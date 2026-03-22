#!/usr/bin/env bash
set -euo pipefail

UMBREL_HOST="${UMBREL_HOST:-umbrel-dev.local}"
APP_ID="coinswap-maker"
APP_STORE_PATH="/home/umbrel/umbrel/app-stores/getumbrel-umbrel-apps-github-53f74447"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
UMBREL_DIR="${UMBREL_DIR:-$(mktemp -d)/umbrel}"

usage() {
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  setup       Clone umbrel repo and start umbrel-dev"
    echo "  install     Copy app files and install on umbrel-dev"
    echo "  reinstall   Uninstall, copy updated files, and install again"
    echo "  uninstall   Remove the app from umbrel-dev"
    echo "  logs        Show logs for all app containers"
    echo "  logs-web    Show logs for the web container"
    echo "  logs-tor    Show logs for the tor container"
    echo "  logs-proxy  Show logs for the app_proxy container"
    echo "  status      Show container status and app state"
    echo "  shell       Open a shell inside umbrel-dev"
    exit 1
}

ensure_umbrel_repo() {
    if [ ! -f "$UMBREL_DIR/package.json" ]; then
        echo "Cloning umbrel repo into $UMBREL_DIR..."
        git clone --depth 1 https://github.com/getumbrel/umbrel.git "$UMBREL_DIR"
    fi
}

ensure_umbrel_running() {
    if ! docker ps --format '{{.Names}}' | grep -q '^umbrel-dev$'; then
        echo "Starting umbrel-dev..."
        cd "$UMBREL_DIR"
        npm run dev &
        echo "Waiting for umbrel-dev to start..."
        until curl -s "http://${UMBREL_HOST}" > /dev/null 2>&1; do
            sleep 5
        done
        echo "umbrel-dev is running."
    fi
}

copy_app_files() {
    echo "Copying app files to umbrel-dev..."
    rsync -av --exclude=".gitkeep" --exclude="test-on-umbrel.sh" --exclude="README.md" \
        "$SCRIPT_DIR/" "umbrel@${UMBREL_HOST}:${APP_STORE_PATH}/${APP_ID}/"
}

run_client() {
    cd "$UMBREL_DIR"
    npm run dev client -- "$@"
}

[ $# -lt 1 ] && usage

case "$1" in
    setup)
        ensure_umbrel_repo
        ensure_umbrel_running
        echo ""
        echo "umbrel-dev is ready at http://${UMBREL_HOST}"
        echo "Create an account if this is your first time."
        ;;

    install)
        ensure_umbrel_repo
        ensure_umbrel_running
        copy_app_files
        echo ""
        echo "Installing ${APP_ID}..."
        run_client apps.install.mutate --appId "$APP_ID"
        echo ""
        echo "Done. Open http://${UMBREL_HOST}:3010"
        ;;

    reinstall)
        ensure_umbrel_repo
        ensure_umbrel_running
        echo "Uninstalling ${APP_ID}..."
        run_client apps.uninstall.mutate --appId "$APP_ID" 2>/dev/null || true
        copy_app_files
        echo ""
        echo "Installing ${APP_ID}..."
        run_client apps.install.mutate --appId "$APP_ID"
        echo ""
        echo "Done. Open http://${UMBREL_HOST}:3010"
        ;;

    uninstall)
        ensure_umbrel_repo
        echo "Uninstalling ${APP_ID}..."
        run_client apps.uninstall.mutate --appId "$APP_ID"
        ;;

    logs)
        docker exec umbrel-dev docker logs -f "${APP_ID}_web_1" &
        docker exec umbrel-dev docker logs -f "${APP_ID}_tor_1" &
        docker exec umbrel-dev docker logs -f "${APP_ID}_app_proxy_1" &
        wait
        ;;

    logs-web)
        docker exec umbrel-dev docker logs -f "${APP_ID}_web_1"
        ;;

    logs-tor)
        docker exec umbrel-dev docker logs -f "${APP_ID}_tor_1"
        ;;

    logs-proxy)
        docker exec umbrel-dev docker logs -f "${APP_ID}_app_proxy_1"
        ;;

    status)
        echo "Container status:"
        docker exec umbrel-dev docker ps -a --filter "name=${APP_ID}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo "App state:"
        ensure_umbrel_repo
        run_client apps.state.query --appId "$APP_ID" 2>/dev/null || echo "App not installed"
        ;;

    shell)
        docker exec -it umbrel-dev bash
        ;;

    *)
        usage
        ;;
esac

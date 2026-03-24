# Umbrel

For other installation options see [packaging/README.md](../README.md).

## Prerequisites

- Umbrel device with SSH access
- Bitcoin installed and running on your Umbrel

## Install

From your local machine, copy the packaging files to the device:

```sh
scp -r packaging/umbrel/ umbrel@umbrel.local:~/umbrel/app-stores/coinswap/coinswap-maker/
```

Then SSH in and install:

```sh
ssh umbrel@umbrel.local
umbreld client apps.install.mutate --appId coinswap-maker
```

Open `http://umbrel.local:3010`.

## Update

```sh
scp -r packaging/umbrel/ umbrel@umbrel.local:~/umbrel/app-stores/coinswap/coinswap-maker/
ssh umbrel@umbrel.local
umbreld client apps.uninstall.mutate --appId coinswap-maker
umbreld client apps.install.mutate --appId coinswap-maker
```

## Uninstall

```sh
umbreld client apps.uninstall.mutate --appId coinswap-maker
```

## Debug

```sh
docker logs coinswap-maker_web_1
docker logs coinswap-maker_tor_1
docker logs coinswap-maker_app_proxy_1
umbreld client apps.state.query --appId coinswap-maker
```

## Tor

Umbrel runs each container in its own network namespace, so `127.0.0.1` inside one container does not reach another. The web container uses `network_mode: "service:tor"` to share the Tor container's network stack. Both containers see the same `127.0.0.1:9050`.

Set `tor_auth` to `moneyprintergobrrr` when creating a maker in the dashboard.

## Testing locally with umbrel-dev

Use `test-on-umbrel.sh` to test against a local umbrel-dev environment:

```sh
./test-on-umbrel.sh setup      # clone umbrel repo and start umbrel-dev
./test-on-umbrel.sh install    # copy files and install
./test-on-umbrel.sh reinstall  # redeploy after changes
./test-on-umbrel.sh logs       # all container logs
./test-on-umbrel.sh status     # container status and app state
./test-on-umbrel.sh uninstall
```

Set `UMBREL_DIR` to skip the clone step:

```sh
export UMBREL_DIR=/path/to/umbrel
```

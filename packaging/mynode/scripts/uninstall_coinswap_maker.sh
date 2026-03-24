#!/bin/bash

source /usr/share/mynode/mynode_device_info.sh
source /usr/share/mynode/mynode_app_versions.sh

echo "==================== UNINSTALLING APP ===================="

docker images --format '{{.Repository}}:{{.Tag}}' | grep 'coinswap/maker-dashboard' | xargs --no-run-if-empty docker rmi

echo "================== DONE UNINSTALLING APP ================="

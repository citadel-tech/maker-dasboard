#!/bin/bash

source /usr/share/mynode/mynode_device_info.sh
source /usr/share/mynode/mynode_app_versions.sh

set -x
set -e

echo "==================== INSTALLING APP ===================="

mkdir -p /opt/mynode/coinswap_maker || true
mkdir -p /mnt/hdd/mynode/coinswap_maker/config || true
mkdir -p /mnt/hdd/mynode/coinswap_maker/coinswap || true

# Remove old image if present
docker images --format '{{.Repository}}:{{.Tag}}' | grep 'coinswap/maker-dashboard' | xargs --no-run-if-empty docker rmi

docker pull coinswap/maker-dashboard:$VERSION
docker tag coinswap/maker-dashboard:$VERSION coinswap/maker-dashboard:master

echo "================== DONE INSTALLING APP ================="

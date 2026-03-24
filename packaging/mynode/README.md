# myNode

For other installation options see [packaging/README.md](../README.md).

## Prerequisites

- myNode device with SSH access
- Bitcoin Core running on your myNode

## Install

SSH into your device:

```sh
ssh admin@mynode.local
```

Create data directories:

```sh
sudo mkdir -p /opt/mynode/coinswap_maker
sudo mkdir -p /mnt/hdd/mynode/coinswap_maker/config
sudo mkdir -p /mnt/hdd/mynode/coinswap_maker/coinswap
sudo chown -R bitcoin:bitcoin /opt/mynode/coinswap_maker
sudo chown -R bitcoin:bitcoin /mnt/hdd/mynode/coinswap_maker
```

Pull the Docker image:

```sh
sudo docker pull coinswap/maker-dashboard:master
```

Copy the service and nginx files from this directory to your device, then:

```sh
sudo cp coinswap_maker.service /etc/systemd/system/coinswap_maker.service
sudo cp nginx/https_coinswap_maker.conf /etc/nginx/sites-enabled/https_coinswap_maker.conf
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl daemon-reload
sudo systemctl enable coinswap_maker
sudo systemctl start coinswap_maker
```

Open `https://mynode.local:14201`.

## Debug

```sh
sudo systemctl status coinswap_maker
sudo journalctl -u coinswap_maker -f
```

## Update

```sh
sudo docker pull coinswap/maker-dashboard:master
sudo systemctl restart coinswap_maker
```

## Uninstall

```sh
sudo systemctl stop coinswap_maker
sudo systemctl disable coinswap_maker
sudo rm /etc/systemd/system/coinswap_maker.service
sudo rm /etc/nginx/sites-enabled/https_coinswap_maker.conf
sudo systemctl daemon-reload
sudo nginx -t && sudo systemctl reload nginx
sudo docker rmi coinswap/maker-dashboard:master
```

To also remove data:

```sh
sudo rm -rf /opt/mynode/coinswap_maker
sudo rm -rf /mnt/hdd/mynode/coinswap_maker
```

## Tor

The container runs with `--network host`, so it shares the host's network stack. The coinswap library connects to Tor at `127.0.0.1:9050` and `127.0.0.1:9051`, which reach the myNode host's Tor daemon directly.

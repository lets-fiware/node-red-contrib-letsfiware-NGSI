# Tutorial

First of all, clone this repository.

```
git clone https://github.com/lets-fiware/node-red-letsfiware-NGSI.git
```

Move current directory to `node-red-letsfiware-NGSI/examples`.

```
cd node-red-letsfiware-NGSI/examples
```

Create docker containers for the tutorial.

```
./service create
```

Start the containers

```
./service start
```

Open Node-RED using the URL: `http://IP address:1880/`.
It is the IP address of your machine running the Docker engine.

To stop the containers, run the following command.

```
./service stop
```

The `service` command can be run with the following options:

| Option      | Description                            |
| ----------- | -------------------------------------- |
| create      | Create containers                      |
| start       | Start all containers                   |
| orion       | Start Orion container                  |
| comet       | Start Orion and STH-Comet containers   |
| quantumleap | Start Orion and Quantumleap containers |
| stop        | Stop all containers                    |

> If CrateDB exits immediately with a
> `max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]` error, this can be fixed
> by running the `sudo sysctl -w vm.max_map_count=262144` command on the host machine. For further information look within
> the CrateDB [documentation](https://crate.io/docs/crate/howtos/en/latest/admin/bootstrap-checks.html#bootstrap-checks)
> and Docker
> [troubleshooting guide](https://crate.io/docs/crate/howtos/en/latest/deployment/containers/docker.html#troubleshooting)

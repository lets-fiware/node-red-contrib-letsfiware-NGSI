[![node-red-contrib-letsfiware-NGSI Banner](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/node-red-contrib-letsfiware-ngsi-non-free.png)](https://www.letsfiware.jp/)
[![NGSI v2](https://img.shields.io/badge/NGSI-v2-5dc0cf.svg)](https://fiware-ges.github.io/orion/api/v2/stable/)

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
![NPM version](https://badge.fury.io/js/node-red-contrib-letsfiware-ngsi.svg)
[![License: MIT](https://img.shields.io/npm/l/node-red-contrib-letsfiware-ngsi)](https://opensource.org/licenses/MIT)
<br/>
[![Unit Tests](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/actions/workflows/ci.yml/badge.svg)](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/lets-fiware/node-red-contrib-letsfiware-NGSI/badge.svg?branch=main)](https://coveralls.io/github/lets-fiware/node-red-contrib-letsfiware-NGSI?branch=main)
[![E2E Tests](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/actions/workflows/e2e.yml/badge.svg)](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/actions/workflows/e2e.yml)
<br/>
[![GitHub Discussions](https://img.shields.io/github/discussions/lets-fiware/node-red-contrib-letsfiware-NGSI)](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/discussions)

[![NPM statistics](https://nodei.co/npm/node-red-contrib-letsfiware-ngsi.png)](https://nodei.co/npm/node-red-contrib-letsfiware-ngsi/)

# node-red-contrib-letsfiware-NGSI

Node-RED implementation for FIWARE Open APIs

| :books: [Documentation](https://node-red-contrib-letsfiware-ngsi.letsfiware.jp/) | :dart: [Roadmap](./ROADMAP.md) |
|-------------------------------------------------------|--------------------------------|

このドキュメントは[日本語](./README_ja.md)でもご覧いただけます。

## Supported custom nodes

-   [NGSI Entity](docs/en/custom_nodes/ngsi_entity.md)
-   [NGSI Source](docs/en/custom_nodes/ngsi_source.md)
-   [NGSI Attributes](docs/en/custom_nodes/ngsi_attributes.md)
-   [NGSI Attribute](docs/en/custom_nodes/ngsi_attribute.md)
-   [NGSI Attribute value](docs/en/custom_nodes/ngsi_attribute_value.md)
-   [NGSI Batch update](docs/en/custom_nodes/ngsi_batch_update.md)
-   [NGSI Subscription](docs/en/custom_nodes/ngsi_subscription.md)
-   [NGSI Registration](docs/en/custom_nodes/ngsi_registration.md)
-   [NGSI Types](docs/en/custom_nodes/ngsi_types.md)
-   [NGSI Encode](docs/en/custom_nodes/ngsi_encode.md)
-   [NGSI Decode](docs/en/custom_nodes/ngsi_decode.md)
-   [Historical context](docs/en/custom_nodes/historical_context.md) (STH-Comet)
-   [NGSI Timeseries](docs/en/custom_nodes/ngsi_timeseries.md) (QuantumLeap)
-   [NGSI to Worldmap](docs/en/custom_nodes/ngsi_to_worldmap.md)
-   [NGSI to Dashboard](docs/en/custom_nodes/ngsi_to_dashboard.md)
-   [OpenWeatherMap to NGSI](docs/en/custom_nodes/openweathermap_to_ngsi.md)
-   [GTFS realtime to NGSI](docs/en/custom_nodes/ngsi_gtfs_realtime.md)
-   [FIWARE version](docs/en/custom_nodes/fiware_version.md)
-   [FIWARE Service and ServicePath](docs/en/custom_nodes/service-and-servicepath.md)

## Documentation

-   [Documentation](https://node-red-contrib-letsfiware-ngsi.letsfiware.jp/en)

## How to install

Run the following command on a command-line interface.

```
npm install node-red-contrib-letsfiware-ngsi
```

## Tutorial

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


## Source code

-   [https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI)

## Related links

-   [https://flows.nodered.org/node/node-red-contrib-letsfiware-ngsi](https://flows.nodered.org/node/node-red-contrib-letsfiware-ngsi)
-   [https://www.npmjs.com/package/node-red-contrib-letsfiware-ngsi](https://www.npmjs.com/package/node-red-contrib-letsfiware-ngsi)
-   [Open Source Insights](https://deps.dev/npm/node-red-contrib-letsfiware-ngsi)

## Copyright and License

Copyright 2022-2024 Kazuhito Suda<br>
Licensed under the [MIT License](./LICENSE).

[![node-red-contrib-letsfiware-NGSI Banner](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/node-red-contrib-letsfiware-ngsi-non-free.png)](https://www.letsfiware.jp/)
[![NGSI v2](https://img.shields.io/badge/NGSI-v2-5dc0cf.svg)](https://fiware-ges.github.io/orion/api/v2/stable/)

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
![NPM version](https://badge.fury.io/js/node-red-contrib-letsfiware-ngsi.svg)
[![License: MIT](https://img.shields.io/npm/l/node-red-contrib-letsfiware-ngsi)](https://opensource.org/licenses/MIT)
<br/>
[![Unit Tests](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/actions/workflows/ci.yml/badge.svg)](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/lets-fiware/node-red-contrib-letsfiware-NGSI/badge.svg?branch=main)](https://coveralls.io/github/lets-fiware/node-red-contrib-letsfiware-NGSI?branch=main)

# node-red-contrib-letsfiware-NGSI

FIWARE Open APIs の Node-RED 実装

| :books: [ドキュメント](https://node-red-contrib-letsfiware-ngsi.letsfiware.jp/ja/) | :dart: [Roadmap](./ROADMAP.md) |
|------------------------------------------------------------------------------------|--------------------------------|

## サポートしているカスタム・ノード

-   [NGSI Entity](docs/ja/custom_nodes/ngsi_entity.md)
-   [NGSI Source](docs/ja/custom_nodes/ngsi_source.md)
-   [NGSI Attributes](docs/ja/custom_nodes/ngsi_attributes.md)
-   [NGSI Attribute](docs/ja/custom_nodes/ngsi_attribute.md)
-   [NGSI Attribute value](docs/ja/custom_nodes/ngsi_attribute_value.md)
-   [NGSI Batch update](docs/ja/custom_nodes/ngsi_batch_update.md)
-   [NGSI Subscription](docs/ja/custom_nodes/ngsi_subscription.md)
-   [NGSI Registration](docs/en/custom_nodes/ngsi_registration.md)
-   [NGSI Types](docs/ja/custom_nodes/ngsi_types.md)
-   [Historical context](docs/ja/custom_nodes/historical_context.md) (STH-Comet)
-   [NGSI Timeseries](docs/en/custom_nodes/ngsi_timeseries.md) (QuantumLeap)
-   [NGSI to Worldmap](docs/ja/custom_nodes/ngsi_to_worldmap.md)
-   [NGSI to Dashboard](docs/ja/custom_nodes/ngsi_to_dashboard.md)
-   [OpenWeatherMap to NGSI](docs/ja/custom_nodes/openweathermap_to_ngsi.md)
-   [GTFS realtime to NGSI](docs/ja/custom_nodes/ngsi_gtfs_realtime.md)
-   [FIWARE version](docs/ja/custom_nodes/fiware_version.md)
-   [FIWARE Service and ServicePath](docs/ja/custom_nodes/service-and-servicepath.md)

## ドキュメント

-   [日本語ドキュメント](https://node-red-contrib-letsfiware-ngsi.letsfiware.jp/ja)

## インストール方法

コマンドライン・インターフェイスで次のコマンドを実行します。

```
npm install node-red-contrib-letsfiware-ngsi
```

## チュートリアル

最初に、このリポジトリをクローンします。

```
git clone https://github.com/lets-fiware/node-red-letsfiware-NGSI.git
```

現在のディレクトリを に移動しますnode-red-letsfiware-NGSI/examples。

```
cd node-red-letsfiware-NGSI/examples
```

チュートリアル用の Docker コンテナーを作成します。

```
./service create
```

コンテナを起動する

```
./service start
```

次の URL を使用して Node-RED を開きます: `http://IP address:1880/`。これは、Docker エンジンを実行しているマシンの IP アドレスです。

コンテナーを停止するには、次のコマンドを実行します。

```
./service stop
```

## ソースコード

-   [https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI](https://github.com/lets-fiware/node-red-contrib-letsfiware-NGSI)

## 関連リンク

-   [https://flows.nodered.org/node/node-red-contrib-letsfiware-ngsi](https://flows.nodered.org/node/node-red-contrib-letsfiware-ngsi)
-   [https://www.npmjs.com/package/node-red-contrib-letsfiware-ngsi](https://www.npmjs.com/package/node-red-contrib-letsfiware-ngsi)
-   [Open Source Insights](https://deps.dev/npm/node-red-contrib-letsfiware-ngsi)

## Copyright and License

Copyright 2022-2023 Kazuhito Suda<br>
Licensed under the [MIT License](./LICENSE).

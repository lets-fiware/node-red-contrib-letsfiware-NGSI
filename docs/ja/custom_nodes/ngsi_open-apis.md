# FIWARE Open APIs

このカスタム・ノードは、FIWARE Generic Enabler の API エンドポイント と IdM を設定できる設定ノードです。

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [FIWARE GE](#fiware-ge)
    -   [Orion Context Broker](#orion-context-broker)
    -   [STH-Comet](#sth-comet)
-   [ID 管理のタイプ](#identity-manager-type)
    -   [None](#none)
    -   [Tokenproxy](#tokenproxy)
    -   [Keyrock](#keyrock)
    -   [Generic](#generic)

</details>

<a name="properties"></a>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-06.png)

-   `name`: ノード・インスタンスの名前
-   `Generic Enabler`: Generic enable のタイプ: `Orion Context Broker` または `STH-Comet`
-   `API Endpoint`: FIWARE GE のエンドポイントの URL
-   `Service`: FIWARE Service
-   `IdM Type`: ID 管理のタイプ: `None`, `Tokenproxy`, `Keyrock` または `Generic`

<a name="fiware-ge"></a>

## FIWARE GE

<a name="orion-context-broker"></a>

### Orion Context Broker

Orion Context Broker を使用するには、`Generic Enabler` プロパティに `Orion Context Broker` を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-01.png)

<a name="sth-comet"></a>

### STH-Comet

STH-Comet を使用するには、`Generic Enabler` プロパティに `STH-Comet` を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-07.png)

<a name="identity-manager-type"></a>

## ID 管理 (Identity manager) のタイプ

<a name="none"></a>

### None

ID 管理を使用しない場合は、`IdM Type` に `NONE` を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-02.png)

<a name="tokenproxy"></a>

### Tokenproxy

Tokenproxy を使用する場合は、`IdM Type` に `Tokenproxy` を設定します。次に、IdM エンドポイント、ユーザ名、およびパスワードを設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-03.png)

<a name="keyrock"></a>

### Keyrock

Keyrock を使用する場合は、`IdM Type` に `keyrock` を設定します。次に、IdM エンドポイント、ユーザ名、パスワード、Client ID、および
Client Secret を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-04.png)

<a name="generic"></a>

### Generic

汎用 ID 管理を使用する場合は、`IdM Type` に `Generic` を設定します。次に、IdM エンドポイント、ユーザ名、パスワード、Client ID、および
Client Secret を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis/open-apis-05.png)

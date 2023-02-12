# NGSI Subscription

このカスタム・ノードは、NGSIv2 サブスクリプションを作成、更新、または削除できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [サブスクリプションの作成](#create-a-subscription)
-   [サブスクリプションの更新](#update-a-subscription)
-   [サブスクリプションの削除](#delete-a-subscription)
-   [Payload 内の actionType の値を使用](#use-value-of-actiontype-in-payload)

</details>

<a name="create-a-subscription"></a>

## サブスクリプションの作成

新しいサブスクリプションを作成できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `create`
-   `Entity type`: 通知の対象となるエンティティのタイプ
-   `ID pattern`: 通知の対象となるエンティティの id パターン
-   `Watched Attrs`: 通知をトリガーする属性名のリスト
-   `Query`: `;` で区切られたステートメントのリストで構成されるクエリ式
-   `Notification Endpoint`: 通知先の URL
-   `Attrs`: 通知メッセージに含まれる属性のリスト
-   `Attrs format`: エンティティが通知でどのように表現されるかを指定します

### 例

#### 入力

Payload *JSON Object*

`msg.payload` には NGSIv2 サブスクリプション・データを含める必要があります。

```json
{
  "type": "T",
  "idPattern": ".*",
  "watchedAttrs": "temperature,humidity",
  "q": "temperature>10",
  "url": "http://context-consumer",
  "attrs": "humidity",
  "description": "subscription for node-red",
  "expires": "2030-04-05T14:00:00.00Z",
  "throttling": 5
}
```

```json
{
  "description": "subscription for node-red",
  "notification": {
    "attrs": [
      "humidity"
    ],
    "http": {
      "url": "http://context-consumer"
    }
  },
  "subject": {
    "condition": {
      "attrs": [
        "temperature",
        "humidity"
      ],
      "expression": {
        "q": "temperature>10"
      }
    },
    "entities": [
      {
        "idPattern": ".*",
        "type": "T"
      }
    ]
  },
  "expires": "2030-04-05T14:00:00.00Z",
  "throttling": 5
}
```

#### 出力

Payload *String*

`msg.payload` には、サブスクリプション id が含まれます。

```text
5fa7988a627088ba9b91b1c1
```

<a name="update-a-subscription"></a>

## サブスクリプションの更新

既存のサブスクリプションを更新できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-03.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Entity type`: 通知の対象となるエンティティのタイプ
-   `ID pattern`: 通知の対象となるエンティティの id パターン
-   `Watched Attrs`: 通知をトリガーする属性名のリスト
-   `Query`: `;` で区切られたステートメントのリストで構成されるクエリ式
-   `Notification Endpoint`: 通知先の URL
-   `Attrs`: 通知メッセージに含まれる属性のリスト
-   `Attrs format`: エンティティが通知でどのように表現されるかを指定します

### 例

#### 入力

Payload *JSON Object*

`msg.payload` には、サブスクリプション id と NGSIv2 サブスクリプション・フラグメントを含める必要があります。

```
{
  "id": "5fa7988a627088ba9b91b1c1",
  "expires": "2030-04-05T14:00:00.00Z"
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```text
204
```

```text
null
```

<a name="delete-a-subscription"></a>

## サブスクリプションの削除

既存のサブスクリプションを削除できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-04.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`

### 例

#### 入力

Payload *string*

`msg.payload` には、サブスクリプション id を含める必要があります。

```
5fa7988a627088ba9b91b1c1
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

<a name="use-value-of-actiontype-in-payload"></a>

## Payload 内の actionType の値を使用

サブスクリプションを作成、更新、または削除できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-05.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`

### 例

新しいサブスクリプションを作成するとき、 `msg.payload` には actionType とサブスクリプション・データを含む JSON
オブジェクトが含まれている必要があります。

#### 入力

```json
{
  "actionType": "create",
  "subscription": {
    "type": "T",
    "idPattern": ".*",
    "watchedAttrs": "temperature,humidity",
    "q": "temperature>10",
    "url": "http://context-consumer",
    "attrs": "humidity",
    "description": "subscription for node-red",
    "expires": "2030-04-05T14:00:00.00Z",
    "throttling": 5
  }
}
```

#### 出力

Payload *string*

`msg.payload` には、サブスクリプション id が含まれます。

```text
5fa7988a627088ba9b91b1c1
```

既存のサブスクリプションを更新する場合、 `msg.payload` には、actionType、サブスクリプション id、およびサブスクリプション・データを含む
JSON オブジェクトが含まれている必要があります。

#### 入力

```json
{
  "actionType": "update",
  "id": "63ea11e4a0cec98fc6017aae",
  "subscription": {
    "expires": "2030-04-05T14:00:00.00Z"
  }
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

既存のサブスクリプションを削除する場合、`msg.payload` には、actionType とサブスクリプション id を持つ
JSON オブジェクトが含まれている必要があります。

#### 入力

```json
{
  "actionType": "delete",
  "id": "63ea11e4a0cec98fc6017aae"
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

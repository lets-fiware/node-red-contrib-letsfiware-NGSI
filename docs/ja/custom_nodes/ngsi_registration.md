# NGSI Registration

このカスタム・ノードは、NGSIv2 レジストレーションを作成または削除できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/registration/registration-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [レジストレーションの作成](#create-a-registration)
-   [レジストレーションの削除](#delete-a-registration)
-   [Payload 内の actionType の値を使用](#use-value-of-actiontype-in-payload)

</details>

<a name="create-a-registration"></a>

## レジストレーションの作成

新しい登録を作成できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/registration/registration-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `create`

### 例

#### 入力

Payload *JSON Object*

`msg.payload`には、NGSIv2 レジストレーション・データを含める必要があります。

```json
{
  "description": "Relative Humidity Context Source",
  "dataProvided": {
    "entities": [
      {
        "id": "room",
        "type": "Room"
      }
    ],
    "attrs": [
      "relativeHumidity"
    ]
  },
  "provider": {
    "http": {
      "url": "http://orion:1026"
    }
  }
}
```

#### 出力

Payload  *string*

`msg.payload` には、レジストレーション id が含まれます。

```text
63ed51173bdeaadaf909c57b
```

<a name="delete-a-registration"></a>

## レジストレーションの削除

既存のレジストレーションを更新できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/registration/registration-03.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`

### 例

#### 入力

Payload *string*

msg.payload` には、レジストレーション id を含める必要があります。

```
63ed51173bdeaadaf909c57b
```

#### 出力

Payload *Number* or *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

<a name="use-value-of-actiontype-in-payload"></a>

## Payload 内の actionType の値を使用

レジストレーションを作成、または削除できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/registration/registration-04.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`

### 例

新しいレジストレーションを作成する場合、`msg.payload` には、actionType とレジストレーション・データを含む JSON オブジェクトが含まれている必要があります。

#### 入力

```json
{
  "actionType": "delete",
  "id": "63ed53123bdeaadaf909c57d"
}
```

#### 出力

Payload  *string*

`msg.payload` には、レジストレーション id が含まれます。

```text
63ed51173bdeaadaf909c57b
```

既存の登録を削除する場合、`msg.payload` には、actionType とレジストレーション id を持つ JSON オブジェクトが含まれている必要があります。

#### 入力

```json
{
  "actionType": "delete",
  "id": "63ea11e4a0cec98fc6017aae"
}
```

#### 出力

Payload *Number* or *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

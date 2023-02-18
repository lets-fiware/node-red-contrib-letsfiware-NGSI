# NGSI Attribute value

このカスタム・ノードは、NGSIv2 エンティティの属性値の読み取りまたは更新を可能にするノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute/attribute-value/attribute-value-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [属性値の読み取り](#read-attribute-value)
-   [属性値の更新](#update-attribute-value)
-   [Payload 内の actionType の値を使用](#use-value-of-actionType-in-payload)

</details>

<a name="read-attribute-value"></a>

## 属性値の読み取り

NGSIv2 エンティティの属性値を読み取ることができます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute/attribute-value/attribute-value-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `read`
-   `Entity id`: 読み取る属性値のエンティティ id
-   `Entity type`: 読み取る属性値のエンティティ・タイプ
-   `Attribute name`: 読み取る属性値の属性名
-   `Skip forwarding`: Context Broker は Context Provider への転送をスキップします

### 例

#### 入力

Payload  *JSON Object*

`msg.payload` には、読み取る属性に関連する情報が含まれている必要があります。

次のペイロードは、各プロパティの値を使用します:

```
{}
```

次のペイロードは、各プロパティの値を上書きします:

```
{
  "id": "urn:ngsi-ld:attr-value",
  "type: "T",
  "attrName": "test",
  "skipForwarding": true
}
```

#### 出力

Payload *null*, *Boolean*, *Number*, *String* または *JSON Object*

`msg.payload` には属性値が含まれます。

<a name="update-attribute-value"></a>

## 属性値の更新

NGSIv2 エンティティの属性値を更新できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute/attribute-value/attribute-value-03.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Entity id`: 更新する属性値のエンティティ id
-   `Entity type`: 更新する属性値のエンティティ・タイプ
-   `Attribute name`: 更新する属性値の属性名
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 例

#### 入力

Payload *null*, *Boolean*, *Number*, *String* または *JSON Object*

`msg.payload` には属性値が含まれている必要があります。

```
null
```

```
true
```

```
123
```

```
abc
```

```
{
  "abc": 123
}
```

```
["abc", 123]
```

### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

<a name="use-value-of-actionType-in-payload"></a>

## Payload 内の actionType の値を使用

NGSIv2 エンティティの属性値を読み取ったり、更新したりできます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute/attribute-value/attribute-value-04.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Entity id`: 読み取るまたは更新する属性値のエンティティ id
-   `Entity type`: 読み取るまたは更新する属性値のエンティティ・タイプ
-   `Attribute name`: 読み取るまたは更新する属性値の属性名
-   `Skip forwarding`: Context Broker は Context Provider への転送をスキップします
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 例

#### 入力 1

Payload  *JSON Object*

次のペイロードは、各プロパティの値を上書きします:

```
{
  "actionType": "read",
  "id": "urn:ngsi-ld:attr-value",
  "type: "T",
  "attrName": "test",
  "skipForwarding": true
}
```

#### 出力 1

Payload *null*, *Boolean*, *Number*, *String* または *JSON Object*

`msg.payload` には属性値が含まれます。

#### 入力 2

Payload *JSON Object*

msg.payloadは、関連情報を含む属性値が含まれている必要があります。
各プロパティの値を上書きします。

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": null
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": false
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": 123
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": "abc"
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": {
    "abc": 123
  }
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": ["abc", 123]
}
```

### 出力 2

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

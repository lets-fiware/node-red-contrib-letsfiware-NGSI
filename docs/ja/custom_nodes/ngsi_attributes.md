# NGSI attributes

このカスタム・ノードは、NGSIv2 エンティティの複数属性を追加、更新、アップサート、または置換できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [複数属性の追加](#append-attributes)
-   [複数属性の更新](#update-attributes)
-   [複数属性のアップサート](#upsert-attributes)
-   [複数属性の置換](#replace-attributes)
-   [Payload 内の actionType の値を使用](#use-value-of-actionType-in-payload)

</details>

<a name="append-attributes"></a>

## 複数属性の追加

NGSIv2 エンティティの複数属性を追加できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `append`
-   `Entity id`: 追加する属性のエンティティ id
-   `Entity type`: 追加する属性のエンティティ・タイプ
-   `Representation`: `normalized` または `keyValues`
-   `Override metadata`: true の場合、既存のメタデータを置き換えます
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 入力

payload  *JSON Object*

`msg.payload` には、属性のオブジェクトが含まれている必要があります。

```json
{
  "temperature": {
    "type": "Number",
    "value": 17,
    "metadata": {}
  }
}
```

### 出力

statusCode *Number*

`msg.statusCode` にはステータス・コードが含まれています。

```text
204
```

<a name="update-attributes"></a>

## 複数属性の更新

NGSIv2 エンティティの複数属性を更新できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-03.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Entity id`: 更新する属性のエンティティ id
-   `Entity type`: 更新する属性のエンティティ・タイプ
-   `Representation`: `normalized` または `keyValues`
-   `Override metadata`: true の場合、既存のメタデータを置き換えます
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 入力

payload  *JSON Object*

`msg.payload` には、属性のオブジェクトが含まれている必要があります。

```json
{
  "temperature": {
    "type": "Number",
    "value": 20,
    "metadata": {}
  }
}
```

### 出力

statusCode *Number*

`msg.statusCode` にはステータス・コードが含まれています。

```text
204
```

<a name="upsert-attributes"></a>

## 複数属性のアップサート

NGSIv2 エンティティの複数属性をアップサートできます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-04.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `upsert`
-   `Entity id`: アップサートする属性のエンティティ id
-   `Entity type`: アップサートする属性のエンティティ・タイプ
-   `Representation`: `normalized` または `keyValues`
-   `Override metadata`: true の場合、既存のメタデータを置き換えます
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 入力

payload  *JSON Object*

`msg.payload` には、属性のオブジェクトが含まれている必要があります。

```json
{
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {}
  },
  "humidity": {
    "type": "Number",
    "value": 42.9,
    "metadata": {}
  }
}
```

### 出力

statusCode *Number*

`msg.statusCode` にはステータス・コードが含まれています。

```text
204
```

<a name="replace-attributes"></a>

## 複数属性の置換

NGSIv2 エンティティの複数属性を置換できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-05.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `replace`
-   `Entity id`: 置換する属性のエンティティ id
-   `Entity type`: 置換する属性のエンティティ・タイプ
-   `Representation`: `normalized` または `keyValues`
-   `Override metadata`: true の場合、既存のメタデータを置き換えます
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 入力

payload  *JSON Object*

`msg.payload` には、属性のオブジェクトが含まれている必要があります。

```json
{
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {}
  },
  "relativeHumidity": {
    "type": "Number",
    "value": 45,
    "metadata": {}
  },
  "atmosphericPressure": {
    "type": "Number",
    "value": 1003.5,
    "metadata": {}
  }
}
```

### 出力

statusCode *Number*

`msg.statusCode` にはステータス・コードが含まれています。

```text
204
```

<a name="use-value-of-actionType-in-payload"></a>

## Payload 内の actionType の値を使用

NGSIv2 エンティティの複数属性を追加、更新、アップサート、または置換できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-06.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Entity id`: 追加、更新、アップサート、または置換する属性のエンティティ id
-   `Entity type`: 追加、更新、アップサート、または置換する属性のエンティティ・タイプ
-   `Representation`: `normalized` または `keyValues`
-   `Override metadata`: true の場合、既存のメタデータを置き換えます
-   `Forced update`: true の場合、一致するサブスクリプションをトリガーします
-   `Flow control`: true の場合、フロー制御メカニズムが有効になります

### 入力

payload *JSON Object*

`msg.payload` には、actionType と複数属性のオブジェクトを持つ JSON Object が含まれている必要があります。

```json
{
  "actionType": "append",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 17,
      "metadata": {}
    }
  }
}
```

```json
{
  "actionType": "update",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 20,
      "metadata": {}
    }
  }
}
```

```json
{
  "actionType": "upsert",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {}
    },
    "humidity": {
      "type": "Number",
      "value": 42.9,
      "metadata": {}
    }
  }
}
```

```json
{
  "actionType": "replace",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {}
    },
    "relativeHumidity": {
      "type": "Number",
      "value": 45,
      "metadata": {}
    },
    "atmosphericPressure": {
      "type": "Number",
      "value": 1003.5,
      "metadata": {}
    }
  }
}
```

### 出力

statusCode *Number*

`msg.statusCode` にはステータス・コードが含まれています。

```text
204
```

# FIWARE Service and ServicePath

このカスタム・ノードは、FIWARE Service と ServicePath を管理できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [パススルー](#passthrough)
-   [FIWARE Service および/または ServicePath の追加](#add-fiware-service-and-or-servicepath)
-   [FIWARE Service および/または ServicePath の削除](#delete-fiware-service-and-or-servicepath)

</details>

<a name="passthrough"></a>

## パススルー

FIWARE Service の値、および/または ServicePath の値を操作なしで出力に渡すことができます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-02.png)

-   `name`: ノード・インスタンスの名前
-   `FIWARE Service`: `Passthrough`
-   `FIWARE ServicePath`: `Passthrough`

### 例

#### 入力

Payload *JSON Object*

`msg.context` には、JSON オブジェクトが含まれている必要があります。

```
{
  "fiwareService": "openiot",
  "fiwareServicePath": "/iot"
}
```

#### 出力

Payload *JSON Object*

`msg.context` には、JSON オブジェクトが含まれます。

```
{
  "fiwareService": "openiot",
  "fiwareServicePath": "/iot"
}
```

<a name="add-fiware-service-and-or-servicepath"></a>

## FIWARE Service および/または ServicePath の追加

`msg.context` に FIWARE Service および/または FIWARE ServicePath を追加できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-03.png)

-   `name`: ノード・インスタンスの名前
-   `FIWARE Service`: `Add`
-   `Service value`: FIWARE Service の値
-   `FIWARE ServicePath`: `Add`
-   `Service valuePath`: FIWARE ServicePath の値

### 例

Set `Service value` to `OpenIoT` and `Service valuePath` to `/iot`.

#### 入力

Payload *JSON Object*

`msg.context` には、JSON オブジェクトが含まれている必要があります。

```
{}
```

#### 出力

Payload *JSON Object*

`msg.context` には、JSON オブジェクトが含まれます。

```
{
  "fiwareService":"openiot",
  "fiwareServicePath":"/iot"
}
```

<a name="delete-fiware-service-and-or-servicepath"></a>

## FIWARE Service および/または ServicePath の削除

`msg.context` から FIWARE Service および/または FIWARE ServicePath を削除できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-04.png)

-   `name`: ノード・インスタンスの名前
-   `FIWARE Service`: `Delete`
-   `FIWARE ServicePath`: `Delete`

### 例

#### 入力

Payload *JSON Object*

`msg.context` には、JSON オブジェクトが含まれている必要があります。

```
{
  "fiwareService":"openiot",
  "fiwareServicePath":"/iot"
}
```

#### 出力

Payload *JSON Object*

`msg.context` には、JSON オブジェクトが含まれます。

```
{}
```

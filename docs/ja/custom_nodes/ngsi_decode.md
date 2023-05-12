# NGSI decode

このカスタム・ノードは、禁止文字をデコードするノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/decode/decode-01.png)

| キャラクタ | デコードされた文字 |
| ---------- | ------------------ |
| %22        | "                  |
| %25        | %                  |
| %27        | '                  |
| %28        | (                  |
| %29        | )                  |
| %3B        | ;                  |
| %3C        | <                  |
| %3D        | =                  |
| %3E        | >                  |

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/decode/decode-02.png)

| プロパティ  | 説明                       |
| ----------- | -------------------------- |
| Name        | ノード・インスタンスの名前 |

### 入力 (string)

payload *string*

`msg.payload` には文字列が含まれている必要があります。

```text
%3CSensor%3E
```

### 出力 (string)

payload *string*

`msg.payload` には文字列が含まれています。

```text
<Sensor>
```

statusCode *Number*

`msg.statusCode` にはステータス・には文字列が含まれています。

```text
200
```

### 入力 (JSON Object)

payload *JSON Object*

`msg.payload` には NGSI データが含まれている必要があります。

```json
{
  "id": "urn:ngsi-ld:TemperatureSensor:001",
  "type": "TemperatureSensor",
  "name": "%3CSensor%3E"
}
```

### 出力 (JSON Object)

payload *JSON Object*

`msg.payload` には NGSI データが含まれています。

```json
{
  "id": "urn:ngsi-ld:TemperatureSensor:001",
  "type": "TemperatureSensor",
  "name": "<Sensor>"
}
```

statusCode *Number*

`msg.statusCode` にはステータス・には文字列が含まれています。

```text
200
```

### 入力 (JSON Array)

payload *JSON Array*

`msg.payload` には NGSI データが含まれている必要があります。

```json
[
  {
    "id": "urn:ngsi-ld:TemperatureSensor:001",
    "type": "TemperatureSensor",
    "name": "%3CSensor%3E"
  }
]
```

### 出力 (JSON Array)

payload *JSON Array*

`msg.payload` には NGSI データが含まれています。

```json
[
  {
    "id": "urn:ngsi-ld:TemperatureSensor:001",
    "type": "TemperatureSensor",
    "name": "<Sensor>"
  }
]
```

statusCode *Number*

`msg.statusCode` にはステータス・には文字列が含まれています。

```text
200
```

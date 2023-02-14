# NGSI Batch update

このカスタム・ノードは、複数の NGSIv2 エンティティを更新できるノードです。エンティティ・データは、`msg.payload`
の一部として提供します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch_update-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [入力](#input)
-   [出力](#output)

</details>

<a name="properties"></a>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch_update-02.png)

- `name`: ノード・インスタンスの名前
- `Action Type`: `append`, `appendStrict`, `update`, `replace` または `delete`

<a name="input"></a>

## 入力

Payload *JSON Araay* または *JSON Object*

`msg.payload` には、JSON 配列として、1つ以上の NGSIv2 エンティティ、または、`actionType` と `entities`
の2つのプロパティを持つ JSON オブジェクトが含まれている必要があります。

### 入力 1 (JSON 配列)

```
[
  {
    "id": "E1",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 51
    },
    "temperature": {
      "type": "Number",
      "value": 25
    }
  },
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50
    },
    "temperature": {
      "type": "Number",
      "value": 30
    }
  }
]
```

### 入力 2 (2つのプロパティを持つ JSON オブジェクト)

```
{
  "actionType": "append",
  "entities": [
    {
      "id": "E1",
      "type": "T",
      "humidity": {
        "type": "Number",
        "value": 51
      },
      "temperature": {
        "type": "Number",
        "value": 25
      }
    },
    {
      "id": "E2",
      "type": "T",
      "humidity": {
        "type": "Number",
        "value": 50
      },
      "temperature": {
        "type": "Number",
        "value": 30
      }
    }
  ]
}
```

<a name="output"></a>

## 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

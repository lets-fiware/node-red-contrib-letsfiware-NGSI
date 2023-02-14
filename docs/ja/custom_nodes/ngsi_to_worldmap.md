# NGSI to Worldmap

このカスタム・ノードは、NGSIv2 エンティティを Worldmap node の "things" データに変換できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/to-worldmap-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [入力](#input)
-   [出力](#output)
-   [例](#example)

</details>

<a name="properties"></a>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/to-worldmap-02.png)

- `name`: ノード・インスタンスの名前
- `attr to use as name`: Worldmap node の名前として使用される値を持つ属性名
- `attr for Worldmap`: Worldmap node の属性を含む属性名

<a name="input"></a>

## 入力

Payload  *JSON Array*

`msg.payload` には NGSIv2 エンティティが含まれます。文字列または NGSIv2 エンティティを含む JSON オブジェクトが提供される場合、
自動的に JSON 配列に変換されます。

<a name="output"></a>

## 出力

Payload *JSON Array*

`msg.payload` には、Worldmap node の "things" データが含まれています。

<a name="example"></a>

## 例

### 入力 1

```
[
  {
    "id": "E1",
    "type": "T",
    "name": {
      "type": "Text",
      "value": "E1"
    },
    "location": {
      "type": "geo:json",
      "value": {
        "type": "Point",
        "coordinates": [
          135,
          35
        ]
      }
    }
  }
]
```

### 出力 1

```
[
  {
    "lat": 35,
    "lon": 135,
    "name": "E1"
  }
]
```

### 入力 2

```
[
  {
    "id": "E1",
    "type": "T",
    "name": {
      "type": "Text",
      "value": "E1"
    },
    "location": {
      "type": "geo:json",
      "value": {
        "type": "Point",
        "coordinates": [
          135,
          35
        ]
      }
    },
    "__worldmap__": {
      "type": "StructuredValues",
      "value": {
        "icon": "bicycle"
      }
    }
  }
]
```

### 出力 2

```
[
  {
    "lat": 35,
    "lon": 135,
    "name": "E1",
    "icon": "bicycle"
  }
]
```

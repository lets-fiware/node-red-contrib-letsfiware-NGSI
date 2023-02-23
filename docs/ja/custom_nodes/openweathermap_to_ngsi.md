# OpenWeatherMap to NGSI

このカスタム・ノードは、OpenWeatherMap の現在の天気と予報データを NGSIv2 エンティティに変換できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/openweathermap-to-ngsi/openweathermap-to-ngsi-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [例](#example)

</details>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/openweathermap-to-ngsi/openweathermap-to-ngsi-02.png)

-   `name`: ノード・インスタンスの名前

## 例

#### 入力

`msg.data` には、OpenWeatherMap の現在の気象データまたは予測データが含まれている必要があります。

```
{
  "coord": {
    "lon": 139.6917,
    "lat": 35.6895
  },
  "weather": [
    {
      "id": 803,
      "main": "Clouds",
      "description": "broken clouds",
      "icon": "04n"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 278.23,
    "feels_like": 275.04,
    "temp_min": 275.4,
    "temp_max": 280.12,
    "pressure": 1022,
    "humidity": 55
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.12,
    "deg": 320
  },
  "clouds": {
    "all": 75
  },
  "dt": 1677100198,
  "sys": {
    "type": 2,
    "id": 2001249,
    "country": "JP",
    "sunrise": 1677100803,
    "sunset": 1677140982
  },
  "timezone": 32400,
  "id": 1850144,
  "name": "Tokyo",
  "cod": 200
}
```

#### 出力

`msg.payload` には、NGSIv2 エンティティが含まれています。

```
{
  "coord": {
    "type": "StructuredValue",
    "value": {
      "lon": 139.6917,
      "lat": 35.6895
    }
  },
  "weather": {
    "type": "StructuredValue",
    "value": [
      {
        "id": 803,
        "main": "Clouds",
        "description": "broken clouds",
        "icon": "04n"
      }
    ]
  },
  "base": {
    "type": "Text",
    "value": "stations"
  },
  "main": {
    "type": "StructuredValue",
    "value": {
      "temp": 278.23,
      "feels_like": 275.04,
      "temp_min": 275.4,
      "temp_max": 280.12,
      "pressure": 1022,
      "humidity": 55
    }
  },
  "visibility": {
    "type": "Number",
    "value": 10000
  },
  "wind": {
    "type": "StructuredValue",
    "value": {
      "speed": 4.12,
      "deg": 320
    }
  },
  "clouds": {
    "type": "StructuredValue",
    "value": {
      "all": 75
    }
  },
  "dt": {
    "type": "Number",
    "value": 1677100198
  },
  "sys": {
    "type": "StructuredValue",
    "value": {
      "type": 2,
      "id": 2001249,
      "country": "JP",
      "sunrise": 1677100803,
      "sunset": 1677140982
    }
  },
  "timezone": {
    "type": "Number",
    "value": 32400
  },
  "id": "urn:ngsi-ld:OpenWeatherMapWeather:1850144",
  "name": {
    "type": "Text",
    "value": "Tokyo"
  },
  "cod": {
    "type": "Number",
    "value": 200
  },
  "location": {
    "type": "geo:json",
    "value": {
      "type": "Point",
      "coordinates": [
        139.6917,
        35.6895
      ]
    }
  },
  "type": "OpenWeatherMapWeather"
}
```

#### フロー

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/openweathermap-to-ngsi/openweathermap-to-ngsi-03.png)
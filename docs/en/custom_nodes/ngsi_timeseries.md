# NGSI timeseries

This custom node is a simple node that allows to obtain timeseries context from Quantumleap.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Entities](#entities)
-   [Entity](#entity)
-   [Type](#type)
-   [Attribute](#attribute)
-   [API reference](#api-reference)

</details>

## Entities

It allows to list of all the entity id available.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-02.png)

-   `name`: A name for a node instance
-   `QuantumLeap`: An endpoint of QuantumLeap
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Entities`
-   `Entity type`: Type of entity
-   `form Date`: Starting date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for from Date
-   `to Date`: Final date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for to date
-   `Limit`: Maximum number of results to retrieve in a single response
-   `Offset`: Offset to apply to the response results

### Example

#### Input

```
{}
```

#### Output

```
[
  {
    "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
    "timeseriesType": "Sensor",
    "index": "2023-02-19T10:37:15.797+00:00"
  }
]
```

## Entity

It allows to query history of attribute(s) (values only) of a given entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-03.png)

-   `name`: A name for a node instance
-   `QuantumLeap`: An endpoint of QuantumLeap
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Entity`
-   `Value`: If true, values only
-   `Entity id`: Id of entity
-   `Entity type`: Type of entity
-   `Attribute name`: A name of an attribute
-   `AggrMethod`: `count`, `sum`, `avg`, `min` or `max`
-   `AggrPeriod`: `year`, `month`, `day`, `hour`, `minute` or `second`
-   `LastN`: Used to request only the last N values that satisfy the request conditions
-   `form Date`: Starting date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for from Date
-   `to Date`: Final date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for to date
-   `Georel`: Specifies a spatial relationship between matching entities and a reference shape (geometry
-   `Geometry`: Specifies the reference shape to be used for geographical queries
-   `Coords`: Specifies the reference shape (geometry) in terms of WGS 84 coordinates
-   `Limit`: Maximum number of results to retrieve in a single response
-   `Offset`: Offset to apply to the response results

### Example: Entity attributes

It allows to query history of N attributes of a given entity.

#### Input

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "lastN": 3
}
```

#### Output

```
{
  "attributes": [
    {
      "attrName": "atmosphericPressure",
      "values": [
        1005.3,
        1005.3,
        1005.3
      ]
    },
    {
      "attrName": "relativeHumidity",
      "values": [
        49.7,
        49.7,
        49.7
      ]
    },
    {
      "attrName": "temperature",
      "values": [
        19.8,
        19.9,
        19.8
      ]
    }
  ],
  "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
  "timeseriesType": "Sensor",
  "index": [
    "2023-02-19T10:38:51.841+00:00",
    "2023-02-19T10:38:53.842+00:00",
    "2023-02-19T10:38:55.845+00:00"
  ]
}
```

### Example: Entity attributes value

It allows to query history of N attributes (values only) of a given entity.

#### Input

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "value": true,
  "lastN": 3
}
```

#### Output

```
{
  "attributes": [
    {
      "attrName": "atmosphericPressure",
      "values": [
        1005.3,
        1005.3,
        1005.3
      ]
    },
    {
      "attrName": "relativeHumidity",
      "values": [
        49.7,
        49.6,
        49.7
      ]
    },
    {
      "attrName": "temperature",
      "values": [
        19.8,
        19.9,
        19.9
      ]
    }
  ],
  "index": [
    "2023-02-19T10:40:35.897+00:00",
    "2023-02-19T10:40:37.910+00:00",
    "2023-02-19T10:40:39.911+00:00"
  ]
}
```

### Example: Entity attribute

It allows to query history of an attribute of a given entity.

#### Input

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "attrName": "temperature",
  "lastN": 3
}
```

#### Output

```
{
  "attrName": "temperature",
  "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
  "timeseriesType": "Sensor",
  "index": [
    "2023-02-19T10:41:00.000+00:00",
    "2023-02-19T10:42:00.000+00:00",
    "2023-02-19T10:43:00.000+00:00"
  ],
  "values": [
    19.8899995803833,
    19.89333292643229,
    19.895832935969036
  ]
}
```

### Example: Entity attribute value

It allows to query history of an attribute (values only) of a given entity.

#### Input

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "attrName": "temperature",
  "value": true,
  "lastN": 3
}
```

#### Output

```
{
  "index": [
    "2023-02-19T10:43:00.000+00:00",
    "2023-02-19T10:44:00.000+00:00",
    "2023-02-19T10:45:00.000+00:00"
  ],
  "values": [
    19.896551329514075,
    19.896666272481283,
    19.899999618530273
  ]
}
```

## Type

It allows to query history of attribute(s) (values only) of N entities of the same type.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-04.png)

-   `name`: A name for a node instance
-   `QuantumLeap`: An endpoint of QuantumLeap
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Type`
-   `Value`: If true, values only
-   `Entity id`: Id of entity
-   `Entity type`: Type of entity
-   `Attribute name`: A name of an attribute
-   `AggrMethod`: `count`, `sum`, `avg`, `min` or `max`
-   `AggrPeriod`: `year`, `month`, `day`, `hour`, `minute` or `second`
-   `LastN`: Used to request only the last N values that satisfy the request conditions
-   `form Date`: Starting date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for from Date
-   `to Date`: Final date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for to date
-   `Georel`: Specifies a spatial relationship between matching entities and a reference shape (geometry
-   `Geometry`: Specifies the reference shape to be used for geographical queries
-   `Coords`: Specifies the reference shape (geometry) in terms of WGS 84 coordinates
-   `Limit`: Maximum number of results to retrieve in a single response
-   `Offset`: Offset to apply to the response results

### Example: Type entity

It allows to query history of N attributes of N entities of the same type.

#### Input

```
{
  "type": "Sensor",
  "lastN": 3
}
```

#### Output

```
{
  "entities": [
    {
      "attributes": [
        {
          "attrName": "atmosphericPressure",
          "values": [
            1005.2,
            1005.3,
            1005.3
          ]
        },
        {
          "attrName": "relativeHumidity",
          "values": [
            49.5,
            49.6,
            49.5
          ]
        },
        {
          "attrName": "temperature",
          "values": [
            19.9,
            19.9,
            19.9
          ]
        }
      ],
      "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-19T10:47:56.116+00:00",
        "2023-02-19T10:47:58.119+00:00",
        "2023-02-19T10:48:00.118+00:00"
      ]
    }
  ],
  "timeseriesType": "Sensor"
}
```

### Example: Type entity value

It allows to query history of N attributes (values only) of N entities of the same type.

#### Input

```
{
  "type": "Sensor",
  "lastN": 3,
  "value": true
}
```

#### Output

```
{
  "values": [
    {
      "attributes": [
        {
          "attrName": "atmosphericPressure",
          "values": [
            1021.5,
            1021.5,
            1021.5
          ]
        },
        {
          "attrName": "relativeHumidity",
          "values": [
            30.8,
            30.8,
            30.8
          ]
        },
        {
          "attrName": "temperature",
          "values": [
            17.8,
            17.8,
            17.8
          ]
        }
      ],
      "entityId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-21T07:47:25.616+00:00",
        "2023-02-21T07:47:27.613+00:00",
        "2023-02-21T07:47:29.616+00:00"
      ]
    }
  ]
}
```

### Example: Type attribute

It allows to query history of an attribute of N entities of the same type.

#### Input

```
{
  "type": "Sensor",
  "attrName": "temperature",
  "lastN": 3
}
```

#### Output

```
{
  "attrName": "temperature",
  "entities": [
    {
      "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-01T00:00:00.000+00:00"
      ],
      "values": [
        104122.2
      ]
    }
  ],
  "timeseriesType": "Sensor"
}
```

### Example: Type attribute value

It allows to query history of an attribute (values only) of N entities of the same type.

#### Input

```
{
  "type": "Sensor",
  "attrName": "temperature",
  "lastN": 3,
  "value": true
}
```

#### Output

```
{
  "values": [
    {
      "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-01T00:00:00.000+00:00"
      ],
      "values": [
        104719.2
      ]
    }
  ]
}
```

## Attributes

It allows to query history of N attribute(s) (values only) of N entities of N types.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-05.png)

-   `name`: A name for a node instance
-   `QuantumLeap`: An endpoint of QuantumLeap
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Attribute`
-   `Value`: If true, values only
-   `Entity id`: Id of entity
-   `Entity type`: Type of entity
-   `Attribute name`: A name of an attribute
-   `AggrMethod`: `count`, `sum`, `avg`, `min` or `max`
-   `AggrPeriod`: `year`, `month`, `day`, `hour`, `minute` or `second`
-   `LastN`: Used to request only the last N values that satisfy the request conditions
-   `form Date`: Starting date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for from Date
-   `to Date`: Final date and time (inclusive) from which the context information is queried
-   `Unit for date`: Unit for to date
-   `Georel`: Specifies a spatial relationship between matching entities and a reference shape (geometry
-   `Geometry`: Specifies the reference shape to be used for geographical queries
-   `Coords`: Specifies the reference shape (geometry) in terms of WGS 84 coordinates
-   `Limit`: Maximum number of results to retrieve in a single response
-   `Offset`: Offset to apply to the response results

### Example: Attributes

It allows to query history of N attributes of N entities of N types.

#### Input

```
{
  "lastN": 3
}
```

#### Output

```
{
  "attrs": [
    {
      "attrName": "atmosphericPressure",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:18.253+00:00",
                "2023-02-19T10:52:20.247+00:00",
                "2023-02-19T10:52:22.252+00:00"
              ],
              "values": [
                1005.3,
                1005.3,
                1005.3
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "relativeHumidity",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:18.253+00:00",
                "2023-02-19T10:52:20.247+00:00",
                "2023-02-19T10:52:22.252+00:00"
              ],
              "values": [
                49.5,
                49.5,
                49.5
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "temperature",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:18.253+00:00",
                "2023-02-19T10:52:20.247+00:00",
                "2023-02-19T10:52:22.252+00:00"
              ],
              "values": [
                19.9,
                19.9,
                19.9
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    }
  ]
}
```

### Example: Attributes value

It allows to query history of N attributes (values only) of N entities of N types.

#### Input

```
{
  "value": true,
  "lastN": 3
}
```

#### Output

```
{
  "values": [
    {
      "attrName": "atmosphericPressure",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:46.261+00:00",
                "2023-02-19T10:52:48.262+00:00",
                "2023-02-19T10:52:50.265+00:00"
              ],
              "values": [
                1005.3,
                1005.3,
                1005.3
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "relativeHumidity",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:46.261+00:00",
                "2023-02-19T10:52:48.262+00:00",
                "2023-02-19T10:52:50.265+00:00"
              ],
              "values": [
                49.5,
                49.5,
                49.5
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "temperature",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:46.261+00:00",
                "2023-02-19T10:52:48.262+00:00",
                "2023-02-19T10:52:50.265+00:00"
              ],
              "values": [
                19.9,
                19.9,
                19.9
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    }
  ]
}
```

### Example: Attribute

It allows to query history of an attribute of N entities of N types.

#### Input

```
{
  "attrName": "temperature",
  "lastN": 3
}
```

#### Output

```
{
  "attrName": "temperature",
  "types": [
    {
      "entities": [
        {
          "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
          "index": [
            "2023-02-01T00:00:00.000+00:00"
          ],
          "values": [
            106749
          ]
        }
      ],
      "timeseriesType": "Sensor"
    }
  ]
}
```

### Example: Attribute value

It allows to query history of an attribute (values only) of N entities of N types.

#### Input

```
{
  "attrName": "temperature",
  "value": true,
  "lastN": 3
}
```

#### Output

```
{
  "values": [
    {
      "entities": [
        {
          "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
          "index": [
            "2023-02-01T00:00:00.000+00:00"
          ],
          "values": [
            107127.1
          ]
        }
      ],
      "timeseriesType": "Sensor"
    }
  ]
}
```

## API reference

-   [https://app.swaggerhub.com/apis/smartsdk/ngsi-tsdb/0.8.3](https://app.swaggerhub.com/apis/smartsdk/ngsi-tsdb/0.8.3)

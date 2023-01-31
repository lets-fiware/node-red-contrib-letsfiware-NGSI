# Historical Context

This custom node is a simple node that allows to obtain historical context from STH-Comet.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context-01.png)

## Properties

This node allows to obtain raw context information or historical aggregate time series context information from STH-Comet.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context-02.png)

-   Raw context information
-   Historical aggregate time series context information
    -   Average of all the samples
    -   Maximum value
    -   Sum of all the samples
    -   Sum of the square value of all the samples
    -   Occur for attributes values of type string

You can specify the start and end of the target period.

-   ISO 8601
-   years
-   months
-   days
-   hours
-   minutes
-   seconds

For example, if you want to get historical context from 3 days ago to 2 days ago, specify as follows.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context-03.png)

### Raw context information

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context-04.png)

-   `name`: a name for a node instance
-   `Generic Enabler`: an endpoint of a STH-Comet
-   `ServicePath`: FIWARE Service Path
-   `Entity id`: an entity id to retrieve
-   `Entity type`: an entity type to retrieve
-   `Attribute`: an attribute to retrieve
-   `Date type`: an data type to retrieve
-   `LastN`: only the requested last entries will be returned. It is a mandatory parameter if no Limit and Offset are provided
-   `Limit`: in case of pagination, the number of entries per page. It is a mandatory parameter if no lastN is provided
-   `Offset`: in case of pagination, the offset to apply to the requested search of raw context information. It is a mandatory parameter if no lastN is provided
-   `Date from`: the starting date and time from which the raw context information is desired. It is an optional parameter
-   `Unit for data from`: unit for starting date
-   `Date to`: the final date and time until which the raw context information is desired. It is an optional parameter.
-   `Unit for data to`: unit for  the final date
-   `Output type`: `raw`, `value` or `dashboard`
-   `Count`: the total count of elements

### Historical Aggregated Time Series Context Information

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context-05.png)

-   `name`: a name for a node instance
-   `Generic Enabler`: an endpoint of a STH-Comet
-   `ServicePath`: FIWARE Service Path
-   `Entity id`: an entity id to retrieve
-   `Entity type`: an entity type to retrieve
-   `Attribute`: an attribute to retrieve
-   `Date type`: an data type to retrieve
-   `Offset`: in case of pagination, the offset to apply to the requested search of raw context information. It is a mandatory parameter if no lastN is provided
-   `AggrPeriod`: Aggregation period or resolution
-   `Date from`: the starting date and time from which the raw context information is desired. It is an optional parameter
-   `Unit for data from`: unit for starting date
-   `Date to`: the final date and time until which the raw context information is desired. It is an optional parameter.
-   `Unit for data to`: unit for  the final date
-   `Output type`: `raw`, `value` or `dashboard`

## Inputs

### Payload  *JSON Object*

A `msg.payload` may contain attributes as shown:

```
{
  "entityId": 
  "attrName": 
  "entityType":
  "dataType": "raw", "ave", "max", "sum", "sum2" or "occur"
  "lastN:
  "hLimit":
  "hOffset":
  "aggrPeriod": "month", "day", "hour", "minute" or "second"
  "dateFrom:"
  "fromUnit": "ISO8601", "years", "months", "days", "hours", "minutes" or "seconds"
  "dateTo: 
  "toUnit: 
  "outputType: "raw", "value", "dashboard"
  "count": "true" or "false"
}
```

These attribute are optional. If properties have appropriate values, you can retrieve historical context by sending
a empty JSON object to this node. If an attribute has a value, it overwrites the value of its corresponding property.

## Outputs

### Payload *JSON Object*

A `msg.payload` contains historical context data.

## Examples

### Output (raw)

```
{
  "type": "StructuredValue",
  "value": [
    {
      "_id": {
        "attrName": "temperature",
        "origin": "2023-01-01T00:00:00.000Z",
        "resolution": "month"
      },
      "points": [
        {
          "offset": 1,
          "samples": 20,
          "sum": 100
        },
        {
          "offset": 1,
          "samples": 0,
          "sum": 0
        }
      ]
    }
  ]
}
```

### Output (value)

```
[
  {
    "_id": "63d115bb5f63eb554d85a13b",
    "attrName": "temperature",
    "attrType": "Number",
    "attrValue": 20.6,
    "recvTime": "2023-01-25T11:42:51.143Z"
  },
  {
    "_id": "63d115bd5f63eb554d85a141",
    "attrName": "temperature",
    "attrType": "Number",
    "attrValue": 20.6,
    "recvTime": "2023-01-25T11:42:53.143Z"
  },
  {
    "_id": "63d115bf5f63eb554d85a147",
    "attrName": "temperature",
    "attrType": "Number",
    "attrValue": 20.6,
    "recvTime": "2023-01-25T11:42:55.145Z"
  }
]
```

### Output (dashboard)

This output is for the NGSI-to-dashboard custom node.

```
{
  "type": "StructuredValue",
  "value": [
    {
      "_id": "63d115bb5f63eb554d85a13b",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 20.6,
      "recvTime": "2023-01-25T11:42:51.143Z"
    },
    {
      "_id": "63d115bd5f63eb554d85a141",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 20.6,
      "recvTime": "2023-01-25T11:42:53.143Z"
    },
    {
      "_id": "63d115bf5f63eb554d85a147",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 20.6,
      "recvTime": "2023-01-25T11:42:55.145Z"
    }
  ],
  "entityId": "E",
  "attrName": "A1",
  "entityType": "T1",
  "dataType": "raw"
}
```

## Examples

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context-06.png)

# FIWARE Service and ServicePath

This custom node is a simple node that allows to manage FIWARE Service and ServicePath.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Passthrough](#passthrough)
-   [Add FIWARE Service and/or ServicePath](#add-fiware-service-andor-servicepath)
-   [Delete FIWARE Service and/or ServicePath](#delete-fiware-service-andor-servicepath)

</details>

## Passthrough

It allows to pass FIWARE Service value and/or ServicePath value to output without manipulation.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-02.png)

-   `name`: A name for a node instance
-   `FIWARE Service`: `Passthrough`
-   `FIWARE ServicePath`: `Passthrough`

### Example

#### Input

Payload *JSON Object*

A `msg.context` should contain JSON Object.

```
{
  "fiwareService": "openiot",
  "fiwareServicePath": "/iot"
}
```

#### Output

Payload *JSON Object*

A `msg.context` contains JSON Object.

```
{
  "fiwareService": "openiot",
  "fiwareServicePath": "/iot"
}
```

## Add FIWARE Service and/or ServicePath

It allows to add FIWARE Service and/or FIWARE ServicePath to `msg.context`.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-03.png)

-   `name`: A name for a node instance
-   `FIWARE Service`: `Add`
-   `Service value`: A value of FIWARE Service
-   `FIWARE ServicePath`: `Add`
-   `Service valuePath`: A value of FIWARE ServicePath

### Examples

Set `Service value` to `OpenIoT` and `Service valuePath` to `/iot`.

#### Input

Payload *JSON Object*

A `msg.context` should contain JSON Object.

```
{}
```

#### Output

Payload *JSON Object*

A `msg.context` contains JSON Object.

```
{
  "fiwareService":"openiot",
  "fiwareServicePath":"/iot"
}
```

## Delete FIWARE Service and/or ServicePath

It allows to delete FIWARE Service and/or FIWARE ServicePath from `msg.context`.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/service-and-servicepath/service-and-servicepath-04.png)

-   `name`: A name for a node instance
-   `FIWARE Service`: `Delete`
-   `FIWARE ServicePath`: `Delete`

### Example

#### Input

Payload *JSON Object*

A `msg.context` should contain JSON Object.

```
{
  "fiwareService":"openiot",
  "fiwareServicePath":"/iot"
}
```

#### Output

Payload *JSON Object*

A `msg.context` contains JSON Object.

```
{}
```

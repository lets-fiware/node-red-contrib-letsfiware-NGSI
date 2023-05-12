# NGSI encode

This custom node is a simple node that encodes forbidden characters.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/encode/encode-01.png)

| Character | Encoded characters |
| --------- | ------------------ |
| "         | %22                |
| %         | %25                |
| '         | %27                |
| (         | %28                |
| )         | %29                |
| ;         | %3B                |
| <         | %3C                |
| =         | %3D                |
| >         | %3E                |

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/encode/encode-02.png)

| Property    | Description                     |
| ----------- | ------------------------------- |
| Name        | A name for a node instance      |

### Input (string)

payload *string*

A `msg.payload` should contain a string.

```text
<Sensor>
```

#### Output (string)

payload *string*

A `msg.payload` contains a string.

```text
%3CSensor%3E
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

### Input (JSON Object)

payload *JSON Object*

A `msg.payload` should contain a NGSI data.

```json
{
  "id": "urn:ngsi-ld:TemperatureSensor:001",
  "type": "TemperatureSensor",
  "name": "<Sensor>"
}
```

#### Output (JSON Object)

payload *JSON Object*

A `msg.payload` contains a NGSI data.

```json
{
  "id": "urn:ngsi-ld:TemperatureSensor:001",
  "type": "TemperatureSensor",
  "name": "%3CSensor%3E"
}
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

### Input (JSON Array)

payload *JSON Array*

A `msg.payload` should contain a NGSI data.

```json
[
  {
    "id": "urn:ngsi-ld:TemperatureSensor:001",
    "type": "TemperatureSensor",
    "name": "<Sensor>"
  }
]
```

#### Output (JSON Array)

payload *JSON Array*

A `msg.payload` contains a NGSI data.

```json
[
  {
    "id": "urn:ngsi-ld:TemperatureSensor:001",
    "type": "TemperatureSensor",
    "name": "%3CSensor%3E"
  }
]
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

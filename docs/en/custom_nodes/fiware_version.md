# FIWARE version 

This custom node is a simple node that allows to obtain the version information of FIWARE Orion.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/version/version-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Properties](#properties)
-   [Inputs](#inputs)
-   [Outputs](#outputs)
-   [Examples](#examples)

</details>

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/version/version-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker

## Inputs

### Payload  *Any*

A `msg.payload` should contain any payload.

```
{}
```

## Outputs

### Payload *JSON Array*

A `msg.payload` contains the version information of FIWARE Orion.

## Examples

### Input

```
{}
```

### Output

```
{
"orion" : {
  "version" : "3.7.0",
  "uptime" : "0 d, 0 h, 0 m, 1 s",
  "git_hash" : "8b19705a8ec645ba1452cb97847a5615f0b2d3ca",
  "compile_time" : "Thu May 26 11:45:49 UTC 2022",
  "compiled_by" : "root",
  "compiled_in" : "025d96e1419a",
  "release_date" : "Thu May 26 11:45:49 UTC 2022",
  "machine" : "x86_64",
  "doc" : "https://fiware-orion.rtfd.io/en/3.7.0/",
  "libversions": {
     "boost": "1_74",
     "libcurl": "libcurl/7.74.0 OpenSSL/1.1.1n zlib/1.2.11 brotli/1.0.9 libidn2/2.3.0 libpsl/0.21.0 (+libidn2/2.3.0) libssh2/1.9.0 nghttp2/1.43.0 librtmp/2.3",
     "libmosquitto": "2.0.12",
     "libmicrohttpd": "0.9.70",
     "openssl": "1.1",
     "rapidjson": "1.1.0",
     "mongoc": "1.17.4",
     "bson": "1.17.4"
  }
}
}
```

## Example

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/version/version-03.png)

```
[{"id":"55dbdb0eb1444bc2","type":"tab","label":"Flow 1","disabled":false,"info":"","env":[]},{"id":"3f69ee368a865420","type":"FIWARE version","z":"55dbdb0eb1444bc2","openapis":"dbfbafc3664fa2c3","x":320,"y":80,"wires":[["3eb4deafeb81a5f5"]]},{"id":"d2f7b9a85b57a7fd","type":"inject","z":"55dbdb0eb1444bc2","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":120,"y":80,"wires":[["3f69ee368a865420"]]},{"id":"3eb4deafeb81a5f5","type":"debug","z":"55dbdb0eb1444bc2","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":530,"y":80,"wires":[]},{"id":"dbfbafc3664fa2c3","type":"Open APIs","name":"","brokerEndpoint":"http://localhost:1026","service":"","idmEndpoint":"","idmType":"none"}]
```

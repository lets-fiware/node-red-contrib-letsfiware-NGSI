# FIWARE Open APIs

This custom node is a configuration node that allows to configure Context Broker and IdM.

<details>
<summary><strong>Details</strong></summary>

-   [Properties](#properties)
-   [FIWARE GE](#fiware-ge)
    -   [Orion Context Broker](#orion-context-broker)
    -   [STH-Comet](#sth-comet)
-   [Identity manager type](#identity-manager-type)
    -   [None](#none)
    -   [Tokenproxy](#tokenproxy)
    -   [Keyrock](#keyrock)
    -   [Generic](#generic)

</details>

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-06.png)

-   `name`: a name for a node instance
-   `Generic Enabler`: Generic enable type: `Orion Context Broker` or `STH-Comet`
-   `API Endpoint`: URL of API Endpoint of FIWARE GE
-   `Service`: FIWARE Service
-   `IdM Type`: Identity manager type, either `None`, `Tokenproxy`, `Keyrock`, or `Generic`

## FIWARE GE

### Orion Context Broker

To use Orion Context Broker, set `Orion Context Broker` to the `Generic Enabler` property.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-01.png)

### STH-Comet

To use STH-Comet, set `STH-Comet` to the `Generic Enabler` property.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-07.png)

## Identity manager type

### None

Set `NONE` to `IdM Type` when not using any identity manager.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-02.png)

### Tokenproxy

Set `Tokenproxy` to `IdM Type` when using Tokenproxy. Then, set IdM Endpoint, Username and Password.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-03.png)

### Keyrock

Set `Keyrock` to `IdM Type` when using Keyrock. Then, set IdM Endpoint, Username, Password, Client ID and Client
Secret. 

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-04.png)

### Generic

Set `Generic` to `IdM Type` when using an generic identity manager. Then, set IdM Endpoint, Username, Password, Client
ID and Client Secret.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-05.png)

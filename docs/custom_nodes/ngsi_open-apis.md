# FIWARE Open APIs

This custom node is a configuration node that allows to configure Context Broker and IdM.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/open-apis-01.png)

- `name`: a name for a node instance
- `Broker Endpoint`: URL of a context broker
- `Service`: FIWARE Service
- `IdM Type`: Identity manager type, either `None`, `Tokenproxy`, `Keyrock`, or `Generic`

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

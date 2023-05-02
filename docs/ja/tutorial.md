# Tutorial

最初に、このリポジトリをクローンします。

```
git clone https://github.com/lets-fiware/node-red-letsfiware-NGSI.git
```

現在のディレクトリを に移動しますnode-red-letsfiware-NGSI/examples。

```
cd node-red-letsfiware-NGSI/examples
```

チュートリアル用の Docker コンテナーを作成します。

```
./service create
```

コンテナを起動する

```
./service start
```

次の URL を使用して Node-RED を開きます: `http://IP address:1880/`。これは、Docker エンジンを実行しているマシンの IP アドレスです。

コンテナーを停止するには、次のコマンドを実行します。

```
./service stop
```

`service` コマンドは、次のオプションを使用して実行できます:

| オプション  | 説明                             |
| ----------- | --------------------------------- |
| create      | コンテナを作成します              |
| start       | すべてのコンテナを起動します      |
| orion       | Orion を起動します                |
| comet       | Orion と STH-Comet を起動します   |
| quantumleap | Orion と Quantumleap を起動します |
| stop        | すべてのコンテナを停止しします    |

> CrateDB が `max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]` エラーで直ぐに
> 終了する場合、ホストマシンで `sudo sysctl -w vm.max_map_count=262144` コマンドを実行することで修正できます。詳細について
> は、CrateDB の [ドキュメント](https://crate.io/docs/crate/howtos/en/latest/admin/bootstrap-checks.html#bootstrap-checks)
> と、Docker
> [トラブルシューティング・ガイド](https://crate.io/docs/crate/howtos/en/latest/deployment/containers/docker.html#troubleshooting)
> を参照してください。

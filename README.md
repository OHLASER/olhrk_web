olhrk_webはC#で記述された ASP.NET Webアプリケーションです。HARUKAの遠隔操作が可能です。

## IISの設定
olhrk_webを使用する際、IISの設定についての注意点を記載します。

### IISマネージャ
olhrk_webを使用するサイトに紐づくアプリケーションプールの詳細設定画面上で、以下のように項目設定が行われている必要があります。
|  項目  |  説明  |
| ---- | ---- |
|  32ビットアプリケーションの有効化  | True  |
|  ID  | LocalSystem  |
![iis_settings00](docs/iis_settings00.PNG)

### Windowsの機能
IISに関するwindowsの機能の設定について、以下のような設定で動作を確認しています。
![iis_settings00](docs/iis_settings01.PNG)


### その他
IPアドレス、ポートの設定は任意の値で問題ありません。
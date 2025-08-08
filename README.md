# cloud-event-notifier-04

Azure Functions (HTTP trigger)  
HTTPリクエスト（POST）を叩くとSlackに通知を送るサンプル  
（100本ノックの第4弾）

---

## 🚀 機能概要

- 関数アプリのURLにPOSTリクエストを送るとSlackに通知を送信します。

## 📦 ディレクトリ構成

```
cloud-event-notifier-02/
├── src/functions/
│   └── NotifyWebhook.ts       # Event Grid Trigger 関数本体
├── .env                      # ローカル用Webhook URL（dotenv）
├── package.json
├── tsconfig.json
├── local.settings.json       # Azure Functions ローカル設定
└── README.md
```

## 🔧 セットアップ手順

1. ローカルでの実行
```bash
npm install
npm run build
func start
```
.env に以下を記述：
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```
---
2. Azureへのデプロイ

```bash
func azure functionapp publish func-cloud-notifier-04-dev
```
3. Slack Webhookの登録（Azure側）
```bash
az functionapp config appsettings set \
  --name func-cloud-notifier-04-dev \
  --resource-group <rg_name> \
  --settings SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---


## ✨ 実行例（Slack通知）

以下のcurlコマンドを実行します
```Bash
curl -X POST 'https://func-cloud-notifier-04-dev.azurewebsites.net/api/NotifyWebhook' \
  -H "Content-Type: application/json" \
  -d '{"message": "Slack通知テスト"}'
```

📨: HTTP通知が届きました!  
📝: Slack通知テスト

---
## ミスったこと
* curlコマンドを実行しても通知されなかった。  

**【確認したこと】**
- 環境変数にSlackのWebhook用URLが設定されているか
- 関数アプリがpublishされているか

**【原因】**
- 関数アプリが正常にデプロイされていなかった。
- function azure functionapp publishコマンドを実行する前に以下コマンドを実行していなかった。
```bash
npm run build
```
これを実行しないとdistディレクトリが作成されず、Azure上に関数がデプロイされない。  
npm run build実行後にデプロイするとSlack通知されるようになった
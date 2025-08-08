import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function NotifyWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const body = await request.json().catch(() => ({})) as { message?: string};
    const message = body.message ?? "📨 通知が届きました! (メッセージ未指定)";

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

    if(!slackWebhookUrl) {
        context.error("❌ SLACK_WEBHOOK_URLが設定されていません!");
        return { status: 500, body: "Webhook URL not set" };
    }

    try {
        await axios.post(slackWebhookUrl, {
            text: `📨 HTTP通知が届きました!\n📝: ${message}`
        });
        context.log("✅ Slack通知送信成功!");
        return { status: 200, body: "Slack通知を送信しました!" };
    } catch (err) {
        context.error("❌ Slack通知送信に失敗:", err);
        return { status: 500, body: "Slack通知エラー" };
    }
};

app.http('NotifyWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: NotifyWebhook
});

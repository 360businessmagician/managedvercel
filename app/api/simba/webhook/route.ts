import { NextResponse } from "next/server"
import { SimbaClient } from "@/lib/simba-integration/client"
import { kv } from "@vercel/kv"

// Initialize SIMBA client with configuration
const simbaClient = new SimbaClient({
  apiKey: process.env.SIMBA_API_KEY || "",
  apiEndpoint: process.env.SIMBA_API_ENDPOINT || "",
  webhookSecret: process.env.SIMBA_WEBHOOK_SECRET || "",
  verificationTTL: 86400, // 24 hours
  retryAttempts: 3,
  retryDelay: 1000,
})

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("X-Simba-Signature") || ""
    const payload = await request.json()

    // Validate the webhook signature
    if (!simbaClient.validateWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Process the verification update
    const { requestId, status, transactionId, verificationProof } = payload

    // Update verification status in KV store
    await kv.set(`verification:${requestId}`, {
      status,
      transactionId,
      verificationProof,
      updatedAt: new Date().toISOString(),
    })

    // Publish event to notify subscribers of the status change
    // In a real implementation, this would use a message queue or event bus

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing SIMBA webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

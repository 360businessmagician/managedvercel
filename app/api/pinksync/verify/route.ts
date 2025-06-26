import { NextResponse } from "next/server"
import { SimbaClient } from "@/lib/simba-integration/client"
import type { VerificationRequest } from "@/lib/simba-integration/types"
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
    const { dataId, dataType, payload, metadata } = await request.json()

    // Create verification request
    const verificationRequest: VerificationRequest = {
      dataId,
      dataType,
      payload,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    }

    // Check if we already have a valid verification for this data
    const existingVerification = await kv.get(`data:${dataId}:verification`)
    if (existingVerification && existingVerification.status === "verified") {
      return NextResponse.json(existingVerification)
    }

    // Submit to SIMBA Chain for verification
    const response = await simbaClient.verifyData(verificationRequest)

    // Store the verification request and initial response
    await kv.set(`verification:${response.requestId}`, {
      status: response.status,
      dataId,
      dataType,
      createdAt: new Date().toISOString(),
    })

    // Link the data ID to this verification request
    await kv.set(`data:${dataId}:verification`, {
      requestId: response.requestId,
      status: response.status,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error initiating SIMBA verification:", error)
    return NextResponse.json({ error: "Verification initiation failed" }, { status: 500 })
  }
}

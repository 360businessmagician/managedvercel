import { NextResponse } from "next/server"
import { SimbaClient } from "@/lib/simba-integration/client"
import { VerificationBackup } from "@/lib/simba-integration/backup"

// Initialize SIMBA client
const simbaClient = new SimbaClient({
  apiKey: process.env.SIMBA_API_KEY || "",
  apiEndpoint: process.env.SIMBA_API_ENDPOINT || "",
  webhookSecret: process.env.SIMBA_WEBHOOK_SECRET || "",
  verificationTTL: 86400,
  retryAttempts: 3,
  retryDelay: 1000,
})

// Initialize backup service
const backupService = new VerificationBackup(simbaClient)

export async function GET() {
  try {
    const results = await backupService.verifyIntegrity()

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Integrity check failed:", error)
    return NextResponse.json({ error: "Failed to verify integrity" }, { status: 500 })
  }
}

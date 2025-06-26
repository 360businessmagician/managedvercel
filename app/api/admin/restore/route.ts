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

export async function POST(request: Request) {
  try {
    const { backupId } = await request.json()

    if (!backupId) {
      return NextResponse.json({ error: "Backup ID is required" }, { status: 400 })
    }

    const restoredCount = await backupService.restoreBackup(backupId)

    return NextResponse.json({
      success: true,
      backupId,
      restoredCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Restore failed:", error)
    return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 })
  }
}

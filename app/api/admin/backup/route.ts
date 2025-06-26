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
    const backupId = await backupService.createBackup()

    return NextResponse.json({
      success: true,
      backupId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Backup creation failed:", error)
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const backups = await backupService.listBackups()

    return NextResponse.json({
      success: true,
      backups,
    })
  } catch (error) {
    console.error("Failed to list backups:", error)
    return NextResponse.json({ error: "Failed to list backups" }, { status: 500 })
  }
}

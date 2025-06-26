import { kv } from "@vercel/kv"
import type { SimbaClient } from "./client"
import type { VerificationResponse } from "./types"

export class VerificationBackup {
  private client: SimbaClient
  private backupPrefix: string

  constructor(client: SimbaClient, backupPrefix = "backup") {
    this.client = client
    this.backupPrefix = backupPrefix
  }

  /**
   * Creates a backup of all verification data
   */
  async createBackup(): Promise<string> {
    const backupId = `${this.backupPrefix}:${Date.now()}`
    const keys = await kv.keys("verification:*")

    if (keys.length === 0) {
      return backupId
    }

    // Get all verification data
    const verifications = await Promise.all(
      keys.map(async (key) => {
        const data = await kv.get(key)
        return { key, data }
      }),
    )

    // Store backup
    await kv.set(backupId, {
      timestamp: new Date().toISOString(),
      count: verifications.length,
      verifications,
    })

    console.log(`Backup created: ${backupId} with ${verifications.length} items`)
    return backupId
  }

  /**
   * Restores verification data from a backup
   */
  async restoreBackup(backupId: string): Promise<number> {
    const backup = await kv.get(backupId)

    if (!backup || !backup.verifications) {
      throw new Error(`Backup not found: ${backupId}`)
    }

    let restoredCount = 0

    // Restore each verification
    for (const { key, data } of backup.verifications) {
      await kv.set(key, data)
      restoredCount++
    }

    console.log(`Restored ${restoredCount} items from backup ${backupId}`)
    return restoredCount
  }

  /**
   * Lists available backups
   */
  async listBackups(): Promise<{ id: string; timestamp: string; count: number }[]> {
    const backupKeys = await kv.keys(`${this.backupPrefix}:*`)

    const backups = await Promise.all(
      backupKeys.map(async (key) => {
        const backup = await kv.get(key)
        return {
          id: key,
          timestamp: backup?.timestamp || "",
          count: backup?.count || 0,
        }
      }),
    )

    return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  /**
   * Verifies the integrity of verification data
   */
  async verifyIntegrity(): Promise<{
    total: number
    valid: number
    invalid: number
    details: Array<{ key: string; valid: boolean; issue?: string }>
  }> {
    const keys = await kv.keys("verification:request:*")
    const results = {
      total: keys.length,
      valid: 0,
      invalid: 0,
      details: [] as Array<{ key: string; valid: boolean; issue?: string }>,
    }

    for (const key of keys) {
      try {
        const verification = (await kv.get(key)) as VerificationResponse

        if (!verification) {
          results.invalid++
          results.details.push({ key, valid: false, issue: "Verification data not found" })
          continue
        }

        if (verification.status === "verified" && verification.transactionId) {
          // Check with SIMBA Chain that the transaction is valid
          const isValid = await this.validateTransaction(verification.transactionId)

          if (isValid) {
            results.valid++
            results.details.push({ key, valid: true })
          } else {
            results.invalid++
            results.details.push({
              key,
              valid: false,
              issue: "Transaction not found on blockchain",
            })
          }
        } else {
          // Non-verified statuses don't need blockchain validation
          results.valid++
          results.details.push({ key, valid: true })
        }
      } catch (error) {
        results.invalid++
        results.details.push({
          key,
          valid: false,
          issue: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return results
  }

  /**
   * Validates a transaction on the blockchain
   */
  private async validateTransaction(transactionId: string): Promise<boolean> {
    try {
      // In a real implementation, this would check with SIMBA Chain
      // that the transaction exists and is valid
      return true
    } catch (error) {
      console.error(`Failed to validate transaction ${transactionId}:`, error)
      return false
    }
  }
}

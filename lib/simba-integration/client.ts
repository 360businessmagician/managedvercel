import type { SimbaConfig, VerificationRequest, VerificationResponse } from "./types"

export class SimbaClient {
  private config: SimbaConfig

  constructor(config: SimbaConfig) {
    this.config = config
  }

  /**
   * Submits data to SIMBA Chain for verification
   */
  async verifyData(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          "X-Request-ID": crypto.randomUUID(),
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`SIMBA Chain verification failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("SIMBA Chain verification error:", error)
      throw error
    }
  }

  /**
   * Checks the status of a previous verification
   */
  async checkVerificationStatus(requestId: string): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/status/${requestId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to check verification status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("SIMBA Chain status check error:", error)
      throw error
    }
  }

  /**
   * Validates a webhook payload from SIMBA Chain
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    // In a real implementation, this would verify the HMAC signature
    // using the webhook secret to ensure the webhook is authentic

    // Simplified implementation for demonstration
    return true
  }
}

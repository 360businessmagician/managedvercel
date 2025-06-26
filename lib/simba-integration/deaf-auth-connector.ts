import type { SimbaClient } from "./client"
import type { VerificationRequest, VerificationResponse } from "./types"

export class DeafAuthConnector {
  private client: SimbaClient
  private authEndpoint: string

  constructor(client: SimbaClient, authEndpoint: string) {
    this.client = client
    this.authEndpoint = authEndpoint
  }

  /**
   * Verifies a DeafAuth identity token
   */
  async verifyIdentityToken(token: string, userId: string): Promise<VerificationResponse> {
    try {
      // Create verification request
      const verificationRequest: VerificationRequest = {
        dataId: `identity:${userId}`,
        dataType: "identity",
        payload: {
          token,
          userId,
          timestamp: new Date().toISOString(),
        },
        metadata: {
          userId,
          serviceId: "deaf-auth",
          timestamp: new Date().toISOString(),
          priority: "high",
        },
      }

      // Submit to SIMBA Chain for verification
      return await this.client.verifyData(verificationRequest)
    } catch (error) {
      console.error("Failed to verify identity token:", error)
      throw error
    }
  }

  /**
   * Validates a user's identity with DeafAuth and verifies it with SIMBA Chain
   */
  async validateAndVerifyIdentity(
    userId: string,
    credentials: Record<string, any>,
  ): Promise<{ isValid: boolean; verification: VerificationResponse | null }> {
    try {
      // First, validate with DeafAuth
      const authResponse = await fetch(`${this.authEndpoint}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          credentials,
        }),
      })

      if (!authResponse.ok) {
        return { isValid: false, verification: null }
      }

      const { token } = await authResponse.json()

      // Then verify with SIMBA Chain
      const verification = await this.verifyIdentityToken(token, userId)

      return {
        isValid: verification.status === "verified",
        verification,
      }
    } catch (error) {
      console.error("Identity validation and verification failed:", error)
      return { isValid: false, verification: null }
    }
  }

  /**
   * Registers a new identity and verifies it with SIMBA Chain
   */
  async registerAndVerifyIdentity(
    userData: Record<string, any>,
  ): Promise<{ userId: string; verification: VerificationResponse | null }> {
    try {
      // Register with DeafAuth
      const registerResponse = await fetch(`${this.authEndpoint}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!registerResponse.ok) {
        throw new Error(`Registration failed: ${registerResponse.statusText}`)
      }

      const { userId, token } = await registerResponse.json()

      // Verify with SIMBA Chain
      const verification = await this.verifyIdentityToken(token, userId)

      return {
        userId,
        verification,
      }
    } catch (error) {
      console.error("Identity registration and verification failed:", error)
      throw error
    }
  }
}

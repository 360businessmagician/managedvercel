import { kv } from "@vercel/kv"
import type { VerificationResponse } from "./types"

export class VerificationCache {
  private readonly namespace: string
  private readonly ttl: number // Time to live in seconds

  constructor(namespace = "verification", ttl = 86400) {
    this.namespace = namespace
    this.ttl = ttl
  }

  /**
   * Generates a cache key for a data ID
   */
  private getDataKey(dataId: string): string {
    return `${this.namespace}:data:${dataId}`
  }

  /**
   * Generates a cache key for a request ID
   */
  private getRequestKey(requestId: string): string {
    return `${this.namespace}:request:${requestId}`
  }

  /**
   * Stores verification data in cache
   */
  async setVerification(requestId: string, dataId: string, verification: Partial<VerificationResponse>): Promise<void> {
    const requestKey = this.getRequestKey(requestId)
    const dataKey = this.getDataKey(dataId)

    // Store the full verification data with the request ID
    await kv.set(
      requestKey,
      {
        ...verification,
        updatedAt: new Date().toISOString(),
      },
      { ex: this.ttl },
    )

    // Store a reference from the data ID to the request ID
    await kv.set(
      dataKey,
      {
        requestId,
        status: verification.status,
        updatedAt: new Date().toISOString(),
      },
      { ex: this.ttl },
    )
  }

  /**
   * Retrieves verification data by request ID
   */
  async getVerificationByRequestId(requestId: string): Promise<VerificationResponse | null> {
    const key = this.getRequestKey(requestId)
    return await kv.get(key)
  }

  /**
   * Retrieves verification data by data ID
   */
  async getVerificationByDataId(dataId: string): Promise<VerificationResponse | null> {
    const dataKey = this.getDataKey(dataId)
    const reference = await kv.get(dataKey)

    if (!reference || !reference.requestId) {
      return null
    }

    return await this.getVerificationByRequestId(reference.requestId)
  }

  /**
   * Updates verification status
   */
  async updateVerificationStatus(
    requestId: string,
    status: string,
    additionalData: Record<string, any> = {},
  ): Promise<void> {
    const key = this.getRequestKey(requestId)
    const verification = await kv.get(key)

    if (!verification) {
      return
    }

    // Update the verification data
    await kv.set(
      key,
      {
        ...verification,
        ...additionalData,
        status,
        updatedAt: new Date().toISOString(),
      },
      { ex: this.ttl },
    )

    // If the verification has a dataId, update the reference as well
    if (verification.dataId) {
      const dataKey = this.getDataKey(verification.dataId)
      await kv.set(
        dataKey,
        {
          requestId,
          status,
          updatedAt: new Date().toISOString(),
        },
        { ex: this.ttl },
      )
    }
  }

  /**
   * Invalidates verification cache for a data ID
   */
  async invalidateDataCache(dataId: string): Promise<void> {
    const dataKey = this.getDataKey(dataId)
    await kv.del(dataKey)
  }

  /**
   * Invalidates verification cache for a request ID
   */
  async invalidateRequestCache(requestId: string): Promise<void> {
    const key = this.getRequestKey(requestId)
    await kv.del(key)
  }
}

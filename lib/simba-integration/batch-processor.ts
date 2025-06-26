import type { SimbaClient } from "./client"
import type { VerificationCache } from "./cache"
import type { VerificationRequest } from "./types"

export class BatchProcessor {
  private client: SimbaClient
  private cache: VerificationCache
  private batchSize: number
  private batchInterval: number // ms
  private queue: VerificationRequest[]
  private timer: NodeJS.Timeout | null = null
  private processing = false

  constructor(
    client: SimbaClient,
    cache: VerificationCache,
    options: { batchSize?: number; batchInterval?: number } = {},
  ) {
    this.client = client
    this.cache = cache
    this.batchSize = options.batchSize || 10
    this.batchInterval = options.batchInterval || 5000
    this.queue = []
  }

  /**
   * Adds a verification request to the batch queue
   */
  async addToBatch(request: VerificationRequest): Promise<string> {
    // Generate a request ID
    const requestId = crypto.randomUUID()

    // Add to queue
    this.queue.push({
      ...request,
      metadata: {
        ...request.metadata,
        requestId,
      },
    })

    // Start timer if not already running
    if (!this.timer && !this.processing) {
      this.timer = setTimeout(() => this.processBatch(), this.batchInterval)
    }

    // Process immediately if batch size reached
    if (this.queue.length >= this.batchSize && !this.processing) {
      clearTimeout(this.timer!)
      this.timer = null
      this.processBatch()
    }

    return requestId
  }

  /**
   * Processes the current batch of verification requests
   */
  private async processBatch(): Promise<void> {
    if (this.queue.length === 0 || this.processing) {
      return
    }

    this.processing = true
    this.timer = null

    try {
      // Take items from the queue up to batch size
      const batch = this.queue.splice(0, this.batchSize)

      // Process batch with SIMBA Chain
      const batchId = crypto.randomUUID()

      // In a real implementation, this would use the SIMBA Chain batch API
      // For now, we'll process each item individually
      const results = await Promise.allSettled(
        batch.map(async (request) => {
          try {
            const response = await this.client.verifyData(request)

            // Cache the verification result
            await this.cache.setVerification(response.requestId, request.dataId, response)

            return response
          } catch (error) {
            console.error(`Batch item processing failed for ${request.dataId}:`, error)
            throw error
          }
        }),
      )

      // Log batch results
      console.log(`Batch ${batchId} processed: ${results.length} items`)
    } catch (error) {
      console.error("Batch processing error:", error)
    } finally {
      this.processing = false

      // If there are more items in the queue, schedule the next batch
      if (this.queue.length > 0) {
        this.timer = setTimeout(() => this.processBatch(), this.batchInterval)
      }
    }
  }

  /**
   * Forces immediate processing of the current batch
   */
  async flushBatch(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    return this.processBatch()
  }
}

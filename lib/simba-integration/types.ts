// Core types for SIMBA Chain integration

export type VerificationStatus = "pending" | "verified" | "failed" | "expired"

export interface VerificationRequest {
  dataId: string
  dataType: "accessibility" | "identity" | "preference" | "transaction"
  payload: Record<string, any>
  metadata: {
    userId?: string
    serviceId: string
    timestamp: string
    priority: "high" | "normal" | "low"
  }
}

export interface VerificationResponse {
  requestId: string
  status: VerificationStatus
  transactionId?: string
  timestamp: string
  expiresAt?: string
  verificationProof?: string
  metadata?: Record<string, any>
}

export interface SimbaConfig {
  apiKey: string
  apiEndpoint: string
  webhookSecret: string
  verificationTTL: number // Time in seconds that verification remains valid
  retryAttempts: number
  retryDelay: number // Time in ms between retry attempts
}

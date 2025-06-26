"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import type { VerificationStatus } from "@/lib/simba-integration/types"

interface DataVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  dataId: string
  dataType: string
  dataName: string
  onVerificationComplete?: (status: VerificationStatus) => void
}

export function DataVerificationModal({
  isOpen,
  onClose,
  dataId,
  dataType,
  dataName,
  onVerificationComplete,
}: DataVerificationModalProps) {
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const [verificationDetails, setVerificationDetails] = useState<{
    transactionId?: string
    timestamp?: string
    message?: string
  }>({})

  const initiateVerification = async () => {
    setStatus("verifying")

    try {
      const response = await fetch("/api/pinksync/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataId,
          dataType,
          payload: {
            name: dataName,
            verificationRequested: new Date().toISOString(),
          },
          metadata: {
            priority: "high",
            serviceId: "pinksync-ui",
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`)
      }

      const data = await response.json()

      setVerificationDetails({
        transactionId: data.transactionId,
        timestamp: data.timestamp,
        message: "Data successfully verified with SIMBA Chain",
      })

      setStatus("success")
      onVerificationComplete?.(data.status)
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationDetails({
        message: error instanceof Error ? error.message : "Verification failed",
      })
      setStatus("error")
      onVerificationComplete?.("failed")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            SIMBA Chain Verification
          </DialogTitle>
          <DialogDescription>Verify this data using SIMBA Chain's tamperproof blockchain technology</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Data ID:</div>
              <div className="font-mono">{dataId.substring(0, 12)}...</div>

              <div className="text-muted-foreground">Type:</div>
              <div className="capitalize">{dataType}</div>

              <div className="text-muted-foreground">Name:</div>
              <div>{dataName}</div>
            </div>

            {status === "idle" && (
              <Alert>
                <AlertDescription>
                  Verifying this data will create an immutable record on the blockchain, ensuring it cannot be tampered
                  with.
                </AlertDescription>
              </Alert>
            )}

            {status === "verifying" && (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-center">Verifying data with SIMBA Chain...</p>
                <p className="text-xs text-muted-foreground text-center mt-1">This may take a few moments</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-center">Verification Successful</p>
                <p className="text-xs text-muted-foreground text-center mt-1">{verificationDetails.message}</p>

                {verificationDetails.transactionId && (
                  <div className="mt-4 text-xs font-mono bg-gray-100 p-2 rounded w-full overflow-x-auto">
                    <p>Transaction ID: {verificationDetails.transactionId}</p>
                    {verificationDetails.timestamp && (
                      <p>Timestamp: {new Date(verificationDetails.timestamp).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center py-4">
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-sm font-medium text-center">Verification Failed</p>
                <p className="text-xs text-red-500 text-center mt-1">{verificationDetails.message}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={onClose} disabled={status === "verifying"}>
            {status === "success" || status === "error" ? "Close" : "Cancel"}
          </Button>

          {status === "idle" && (
            <Button onClick={initiateVerification}>
              <Shield className="h-4 w-4 mr-2" />
              Verify Data
            </Button>
          )}

          {status === "error" && <Button onClick={initiateVerification}>Try Again</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

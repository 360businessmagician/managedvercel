"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertTriangle } from "lucide-react"

interface SimbaConnectorProps {
  serviceName: string
  dataType: "identity" | "financial" | "accessibility" | "vocational"
  onVerificationComplete?: (status: boolean) => void
}

export function SimbaConnector({ serviceName, dataType, onVerificationComplete }: SimbaConnectorProps) {
  const [status, setStatus] = useState<"idle" | "connecting" | "verified" | "error">("idle")
  const [lastVerified, setLastVerified] = useState<string | null>(null)

  // Simulated connection to SIMBA Chain
  const connectToSimba = async () => {
    setStatus("connecting")

    try {
      // This would be replaced with actual SIMBA Chain API calls
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStatus("verified")
      setLastVerified(new Date().toISOString())
      onVerificationComplete?.(true)
    } catch (error) {
      setStatus("error")
      onVerificationComplete?.(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{serviceName}</CardTitle>
          <CardDescription>SIMBA Chain Verification</CardDescription>
        </div>
        <Shield className="h-6 w-6 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Data Type</p>
            <Badge variant="outline" className="capitalize">
              {dataType}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            {status === "verified" ? (
              <Badge className="bg-green-500">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified
              </Badge>
            ) : status === "error" ? (
              <Badge variant="destructive">
                <AlertTriangle className="mr-1 h-3 w-3" /> Error
              </Badge>
            ) : status === "connecting" ? (
              <Badge variant="outline" className="animate-pulse">
                Connecting...
              </Badge>
            ) : (
              <Badge variant="outline">Not Verified</Badge>
            )}
          </div>
        </div>

        {lastVerified && (
          <p className="mt-4 text-xs text-muted-foreground">Last verified: {new Date(lastVerified).toLocaleString()}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={connectToSimba}
          disabled={status === "connecting"}
          className="w-full"
          variant={status === "verified" ? "outline" : "default"}
        >
          {status === "verified" ? "Reverify" : status === "connecting" ? "Connecting..." : "Verify Data"}
        </Button>
      </CardFooter>
    </Card>
  )
}

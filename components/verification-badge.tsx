"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertTriangle, Clock } from "lucide-react"
import type { VerificationStatus } from "@/lib/simba-integration/types"

interface VerificationBadgeProps {
  dataId: string
  pollingInterval?: number // ms
}

export function VerificationBadge({ dataId, pollingInterval = 5000 }: VerificationBadgeProps) {
  const [status, setStatus] = useState<VerificationStatus>("pending")
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  useEffect(() => {
    // Initial check
    checkVerificationStatus()

    // Set up polling if not verified
    const interval = setInterval(() => {
      if (status !== "verified") {
        checkVerificationStatus()
      }
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [dataId, status])

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch(`/api/pinksync/status?dataId=${dataId}`)
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
        setLastChecked(new Date().toISOString())
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={status === "verified" ? "default" : status === "failed" ? "destructive" : "outline"}
            className={status === "pending" ? "animate-pulse" : ""}
          >
            {status === "verified" ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </>
            ) : status === "failed" ? (
              <>
                <AlertTriangle className="h-3 w-3 mr-1" /> Failed
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" /> Pending
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p>Verification Status: {status}</p>
            {lastChecked && (
              <p className="text-muted-foreground">Last checked: {new Date(lastChecked).toLocaleString()}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

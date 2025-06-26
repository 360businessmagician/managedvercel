"use client"

import { useState, useEffect } from "react"
import { Shield, AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { VerificationStatus } from "@/lib/simba-integration/types"

interface VerificationStatusIndicatorProps {
  dataId: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  showTooltip?: boolean
  className?: string
  onStatusChange?: (status: VerificationStatus) => void
}

export function VerificationStatusIndicator({
  dataId,
  size = "md",
  showLabel = false,
  showTooltip = true,
  className,
  onStatusChange,
}: VerificationStatusIndicatorProps) {
  const [status, setStatus] = useState<VerificationStatus>("pending")
  const [lastChecked, setLastChecked] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  useEffect(() => {
    checkStatus()

    // Set up polling for pending status
    let interval: NodeJS.Timeout | null = null
    if (status === "pending") {
      interval = setInterval(checkStatus, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [dataId, status])

  const checkStatus = async () => {
    try {
      const response = await fetch(`/api/pinksync/status?dataId=${dataId}`)
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
        setLastChecked(new Date().toISOString())

        if (onStatusChange && data.status !== status) {
          onStatusChange(data.status)
        }
      }
    } catch (error) {
      console.error("Failed to check verification status:", error)
    }
  }

  const refreshStatus = async () => {
    setIsRefreshing(true)
    await checkStatus()
    setIsRefreshing(false)
  }

  const getStatusIcon = () => {
    switch (status) {
      case "verified":
        return <CheckCircle className={cn(sizeClasses[size], "text-green-500")} />
      case "failed":
        return <AlertCircle className={cn(sizeClasses[size], "text-red-500")} />
      case "expired":
        return <Clock className={cn(sizeClasses[size], "text-amber-500")} />
      case "pending":
      default:
        return (
          <Shield className={cn(sizeClasses[size], "text-blue-500", status === "pending" ? "animate-pulse" : "")} />
        )
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case "verified":
        return "Verified"
      case "failed":
        return "Verification Failed"
      case "expired":
        return "Verification Expired"
      case "pending":
      default:
        return "Verification Pending"
    }
  }

  const statusComponent = (
    <div className={cn("flex items-center gap-1.5", className)} role="status" aria-live="polite">
      {getStatusIcon()}
      {showLabel && <span className="text-sm font-medium">{getStatusLabel()}</span>}
      {status !== "pending" && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            refreshStatus()
          }}
          className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Refresh verification status"
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
        </button>
      )}
    </div>
  )

  if (!showTooltip) {
    return statusComponent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{statusComponent}</TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p className="font-medium">SIMBA Chain Verification</p>
            <p>Status: {getStatusLabel()}</p>
            {lastChecked && (
              <p className="text-muted-foreground">Last checked: {new Date(lastChecked).toLocaleString()}</p>
            )}
            {status === "verified" && <p className="text-green-500">This data is verified and tamperproof</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

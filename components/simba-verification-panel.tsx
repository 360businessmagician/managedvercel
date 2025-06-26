"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, RefreshCw } from "lucide-react"
import { VerificationBadge } from "./verification-badge"

interface SimbaVerificationPanelProps {
  title: string
  description: string
  dataIds: string[]
  onRefresh?: () => void
}

export function SimbaVerificationPanel({ title, description, dataIds, onRefresh }: SimbaVerificationPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Shield className="h-6 w-6 text-blue-500" />
      </CardHeader>
      <CardContent>
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>SIMBA Chain Verification</AlertTitle>
          <AlertDescription>Data is verified using SIMBA Chain's tamperproof blockchain technology.</AlertDescription>
        </Alert>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Verification Status:</p>
          <div className="space-y-2">
            {dataIds.map((dataId) => (
              <div key={dataId} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ID: {dataId.substring(0, 8)}...</span>
                <VerificationBadge dataId={dataId} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="w-full">
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Verification
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

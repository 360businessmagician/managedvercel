"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { VerificationStatus } from "@/lib/simba-integration/types"

interface VerificationEvent {
  id: string
  dataId: string
  status: VerificationStatus
  timestamp: string
  transactionId?: string
  details?: string
}

interface VerificationHistoryProps {
  dataId: string
  limit?: number
}

export function VerificationHistory({ dataId, limit = 5 }: VerificationHistoryProps) {
  const [events, setEvents] = useState<VerificationEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [dataId])

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pinksync/history?dataId=${dataId}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`)
      }

      const data = await response.json()
      setEvents(data.events)
    } catch (error) {
      console.error("Error fetching verification history:", error)
      setError(error instanceof Error ? error.message : "Failed to load verification history")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="h-3 w-3 mr-1" /> Expired
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="outline" className="animate-pulse">
            <Shield className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Verification History</CardTitle>
        <CardDescription>SIMBA Chain verification events for this data</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading verification history...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No verification events found</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.slice(0, isOpen ? events.length : Math.min(3, events.length)).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell className="text-xs">{new Date(event.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs font-mono">
                          {event.transactionId ? event.transactionId.substring(0, 10) + "..." : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {events.length > 3 && (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      {isOpen ? (
                        <span className="flex items-center">
                          <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ChevronDown className="h-4 w-4 mr-1" /> Show More ({events.length - 3} more)
                        </span>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                )}

                <CollapsibleContent>
                  {/* Additional content shown when expanded */}
                  {events.length > 3 && (
                    <div className="pt-2 border-t mt-2">
                      <p className="text-xs text-muted-foreground">
                        Full verification history is available in the admin dashboard
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </>
            )}
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

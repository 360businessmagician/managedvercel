"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CostTracker } from "@/lib/simba-integration/cost-tracker"

export function CostDashboard() {
  const [costTracker] = useState(() => new CostTracker())
  const [timeRange, setTimeRange] = useState("month")
  const [totalCost, setTotalCost] = useState(0)
  const [costsByType, setCostsByType] = useState<Record<string, number>>({})
  const [batchingSavings, setBatchingSavings] = useState(0)

  useEffect(() => {
    updateCostData()
  }, [timeRange])

  const updateCostData = () => {
    let startDate: Date | undefined
    const endDate = new Date()

    switch (timeRange) {
      case "week":
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case "month":
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "quarter":
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "year":
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = undefined
    }

    setTotalCost(costTracker.getTotalCost(startDate, endDate))
    setCostsByType(costTracker.getCostsByType(startDate, endDate))
    setBatchingSavings(costTracker.getBatchingSavings())
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verification Costs</CardTitle>
            <CardDescription>Track and analyze SIMBA Chain verification costs</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="byType">By Type</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Savings from Batching</div>
                  <div className="text-2xl font-bold text-green-600">${batchingSavings.toFixed(2)}</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  These costs represent blockchain transaction fees for data verification. Optimize costs by using
                  batching and selective verification.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="byType">
            <div className="space-y-4">
              {Object.entries(costsByType).length > 0 ? (
                Object.entries(costsByType).map(([type, cost]) => (
                  <div key={type} className="flex justify-between items-center p-2 border-b">
                    <div className="capitalize">{type}</div>
                    <div className="font-medium">${cost.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No cost data available for this time period
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="savings">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Savings</div>
                <div className="text-2xl font-bold text-green-600">${batchingSavings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Compared to individual verification transactions
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Optimization Strategies</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Batch multiple verifications into a single transaction to reduce costs
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Use selective verification for non-critical data
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Implement caching to avoid redundant verifications
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Schedule bulk verifications during low-fee periods
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Cost data is updated in real-time as verifications are processed
      </CardFooter>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostDashboard } from "@/components/cost-dashboard"

export default function MonitoringDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">SIMBA Chain Monitoring</h1>
      <p className="text-muted-foreground mb-8">Monitor the performance and status of the SIMBA Chain integration</p>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-green-500">+0.2% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Latency</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320ms</div>
                <p className="text-xs text-green-500">-15ms from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,458</div>
                <p className="text-xs text-green-500">+8% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.3%</div>
                <p className="text-xs text-amber-500">-1.2% from yesterday</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of all components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="font-medium">SIMBA Chain API</div>
                  <div className="text-green-500 font-medium">Operational</div>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="font-medium">Blockchain Network</div>
                  <div className="text-green-500 font-medium">Operational</div>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="font-medium">Verification Cache</div>
                  <div className="text-green-500 font-medium">Operational</div>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="font-medium">Webhook Processor</div>
                  <div className="text-green-500 font-medium">Operational</div>
                </div>
                <div className="flex justify-between items-center p-2">
                  <div className="font-medium">Batch Processor</div>
                  <div className="text-green-500 font-medium">Operational</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Performance chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latency Breakdown</CardTitle>
                <CardDescription>Average time spent in each phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">API Request</div>
                    <div className="font-mono">45ms</div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">Data Transformation</div>
                    <div className="font-mono">12ms</div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">SIMBA Chain API</div>
                    <div className="font-mono">180ms</div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">Blockchain Submission</div>
                    <div className="font-mono">65ms</div>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div className="font-medium">Response Processing</div>
                    <div className="font-mono">18ms</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
                <CardDescription>Cache efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">Hit Rate</div>
                    <div className="font-mono">92.3%</div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">Miss Rate</div>
                    <div className="font-mono">7.7%</div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">Avg. Cache Latency</div>
                    <div className="font-mono">5ms</div>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div className="font-medium">Cache Size</div>
                    <div className="font-mono">245MB</div>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div className="font-medium">Eviction Rate</div>
                    <div className="font-mono">0.5%/hour</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <CostDashboard />
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution</CardTitle>
              <CardDescription>Errors by type in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Error distribution chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Latest error events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium text-red-800">Blockchain Timeout</div>
                    <div className="text-xs text-muted-foreground">10 minutes ago</div>
                  </div>
                  <p className="text-sm mt-1">Transaction confirmation timed out after 30 seconds</p>
                  <div className="text-xs font-mono bg-red-100 p-2 mt-2 rounded">
                    RequestID: 8f7d6e5c-4b3a-2d1c-0f9e-8d7c6b5a4e3d
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium text-amber-800">API Rate Limit</div>
                    <div className="text-xs text-muted-foreground">45 minutes ago</div>
                  </div>
                  <p className="text-sm mt-1">SIMBA Chain API rate limit exceeded</p>
                  <div className="text-xs font-mono bg-amber-100 p-2 mt-2 rounded">Error: 429 Too Many Requests</div>
                </div>

                <div className="p-3 bg-red-50 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium text-red-800">Webhook Delivery Failure</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <p className="text-sm mt-1">Failed to deliver webhook notification after 3 retries</p>
                  <div className="text-xs font-mono bg-red-100 p-2 mt-2 rounded">
                    WebhookID: 2a1b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

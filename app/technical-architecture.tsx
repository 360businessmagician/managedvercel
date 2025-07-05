import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Server, Layers, MessageSquare, Zap } from "lucide-react"

export default function TechnicalArchitecture() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Technical Architecture</h1>

      <Tabs defaultValue="core">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core">Core Components</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API Layer</TabsTrigger>
          <TabsTrigger value="ai">AI Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="core">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Core Components
              </CardTitle>
              <CardDescription>The foundational elements of the unified communication platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Unified Chat Module
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A centralized chat system that routes all messages through V0, the communication hub. Includes
                    real-time messaging, notification management, and message persistence.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <Code className="h-4 w-4 inline mr-2" />
                    <code className="text-xs">Python + WebSockets + Redis for pub/sub messaging</code>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Admin Control Panel
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Centralized administration at admin.mbtquniverse.com for managing all aspects of the platform
                    including user permissions, system configuration, and monitoring.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <Code className="h-4 w-4 inline mr-2" />
                    <code className="text-xs">Python + FastAPI + React for the frontend</code>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Accessibility Layer
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Specialized components for deaf users including visual notifications, sign language integration, and
                    accessibility-first design patterns.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <Code className="h-4 w-4 inline mr-2" />
                    <code className="text-xs">Python + Custom UI Components + WebRTC for video</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Unified Database
              </CardTitle>
              <CardDescription>A single, shared database architecture at db.mbtquniverse.com</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Database Schema</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A carefully designed schema that supports all projects while maintaining data consistency and
                    relationships across the entire ecosystem.
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      <code>
                        {`# Core Tables
Users
  - user_id (PK)
  - username
  - email
  - accessibility_preferences
  - created_at

Organizations
  - org_id (PK)
  - name
  - subscription_tier
  - admin_user_id (FK)

Messages
  - message_id (PK)
  - sender_id (FK)
  - recipient_id (FK)
  - content
  - content_type (text, sign_language_video, etc.)
  - timestamp
  - project_id (FK)

Projects
  - project_id (PK)
  - name
  - description
  - organization_id (FK)
  - created_at`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Technology Stack</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A robust database solution that balances performance, scalability, and ease of management.
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>PostgreSQL for relational data with JSON support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Redis for caching and real-time features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Object storage for media (videos, images)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                API Layer
              </CardTitle>
              <CardDescription>A unified API architecture that connects all components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Core API Endpoints</h3>
                  <div className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      <code>
                        {`# Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token

# Messaging
GET /api/messages/{project_id}
POST /api/messages/send
PUT /api/messages/{message_id}
DELETE /api/messages/{message_id}

# User Management
GET /api/users/{user_id}
PUT /api/users/{user_id}
GET /api/users/{user_id}/preferences

# Organizations
GET /api/organizations/{org_id}
POST /api/organizations/create
PUT /api/organizations/{org_id}

# Accessibility
GET /api/accessibility/preferences
PUT /api/accessibility/preferences
POST /api/accessibility/translate-to-sign`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">API Implementation</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A FastAPI-based implementation with comprehensive documentation and security features.
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span>FastAPI for high-performance API endpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span>JWT authentication with role-based access control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span>Comprehensive API documentation with Swagger/OpenAPI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span>Rate limiting and security measures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Integration
              </CardTitle>
              <CardDescription>Specialized AI models for the deaf community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Sign Language Translation</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    AI models that can translate between text and various sign languages, enabling seamless
                    communication between deaf and hearing users.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <Code className="h-4 w-4 inline mr-2" />
                    <code className="text-xs">Python + Custom trained models + Computer vision</code>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Deaf-Culture-Aware LLM</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Language models fine-tuned with data from deaf communities to better understand and generate content
                    that respects deaf culture and communication patterns.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <Code className="h-4 w-4 inline mr-2" />
                    <code className="text-xs">Python + Fine-tuned LLMs + Custom training data</code>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Visual Communication Assistant</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    AI-powered tools that enhance visual communication through automated captioning, visual cues, and
                    accessibility features.
                  </p>
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <Code className="h-4 w-4 inline mr-2" />
                    <code className="text-xs">Python + Computer vision + Real-time processing</code>
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

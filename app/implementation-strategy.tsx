import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineBody,
} from "@/components/ui/timeline"
import { CheckCircle2, Target, Users, Rocket, Zap, BarChart } from "lucide-react"

export default function ImplementationStrategy() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Rule of One Implementation Strategy</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Focus Strategy
          </CardTitle>
          <CardDescription>Applying the Rule of One to build a focused, high-impact solution</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Instead of trying to build multiple features across various projects simultaneously, the Rule of One guides
            us to focus all resources on creating an exceptional unified communication platform specifically for the
            deaf community.
          </p>
        </CardContent>
      </Card>

      <Timeline className="px-4">
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>
              <CheckCircle2 className="h-4 w-4" />
            </TimelineIcon>
            <TimelineTitle>Phase 1: Core Platform Development</TimelineTitle>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <p>
              Build the foundational unified chat system that connects all projects within mbtquniverse.com. Focus on
              creating a robust API layer, database schema, and basic UI components that will serve as the backbone for
              all communication.
            </p>
          </TimelineBody>
        </TimelineItem>

        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>
              <Users className="h-4 w-4" />
            </TimelineIcon>
            <TimelineTitle>Phase 2: Deaf-Specific Accessibility Features</TimelineTitle>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <p>
              Develop specialized features for deaf users including visual notifications, sign language integration with
              AI translation, and deaf-culture-aware language models. Test extensively with your target customer
              segment.
            </p>
          </TimelineBody>
        </TimelineItem>

        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>
              <Zap className="h-4 w-4" />
            </TimelineIcon>
            <TimelineTitle>Phase 3: Integration & Optimization</TimelineTitle>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <p>
              Integrate the platform with existing projects in the MBTQ Universe. Optimize performance, refine the user
              experience, and ensure seamless data flow between components. Implement the unified admin panel at
              admin.mbtquniverse.com.
            </p>
          </TimelineBody>
        </TimelineItem>

        <TimelineItem>
          <TimelineHeader>
            <TimelineIcon>
              <Rocket className="h-4 w-4" />
            </TimelineIcon>
            <TimelineTitle>Phase 4: Launch & Scale</TimelineTitle>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <p>
              Launch the platform to a select group of deaf community organizations. Gather feedback, make necessary
              adjustments, and then scale to additional organizations. Implement the subscription model and begin
              generating revenue.
            </p>
          </TimelineBody>
        </TimelineItem>
      </Timeline>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Success Metrics
          </CardTitle>
          <CardDescription>Measuring the impact of your focused approach</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <span>User adoption rate among deaf community organizations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Reduction in communication barriers (measured through user surveys)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Subscription conversion rate and monthly recurring revenue</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <span>User engagement metrics (daily active users, session duration)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Feature utilization rates for deaf-specific accessibility tools</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

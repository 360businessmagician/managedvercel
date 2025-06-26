import { AccessibilitySettingsCard } from "@/components/accessibility-settings-card"
import { VerificationHistory } from "@/components/verification-history"
import { SimbaVerificationPanel } from "@/components/simba-verification-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export default function AccessibilitySettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1 space-y-6 w-full">
          <h1 className="text-3xl font-bold">Accessibility Settings</h1>
          <p className="text-muted-foreground">
            Customize your accessibility preferences. All settings are securely verified with SIMBA Chain.
          </p>

          <Tabs defaultValue="visual">
            <TabsList>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="language">Language</TabsTrigger>
              <TabsTrigger value="interaction">Interaction</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="space-y-6 pt-4">
              <AccessibilitySettingsCard
                settingId="visual-settings-001"
                title="Visual Preferences"
                description="Customize how content is displayed across all platforms"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <Switch id="high-contrast" />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Size</Label>
                    <Slider defaultValue={[2]} min={1} max={5} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Small</span>
                      <span>Default</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                    <Switch id="reduce-motion" />
                  </div>
                </div>
              </AccessibilitySettingsCard>
            </TabsContent>

            <TabsContent value="language" className="space-y-6 pt-4">
              <AccessibilitySettingsCard
                settingId="language-settings-001"
                title="Sign Language Preferences"
                description="Set your preferred sign language and caption settings"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Sign Language</Label>
                    <RadioGroup defaultValue="asl">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asl" id="asl" />
                        <Label htmlFor="asl">American Sign Language (ASL)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bsl" id="bsl" />
                        <Label htmlFor="bsl">British Sign Language (BSL)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auslan" id="auslan" />
                        <Label htmlFor="auslan">Auslan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="always-captions">Always Show Captions</Label>
                    <Switch id="always-captions" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Caption Size</Label>
                    <Slider defaultValue={[3]} min={1} max={5} step={1} />
                  </div>
                </div>
              </AccessibilitySettingsCard>
            </TabsContent>

            <TabsContent value="interaction" className="space-y-6 pt-4">
              <AccessibilitySettingsCard
                settingId="interaction-settings-001"
                title="Interaction Preferences"
                description="Customize how you interact with applications"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gesture-navigation">Gesture Navigation</Label>
                    <Switch id="gesture-navigation" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
                    <Switch id="haptic-feedback" />
                  </div>

                  <div className="space-y-2">
                    <Label>Gesture Sensitivity</Label>
                    <Slider defaultValue={[3]} min={1} max={5} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </AccessibilitySettingsCard>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <SimbaVerificationPanel
            title="Verification Status"
            description="SIMBA Chain verification status for your settings"
            dataIds={["visual-settings-001", "language-settings-001", "interaction-settings-001"]}
          />

          <VerificationHistory dataId="language-settings-001" limit={5} />
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { VerificationStatusIndicator } from "./verification-status-indicator"
import { DataVerificationModal } from "./data-verification-modal"
import type { VerificationStatus } from "@/lib/simba-integration/types"

interface AccessibilitySettingsCardProps {
  settingId: string
  title: string
  description: string
  children: React.ReactNode
  onSave?: () => Promise<void>
}

export function AccessibilitySettingsCard({
  settingId,
  title,
  description,
  children,
  onSave,
}: AccessibilitySettingsCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("pending")

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave()
      }
      // After saving, prompt for verification
      setIsVerificationModalOpen(true)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerificationComplete = (status: VerificationStatus) => {
    setVerificationStatus(status)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <VerificationStatusIndicator dataId={settingId} showTooltip={true} onStatusChange={setVerificationStatus} />
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsVerificationModalOpen(true)}>
            <Shield className="h-4 w-4 mr-2" />
            Verify Settings
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      <DataVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        dataId={settingId}
        dataType="accessibility"
        dataName={title}
        onVerificationComplete={handleVerificationComplete}
      />
    </>
  )
}

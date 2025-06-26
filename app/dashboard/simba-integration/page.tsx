import { SimbaConnector } from "@/components/simba-connector"

export default function SimbaIntegrationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SIMBA Chain Integration</h1>
      <p className="text-muted-foreground mb-8">Secure, tamperproof data verification across the MBTQ ecosystem</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SimbaConnector serviceName="PinkSync.io" dataType="accessibility" />
        <SimbaConnector serviceName="DeafAuth" dataType="identity" />
        <SimbaConnector serviceName="VR4Deaf" dataType="vocational" />
        <SimbaConnector serviceName="MBTQ Group" dataType="financial" />
      </div>
    </div>
  )
}

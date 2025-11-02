"use client"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { DiagnosticForm } from "@/components/diagnostic-form"

export default function DiagnosticPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Navigation */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Free Diagnostic</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="p-8 bg-background border-border">
          <DiagnosticForm />
        </Card>
      </div>
    </div>
  )
}

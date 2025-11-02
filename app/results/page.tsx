"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatedCounter } from "@/components/animated-counter"
import { CircularProgress } from "@/components/circular-progress"

interface DiagnosticResult {
  name: string
  applianceType: string
  energyLossPerMonth: number
  healthScore: number
  efficiency: string
  recommendation: string
  estimatedSavings: number
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosticResult")
    if (stored) {
      setResult(JSON.parse(stored))
      setTimeout(() => setShowAnimation(true), 500)
    } else {
      router.push("/diagnostic")
    }
  }, [router])

  if (!result) return null

  const priceInfo = {
    AC: { onetime: 799, amc: 999 },
    Refrigerator: { onetime: 699, amc: 799 },
    "Washing Machine": { onetime: 649, amc: 749 },
    Microwave: { onetime: 499, amc: 599 },
    Dishwasher: { onetime: 799, amc: 899 },
    "Water Heater": { onetime: 549, amc: 699 },
  }

  const prices = priceInfo[result.applianceType as keyof typeof priceInfo] || { onetime: 799, amc: 999 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Navigation */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Your Diagnostic Results</h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{result.efficiency} Condition</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Your {result.applianceType} analysis is complete. See the details below.
          </p>
        </div>

        {/* Main Results Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Energy Loss Card */}
          <Card
            className={`p-8 bg-background border-border transform transition-all duration-700 ${showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <div className="text-center space-y-6">
              <p className="text-foreground/60">Monthly Energy Loss</p>
              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-bold text-destructive">
                  ₹
                  <AnimatedCounter from={0} to={result.energyLossPerMonth} duration={2} delay={showAnimation ? 0 : 0} />
                </div>
                <p className="text-foreground/50">per month</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground/70">
                  You could save{" "}
                  <span className="font-semibold text-primary">₹{result.estimatedSavings.toLocaleString()}</span>{" "}
                  annually with proper maintenance
                </p>
              </div>
            </div>
          </Card>

          {/* Health Score Card */}
          <Card
            className={`p-8 bg-background border-border flex flex-col items-center justify-center transform transition-all duration-700 ${showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <div className="text-center space-y-6 w-full">
              <p className="text-foreground/60">Health Score</p>
              <div className="flex justify-center">
                <CircularProgress percentage={result.healthScore} size={140} animate={showAnimation} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{result.efficiency}</p>
                <p className="text-sm text-foreground/60">Condition</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommendation Card */}
        <Card
          className={`p-6 bg-card border border-border transform transition-all duration-700 delay-300 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div className="flex gap-4">
            {result.healthScore < 70 ? (
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Recommendation</h3>
              <p className="text-foreground/70">{result.recommendation}</p>
            </div>
          </div>
        </Card>

        {/* Appliance Details */}
        <Card className="p-6 bg-background border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appliance Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Type</p>
              <p className="font-semibold text-foreground">{result.applianceType}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60 mb-1">Name</p>
              <p className="font-semibold text-foreground">{result.name}</p>
            </div>
          </div>
        </Card>

        {/* Service Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Choose Your Service</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* One-time Service */}
            <Card className="p-6 border-2 border-border hover:border-primary transition-colors bg-background cursor-pointer group">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">One-Time Service</h3>
                <p className="text-foreground/60 text-sm">Perfect for immediate issues and quick fixes</p>

                <div className="space-y-2 py-4 border-y border-border">
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>Expert diagnosis</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>Professional repair</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>One-time service</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>6 months warranty</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-primary">₹{prices.onetime}</p>
                  </div>
                  <Link href={`/booking?type=onetime&service=${result.applianceType}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Book Now</Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* AMC Plan */}
            <Card className="p-6 border-2 border-primary bg-background relative">
              <div className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                RECOMMENDED
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-semibold text-foreground">Annual Maintenance (AMC)</h3>
                <p className="text-foreground/60 text-sm">Complete peace of mind with 12 months of care</p>

                <div className="space-y-2 py-4 border-y border-border">
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>4 expert visits/year</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>24/7 emergency support</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>Parts replacement</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>Priority service</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-primary">₹{prices.amc}</p>
                    <p className="text-xs text-foreground/50 mt-1">per year</p>
                  </div>
                  <Link href={`/booking?type=amc&service=${result.applianceType}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-foreground/60 text-sm">Join 50,000+ customers saving money with Bolt Nexus</p>
        </div>
      </div>
    </div>
  )
}

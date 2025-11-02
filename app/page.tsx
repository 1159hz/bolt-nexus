"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap, Wrench, TrendingDown, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 animate-slide-in-down">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-scale-in animate-float">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Bolt Nexus</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-foreground/70 hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition-smooth">
              How It Works
            </a>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="transition-smooth hover:bg-muted bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div
            className={`space-y-4 transition-all duration-1000 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              <span className="text-foreground">Predict.</span>
              <br />
              <span className="text-primary">Maintain.</span>
              <br />
              <span className="text-foreground">Save.</span>
            </h1>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto animate-fade-in">
              Get instant diagnostics on your appliances. Discover energy inefficiencies. Schedule maintenance. Save
              thousands.
            </p>
          </div>

          <Link
            href="/diagnostic"
            className={`inline-block transition-all duration-1000 delay-200 ${animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth animate-subtle-glow"
            >
              Run Free Diagnostic
            </Button>
          </Link>

          {/* Trust Indicators */}
          <div className="pt-8 grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: "50k+", label: "Diagnostics Run" },
              { value: "₹2L+", label: "Saved" },
              { value: "4.8/5", label: "Rating" },
              { value: "24/7", label: "Support" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`text-center animate-slide-in-up transition-all duration-700`}
                style={{ animationDelay: animateIn ? `${300 + idx * 100}ms` : "0ms" }}
              >
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-foreground/50">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in">How We Help</h2>
            <p className="text-foreground/60 max-w-xl mx-auto animate-fade-in">
              Everything you need to keep your appliances running efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "Energy Diagnostics",
                desc: "Instant analysis of your appliance efficiency and monthly energy loss in rupees.",
              },
              {
                icon: TrendingDown,
                title: "Health Scoring",
                desc: "Get a comprehensive health score (0-100) for your appliances with actionable insights.",
              },
              {
                icon: Wrench,
                title: "Expert Technicians",
                desc: "Book certified technicians for maintenance, repairs, or annual maintenance contracts.",
              },
              {
                icon: Shield,
                title: "Verified Savings",
                desc: "Track your actual savings after maintenance and optimize your appliance usage.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card
                  key={idx}
                  className={`p-6 bg-background border-border hover:shadow-lg hover:border-primary transition-all duration-500 animate-scale-in animate-breathe`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Icon className="w-8 h-8 text-primary mb-4 animate-float" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/60">{feature.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center animate-fade-in">
            Simple & Fast
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Share Details", desc: "Tell us about your appliance in 2 minutes" },
              { step: "2", title: "Get Diagnosis", desc: "Instant energy & health analysis" },
              { step: "3", title: "Choose Plan", desc: "One-time service or annual contract" },
              { step: "4", title: "Book & Pay", desc: "Schedule technician, secure payment" },
            ].map((item, idx) => (
              <div key={idx} className="text-center animate-slide-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 hover:scale-110 transition-transform animate-float-slow">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-scale-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Save?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Start with a free diagnostic. No credit card required.
          </p>
          <Link href="/diagnostic">
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-smooth animate-subtle-glow"
            >
              Run Free Diagnostic Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 px-6 animate-slide-in-up">
        <div className="max-w-6xl mx-auto text-center text-foreground/50 text-sm">
          <p>© 2025 Bolt Nexus. Predict. Maintain. Save.</p>
        </div>
      </footer>
    </div>
  )
}

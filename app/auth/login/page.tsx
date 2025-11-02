"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, Zap, AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (formData.email.includes("@")) {
      localStorage.setItem(
        "boltNexusUser",
        JSON.stringify({
          name: formData.email.split("@")[0],
          email: formData.email,
        }),
      )
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col animate-fade-in">
      <nav className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md p-8 bg-background border-border space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center animate-slide-in-down">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-foreground/60">Sign in to your Bolt Nexus account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`pl-10 bg-input border-border text-foreground transition-smooth ${
                    touched.email && errors.email ? "border-destructive ring-2 ring-destructive/20" : ""
                  }`}
                />
                {touched.email && !errors.email && formData.email && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={`pl-10 bg-input border-border text-foreground transition-smooth ${
                    touched.password && errors.password ? "border-destructive ring-2 ring-destructive/20" : ""
                  }`}
                />
                {touched.password && !errors.password && formData.password && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                )}
              </div>
              {touched.password && errors.password && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.password}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive flex items-center gap-2 animate-slide-in-down">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="bg-muted p-4 rounded-lg border border-border text-sm space-y-1 animate-fade-in">
            <p className="font-semibold text-foreground">Demo Credentials</p>
            <p className="text-foreground/70">Email: demo@example.com</p>
            <p className="text-foreground/70">Password: any password</p>
          </div>

          <div className="text-center text-sm text-foreground/60">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-semibold transition-smooth">
              Sign up here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

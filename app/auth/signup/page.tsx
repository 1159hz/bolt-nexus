"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, User, Phone, Zap, AlertCircle, CheckCircle } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\d{10}/.test(phone.replace(/\D/g, ""))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be at least 10 digits"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      )
      router.push("/dashboard")
    } else {
      setError("Invalid email format")
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
            <h1 className="text-2xl font-bold text-foreground">Join Bolt Nexus</h1>
            <p className="text-foreground/60">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`pl-10 bg-input border-border text-foreground transition-smooth ${
                    touched.name && errors.name ? "border-destructive ring-2 ring-destructive/20" : ""
                  }`}
                />
                {touched.name && !errors.name && formData.name && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                )}
              </div>
              {touched.name && errors.name && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.name}</p>
              )}
            </div>

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
              <Label htmlFor="phone" className="text-foreground">
                Phone Number
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  className={`pl-10 bg-input border-border text-foreground transition-smooth ${
                    touched.phone && errors.phone ? "border-destructive ring-2 ring-destructive/20" : ""
                  }`}
                />
                {touched.phone && !errors.phone && formData.phone && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                )}
              </div>
              {touched.phone && errors.phone && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.phone}</p>
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

            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                  className={`pl-10 bg-input border-border text-foreground transition-smooth ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-destructive ring-2 ring-destructive/20"
                      : ""
                  }`}
                />
                {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.confirmPassword}</p>
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
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-foreground/60">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold transition-smooth">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

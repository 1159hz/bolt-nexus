"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingType = searchParams.get("type") || "onetime"
  const applianceType = searchParams.get("service") || "AC"

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    preferredDate: "",
    additionalNotes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const serviceAmount = 100
  const gst = Math.round(serviceAmount * 0.18)
  const totalAmount = serviceAmount + gst

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be at least 10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits"
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2)
    } else if (step === 2) {
      if (validateStep2()) setStep(3)
    }
  }

  const handlePrev = () => {
    setStep(Math.max(1, step - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard")
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setTouched({ ...touched, [field]: true })
  }

  const steps = [
    { number: 1, title: "Contact", icon: "👤" },
    { number: 2, title: "Address", icon: "📍" },
    { number: 3, title: "Payment", icon: "💳" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background animate-fade-in">
      <nav className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-lg transition-smooth">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Complete Your Booking</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-background border-border space-y-8 animate-scale-in">
              <div className="space-y-4">
                <div className="flex gap-2 justify-between">
                  {steps.map((s) => (
                    <div key={s.number} className="flex-1">
                      <div
                        className={`h-1 rounded-full transition-smooth ${s.number <= step ? "bg-primary" : "bg-muted"}`}
                      />
                      <div className="mt-2 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 transition-smooth ${
                            s.number <= step
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted text-foreground/50"
                          }`}
                        >
                          {s.number < step ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">{s.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground/60 text-center">Step {step} of 3</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Contact Information */}
                {step === 1 && (
                  <div className="space-y-4 animate-slide-in-up">
                    <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>

                    <div>
                      <Label htmlFor="fullName" className="text-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        onBlur={() => setTouched({ ...touched, fullName: true })}
                        placeholder="John Doe"
                        className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                          touched.fullName && errors.fullName ? "border-destructive ring-2 ring-destructive/20" : ""
                        }`}
                      />
                      {touched.fullName && errors.fullName && (
                        <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        onBlur={() => setTouched({ ...touched, email: true })}
                        placeholder="you@example.com"
                        className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                          touched.email && errors.email ? "border-destructive ring-2 ring-destructive/20" : ""
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        onBlur={() => setTouched({ ...touched, phone: true })}
                        placeholder="+91 98765 43210"
                        className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                          touched.phone && errors.phone ? "border-destructive ring-2 ring-destructive/20" : ""
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Address Information */}
                {step === 2 && (
                  <div className="space-y-4 animate-slide-in-up">
                    <h2 className="text-xl font-semibold text-foreground">Delivery Address</h2>

                    <div>
                      <Label htmlFor="address" className="text-foreground">
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleFieldChange("address", e.target.value)}
                        onBlur={() => setTouched({ ...touched, address: true })}
                        placeholder="123 Main Street"
                        className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                          touched.address && errors.address ? "border-destructive ring-2 ring-destructive/20" : ""
                        }`}
                      />
                      {touched.address && errors.address && (
                        <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-foreground">
                          City
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleFieldChange("city", e.target.value)}
                          onBlur={() => setTouched({ ...touched, city: true })}
                          placeholder="Mumbai"
                          className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                            touched.city && errors.city ? "border-destructive ring-2 ring-destructive/20" : ""
                          }`}
                        />
                        {touched.city && errors.city && (
                          <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="pincode" className="text-foreground">
                          Pincode
                        </Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleFieldChange("pincode", e.target.value)}
                          onBlur={() => setTouched({ ...touched, pincode: true })}
                          placeholder="400001"
                          className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                            touched.pincode && errors.pincode ? "border-destructive ring-2 ring-destructive/20" : ""
                          }`}
                        />
                        {touched.pincode && errors.pincode && (
                          <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.pincode}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferredDate" className="text-foreground">
                        Preferred Service Date
                      </Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleFieldChange("preferredDate", e.target.value)}
                        onBlur={() => setTouched({ ...touched, preferredDate: true })}
                        className={`mt-1 bg-input border-border text-foreground transition-smooth ${
                          touched.preferredDate && errors.preferredDate
                            ? "border-destructive ring-2 ring-destructive/20"
                            : ""
                        }`}
                      />
                      {touched.preferredDate && errors.preferredDate && (
                        <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.preferredDate}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="additionalNotes" className="text-foreground">
                        Additional Notes (optional)
                      </Label>
                      <textarea
                        id="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        placeholder="Any special instructions..."
                        className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground transition-smooth focus:ring-2 focus:ring-primary/20"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Review */}
                {step === 3 && (
                  <div className="space-y-4 animate-slide-in-up">
                    <h2 className="text-xl font-semibold text-foreground">Review & Confirm</h2>

                    <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Name</span>
                        <span className="font-semibold text-foreground">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Email</span>
                        <span className="font-semibold text-foreground">{formData.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Address</span>
                        <span className="font-semibold text-foreground text-right">
                          {formData.address}, {formData.city} - {formData.pincode}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Service Date</span>
                        <span className="font-semibold text-foreground">{formData.preferredDate}</span>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground/70 mb-3">
                        By confirming, you agree to our terms and conditions
                      </p>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
                      >
                        {loading ? "Processing..." : "Confirm & Complete Booking"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4 animate-fade-in">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      className="flex-1 bg-transparent transition-smooth hover:bg-muted"
                    >
                      Back
                    </Button>
                  )}
                  {step < 3 && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6 bg-card border-border space-y-6 animate-slide-in-down">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Service</span>
                    <span className="font-semibold">{applianceType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Type</span>
                    <span className="font-semibold capitalize">{bookingType}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-foreground/70">
                  <span>Service Fee</span>
                  <span>₹{serviceAmount}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary text-lg">₹{totalAmount}</span>
                </div>
              </div>

              {step === 3 && (
                <div className="pt-4 border-t border-border">
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      document.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true }))
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BookingContent />
    </Suspense>
  )
}

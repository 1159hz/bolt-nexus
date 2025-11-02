"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { calculateDiagnostic } from "@/lib/diagnostic-calculator"
import { AlertCircle, CheckCircle } from "lucide-react"

const APPLIANCE_TYPES = ["AC", "Refrigerator", "Washing Machine", "Microwave", "Dishwasher", "Water Heater"]
const AC_BRANDS = [
  "Voltas",
  "Daikin",
  "LG",
  "Samsung",
  "Whirlpool",
  "Godrej",
  "Hitachi",
  "Bluestar",
  "Carrier",
  "Panasonic",
  "Other",
]
const FRIDGE_BRANDS = [
  "LG",
  "Samsung",
  "Godrej",
  "Whirlpool",
  "Haier",
  "Bosch",
  "Videocon",
  "IFB",
  "Electrolux",
  "Liebherr",
  "Other",
]
const WASHER_BRANDS = [
  "LG",
  "Samsung",
  "Whirlpool",
  "IFB",
  "Bosch",
  "Haier",
  "Godrej",
  "Videocon",
  "Electrolux",
  "Siemens",
  "Other",
]
const MICROWAVE_BRANDS = [
  "LG",
  "Samsung",
  "Panasonic",
  "IFB",
  "Godrej",
  "Whirlpool",
  "Electrolux",
  "Voltas",
  "Midea",
  "Other",
]
const DISHWASHER_BRANDS = [
  "Bosch",
  "IFB",
  "Electrolux",
  "Siemens",
  "Samsung",
  "LG",
  "Whirlpool",
  "Godrej",
  "Beko",
  "Other",
]
const HEATER_BRANDS = [
  "AO Smith",
  "Bajaj",
  "Havells",
  "Racold",
  "Crompton",
  "V-Guard",
  "Jaquar",
  "Kuvera",
  "Sunflame",
  "Other",
]

export function DiagnosticForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    applianceType: "",
    brand: "",
    model: "",
    yearOfPurchase: new Date().getFullYear(),
    usageHoursPerDay: 4,
    monthsSinceLastService: 6,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be at least 10 digits"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.applianceType) newErrors.applianceType = "Please select an appliance type"
    if (!formData.brand) newErrors.brand = "Please select a brand"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (formData.usageHoursPerDay < 1) {
      newErrors.usageHoursPerDay = "Please select daily usage hours"
    }

    if (formData.monthsSinceLastService < 1) {
      newErrors.monthsSinceLastService = "Please select months since last service"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 3 && !validateStep3()) {
      return
    }
    const result = calculateDiagnostic(formData)
    sessionStorage.setItem(
      "diagnosticResult",
      JSON.stringify({
        ...formData,
        ...result,
      }),
    )
    router.push("/results")
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    setTouched({ ...touched, [field]: true })
  }

  const getBrandOptions = () => {
    switch (formData.applianceType) {
      case "AC":
        return AC_BRANDS
      case "Refrigerator":
        return FRIDGE_BRANDS
      case "Washing Machine":
        return WASHER_BRANDS
      case "Microwave":
        return MICROWAVE_BRANDS
      case "Dishwasher":
        return DISHWASHER_BRANDS
      case "Water Heater":
        return HEATER_BRANDS
      default:
        return ["Other"]
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex gap-2 mb-8 animate-breathe">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-smooth ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-sm text-foreground/60">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-slide-in-up">
          <h2 className="text-xl font-semibold text-foreground">Tell us about yourself</h2>

          <div>
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <div className="relative mt-1">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => setTouched({ ...touched, name: true })}
                placeholder="John Doe"
                className={`bg-input border-border text-foreground transition-smooth ${
                  touched.name && errors.name ? "border-destructive ring-2 ring-destructive/20" : ""
                }`}
              />
              {touched.name && errors.name && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
              )}
            </div>
            {touched.name && errors.name && (
              <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-foreground">
              Phone Number
            </Label>
            <div className="relative mt-1">
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => setTouched({ ...touched, phone: true })}
                placeholder="+91 98765 43210"
                className={`bg-input border-border text-foreground transition-smooth ${
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
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative mt-1">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                placeholder="you@example.com"
                className={`bg-input border-border text-foreground transition-smooth ${
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
            <Label htmlFor="city" className="text-foreground">
              City
            </Label>
            <div className="relative mt-1">
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                onBlur={() => setTouched({ ...touched, city: true })}
                placeholder="Mumbai, Delhi, Bangalore..."
                className={`bg-input border-border text-foreground transition-smooth ${
                  touched.city && errors.city ? "border-destructive ring-2 ring-destructive/20" : ""
                }`}
              />
              {touched.city && !errors.city && formData.city && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              )}
            </div>
            {touched.city && errors.city && (
              <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.city}</p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-slide-in-up">
          <h2 className="text-xl font-semibold text-foreground">Tell us about your appliance</h2>

          <div>
            <Label htmlFor="appliance" className="text-foreground">
              Appliance Type
            </Label>
            <select
              id="appliance"
              value={formData.applianceType}
              onChange={(e) => handleFieldChange("applianceType", e.target.value)}
              className={`w-full mt-1 px-3 py-2 bg-input border rounded-md text-foreground transition-smooth ${
                errors.applianceType ? "border-destructive ring-2 ring-destructive/20" : "border-border"
              }`}
            >
              <option value="">Select an appliance</option>
              {APPLIANCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.applianceType && (
              <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.applianceType}</p>
            )}
          </div>

          <div>
            <Label htmlFor="brand" className="text-foreground">
              Brand
            </Label>
            <select
              id="brand"
              value={formData.brand}
              onChange={(e) => handleFieldChange("brand", e.target.value)}
              className={`w-full mt-1 px-3 py-2 bg-input border rounded-md text-foreground transition-smooth ${
                errors.brand ? "border-destructive ring-2 ring-destructive/20" : "border-border"
              }`}
            >
              <option value="">Select a brand</option>
              {getBrandOptions().map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.brand && <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.brand}</p>}
          </div>

          <div>
            <Label htmlFor="model" className="text-foreground">
              Model (optional)
            </Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleFieldChange("model", e.target.value)}
              placeholder="e.g., 1.5 Ton Inverter"
              className="mt-1 bg-input border-border text-foreground transition-smooth"
            />
          </div>

          <div>
            <Label htmlFor="year" className="text-foreground">
              Year of Purchase
            </Label>
            <select
              id="year"
              value={formData.yearOfPurchase}
              onChange={(e) => handleFieldChange("yearOfPurchase", Number.parseInt(e.target.value))}
              className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground transition-smooth"
            >
              {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-slide-in-up">
          <h2 className="text-xl font-semibold text-foreground">How do you use it?</h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="hours" className="text-foreground font-medium">
                  Average Daily Usage
                </Label>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/30 animate-pulse">
                  <span className="text-lg font-bold text-primary">{formData.usageHoursPerDay}</span>
                  <span className="text-sm text-foreground/70">hours/day</span>
                </div>
              </div>
              <div className="relative">
                <input
                  id="hours"
                  type="range"
                  min="1"
                  max="24"
                  value={formData.usageHoursPerDay}
                  onChange={(e) => handleFieldChange("usageHoursPerDay", Number.parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-muted via-primary to-primary rounded-full appearance-none cursor-pointer accent-primary slider-thumb-enhanced"
                  style={{
                    background: `linear-gradient(to right, #e0f2f1 0%, #00bfa5 ${(formData.usageHoursPerDay / 24) * 100}%, #e0f2f1 ${(formData.usageHoursPerDay / 24) * 100}%, #e0f2f1 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/50 font-medium">
                <span>1h</span>
                <span>12h</span>
                <span>24h</span>
              </div>
              {touched.usageHoursPerDay && errors.usageHoursPerDay && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.usageHoursPerDay}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="service" className="text-foreground font-medium">
                  Time Since Last Service
                </Label>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/30 animate-pulse">
                  <span className="text-lg font-bold text-primary">{formData.monthsSinceLastService}</span>
                  <span className="text-sm text-foreground/70">months</span>
                </div>
              </div>
              <div className="relative">
                <input
                  id="service"
                  type="range"
                  min="1"
                  max="60"
                  value={formData.monthsSinceLastService}
                  onChange={(e) => handleFieldChange("monthsSinceLastService", Number.parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-muted via-primary to-primary rounded-full appearance-none cursor-pointer accent-primary slider-thumb-enhanced"
                  style={{
                    background: `linear-gradient(to right, #e0f2f1 0%, #00bfa5 ${(formData.monthsSinceLastService / 60) * 100}%, #e0f2f1 ${(formData.monthsSinceLastService / 60) * 100}%, #e0f2f1 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/50 font-medium">
                <span>1 month</span>
                <span>30 months</span>
                <span>60 months</span>
              </div>
              {touched.monthsSinceLastService && errors.monthsSinceLastService && (
                <p className="text-destructive text-sm mt-1 animate-slide-in-down">{errors.monthsSinceLastService}</p>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg border border-border animate-fade-in">
            <p className="text-sm text-foreground/70">
              💡 Based on your appliance usage, we'll calculate energy efficiency and provide personalized
              recommendations.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-6 animate-fade-in">
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
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
          >
            Get Diagnosis
          </Button>
        )}
      </div>
    </form>
  )
}

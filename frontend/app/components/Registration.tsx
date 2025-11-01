'use client'

import { useState } from 'react'
import axios from 'axios'
import { ArrowLeft, Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import styles from './Registration.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface RegistrationProps {
  onComplete: (data: any) => void
  onBack: () => void
}

export default function Registration({ onComplete, onBack }: RegistrationProps) {
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [maintenanceProbability, setMaintenanceProbability] = useState(0)
  const [estimatedSavings, setEstimatedSavings] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    appliance_type: 'AC',
    brand_model: '',
    year_of_purchase: new Date().getFullYear() - 2,
    usage_hours_per_day: 8,
    months_since_service: 12,
    current_bill: 3000, // Monthly electricity bill in INR
    appliance_age_years: 2
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const numericFields = ['year_of_purchase', 'usage_hours_per_day', 'months_since_service', 'current_bill', 'appliance_age_years']
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }))
  }

  // Calculate maintenance probability using Bayesian-inspired formula
  const calculateMaintenanceProbability = () => {
    const { appliance_type, usage_hours_per_day, months_since_service, appliance_age_years, current_bill } = formData

    // Base probability factors
    let probability = 0

    // Age factor (0-40 points): Older appliances need more maintenance
    const ageFactor = Math.min((appliance_age_years / 10) * 40, 40)
    probability += ageFactor

    // Usage factor (0-30 points): Higher usage increases probability
    const usageFactor = Math.min((usage_hours_per_day / 24) * 30, 30)
    probability += usageFactor

    // Service delay factor (0-30 points): Time since last service
    const serviceFactor = Math.min((months_since_service / 24) * 30, 30)
    probability += serviceFactor

    // Appliance type multiplier
    const typeMultipliers: { [key: string]: number } = {
      'AC': 1.2,        // ACs need more frequent maintenance
      'Fridge': 1.0,
      'Washing Machine': 0.9
    }
    probability *= typeMultipliers[appliance_type] || 1.0

    // Cap at 100%
    probability = Math.min(Math.round(probability), 100)

    // Calculate potential savings (10-20% of current bill for well-maintained appliances)
    const baselineSavings = current_bill * 0.15 // 15% average savings
    const efficiencyLoss = (probability / 100) * 0.3 // Up to 30% efficiency loss
    const potentialSavings = Math.round(current_bill * efficiencyLoss)

    setMaintenanceProbability(probability)
    setEstimatedSavings(potentialSavings)
    setShowResult(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calculate probability first
      calculateMaintenanceProbability()

      // Send to backend
      const response = await axios.post(`${API_URL}/register`, {
        ...formData,
        maintenance_probability: maintenanceProbability,
        estimated_savings: estimatedSavings
      })

      setTimeout(() => {
        onComplete(response.data)
        setLoading(false)
      }, 2000)
    } catch (error: any) {
      console.error('Registration error:', error)
      alert('Failed to register. Please try again.')
      setLoading(false)
    }
  }

  const getMaintenanceStatus = () => {
    if (maintenanceProbability >= 70) {
      return {
        level: 'Urgent',
        color: '#FF6B9D',
        icon: <AlertCircle size={32} />,
        message: 'Your appliance urgently needs maintenance to avoid high bills!'
      }
    } else if (maintenanceProbability >= 40) {
      return {
        level: 'Recommended',
        color: '#FFA726',
        icon: <TrendingUp size={32} />,
        message: 'Maintenance recommended to optimize electricity costs.'
      }
    } else {
      return {
        level: 'Good',
        color: '#66BB6A',
        icon: <CheckCircle size={32} />,
        message: 'Your appliance is in good condition!'
      }
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Zap size={48} className={styles.headerIcon} />
          <h1>Smart Appliance Registration</h1>
          <p>Register your appliance and discover your electricity saving potential</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Personal Information */}
          <div className={styles.section}>
            <h3>Your Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Mumbai, Delhi, Bangalore..."
              />
            </div>
          </div>

          {/* Appliance Information */}
          <div className={styles.section}>
            <h3>Appliance Details</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="appliance_type">Appliance Type *</label>
              <select
                id="appliance_type"
                name="appliance_type"
                value={formData.appliance_type}
                onChange={handleChange}
                required
              >
                <option value="AC">Air Conditioner</option>
                <option value="Fridge">Refrigerator</option>
                <option value="Washing Machine">Washing Machine</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="brand_model">Brand / Model</label>
              <input
                type="text"
                id="brand_model"
                name="brand_model"
                value={formData.brand_model}
                onChange={handleChange}
                placeholder="e.g., Samsung 1.5 Ton Split AC"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="appliance_age_years">Appliance Age (years) *</label>
                <input
                  type="number"
                  id="appliance_age_years"
                  name="appliance_age_years"
                  value={formData.appliance_age_years}
                  onChange={handleChange}
                  min={0}
                  max={30}
                  step={1}
                  required
                />
                <small>How old is your appliance?</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="usage_hours_per_day">Daily Usage (hours) *</label>
                <input
                  type="number"
                  id="usage_hours_per_day"
                  name="usage_hours_per_day"
                  value={formData.usage_hours_per_day}
                  onChange={handleChange}
                  min={0}
                  max={24}
                  step={0.5}
                  required
                />
                <small>Average hours used per day</small>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="months_since_service">Last Service (months ago) *</label>
                <input
                  type="number"
                  id="months_since_service"
                  name="months_since_service"
                  value={formData.months_since_service}
                  onChange={handleChange}
                  min={0}
                  max={120}
                  required
                />
                <small>Enter 0 if never serviced</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="current_bill">Monthly Electricity Bill (₹) *</label>
                <input
                  type="number"
                  id="current_bill"
                  name="current_bill"
                  value={formData.current_bill}
                  onChange={handleChange}
                  min={0}
                  step={100}
                  required
                />
                <small>Your average monthly bill</small>
              </div>
            </div>
          </div>

          {/* Result Preview */}
          {showResult && (
            <div className={styles.resultPreview}>
              <div className={styles.probabilityCard} style={{ borderColor: getMaintenanceStatus().color }}>
                <div className={styles.iconWrapper} style={{ background: `${getMaintenanceStatus().color}20` }}>
                  {getMaintenanceStatus().icon}
                </div>
                <div className={styles.resultContent}>
                  <h4>Maintenance Probability</h4>
                  <div className={styles.probabilityValue} style={{ color: getMaintenanceStatus().color }}>
                    {maintenanceProbability}%
                  </div>
                  <p className={styles.statusLabel}>{getMaintenanceStatus().level}</p>
                  <p className={styles.statusMessage}>{getMaintenanceStatus().message}</p>
                </div>
              </div>

              <div className={styles.savingsCard}>
                <h4>Potential Monthly Savings</h4>
                <div className={styles.savingsAmount}>₹{estimatedSavings.toLocaleString()}</div>
                <p>With proper maintenance, you could save this much on your electricity bill every month!</p>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>Processing...</>
            ) : showResult ? (
              <>
                Complete Registration
                <CheckCircle size={20} />
              </>
            ) : (
              <>
                Calculate & Register
                <Zap size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

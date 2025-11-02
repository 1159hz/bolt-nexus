'use client'

import { useState } from 'react'
import { mockApi } from '../services/mockApi'
import { ArrowLeft, Zap } from 'lucide-react'
import styles from './DiagnosticForm.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface DiagnosticFormProps {
  onComplete: (data: any) => void
  onBack: () => void
}

export default function DiagnosticForm({ onComplete, onBack }: DiagnosticFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    appliance_type: 'AC',
    brand_model: '',
    year_of_purchase: new Date().getFullYear() - 3,
    usage_hours_per_day: 8,
    months_since_service: 6
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('year') || name.includes('hours') || name.includes('months') 
        ? Number(value) 
        : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Use mock API instead of real backend
      const response = await mockApi.runDiagnostic(formData)
      onComplete(response)
    } catch (error: any) {
      console.error('Diagnostic error:', error)
      alert('Failed to run diagnostic. Please try again.')
    } finally {
      setLoading(false)
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
          <h1>Free Appliance Diagnostic</h1>
          <p>Get instant insights into your appliance health and energy efficiency</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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
                <label htmlFor="year_of_purchase">Year of Purchase *</label>
                <input
                  type="number"
                  id="year_of_purchase"
                  name="year_of_purchase"
                  value={formData.year_of_purchase}
                  onChange={handleChange}
                  min={2000}
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="usage_hours_per_day">Usage (hours/day) *</label>
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
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="months_since_service">Months Since Last Service *</label>
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
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Diagnostic'}
            <Zap size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

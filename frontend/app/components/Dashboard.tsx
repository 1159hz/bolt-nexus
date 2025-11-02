'use client'

import { useState, useEffect } from 'react'
import { mockApi } from '../services/mockApi'
import { ArrowLeft, Calendar, Package, Clock, CheckCircle } from 'lucide-react'
import styles from './Dashboard.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface DashboardProps {
  userId: number
  onBack: () => void
}

interface Appliance {
  id: number
  appliance_type: string
  brand_model: string
  health_score: number
  energy_loss_per_month: number
  status: string
}

interface Booking {
  id: number
  service_type: string
  scheduled_date: string
  status: string
  service_amount: number
}

export default function Dashboard({ userId, onBack }: DashboardProps) {
  const [appliances, setAppliances] = useState<Appliance[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppliance, setSelectedAppliance] = useState<number | null>(null)
  const [serviceType, setServiceType] = useState<'one_time' | 'amc'>('one_time')
  const [scheduledDate, setScheduledDate] = useState('')

  useEffect(() => {
    // Use mock data instead of calling backend
    const mockAppliances = [
      {
        id: 1,
        appliance_type: 'Air Conditioner',
        brand_model: 'Samsung 1.5 Ton',
        health_score: 75,
        energy_loss_per_month: 1200,
        status: 'active'
      },
      {
        id: 2,
        appliance_type: 'Refrigerator',
        brand_model: 'LG Double Door',
        health_score: 85,
        energy_loss_per_month: 450,
        status: 'active'
      }
    ]
    
    const mockBookings = [
      {
        id: 1,
        service_type: 'one_time',
        scheduled_date: '2023-12-15',
        status: 'confirmed',
        service_amount: 799
      }
    ]
    
    setAppliances(mockAppliances)
    setBookings(mockBookings)
    setLoading(false)
  }, [userId])

  const handleBookService = async () => {
    if (!selectedAppliance || !scheduledDate) {
      alert('Please select an appliance and date')
      return
    }

    // Simulate booking creation
    alert(`Booking created! Amount: ₹799. In a real application, this would redirect to payment...`)
    
    // Refresh data with mock booking
    const newBooking = {
      id: bookings.length + 1,
      service_type: serviceType,
      scheduled_date: scheduledDate,
      status: 'confirmed',
      service_amount: serviceType === 'amc' ? 999 : 799
    }
    
    setBookings([...bookings, newBooking])
    setSelectedAppliance(null)
    setScheduledDate('')
  }

  const getHealthColor = (score: number) => {
    if (score >= 70) return '#4CAF50'
    if (score >= 40) return '#FF9800'
    return '#F44336'
  }

  const getStatusBadge = (status: string) => {
    const styles_map: any = {
      'pending': { bg: '#FFF3E0', color: '#F57C00' },
      'confirmed': { bg: '#E8F5E9', color: '#2E7D32' },
      'completed': { bg: '#E3F2FD', color: '#1976D2' },
      'cancelled': { bg: '#FFEBEE', color: '#C62828' }
    }
    const style = styles_map[status] || styles_map.pending
    return (
      <span style={{ 
        backgroundColor: style.bg, 
        color: style.color, 
        padding: '0.25rem 0.75rem', 
        borderRadius: '12px', 
        fontSize: '0.875rem',
        fontWeight: '600'
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={20} />
        Back to Home
      </button>

      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1>My Dashboard</h1>
          <p>Manage your appliances and bookings</p>
        </header>

        {/* Appliances Section */}
        <section className={styles.section}>
          <h2><Package size={24} /> My Appliances</h2>
          
          {appliances.length === 0 ? (
            <p className={styles.emptyState}>No appliances found. Run a diagnostic to get started!</p>
          ) : (
            <div className={styles.applianceGrid}>
              {appliances.map(appliance => (
                <div key={appliance.id} className={styles.applianceCard}>
                  <div className={styles.applianceHeader}>
                    <h3>{appliance.appliance_type}</h3>
                    <div 
                      className={styles.healthScore}
                      style={{ borderColor: getHealthColor(appliance.health_score) }}
                    >
                      <span style={{ color: getHealthColor(appliance.health_score) }}>
                        {appliance.health_score}
                      </span>
                    </div>
                  </div>
                  
                  <p className={styles.brandModel}>{appliance.brand_model || 'No model specified'}</p>
                  
                  <div className={styles.energyLoss}>
                    <span>Energy Loss:</span>
                    <strong>₹{appliance.energy_loss_per_month}/month</strong>
                  </div>
                  
                  <button 
                    className={styles.bookButton}
                    onClick={() => setSelectedAppliance(appliance.id)}
                  >
                    <Calendar size={16} />
                    Book Service
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking Form Modal */}
        {selectedAppliance && (
          <div className={styles.modal} onClick={() => setSelectedAppliance(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3>Schedule Service</h3>
              
              <div className={styles.formGroup}>
                <label>Service Type</label>
                <div className={styles.radioGroup}>
                  <label>
                    <input 
                      type="radio" 
                      value="one_time"
                      checked={serviceType === 'one_time'}
                      onChange={(e) => setServiceType(e.target.value as 'one_time')}
                    />
                    One-time Service
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      value="amc"
                      checked={serviceType === 'amc'}
                      onChange={(e) => setServiceType(e.target.value as 'amc')}
                    />
                    Annual AMC
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Preferred Date & Time</label>
                <input 
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button className={styles.cancelButton} onClick={() => setSelectedAppliance(null)}>
                  Cancel
                </button>
                <button className={styles.confirmButton} onClick={handleBookService}>
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <section className={styles.section}>
          <h2><Clock size={24} /> My Bookings</h2>
          
          {bookings.length === 0 ? (
            <p className={styles.emptyState}>No bookings yet.</p>
          ) : (
            <div className={styles.bookingsList}>
              {bookings.map(booking => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <h4>{booking.service_type === 'amc' ? 'Annual AMC' : 'One-time Service'}</h4>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className={styles.bookingDetails}>
                    <div>
                      <span>Scheduled:</span>
                      <strong>{new Date(booking.scheduled_date).toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>Amount:</span>
                      <strong>₹{booking.service_amount}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

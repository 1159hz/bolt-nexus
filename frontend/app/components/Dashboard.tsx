'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
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
    fetchDashboardData()
  }, [userId])

  const fetchDashboardData = async () => {
    try {
      const [appliancesRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/appliances/${userId}`),
        axios.get(`${API_URL}/bookings/${userId}`)
      ])
      
      setAppliances(appliancesRes.data)
      setBookings(bookingsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
      setLoading(false)
    }
  }

  const handleBookService = async () => {
    if (!selectedAppliance || !scheduledDate) {
      alert('Please select an appliance and date')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/bookings`, {
        user_id: userId,
        appliance_id: selectedAppliance,
        service_type: serviceType,
        scheduled_date: scheduledDate
      })

      // Simulate payment (in real app, integrate Razorpay here)
      alert(`Booking created! Amount: ₹${response.data.amount}. Redirecting to payment...`)
      
      // Refresh data
      fetchDashboardData()
      setSelectedAppliance(null)
      setScheduledDate('')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Failed to create booking. Please try again.')
    }
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

'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ApplianceLogger.module.css'

const API_URL = 'http://localhost:5000/api'

interface ApplianceLoggerProps {
  userId: number
  onSubmit: () => void
}

interface Appliance {
  id: number
  name: string
  category: string
  typical_wattage: number
  icon: string
}

interface UserAppliance {
  id: number
  user_id: number
  appliance_id: number
  custom_name: string | null
  actual_wattage: number
  appliances: Appliance
}

export default function ApplianceLogger({ userId, onSubmit }: ApplianceLoggerProps) {
  const [userAppliances, setUserAppliances] = useState<UserAppliance[]>([])
  const [allAppliances, setAllAppliances] = useState<Appliance[]>([])
  const [selectedAppliance, setSelectedAppliance] = useState<number | null>(null)
  const [hoursUsed, setHoursUsed] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddAppliance, setShowAddAppliance] = useState(false)
  const [selectedNewAppliance, setSelectedNewAppliance] = useState('')

  useEffect(() => {
    fetchUserAppliances()
    fetchAllAppliances()
  }, [userId])

  const fetchUserAppliances = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-appliances/${userId}`)
      setUserAppliances(response.data)
    } catch (error) {
      console.error('Failed to fetch user appliances:', error)
    }
  }

  const fetchAllAppliances = async () => {
    try {
      const response = await axios.get(`${API_URL}/appliances`)
      setAllAppliances(response.data)
    } catch (error) {
      console.error('Failed to fetch appliances:', error)
    }
  }

  const handleLogUsage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppliance || !hoursUsed) return

    setLoading(true)
    try {
      await axios.post(`${API_URL}/energy-logs`, {
        user_id: userId,
        user_appliance_id: selectedAppliance,
        hours_used: parseFloat(hoursUsed)
      })
      setHoursUsed('')
      setSelectedAppliance(null)
      onSubmit()
    } catch (error) {
      console.error('Failed to log energy:', error)
      alert('Failed to log energy usage')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppliance = async () => {
    if (!selectedNewAppliance) return

    try {
      const appliance = allAppliances.find(a => a.id === parseInt(selectedNewAppliance))
      if (!appliance) return

      await axios.post(`${API_URL}/user-appliances`, {
        user_id: userId,
        appliance_id: appliance.id,
        actual_wattage: appliance.typical_wattage
      })
      
      setShowAddAppliance(false)
      setSelectedNewAppliance('')
      fetchUserAppliances()
    } catch (error) {
      console.error('Failed to add appliance:', error)
      alert('Failed to add appliance')
    }
  }

  return (
    <div className={styles.logger}>
      <div className={styles.card}>
        <h2>Log Energy Usage</h2>
        
        {userAppliances.length === 0 ? (
          <div className={styles.empty}>
            <p>No appliances added yet. Add your first appliance below!</p>
          </div>
        ) : (
          <form onSubmit={handleLogUsage} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Select Appliance</label>
              <select 
                value={selectedAppliance || ''} 
                onChange={(e) => setSelectedAppliance(parseInt(e.target.value))}
                className={styles.select}
                required
              >
                <option value="">Choose an appliance...</option>
                {userAppliances.map((ua) => (
                  <option key={ua.id} value={ua.id}>
                    {ua.appliances.icon} {ua.custom_name || ua.appliances.name} ({ua.actual_wattage}W)
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Hours Used Today</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={hoursUsed}
                onChange={(e) => setHoursUsed(e.target.value)}
                className={styles.input}
                placeholder="e.g., 3.5"
                required
              />
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Logging...' : '✓ Log Usage'}
            </button>
          </form>
        )}
      </div>

      {/* Add Appliance Section */}
      <div className={styles.card}>
        <h3>My Appliances</h3>
        
        {userAppliances.length > 0 && (
          <div className={styles.applianceList}>
            {userAppliances.map((ua) => (
              <div key={ua.id} className={styles.applianceItem}>
                <span className={styles.applianceIcon}>{ua.appliances.icon}</span>
                <span className={styles.applianceName}>
                  {ua.custom_name || ua.appliances.name}
                </span>
                <span className={styles.applianceWattage}>{ua.actual_wattage}W</span>
              </div>
            ))}
          </div>
        )}

        {!showAddAppliance ? (
          <button 
            onClick={() => setShowAddAppliance(true)} 
            className={styles.addButton}
          >
            + Add New Appliance
          </button>
        ) : (
          <div className={styles.addForm}>
            <select 
              value={selectedNewAppliance} 
              onChange={(e) => setSelectedNewAppliance(e.target.value)}
              className={styles.select}
            >
              <option value="">Select appliance type...</option>
              {allAppliances
                .filter(a => !userAppliances.some(ua => ua.appliance_id === a.id))
                .map((appliance) => (
                  <option key={appliance.id} value={appliance.id}>
                    {appliance.icon} {appliance.name} ({appliance.typical_wattage}W)
                  </option>
                ))}
            </select>
            <div className={styles.addFormButtons}>
              <button onClick={handleAddAppliance} className={styles.confirmButton}>
                Add
              </button>
              <button 
                onClick={() => {
                  setShowAddAppliance(false)
                  setSelectedNewAppliance('')
                }} 
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

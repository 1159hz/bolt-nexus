'use client'

import { ArrowLeft, TrendingDown, AlertTriangle, CheckCircle, Calendar, CreditCard } from 'lucide-react'
import styles from './DiagnosticResult.module.css'

interface DiagnosticResultProps {
  data: {
    health_score: number
    energy_loss_per_month: number
    estimated_savings: number
    recommendations: string[]
    pricing: {
      one_time: number
      amc: number
    }
    user_id: number
    appliance_id: number
  }
  onViewDashboard: () => void
  onBack: () => void
}

export default function DiagnosticResult({ data, onViewDashboard, onBack }: DiagnosticResultProps) {
  const getHealthStatus = (score: number) => {
    if (score >= 70) return { text: 'Good', color: '#4CAF50', icon: <CheckCircle size={32} /> }
    if (score >= 40) return { text: 'Needs Attention', color: '#FF9800', icon: <AlertTriangle size={32} /> }
    return { text: 'Critical', color: '#F44336', icon: <AlertTriangle size={32} /> }
  }

  const status = getHealthStatus(data.health_score)
  const circumference = 2 * Math.PI * 90

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Diagnostic Report</h1>
          <p>Here's what we found about your appliance</p>
        </div>

        {/* Health Score Circle */}
        <div className={styles.scoreSection}>
          <div className={styles.circleWrapper}>
            <svg className={styles.circle} width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#E0E0E0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={status.color}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (data.health_score / 100) * circumference}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className={styles.scoreText}>
              <div className={styles.scoreNumber}>{data.health_score}</div>
              <div className={styles.scoreLabel}>Health Score</div>
              <div className={styles.scoreStatus} style={{ color: status.color }}>
                {status.text}
              </div>
            </div>
          </div>
        </div>

        {/* Energy Loss */}
        <div className={styles.energyLoss}>
          <div className={styles.lossIcon}>
            <TrendingDown size={40} />
          </div>
          <div className={styles.lossText}>
            <h2>₹{data.energy_loss_per_month.toLocaleString()}</h2>
            <p>Energy wasted per month</p>
          </div>
        </div>

        {/* Potential Savings */}
        <div className={styles.savings}>
          <h3>Potential Savings</h3>
          <div className={styles.savingsAmount}>
            ₹{data.estimated_savings.toLocaleString()}/month
          </div>
          <p>With proper maintenance, you could save this amount every month!</p>
        </div>

        {/* Recommendations */}
        <div className={styles.recommendations}>
          <h3>Recommendations</h3>
          <ul>
            {data.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <h3>Next Steps</h3>
          
          <div className={styles.buttonGrid}>
            <button className={styles.primaryButton} onClick={onViewDashboard}>
              <Calendar size={20} />
              Schedule Service
            </button>
            
            <button className={styles.secondaryButton} onClick={onViewDashboard}>
              <CheckCircle size={20} />
              Buy AMC Plan
            </button>
          </div>

          <div className={styles.pricing}>
            <div className={styles.priceItem}>
              <span>One-time Service:</span>
              <strong>₹{data.pricing.one_time}</strong>
            </div>
            <div className={styles.priceItem}>
              <span>Annual AMC:</span>
              <strong>₹{data.pricing.amc}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

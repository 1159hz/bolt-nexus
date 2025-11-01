'use client'

import { useState } from 'react'
import styles from './page.module.css'
import DiagnosticForm from '@/app/components/DiagnosticForm'
import DiagnosticResult from '@/app/components/DiagnosticResult'
import Dashboard from '@/app/components/Dashboard'
import Registration from '@/app/components/Registration'
import { Zap, ShieldCheck, TrendingDown, Clock } from 'lucide-react'

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'diagnostic' | 'result' | 'dashboard' | 'register'>('landing')
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [userId, setUserId] = useState<number | null>(null)

  const handleDiagnosticComplete = (data: any) => {
    setDiagnosticData(data)
    setUserId(data.user_id)
    setCurrentView('result')
  }

  const handleRegistrationComplete = (data: any) => {
    setDiagnosticData(data)
    setUserId(data.user_id)
    setCurrentView('result')
  }

  const handleViewDashboard = () => {
    setCurrentView('dashboard')
  }

  if (currentView === 'register') {
    return <Registration onComplete={handleRegistrationComplete} onBack={() => setCurrentView('landing')} />
  }

  if (currentView === 'diagnostic') {
    return <DiagnosticForm onComplete={handleDiagnosticComplete} onBack={() => setCurrentView('landing')} />
  }

  if (currentView === 'result' && diagnosticData) {
    return (
      <DiagnosticResult 
        data={diagnosticData} 
        onViewDashboard={handleViewDashboard}
        onBack={() => setCurrentView('landing')}
      />
    )
  }

  if (currentView === 'dashboard' && userId) {
    return <Dashboard userId={userId} onBack={() => setCurrentView('landing')} />
  }

  return (
    <div className={styles.container} key="landing">
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logo}>
            <Zap size={40} className={styles.logoIcon} />
            <h1 className={styles.logoText}>Bolt Nexus</h1>
          </div>
          <h2 className={styles.heroTitle}>
            Predict. Maintain. Save.
          </h2>
          <p className={styles.heroSubtitle}>
            Smart appliance registration with AI-powered probability analysis. Discover exactly when your appliance needs maintenance to reduce your electricity bill.
          </p>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.ctaButton}
              onClick={() => setCurrentView('register')}
            >
              Register Appliance
              <Zap size={20} className={styles.buttonIcon} />
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={() => setCurrentView('diagnostic')}
            >
              Quick Diagnostic
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={32} />
            </div>
            <h3>Predictive Health Score</h3>
            <p>AI-powered diagnostics assess your appliance condition and predict potential failures before they happen.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <TrendingDown size={32} />
            </div>
            <h3>Energy Loss Detection</h3>
            <p>Discover exactly how much money you're losing each month due to inefficient appliances.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Clock size={32} />
            </div>
            <h3>Instant Scheduling</h3>
            <p>Book certified technicians in seconds. Track service status in real-time through your dashboard.</p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className={styles.pricing}>
        <h2 className={styles.sectionTitle}>Transparent Pricing</h2>
        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <h3>Air Conditioner</h3>
            <div className={styles.price}>
              <span className={styles.priceAmount}>₹799</span>
              <span className={styles.priceLabel}>One-time</span>
            </div>
            <div className={styles.price}>
              <span className={styles.priceAmount}>₹999</span>
              <span className={styles.priceLabel}>AMC/year</span>
            </div>
          </div>

          <div className={styles.priceCard}>
            <h3>Refrigerator</h3>
            <div className={styles.price}>
              <span className={styles.priceAmount}>₹699</span>
              <span className={styles.priceLabel}>One-time</span>
            </div>
            <div className={styles.price}>
              <span className={styles.priceAmount}>₹799</span>
              <span className={styles.priceLabel}>AMC/year</span>
            </div>
          </div>

          <div className={styles.priceCard}>
            <h3>Washing Machine</h3>
            <div className={styles.price}>
              <span className={styles.priceAmount}>₹649</span>
              <span className={styles.priceLabel}>One-time</span>
            </div>
            <div className={styles.price}>
              <span className={styles.priceAmount}>₹749</span>
              <span className={styles.priceLabel}>AMC/year</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <h2>Ready to reduce your electricity bill?</h2>
        <div className={styles.buttonGroup}>
          <button 
            className={styles.ctaButton}
            onClick={() => setCurrentView('register')}
          >
            Register Now - It's Free
          </button>
        </div>
      </section>
    </div>
  )
}

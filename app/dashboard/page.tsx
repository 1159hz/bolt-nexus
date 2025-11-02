"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Plus, Clock, AlertCircle, Zap, Wrench } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Appliance {
  id: string
  type: string
  brand: string
  health: number
  status: string
  lastService: string
  energyLoss: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      id: "1",
      type: "AC",
      brand: "Daikin",
      health: 78,
      status: "Good",
      lastService: "2 months ago",
      energyLoss: 450,
    },
    {
      id: "2",
      type: "Refrigerator",
      brand: "LG",
      health: 92,
      status: "Excellent",
      lastService: "1 month ago",
      energyLoss: 120,
    },
  ])

  useEffect(() => {
    // Load user from localStorage (mock auth)
    const savedUser = localStorage.getItem("boltNexusUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setUser({
        name: "Guest User",
        email: "user@example.com",
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("boltNexusUser")
    router.push("/")
  }

  const getHealthColor = (score: number) => {
    if (score < 50) return "text-destructive"
    if (score < 70) return "text-amber-500"
    if (score < 85) return "text-yellow-500"
    return "text-primary"
  }

  const getHealthBg = (score: number) => {
    if (score < 50) return "bg-destructive/10"
    if (score < 70) return "bg-amber-500/10"
    if (score < 85) return "bg-yellow-500/10"
    return "bg-primary/10"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Navigation */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Bolt Nexus</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-foreground/70 hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-foreground/60">{user.email}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-background border-border">
            <div className="space-y-2">
              <p className="text-sm text-foreground/60">Total Appliances</p>
              <p className="text-3xl font-bold text-foreground">{appliances.length}</p>
            </div>
          </Card>
          <Card className="p-6 bg-background border-border">
            <div className="space-y-2">
              <p className="text-sm text-foreground/60">Potential Monthly Savings</p>
              <p className="text-3xl font-bold text-primary">₹{appliances.reduce((sum, a) => sum + a.energyLoss, 0)}</p>
            </div>
          </Card>
          <Card className="p-6 bg-background border-border">
            <div className="space-y-2">
              <p className="text-sm text-foreground/60">Average Health</p>
              <p className="text-3xl font-bold text-primary">
                {Math.round(appliances.reduce((sum, a) => sum + a.health, 0) / appliances.length)}
              </p>
            </div>
          </Card>
        </div>

        {/* Appliances Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Appliances</h2>
            <Link href="/diagnostic">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add Appliance
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {appliances.map((appliance) => (
              <Card key={appliance.id} className="p-6 bg-background border-border hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {appliance.brand} {appliance.type}
                      </h3>
                      <p className="text-sm text-foreground/60 mt-1">Model: {appliance.type}</p>
                    </div>
                    <div className={`${getHealthBg(appliance.health)} px-3 py-1 rounded-lg`}>
                      <p className={`text-sm font-semibold ${getHealthColor(appliance.health)}`}>{appliance.health}%</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Status</p>
                      <p className="font-semibold text-foreground">{appliance.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Last Service</p>
                      <p className="font-semibold text-foreground">{appliance.lastService}</p>
                    </div>
                  </div>

                  {/* Monthly Savings */}
                  <div className="space-y-2">
                    <p className="text-xs text-foreground/60 flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Potential Monthly Savings
                    </p>
                    <p className="text-2xl font-bold text-primary">₹{appliance.energyLoss}</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="outline" className="border-border text-foreground hover:bg-card bg-transparent">
                      <Wrench className="w-4 h-4 mr-2" />
                      Schedule Service
                    </Button>
                    <Button variant="outline" className="border-border text-foreground hover:bg-card bg-transparent">
                      <Clock className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Health Alert */}
        <Card className="mt-12 p-6 bg-primary/5 border border-primary/20">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
              <p className="text-foreground/70 text-sm">
                Regular maintenance can save you up to 30% on energy bills. Consider subscribing to our AMC plans for
                hassle-free care.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Leaf, MessageCircle, Users, TrendingUp } from 'lucide-react'
import { supabase } from './lib/supabase'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import type { User } from '@supabase/supabase-js'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // Only check session if Supabase is properly configured
        if (!import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
          const { data: { session } } = await supabase.auth.getSession()
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.warn('Supabase not configured:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()

    // Listen for auth changes
    let subscription: any = null
    
    if (!import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      subscription = data.subscription
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleAuthSuccess = () => {
    // User will be automatically set by the auth state listener
  }

  const handleSignOut = () => {
    setUser(null)
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Dashboard onSignOut={handleSignOut} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-green-600 p-3 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Smart Kissan</h1>
            </div>
            <p className="text-lg font-semibold text-green-600 mb-4">Smart Kissan Smart Pakistan</p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your intelligent agricultural companion powered by AI. Get expert farming advice, 
              crop recommendations, and personalized insights to maximize your agricultural success.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Features */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Why Choose Smart Kissan?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant AI Assistance</h3>
                    <p className="text-gray-600">Get real-time answers to your farming questions from our advanced AI system.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
                    <p className="text-gray-600">Make informed decisions with comprehensive agricultural analytics and trends.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Support</h3>
                    <p className="text-gray-600">Connect with fellow farmers and agricultural experts worldwide.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
                <p className="text-gray-700 italic">
                  "Smart Kissan has revolutionized how I approach farming. The AI insights have helped me 
                  increase my crop yield by 30% while reducing costs."
                </p>
                <p className="text-green-600 font-semibold mt-2">- Sarah Johnson, Organic Farmer</p>
              </div>
            </div>

            {/* Right Column - Auth Form */}
            <div>
              <AuthForm 
                mode={authMode} 
                onToggle={toggleAuthMode}
                onSuccess={handleAuthSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
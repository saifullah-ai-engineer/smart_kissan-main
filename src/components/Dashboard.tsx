import React, { useEffect, useState } from 'react'
import { MessageCircle, LogOut, User, Leaf, Bot } from 'lucide-react'
import { supabase } from '../lib/supabase'
import SmartKissanChat from './AgriMindChat'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface DashboardProps {
  onSignOut: () => void
}

export default function Dashboard({ onSignOut }: DashboardProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onSignOut()
  }

  const handleStartChat = () => {
    setShowChat(true)
  }

  if (showChat) {
    return <SmartKissanChat onBack={() => setShowChat(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Smart Kissan</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 mb-8">
          {/* Hero Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-green-600" />
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-green-600">Smart Kissan:</span> <span className="text-gray-900">Your Farm's AI Companion</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Chat with AI about your crops. Send photos, describe problems by voice, 
              and get instant expert advice on diseases, fertilizers, and farming practices.
            </p>
          </div>

          <button
            onClick={handleStartChat}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-3 mb-12"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Start Chat</span>
          </button>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🌦</span>
              </div>
              <p className="text-gray-700 font-medium">Weather</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🐛</span>
              </div>
              <p className="text-gray-700 font-medium">Disease</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">💧</span>
              </div>
              <p className="text-gray-700 font-medium">Soil</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-gray-700 font-medium">Fertilizer</p>
            </div>
          </div>
        </div>
        
        {/* Integration Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">n8n Webhook Connected</span>
            </div>
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') 
                ? 'bg-yellow-50' 
                : 'bg-green-50'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}></div>
              <span className={`text-sm ${
                import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') 
                  ? 'text-yellow-700' 
                  : 'text-green-700'
              }`}>
                {import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') 
                  ? 'Supabase Setup Required' 
                  : 'Supabase Connected'}
              </span>
            </div>
          </div>
          {import.meta.env.VITE_SUPABASE_URL?.includes('placeholder') && (
            <p className="text-sm text-gray-600 mt-3">
              To enable full functionality, please configure Supabase by clicking the settings icon above.
            </p>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-6 text-gray-500">
        <p className="text-sm">Built at National Agentic AI Hackathon 2025</p>
      </footer>
    </div>
  )
}
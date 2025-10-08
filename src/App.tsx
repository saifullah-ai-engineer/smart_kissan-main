import React from 'react'
import { Leaf } from 'lucide-react'
import AgriMindChat from './components/AgriMindChat'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Kissan</h1>
              <p className="text-sm text-green-600 font-medium">Smart Kissan Smart Pakistan</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your AI Agricultural Assistant
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant expert advice on farming, crop management, pest control, and agricultural best practices. 
            Ask questions in English or Urdu and receive intelligent, data-driven responses.
          </p>
        </div>
        
        <AgriMindChat />
      </main>
    </div>
  )
}

export default App
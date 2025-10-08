import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Play, 
  Pause, 
  Download, 
  Globe,
  Bot,
  User,
  Leaf
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'smartkissan'
  content: string
  timestamp: Date
  messageType?: 'text' | 'speech' | 'image+speech'
  image?: string
  analysis?: {
    disease?: string
    severity?: number
    confidence?: number
    recommendations?: string[]
    weather?: string
    irrigation?: string
  }
}

export default function AgriMindChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'ur-PK'
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'smartkissan',
      content: language === 'en' 
        ? "Hello! I'm Smart Kissan, your AI farming companion. I can help you with crop diseases, fertilizer recommendations, weather advice, and more. You can type, speak, or upload images of your crops!"
        : "السلام علیکم! میں Smart Kissan ہوں، آپ کا AI کاشتکاری ساتھی۔ میں آپ کی فصلوں کی بیماریوں، کھاد کی سفارشات، موسمی مشورے اور بہت کچھ میں مدد کر سکتا ہوں۔",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [language])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (text: string, type: 'text' | 'speech' | 'image+speech' = 'text', image?: string) => {
    if (!text.trim() && !image) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      messageType: type,
      image
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const mockResponse = getMockResponse(text, type, image)
      const smartkissanMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'smartkissan',
        content: mockResponse.content,
        timestamp: new Date(),
        analysis: mockResponse.analysis
      }

      setMessages(prev => [...prev, smartkissanMessage])
      setIsLoading(false)
    }, 1500)
  }

  const getMockResponse = (text: string, type: string, image?: string) => {
    const mockResponses = {
      en: {
        disease: {
          content: "Based on the image analysis, I've identified a potential leaf blight disease affecting your crop.",
          analysis: {
            disease: "Leaf Blight",
            severity: 65,
            confidence: 87,
            recommendations: [
              "Apply copper-based fungicide (2-3ml per liter)",
              "Improve air circulation around plants",
              "Remove affected leaves immediately",
              "Avoid overhead watering"
            ],
            weather: "Current humidity levels are high. Consider reducing irrigation frequency.",
            irrigation: "Water at soil level, avoid wetting leaves. Early morning watering recommended."
          }
        },
        general: {
          content: "I understand you're asking about crop management. Here are some general recommendations for healthy crop growth.",
          analysis: {
            recommendations: [
              "Maintain proper soil pH (6.0-7.0)",
              "Ensure adequate drainage",
              "Apply balanced NPK fertilizer",
              "Monitor for pest activity regularly"
            ],
            weather: "Weather conditions are favorable for crop growth.",
            irrigation: "Maintain consistent moisture levels in soil."
          }
        }
      },
      ur: {
        disease: {
          content: "تصویر کے تجزیے کی بنیاد پر، میں نے آپ کی فصل میں پتوں کی بیماری کی تشخیص کی ہے۔",
          analysis: {
            disease: "پتوں کا جھلساؤ",
            severity: 65,
            confidence: 87,
            recommendations: [
              "کاپر بیسڈ فنگی سائیڈ استعمال کریں (2-3ml فی لیٹر)",
              "پودوں کے ارد گرد ہوا کی گردش بہتر بنائیں",
              "متاثرہ پتے فوری طور پر ہٹا دیں",
              "اوپر سے پانی دینے سے بچیں"
            ],
            weather: "موجودہ نمی کی سطح زیادہ ہے۔ پانی دینے کی تعدد کم کرنے پر غور کریں۔",
            irrigation: "مٹی کی سطح پر پانی دیں، پتوں کو گیلا کرنے سے بچیں۔"
          }
        },
        general: {
          content: "میں سمجھ گیا ہوں کہ آپ فصل کی دیکھ بھال کے بارے میں پوچھ رہے ہیں۔",
          analysis: {
            recommendations: [
              "مٹی کا مناسب pH برقرار رکھیں (6.0-7.0)",
              "مناسب نکاسی آب کو یقینی بنائیں",
              "متوازن NPK کھاد استعمال کریں",
              "کیڑوں کی باقاعدگی سے نگرانی کریں"
            ]
          }
        }
      }
    }

    const responses = mockResponses[language]
    return image || text.toLowerCase().includes('disease') || text.toLowerCase().includes('بیماری') 
      ? responses.disease 
      : responses.general
  }

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true)
      recognitionRef.current.start()
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = () => {
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Image = e.target?.result as string
        // Automatically start speech recognition for image uploads
        if (recognitionRef.current) {
          setIsRecording(true)
          recognitionRef.current.start()
          
          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            handleSendMessage(transcript, 'image+speech', base64Image)
            setIsRecording(false)
          }

          recognitionRef.current.onerror = () => {
            // Send image without speech if speech recognition fails
            handleSendMessage('Image uploaded for analysis', 'image+speech', base64Image)
            setIsRecording(false)
          }
        } else {
          // Fallback if speech recognition is not available
          handleSendMessage('Image uploaded for analysis', 'image+speech', base64Image)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const playMessage = (messageId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (currentlyPlaying === messageId) {
        window.speechSynthesis.cancel()
        setCurrentlyPlaying(null)
        return
      }

      window.speechSynthesis.cancel()
      
      // Wait for voices to load
      const speakText = () => {
        const utterance = new SpeechSynthesisUtterance(text)
        const voices = window.speechSynthesis.getVoices()
        
        if (language === 'ur') {
          // Try to find Urdu voice
          const urduVoice = voices.find(voice => 
            voice.lang.includes('ur') || 
            voice.lang.includes('hi') || 
            voice.name.toLowerCase().includes('urdu') ||
            voice.name.toLowerCase().includes('hindi')
          )
          if (urduVoice) {
            utterance.voice = urduVoice
          }
          utterance.lang = 'ur-PK'
        } else {
          // English voice
          const englishVoice = voices.find(voice => 
            voice.lang.includes('en-US') || voice.lang.includes('en')
          )
          if (englishVoice) {
            utterance.voice = englishVoice
          }
          utterance.lang = 'en-US'
        }
        
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.volume = 1
        utterance.onstart = () => setCurrentlyPlaying(messageId)
        utterance.onend = () => setCurrentlyPlaying(null)
        utterance.onerror = (event) => {
          console.warn('Speech synthesis error:', event)
          setCurrentlyPlaying(null)
        }
        
        setCurrentlyPlaying(messageId)
        window.speechSynthesis.speak(utterance)
      }
      
      // Check if voices are loaded
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', speakText, { once: true })
      } else {
        speakText()
      }
    } else {
      console.warn('Speech synthesis not supported in this browser')
    }
  }

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      language,
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        analysis: msg.analysis
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agrimind-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Smart Kissan</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'EN' : 'اردو'}</span>
              </button>
              

              <button
                onClick={downloadReport}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
                title="Download Report"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {/* Welcome Section */}
        {messages.length <= 1 && (
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Smart Kissan!</h2>
                <p className="text-lg text-green-600 font-semibold mb-4">Smart Kissan Smart Pakistan</p>
                <p className="text-gray-600 mb-8">
                  Send a photo of your crop, describe an issue, or ask any farming question.
                </p>
              </div>
              
              {/* Feature Icons */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌦</span>
                  </div>
                  <p className="text-sm text-gray-600">Weather</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🐛</span>
                  </div>
                  <p className="text-sm text-gray-600">Disease</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">💧</span>
                  </div>
                  <p className="text-sm text-gray-600">Soil</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <p className="text-sm text-gray-600">Fertilizer</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 1 && (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'smartkissan' && (
                      <Bot className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Uploaded crop"
                          className="w-full max-w-xs h-48 object-cover rounded-lg mb-2 border border-gray-200"
                        />
                      )}
                      <p className="text-sm">{message.content}</p>
                      
                      {message.analysis && (
                        <div className="mt-3 space-y-2">
                          {message.analysis.disease && (
                            <div className="bg-red-50 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-red-800">🐛 {message.analysis.disease}</span>
                                <div className="text-xs text-red-600">
                                  {message.analysis.confidence}% confidence
                                </div>
                              </div>
                              {message.analysis.severity && (
                                <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                                  <div
                                    className="bg-red-600 h-2 rounded-full"
                                    style={{ width: `${message.analysis.severity}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {message.analysis.recommendations && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <h4 className="font-semibold text-green-800 mb-2">🌿 Recommendations:</h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                {message.analysis.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {message.analysis.weather && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h4 className="font-semibold text-blue-800 mb-1">🌦 Weather Advice:</h4>
                              <p className="text-sm text-blue-700">{message.analysis.weather}</p>
                            </div>
                          )}
                          
                          {message.analysis.irrigation && (
                            <div className="bg-cyan-50 p-3 rounded-lg">
                              <h4 className="font-semibold text-cyan-800 mb-1">💧 Irrigation:</h4>
                              <p className="text-sm text-cyan-700">{message.analysis.irrigation}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {message.type === 'smartkissan' && (
                        <button
                          onClick={() => playMessage(message.id, message.content)}
                          className="mt-2 flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 transition-colors duration-200 bg-green-50 px-2 py-1 rounded-full"
                        >
                          {currentlyPlaying === message.id ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          <span>Play</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                title="Upload crop image"
              >
                <Camera className="w-5 h-5" />
              </button>
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <div className="flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                  placeholder={language === 'en' ? "Ask about your crops, diseases, fertilizers..." : "فصلوں، بیماریوں، کھادوں کے بارے میں پوچھیں..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  disabled={isRecording}
                />
              </div>
              
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            
            {isRecording && (
              <div className="mt-2 text-center">
                <span className="text-sm text-red-600 animate-pulse">
                  {language === 'en' ? 'Listening...' : 'سن رہا ہوں...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 bg-white border-t">
        <p className="text-sm">Built at National Agentic AI Hackathon 2025</p>
      </footer>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
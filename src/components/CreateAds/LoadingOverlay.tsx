import { useState, useEffect } from "react"

interface LoadingOverlayProps {
  isVisible: boolean
  messages: string[] | string
}

export default function LoadingOverlay({ isVisible, messages }: LoadingOverlayProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  const messageArray = Array.isArray(messages) ? messages : [messages]
  const currentMessage = messageArray[currentMessageIndex]

  useEffect(() => {
    if (!isVisible || messageArray.length <= 1) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messageArray.length)
    }, 2500) // Change message every 2.5 seconds

    return () => clearInterval(interval)
  }, [isVisible, messageArray.length])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-2xl"></div>
        <div className="relative bg-slate-900/95 border border-purple-500/50 rounded-2xl p-12 max-w-md w-full mx-4">
          {/* Animated Spinner */}
          <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-blue-400 animate-spin"></div>
              <div
                className="absolute inset-2 rounded-full border-2 border-transparent border-t-pink-400 animate-spin opacity-60"
                style={{ animationDirection: "reverse" }}
              ></div>
            </div>
          </div>

          {/* Loading Message */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-white">Processing Your Request</h3>
            <p className="text-gray-300 text-sm leading-relaxed h-12 flex items-center justify-center transition-opacity duration-500 opacity-100">
              {currentMessage}
            </p>
            {messageArray.length > 1 && (
              <div className="flex justify-center gap-1 mt-6">
                {messageArray.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 w-2 rounded-full transition-all duration-300 ${
                      idx === currentMessageIndex ? "bg-purple-400" : "bg-gray-600"
                    }`}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <span>Please wait while we process your content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

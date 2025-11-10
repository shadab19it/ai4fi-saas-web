interface ProgressBarProps {
    currentStep: number
    totalSteps: number
  }
  
  export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          {[...Array(totalSteps)].map((_, i) => {
            const stepNum = i + 1
            const isActive = stepNum === currentStep
            const isCompleted = stepNum < currentStep
  
            return (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 ring-2 ring-purple-400"
                      : isCompleted
                        ? "bg-green-600"
                        : "bg-gray-700"
                  }`}
                >
                  {isCompleted ? "✓" : stepNum}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      isCompleted ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-gray-700"
                    }`}
                  ></div>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Upload & Details</span>
          <span>Image Processing</span>
          <span>Video Generation</span>
        </div>
      </div>
    )
  }
  
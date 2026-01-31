'use client'

import { Check } from 'lucide-react'

interface StepProgressProps {
  currentStep: number
  steps: string[]
}

export default function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between w-full mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = currentStep > stepNumber
        const isActive = currentStep === stepNumber

        return (
          <div key={step} className="flex flex-col items-center relative flex-1">
            {/* Connection Line */}
            {index !== 0 && (
              <div 
                className={`absolute right-1/2 left-0 top-5 h-[2px] -translate-y-1/2 z-0 
                  ${currentStep >= stepNumber ? 'bg-red-600' : 'bg-zinc-800'}`} 
              />
            )}
            {index !== steps.length - 1 && (
              <div 
                className={`absolute left-1/2 right-0 top-5 h-[2px] -translate-y-1/2 z-0 
                  ${currentStep > stepNumber ? 'bg-red-600' : 'bg-zinc-800'}`} 
              />
            )}

            {/* Step Circle */}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-all duration-300
                ${isCompleted ? 'bg-red-600 text-white' : isActive ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
            </div>

            {/* Step Label */}
            <span 
              className={`mt-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300
                ${isActive ? 'text-white' : isCompleted ? 'text-red-600' : 'text-zinc-600'}`}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface UseSliderWithInputProps {
  minValue: number
  maxValue: number
  initialValue: [number, number]
}

export function useSliderWithInput({ minValue, maxValue, initialValue }: UseSliderWithInputProps) {
  const [sliderValue, setSliderValue] = useState<number[]>(initialValue)
  const [inputValues, setInputValues] = useState<string[]>([initialValue[0].toString(), initialValue[1].toString()])

  const handleSliderChange = useCallback((values: number[]) => {
    setSliderValue(values)
    setInputValues(values.map((v) => v.toString()))
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newInputValues = [...inputValues]
      newInputValues[index] = e.target.value
      setInputValues(newInputValues)
    },
    [inputValues],
  )

  const validateAndUpdateValue = useCallback(
    (value: string, index: number) => {
      const numValue = Number.parseFloat(value)
      if (isNaN(numValue)) {
        setInputValues((prev) => {
          const newValues = [...prev]
          newValues[index] = sliderValue[index].toString()
          return newValues
        })
        return
      }

      const clampedValue = Math.max(minValue, Math.min(maxValue, numValue))
      const newSliderValue = [...sliderValue]
      newSliderValue[index] = clampedValue

      if (index === 0 && clampedValue > sliderValue[1]) {
        newSliderValue[1] = clampedValue
      } else if (index === 1 && clampedValue < sliderValue[0]) {
        newSliderValue[0] = clampedValue
      }

      setSliderValue(newSliderValue)
      setInputValues(newSliderValue.map((v) => v.toString()))
    },
    [minValue, maxValue, sliderValue],
  )

  return {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  }
}

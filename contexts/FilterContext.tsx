"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  origins: string[]
  nftVerified: boolean
  artisanVerified: boolean
}

interface FilterContextType {
  filters: FilterState
  updateFilters: (newFilters: Partial<FilterState>) => void
  clearFilters: () => void
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 3000],
  origins: [],
  nftVerified: false,
  artisanVerified: false,
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <FilterContext.Provider value={{ filters, updateFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}

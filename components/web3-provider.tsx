"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ethers, BrowserProvider, Signer } from "ethers"

interface User {
  id: string
  name: string
  email: string
  walletAddress: string
  isArtisan: boolean
}

interface Web3ContextType {
  isConnected: boolean
  user: User | null
  provider: BrowserProvider | null
  signer: Signer | null
  availableAccounts: string[]
  connect: () => Promise<string[]>
  connectWithAccount: (address: string) => Promise<void>
  disconnect: () => void
}

export const Web3Context = createContext<Web3ContextType | null>(null)

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([])

  const connect = async (): Promise<string[]> => {
    try {
      if (typeof window.ethereum !== "undefined") {
        // Request account access
        const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" })

        // Create provider
        const web3Provider = new BrowserProvider(window.ethereum)
        setProvider(web3Provider)
        setAvailableAccounts(accounts)

        return accounts
      } else {
        alert("Please install MetaMask to use this application")
        return []
      }
    } catch (error) {
      console.error("Connection error:", error)
      return []
    }
  }

  const connectWithAccount = async (address: string) => {
    try {
      if (provider && availableAccounts.includes(address)) {
        // Get signer for account
        const web3Signer = await provider.getSigner()
        setSigner(web3Signer)

        // Mock user for now
        const mockUser: User = {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          walletAddress: address,
          isArtisan: true,
        }

        setUser(mockUser)
        setIsConnected(true)

        localStorage.setItem("web3Connected", "true")
        localStorage.setItem("selectedAccount", address)
      }
    } catch (error) {
      console.error("Account connection error:", error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setUser(null)
    setProvider(null)
    setSigner(null)
    setAvailableAccounts([])
    localStorage.removeItem("web3Connected")
    localStorage.removeItem("selectedAccount")
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem("web3Connected")
    const selectedAccount = localStorage.getItem("selectedAccount")
    if (wasConnected && selectedAccount && typeof window.ethereum !== "undefined") {
      connect().then((accounts) => {
        if (accounts.includes(selectedAccount)) {
          connectWithAccount(selectedAccount)
        }
      })
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        user,
        provider,
        signer,
        availableAccounts,
        connect,
        connectWithAccount,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

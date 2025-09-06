'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, Copy, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AccountSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  accounts: string[]
  onSelectAccount: (address: string) => Promise<void>
  provider: any
}

interface AccountInfo {
  address: string
  balance: string
  isLoading: boolean
}

const AccountSelectionDialog: React.FC<AccountSelectionDialogProps> = ({
  isOpen,
  onClose,
  accounts,
  onSelectAccount,
  provider
}) => {
  const [accountsInfo, setAccountsInfo] = useState<AccountInfo[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (isOpen && accounts.length > 0 && provider) {
      fetchAccountBalances()
    }
  }, [isOpen, accounts, provider])

  const fetchAccountBalances = async () => {
    const accountsWithBalances = await Promise.all(
      accounts.map(async (address) => {
        try {
          const balance = await provider.getBalance(address)
          const balanceInEth = parseFloat(balance.toString()) / 1e18
          return {
            address,
            balance: balanceInEth.toFixed(4),
            isLoading: false
          }
        } catch (error) {
          return {
            address,
            balance: '0.0000',
            isLoading: false
          }
        }
      })
    )
    setAccountsInfo(accountsWithBalances)
  }

  const handleSelectAccount = async (address: string) => {
    setIsConnecting(true)
    try {
      await onSelectAccount(address)
      onClose()
      toast({
        title: "Account Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the selected account.",
        variant: "destructive"
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Select Account
          </DialogTitle>
          <DialogDescription>
            Choose which MetaMask account you want to connect to the application.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {accountsInfo.map((account, index) => (
            <Card 
              key={account.address}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAccount === account.address ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedAccount(account.address)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Account {index + 1}</span>
                        {selectedAccount === account.address && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatAddress(account.address)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(account.address)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Balance: {account.balance} ETH
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedAccount && handleSelectAccount(selectedAccount)}
            disabled={!selectedAccount || isConnecting}
            className="flex-1"
          >
            {isConnecting ? 'Connecting...' : 'Connect Account'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountSelectionDialog

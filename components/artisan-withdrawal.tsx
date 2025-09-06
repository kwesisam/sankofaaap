"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Smartphone, CreditCard, ArrowDownToLine } from "lucide-react"

interface ArtisanWithdrawalProps {
  availableBalance: number
  artisanName: string
}

export default function ArtisanWithdrawal({ availableBalance, artisanName }: ArtisanWithdrawalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    accountType: "bank" as "bank" | "mobile_money",
    accountNumber: "",
    bankCode: "",
    mobileNetwork: "mtn" as "mtn" | "vodafone" | "airteltigo",
  })
  const { toast } = useToast()

  const exchangeRate = 12.2 // 1 USD = 12.2 GHS
  const amountInGHS = Number.parseFloat(withdrawalData.amount || "0") * exchangeRate

  const handleInputChange = (field: string, value: string) => {
    setWithdrawalData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWithdrawal = async () => {
    const amount = Number.parseFloat(withdrawalData.amount)

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds to withdraw this amount.",
        variant: "destructive",
      })
      return
    }

    if (!withdrawalData.accountNumber) {
      toast({
        title: "Account Required",
        description: "Please provide your account details.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/payments/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          accountType: withdrawalData.accountType,
          accountNumber: withdrawalData.accountNumber,
          bankCode: withdrawalData.bankCode,
          mobileNetwork: withdrawalData.mobileNetwork,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process withdrawal")
      }

      const result = await response.json()

      toast({
        title: "Withdrawal Initiated",
        description: `GHS ${result.amountInGHS.toFixed(2)} will be sent to your account within 24 hours.`,
      })

      // Reset form
      setWithdrawalData({
        amount: "",
        accountType: "bank",
        accountNumber: "",
        bankCode: "",
        mobileNetwork: "mtn",
      })
    } catch (error) {
      console.error("Withdrawal error:", error)
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const ghanaianBanks = [
    { code: "GCB", name: "GCB Bank" },
    { code: "ADB", name: "Agricultural Development Bank" },
    { code: "CAL", name: "CAL Bank" },
    { code: "EBG", name: "Ecobank Ghana" },
    { code: "FBN", name: "First Bank of Nigeria" },
    { code: "FID", name: "Fidelity Bank" },
    { code: "GTB", name: "Guaranty Trust Bank" },
    { code: "SCB", name: "Standard Chartered Bank" },
    { code: "UBA", name: "United Bank for Africa" },
    { code: "ZEN", name: "Zenith Bank" },
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Withdraw Earnings
        </CardTitle>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Available Balance:</strong> ${availableBalance.toFixed(2)} GHC (≈ GHS{" "}
            {(availableBalance * exchangeRate).toFixed(2)})
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="amount">Withdrawal Amount (GHC)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            max={availableBalance}
            value={withdrawalData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            placeholder="0.00"
          />
          {withdrawalData.amount && (
            <p className="text-sm text-gray-600 mt-1">You will receive: GHS {amountInGHS.toFixed(2)}</p>
          )}
        </div>

        <Tabs value={withdrawalData.accountType} onValueChange={(value) => handleInputChange("accountType", value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bank Account
            </TabsTrigger>
            <TabsTrigger value="mobile_money" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile Money
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-4">
            <div>
              <Label htmlFor="bankCode">Select Bank</Label>
              <Select value={withdrawalData.bankCode} onValueChange={(value) => handleInputChange("bankCode", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  {ghanaianBanks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={withdrawalData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                placeholder="Enter your account number"
              />
            </div>
          </TabsContent>

          <TabsContent value="mobile_money" className="space-y-4">
            <div>
              <Label htmlFor="mobileNetwork">Mobile Network</Label>
              <Select
                value={withdrawalData.mobileNetwork}
                onValueChange={(value) => handleInputChange("mobileNetwork", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                  <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                  <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mobileNumber">Mobile Money Number</Label>
              <Input
                id="mobileNumber"
                value={withdrawalData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                placeholder="0XX XXX XXXX"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How withdrawals work:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Your GHC earnings are converted to Ghanaian Cedis at current rates</li>
            <li>2. Funds are sent directly to your chosen account via Paystack</li>
            <li>3. Processing typically takes 1-24 hours</li>
            <li>4. You'll receive SMS/email confirmation when complete</li>
          </ol>
        </div>

        <Button
          onClick={handleWithdrawal}
          disabled={isProcessing || !withdrawalData.amount || !withdrawalData.accountNumber}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isProcessing ? (
            "Processing Withdrawal..."
          ) : (
            <>
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Withdraw GHS {amountInGHS.toFixed(2)}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

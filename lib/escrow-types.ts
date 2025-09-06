// Types for Escrow API
export interface CreateEscrowRequest {
  escrowId: string
  sellerAddress: string
  amount: string
}

export interface ConfirmDeliveryRequest {
  escrowId: string
}

export interface EstimateGasRequest {
  operation: 'create' | 'confirm'
  escrowId: string
  sellerAddress?: string
  amount?: string
  fromAddress: string
}

export interface EscrowResponse {
  success: boolean
  data?: any
  error?: string
  details?: string
}

export interface EscrowEventData {
  eventType: string
  blockNumber: number
  transactionHash: string
  timestamp: number | null
  args: {
    escrowId?: string
    buyer?: string
    seller?: string
    amount?: string
  }
}

export interface GasEstimateData {
  operation: string
  escrowId: string
  gasEstimate: string
  gasPrice: string
  estimatedCost: string
  estimatedCostEth: string
}

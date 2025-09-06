# Escrow Contract API Documentation

This API provides endpoints to interact with the EscrowContract deployed at `0x66e2755d2Ad79eDD8506Dd55fA72A4D9eF9660Be`.

## Environment Variables

Add these to your `.env` file:

```env
NEXT_PUBLIC_ESCROW_ADDRESS=0x66e2755d2Ad79eDD8506Dd55fA72A4D9eF9660Be
MEGAETH_RPC_URL=https://megaeth-rpc-url
NEXT_PUBLIC_RPC_URL=https://megaeth-rpc-url
ESCROW_PRIVATE_KEY=0x...your-private-key-here
```

**Security Note:** The `ESCROW_PRIVATE_KEY` should be the private key of the wallet that will act as the buyer for escrow transactions. Keep this secure and never commit it to version control.

## API Endpoints

### 1. Get Escrow Details
**GET** `/api/escrow?escrowId=<id>`

Returns complete escrow information including buyer, seller, amount, and status.

**Response:**
```json
{
  "success": true,
  "data": {
    "escrowId": "order_123",
    "buyer": "0x...",
    "seller": "0x...",
    "amount": "1000000000000000000",
    "status": "FUNDED",
    "statusCode": 1
  }
}
```

### 2. Create Escrow
**POST** `/api/escrow/create`

Creates a new escrow with ETH deposit.

**Request Body:**
```json
{
  "escrowId": "order_123",
  "sellerAddress": "0x...",
  "amount": "1.0"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "escrowId": "order_123",
    "transactionHash": "0x...",
    "buyer": "0x...",
    "seller": "0x...",
    "amount": "1.0",
    "status": "FUNDED"
  }
}
```

### 3. Confirm Delivery
**POST** `/api/escrow/confirm`

Confirms delivery and releases payment to seller (buyer only).

**Request Body:**
```json
{
  "escrowId": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "escrowId": "order_123",
    "transactionHash": "0x...",
    "status": "DELIVERED",
    "message": "Delivery confirmed and payment released to seller"
  }
}
```

### 4. Get Escrow Status
**GET** `/api/escrow/status?escrowId=<id>`

Returns only the status of an escrow.

**Response:**
```json
{
  "success": true,
  "data": {
    "escrowId": "order_123",
    "status": "FUNDED",
    "statusCode": 1
  }
}
```

### 5. Get Escrow Events
**GET** `/api/escrow/events?escrowId=<id>&eventType=<type>`

Returns blockchain events for an escrow.

**Query Parameters:**
- `escrowId`: Required
- `eventType`: Optional (`created`, `confirmed`, `completed`, `all`)
- `fromBlock`: Optional (default: 0)
- `toBlock`: Optional (default: latest)

**Response:**
```json
{
  "success": true,
  "data": {
    "escrowId": "order_123",
    "events": [
      {
        "eventType": "EscrowCreated",
        "blockNumber": 12345,
        "transactionHash": "0x...",
        "timestamp": null,
        "args": {
          "escrowId": "0x...",
          "buyer": "0x...",
          "seller": "0x...",
          "amount": "1000000000000000000"
        }
      }
    ],
    "totalEvents": 1
  }
}
```

### 6. Estimate Gas
**POST** `/api/escrow/estimate-gas`

Estimates gas costs for escrow operations.

**Request Body:**
```json
{
  "operation": "create",
  "escrowId": "order_123",
  "sellerAddress": "0x...",
  "amount": "1.0",
  "fromAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "operation": "create",
    "escrowId": "order_123",
    "gasEstimate": "150000",
    "gasPrice": "20000000000",
    "estimatedCost": "3000000000000000",
    "estimatedCostEth": "0.003"
  }
}
```

## Status Codes

- `0` - NOT_CREATED: Escrow doesn't exist
- `1` - FUNDED: Escrow created and funded
- `2` - DELIVERED: Delivery confirmed, payment released

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `403` - Forbidden (authorization errors)
- `404` - Not Found (escrow doesn't exist)
- `409` - Conflict (escrow already exists)
- `500` - Internal Server Error

## Usage Examples

### JavaScript/TypeScript Client

```typescript
// Create escrow
const createResponse = await fetch('/api/escrow/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    escrowId: 'order_123',
    sellerAddress: '0x...',
    amount: '1.0',
    privateKey: '0x...'
  })
})

// Get escrow details
const escrow = await fetch('/api/escrow?escrowId=order_123')
const escrowData = await escrow.json()

// Confirm delivery
const confirmResponse = await fetch('/api/escrow/confirm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    escrowId: 'order_123',
    privateKey: '0x...'
  })
})
```

### cURL Examples

```bash
# Get escrow details
curl "http://localhost:3000/api/escrow?escrowId=order_123"

# Create escrow
curl -X POST "http://localhost:3000/api/escrow/create" \
  -H "Content-Type: application/json" \
  -d '{
    "escrowId": "order_123",
    "sellerAddress": "0x...",
    "amount": "1.0",
    "privateKey": "0x..."
  }'

# Confirm delivery
curl -X POST "http://localhost:3000/api/escrow/confirm" \
  -H "Content-Type: application/json" \
  -d '{
    "escrowId": "order_123",
    "privateKey": "0x..."
  }'
```

## Security Notes

- Never expose private keys in client-side code
- Use environment variables for sensitive configuration
- Validate all inputs on both client and server side
- Consider implementing rate limiting for production use
- Use HTTPS in production environments

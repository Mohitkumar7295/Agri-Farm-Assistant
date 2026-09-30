# 📡 AgriFarmAssistant: OpenAPI 3.0 & REST / SSE Specification

> **Base URL (Local)**: `http://localhost:8080/api/v1`  
> **Base URL (Production on Railway)**: `https://agrifarm-backend-production.up.railway.app/api/v1`  
> **Protocol**: HTTPS / Server-Sent Events (SSE) for streaming AI advisory.

---

## 1. Global Request & Response Formats

### 1.1 Authentication & Multi-Tenant Headers
All secured endpoints require standard cryptographic JWT Bearer headers:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept-Language: hi-IN, en-US
Content-Type: application/json
```

### 1.2 Unified Success Envelope (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-09-28T00:30:00.000Z"
}
```

### 1.3 Unified Error Envelope
```json
{
  "success": false,
  "message": "Stock underflow detected: Mortality count exceeds current poultry population",
  "errorCode": "STOCK_UNDERFLOW_ERROR",
  "timestamp": "2026-09-28T00:30:00.000Z"
}
```

---

## 2. Authentication & Identity Endpoints (`/auth`)

### 2.1 Send 6-Digit Email OTP
- **Endpoint**: `POST /auth/email/send-otp`
- **Rate Limit**: 3 requests per 10 minutes per IP/Email.
- **Request Body**:
```json
{
  "email": "farmer.ramesh@gmail.com",
  "preferredLanguage": "hi"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "OTP successfully dispatched to farmer.ramesh@gmail.com. Valid for 10 minutes.",
  "data": {
    "email": "farmer.ramesh@gmail.com",
    "expiresInSeconds": 600
  }
}
```

### 2.2 Verify Email OTP & Issue 30-Day JWT
- **Endpoint**: `POST /auth/email/verify-otp`
- **Request Body**:
```json
{
  "email": "farmer.ramesh@gmail.com",
  "otp": "492817"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "tokenType": "Bearer",
    "expiresInDays": 30,
    "user": {
      "id": "e2a1b41c-8433-4f9e-9d0b-683a9cf73401",
      "email": "farmer.ramesh@gmail.com",
      "fullName": "Ramesh Patel",
      "preferredLanguage": "hi",
      "role": "FARMER"
    }
  }
}
```

---

## 3. Farm & GPS Management (`/farms`)

### 3.1 Create Farm Profile
- **Endpoint**: `POST /farms`
- **Request Body**:
```json
{
  "name": "Patel Green Bio-Farm",
  "domain": "INTEGRATED",
  "latitude": 21.1458,
  "longitude": 79.0882,
  "address": "Village Umred, District Nagpur, Maharashtra",
  "totalAreaAcres": 12.5
}
```

### 3.2 List Farmer's Farms
- **Endpoint**: `GET /farms`
- **Response**: `200 OK` (Filtered automatically to authenticated tenant)

---

## 4. Fisheries & Pond Hub (`/fisheries`)

### 4.1 Create Pond
- **Endpoint**: `POST /fisheries/ponds`
- **Request Body**:
```json
{
  "farmId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Pond 1 - North Nursery",
  "waterAreaAcres": 1.5,
  "depthFeet": 5.5,
  "hasAerator": true,
  "aeratorHp": 3.0
}
```

### 4.2 Stock Polyculture Batch
- **Endpoint**: `POST /fisheries/ponds/{pondId}/batches`
- **Request Body**:
```json
{
  "batchCode": "BATCH-2026-CARP-01",
  "stockingDate": "2026-09-01",
  "stocks": [
    { "specie": "ROHU", "quantity": 3000, "initialAvgWeightGrams": 50.0 },
    { "specie": "CATLA", "quantity": 2500, "initialAvgWeightGrams": 65.0 },
    { "specie": "MRIGAL", "quantity": 2000, "initialAvgWeightGrams": 40.0 }
  ]
}
```

---

## 5. Poultry Hub (`/poultry`)

### 5.1 Create Poultry Shed
- **Endpoint**: `POST /poultry/sheds`
- **Request Body**:
```json
{
  "farmId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "shedName": "Broiler Shed Alpha",
  "shedType": "OPEN_SIDED",
  "lengthFeet": 150.0,
  "widthFeet": 30.0,
  "capacityBirds": 5000,
  "hasFoggers": true
}
```

### 5.2 Stock Poultry Batch
- **Endpoint**: `POST /poultry/sheds/{shedId}/batches`
- **Request Body**:
```json
{
  "batchCode": "POULTRY-BROILER-2026-09",
  "breed": "COBB_500",
  "category": "BROILER",
  "initialQuantity": 4500,
  "hatchDate": "2026-09-20",
  "initialAvgWeightGrams": 42.0
}
```

---

## 6. Safe Mortality Recording (`/mortality`)

- **Endpoint**: `POST /mortality/record`
- **Request Body**:
```json
{
  "entityType": "POULTRY_BATCH",
  "entityId": "8f307842-83b6-4b2a-bf36-fbe755f1064a",
  "deadCount": 12,
  "suspectedCause": "HEAT_STRESS",
  "observationNotes": "Sudden panting observed during 2 PM peak heat",
  "logDate": "2026-09-28"
}
```
- **Error Response Example (`409 Conflict`)**:
```json
{
  "success": false,
  "message": "Stock underflow: Cannot record 12 mortalities. Current poultry count is 5.",
  "errorCode": "STOCK_UNDERFLOW_ERROR"
}
```

---

## 7. Biological Growth Sampling & DWG (`/growth`)

- **Endpoint**: `POST /growth/sampling`
- **Request Body**:
```json
{
  "entityType": "FISHERIES_BATCH",
  "batchId": "698c9f5d-79e1-4c12-9c7f-38a4c1075d9e",
  "specie": "ROHU",
  "sampleSizeCount": 25,
  "averageWeightGrams": 420.5,
  "samplingDate": "2026-09-28"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "dwgGramsPerDay": 4.12,
    "sgrPercentage": 1.28,
    "estimatedBiomassKg": 1261.5,
    "daysSinceStocking": 90,
    "onTrackForTarget": true
  }
}
```

---

## 8. Predictive Feeding & FCR Engine (`/feeding`)

### 8.1 Log Daily Feed Disbursed
- **Endpoint**: `POST /feeding/logs`
- **Request Body**:
```json
{
  "entityType": "FISHERIES_POND",
  "entityId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "feedType": "FLOATING_PELLET_28_PROTEIN",
  "quantityKg": 35.0,
  "feedingSession": "MORNING",
  "costPerKg": 42.50
}
```

### 8.2 Get 10-Day Predictive Feed Demand Forecast
- **Endpoint**: `GET /feeding/forecast/{pondId}`
- **Response**: `200 OK` returns day-by-day projected feed requirements adjusted for forecasted water temperatures and growth.

---

## 9. Water Quality Telemetry (`/water-quality`)

- **Endpoint**: `POST /water-quality/telemetry`
- **Request Body**:
```json
{
  "pondId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "dissolvedOxygen": 4.8,
  "ph": 7.4,
  "temperatureCelsius": 29.2,
  "ammoniaTan": 0.02,
  "nitrite": 0.01,
  "transparencyCm": 32.0,
  "loggedAt": "2026-09-28T06:30:00Z"
}
```

---

## 10. AI Advisory: Streaming Multi-Agent Core (`/ai/advisory`)

### 10.1 Streaming Chat (Server-Sent Events)
- **Endpoint**: `POST /ai/advisory/stream`
- **Produces**: `text/event-stream`
- **Request Body**:
```json
{
  "query": "मेरे रोहू मछली के गलफड़े लाल और सूजे हुए हैं, क्या करूं?",
  "farmId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "pondId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "language": "hi"
}
```
- **SSE Stream Output**:
```
event: agent_routing
data: {"agent": "FisheriesAiSpecialist", "protocol": "ICAR-CIFA"}

event: chunk
data: {"token": "यह "}

event: chunk
data: {"token": "बैक्टीरियल "}

event: chunk
data: {"token": "गिल रॉट "}

event: citation
data: {"source": "ICAR-CIFA Freshwater Fisheries Manual 2024, Page 114", "verified": true}

event: done
data: {"status": "COMPLETED"}
```

---

## 11. Vision Disease Diagnostic Scanner (`/ai/vision`)

- **Endpoint**: `POST /ai/vision/diagnose`
- **Consumes**: `multipart/form-data`
- **Form Fields**:
  - `file`: Image file (JPG/PNG, $\le 5\text{MB}$)
  - `entityType`: `FISHERIES` or `POULTRY`
  - `entityId`: UUID
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "detectedCondition": "Epizootic Ulcerative Syndrome (EUS / Red Spot)",
    "confidenceScore": 0.94,
    "severity": "CRITICAL",
    "verifiedRemedy": "Apply CIFAX at 1.0 Litre per hectare-meter water depth. Repeat after 14 days if symptoms persist.",
    "drugWithdrawalPeriodDays": 0,
    "icarProtocolCitation": "ICAR-CIFA Disease Management Circular 2023"
  }
}
```

---

## 12. Weather Sentinel & Hypoxia Risk (`/weather`)

- **Endpoint**: `GET /weather/risk/{farmId}`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "currentTemperature": 34.5,
    "currentHumidity": 82,
    "nighttimeCloudCoverPercent": 95,
    "nocturnalHypoxiaRiskIndex": 0.88,
    "hypoxiaRiskLevel": "CRITICAL",
    "mandatoryAeratorSchedule": {
      "startTime": "02:00 AM",
      "endTime": "06:00 AM",
      "reason": "Heavy cloud cover and high biomass will cause dangerous nighttime DO depletion."
    }
  }
}
```

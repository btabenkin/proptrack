# Rental Property Tracking App - Architectural Diagrams

## 1. System Architecture Overview

```mermaid
flowchart TD
    A[User] -->|Interacts with| B[Frontend]
    B -->|API Calls| C[Backend]
    C -->|CRUD Operations| D[Database]
    C -->|Authentication| E[Auth Service]
    C -->|File Storage| F[Storage Service]
    D -->|Data| C
    E -->|Auth Tokens| C
    F -->|Files| C
```

## 2. Database Schema Visualization

```mermaid
erDiagram
    PROPERTY ||--o{ TENANT : has
    PROPERTY ||--o{ LEASE : has
    PROPERTY ||--o{ MAINTENANCE_REQUEST : has
    PROPERTY ||--o{ PAYMENT : has
    TENANT ||--o{ LEASE : signs
    TENANT ||--o{ PAYMENT : makes
    LEASE ||--o{ PAYMENT : includes
    MAINTENANCE_REQUEST ||--o{ MAINTENANCE_LOG : has

    PROPERTY {
        int id
        string address
        string city
        string state
        string zip
        int bedrooms
        int bathrooms
        int squareFeet
        decimal rentAmount
        string status
    }

    TENANT {
        int id
        string firstName
        string lastName
        string email
        string phone
        string leaseStartDate
        string leaseEndDate
    }

    LEASE {
        int id
        int propertyId
        int tenantId
        string startDate
        string endDate
        decimal monthlyRent
        string status
    }

    MAINTENANCE_REQUEST {
        int id
        int propertyId
        string requestDate
        string description
        string status
        string resolutionDate
    }

    PAYMENT {
        int id
        int leaseId
        int tenantId
        decimal amount
        string paymentDate
        string status
    }

    MAINTENANCE_LOG {
        int id
        int requestId
        string logDate
        string description
    }
```

## 3. API Endpoint Mapping

```mermaid
flowchart TD
    subgraph API Endpoints
        A[/properties] -->|GET| B[List all properties]
        A -->|POST| C[Create property]
        A -->|GET /:id| D[Get property details]
        A -->|PUT /:id| E[Update property]
        A -->|DELETE /:id| F[Delete property]

        G[/tenants] -->|GET| H[List all tenants]
        G -->|POST| I[Create tenant]
        G -->|GET /:id| J[Get tenant details]
        G -->|PUT /:id| K[Update tenant]
        G -->|DELETE /:id| L[Delete tenant]

        M[/leases] -->|GET| N[List all leases]
        M -->|POST| O[Create lease]
        M -->|GET /:id| P[Get lease details]
        M -->|PUT /:id| Q[Update lease]
        M -->|DELETE /:id| R[Delete lease]

        S[/maintenance] -->|GET| T[List all requests]
        S -->|POST| U[Create request]
        S -->|GET /:id| V[Get request details]
        S -->|PUT /:id| W[Update request]
        S -->|DELETE /:id| X[Delete request]

        Y[/payments] -->|GET| Z[List all payments]
        Y -->|POST| AA[Create payment]
        Y -->|GET /:id| AB[Get payment details]
        Y -->|PUT /:id| AC[Update payment]
        Y -->|DELETE /:id| AD[Delete payment]

        AE[/auth] -->|POST /login| AF[Login]
        AE -->|POST /register| AG[Register]
        AE -->|POST /logout| AH[Logout]
    end
```

## 4. Frontend Component Hierarchy

```mermaid
flowchart TD
    A[App] --> B[AuthProvider]
    B --> C[Router]
    C --> D[Layout]
    D --> E[Navbar]
    D --> F[Sidebar]
    D --> G[Main Content]

    G --> H[Dashboard]
    G --> I[Properties]
    G --> J[Tenants]
    G --> K[Leases]
    G --> L[Maintenance]
    G --> M[Payments]
    G --> N[Reports]

    H --> O[PropertyList]
    H --> P[PropertyCard]
    H --> Q[PropertyForm]

    I --> R[TenantList]
    I --> S[TenantCard]
    I --> T[TenantForm]

    J --> U[LeaseList]
    J --> V[LeaseCard]
    J --> W[LeaseForm]

    K --> X[MaintenanceList]
    K --> Y[MaintenanceCard]
    K --> Z[MaintenanceForm]

    L --> AA[PaymentList]
    L --> AB[PaymentCard]
    L --> AC[PaymentForm]

    M --> AD[ReportFilters]
    M --> AE[ReportCharts]
```

## 5. Data Flow Between Components

```mermaid
flowchart TD
    A[User Interaction] -->|Triggers| B[Frontend Component]
    B -->|API Call| C[Backend Service]
    C -->|Query/Command| D[Database]
    D -->|Response| C
    C -->|JSON Response| B
    B -->|Render| E[UI Update]

    subgraph Frontend
        B -->|State Management| F[State Store]
        F -->|Updates| B
    end

    subgraph Backend
        C -->|Business Logic| G[Domain Services]
        G -->|Data Access| H[Repositories]
        H -->|CRUD| D
    end
```

## 6. AWS Deployment Architecture

```mermaid
flowchart TD
    A[User] -->|HTTPS| B[CloudFront]
    B -->|Routes| C[API Gateway]
    C -->|Lambda Functions| D[Backend Services]
    D -->|DynamoDB| E[Database]
    D -->|S3| F[File Storage]
    D -->|Cognito| G[Authentication]

    subgraph AWS Services
        C -->|Triggers| H[EventBridge]
        H -->|Schedules| I[Maintenance Jobs]
        I -->|Processes| D

        J[CloudWatch] -->|Logs| D
        J -->|Metrics| K[Monitoring Dashboard]
    end

    subgraph CI/CD
        L[GitHub] -->|Webhooks| M[CodePipeline]
        M -->|Builds| N[CodeBuild]
        N -->|Deploys| O[CloudFormation]
        O -->|Updates| P[AWS Resources]
    end
```
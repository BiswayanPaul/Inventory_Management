# Inventory & Billing Management System (Backend)

A robust **Node.js + TypeScript** backend solution for managing products, customers, vendors, and transactions for small businesses.  
Features **JWT-based authentication**, **transaction-safe operations**, and **comprehensive inventory & reporting system**.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

---

## ✨ Features

- 🔐 **Authentication & Security**
  - Register, login, logout, refresh tokens
  - JWT-based session management
  - Password hashing with bcrypt

- 📦 **Product Management**
  - CRUD operations on products
  - Stock adjustments (increase/decrease)
  - Search & filtering by name/category

- 👥 **Customer & Vendor Management**
  - Add, edit, delete, and list
  - Unified schema with `type: customer | vendor`

- 💳 **Transaction Management**
  - Record **sales (to customers)** and **purchases (from vendors)**
  - Automatic stock updates
  - Transaction-safe (rollback on failure)
  - Query filters: date, type, customer/vendor

- 📊 **Reports**
  - Transaction history reports
  - Inventory stock reports
  - Customer/vendor transaction history

- 🛡️ **Role-Based Access**
  - Secure endpoints with business-level isolation

---

## 🛠️ Tech Stack

- **Runtime**: Node.js with Express.js  
- **Language**: TypeScript  
- **Database**: MongoDB with Mongoose ODM  
- **Authentication**: JWT (Access + Refresh tokens)  
- **Security**: bcrypt for password hashing  

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BiswayanPaul/Inventory_Management.git
   cd Inventory_Management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in root directory:
   ```bash
   PORT=5000
   MONGODB_URI=<Your MongoDB connection URI>
   CORS_ORIGIN=http://localhost:3000
   ACCESS_TOKEN_SECRET=<Your JWT access token secret>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<Your JWT refresh token secret>
   REFRESH_TOKEN_EXPIRY=30d
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   
   Server runs on `http://localhost:5000`

---

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | — |
| CORS_ORIGIN | Allowed frontend origin | — |
| ACCESS_TOKEN_SECRET | Secret key for access tokens | — |
| ACCESS_TOKEN_EXPIRY | Expiration (e.g. 1d, 15m) | 1d |
| REFRESH_TOKEN_SECRET | Secret key for refresh tokens | — |
| REFRESH_TOKEN_EXPIRY | Expiration for refresh tokens | 30d |
| NODE_ENV | Environment (development, production) | development |

---

## 📡 API Routes

### 🔑 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login user |
| GET | `/api/v1/users/logout` | Logout user |
| GET | `/api/v1/users/refresh` | Refresh access token |

### 📦 Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List all products |
| POST | `/api/v1/products` | Add new product |
| GET | `/api/v1/products/:id` | Get product by ID |
| PUT | `/api/v1/products/:id` | Update product |
| DELETE | `/api/v1/products/:id` | Delete product |

### 👥 Customers & Vendors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/contacts` | List/search customers & vendors |
| POST | `/api/v1/contacts` | Add new customer/vendor |
| PUT | `/api/v1/contacts/:id` | Update customer/vendor |
| DELETE | `/api/v1/contacts/:id` | Delete customer/vendor |

### 💳 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/transactions` | List transactions (filters: date, type, customerId, vendorId) |
| POST | `/api/v1/transactions` | Record new transaction (sale/purchase) |

### 📊 Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/transactions` | Transaction reports with filters |
| GET | `/api/v1/reports/inventory` | Current inventory report |

---

## 🧪 API Testing Examples

> **Note**: This API uses **HTTP-only cookies** for authentication. After successful registration/login, the access token is automatically stored in cookies. No need to manually add `Authorization` headers in subsequent requests if testing in the same session.

> **Important**: All IDs shown in examples (like `64a12345abc`, `64b12345abc`, etc.) are placeholders. Replace them with actual MongoDB ObjectIds from your database when testing.

### Authentication

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "businessId": "BIZ-001"
}
```

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Products

#### Add Product
```http
POST /api/v1/products
Content-Type: application/json
# Note: Access token sent via cookies (no Authorization header needed)

{
  "name": "Laptop",
  "description": "High-end gaming laptop",
  "price": 1500,
  "stock": 10,
  "category": "Electronics"
}
```

#### Update Product
```http
PUT /api/v1/products/:id
Content-Type: application/json
# Note: Access token sent via cookies (no Authorization header needed)

{
  "name": "Gaming Laptop",
  "stock": 15
}
```

### Customers & Vendors

#### Add Customer
```http
POST /api/v1/contacts
Content-Type: application/json
# Note: Access token sent via cookies (no Authorization header needed)

{
  "name": "Alice Johnson",
  "phone": "9876543210",
  "email": "alice@example.com",
  "address": "Kolkata, India",
  "type": "customer"
}
```

#### Add Vendor
```http
POST /api/v1/contacts
Content-Type: application/json
# Note: Access token sent via cookies (no Authorization header needed)

{
  "name": "TechVendor",
  "phone": "9123456789",
  "email": "vendor@example.com",
  "address": "Delhi, India",
  "type": "vendor"
}
```

### Transactions

#### Record Sale
```http
POST /api/v1/transactions
Content-Type: application/json
# Note: Access token sent via cookies (no Authorization header needed)

{
  "type": "sale",
  "customerId": "64b12345abc",
  "products": [
    {
      "productId": "64a12345abc",
      "quantity": 2,
      "price": 1500
    }
  ]
}
```

#### Record Purchase
```http
POST /api/v1/transactions
Content-Type: application/json
# Note: Access token sent via cookies (no Authorization header needed)

{
  "type": "purchase",
  "vendorId": "64b67890xyz",
  "products": [
    {
      "productId": "64a12345abc",
      "quantity": 5,
      "price": 1200
    }
  ]
}
```

#### Get Transactions with Filters
```http
GET /api/v1/transactions?type=sale&startDate=2025-09-01&endDate=2025-09-05
# Note: Access token sent via cookies (no Authorization header needed)
```

### Reports

#### Get Inventory Report
```http
GET /api/v1/reports/inventory
# Note: Access token sent via cookies (no Authorization header needed)
```

#### Get Transaction Report
```http
GET /api/v1/reports/transactions?type=purchase&startDate=2025-09-01&endDate=2025-09-05
# Note: Access token sent via cookies (no Authorization header needed)
```

---

## 📦 Project Structure

```
src/
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Auth & error handling
├── utils/           # Utility functions
├── types/           # TypeScript types
└── config/          # DB & server config
```

---

## 🔧 Key Features

### Transaction Safety
- Automatic stock updates on sales/purchases
- Rollback on transaction failure
- Data consistency maintained

### Business Isolation
- Each user operates within their business context
- Secure data separation
- Role-based access control

### Comprehensive Reporting
- Real-time inventory status
- Transaction history with filters
- Customer/vendor analytics

---

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

**Biswayan Paul**
- GitHub: [@BiswayanPaul](https://github.com/BiswayanPaul)
- LinkedIn: [Biswayan Paul](https://linkedin.com/in/biswayan-paul)
- Project Link: [Inventory & Billing Management](https://github.com/BiswayanPaul/Inventory_Management)

---

## 🙏 Acknowledgments

- Inspired by real-world small business needs
- Transaction-safe stock management
- Built with modern Node.js + TypeScript best practices

---

⭐ **Star this repo if you find it useful!**
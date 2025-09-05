# Inventory & Billing Management System (Backend)

A robust Node.js + TypeScript backend solution for managing products, customers, vendors, and transactions for small businesses. Features JWT-based authentication, role-based access control, and comprehensive inventory management.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## ✨ Features

- **🔐 User Authentication**: Register, login, logout, and token refresh functionality
- **📦 Product Management**: Add, update, delete, list, and adjust stock levels
- **👥 Customer & Vendor Management**: Comprehensive CRUD operations
- **💳 Transaction Management**: Record sales and purchases with automatic stock updates
- **📊 Simple Reports**: Inventory status and transaction history reporting
- **🛡️ Role-Based Access**: Secure endpoints with appropriate permissions

## 🛠️ Tech Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript for type safety
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Security**: bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BiswayanPaul/InventoryandBillingManagement.git
cd InventoryandBillingManagement
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in root directory
PORT=5000
MONGODB_URI=<Your MongoDB connection URI>
CORS_ORIGIN=<Optional: front-end URL>
ACCESS_TOKEN_SECRET=<JWT access token secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<JWT refresh token secret>
REFRESH_TOKEN_EXPIRY=30d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will be running on `http://localhost:5000`

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port number | 5000 |
| MONGODB_URI | MongoDB connection string | - |
| CORS_ORIGIN | Allowed front-end origins | - |
| ACCESS_TOKEN_SECRET | JWT access token secret key | - |
| ACCESS_TOKEN_EXPIRY | Access token expiration time | 1d |
| REFRESH_TOKEN_SECRET | JWT refresh token secret key | - |
| REFRESH_TOKEN_EXPIRY | Refresh token expiration time | 30d |
| BCRYPT_SALT_ROUNDS | Salt rounds for password hashing | 10 |
| NODE_ENV | Environment mode | development |

## 📡 API Routes

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login user |
| GET | `/api/v1/users/logout` | Logout user |
| GET | `/api/v1/users/refresh` | Refresh access token |

### Product Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/products/add` | Add new product |
| GET | `/api/v1/products/get` | List all products for business |
| GET | `/api/v1/products/get/:id` | Get single product by ID |
| PUT | `/api/v1/products/update/:id` | Update product by ID |
| DELETE | `/api/v1/products/delete/:id` | Delete product by ID |
| PUT | `/api/v1/products/increase/:id` | Increase product stock |
| PUT | `/api/v1/products/decrease/:id` | Decrease product stock |

## 🧪 Testing the API

You can test the API using Postman, Insomnia, or any HTTP client. Below are sample requests:

### 1. Register User
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

### 2. Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Add Product
```http
POST /api/v1/products/add
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-end gaming laptop",
  "price": 1500,
  "stock": 10,
  "category": "Electronics"
}
```

### 4. Increase Stock
```http
PUT /api/v1/products/increase/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "quantity": 5
}
```

## 📦 Project Structure

```
src/
├── controllers/     # Route controllers
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── config/          # Configuration files
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Biswayan Paul**
- GitHub: [@BiswayanPaul](https://github.com/BiswayanPaul)
- Project Link: [https://github.com/BiswayanPaul/InventoryandBillingManagement](https://github.com/BiswayanPaul/InventoryandBillingManagement)

## 🙏 Acknowledgments

- Inspired by the needs of small business inventory management
- Built with modern backend development practices
- Thanks to all contributors who help improve this project

---

⭐ Star this repo if you found it helpful!
# Real-Time Inventory Management System

## Introduction
This project is a **Real-Time Inventory Management System** designed to track and update inventory levels for businesses in real time. It includes role-based access for **Admins** and **Employees**, providing features like inventory tracking, stock movement analysis, and low-stock alerts. The system is built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js).

---

## Features

### Admin Features:
- Add, edit, and delete products.
- View and manage inventory details.
- Low-stock alerts for products.
- Generate stock movement and sales reports.
- Role management for users (add/edit/delete employees).

### Employee Features:
- View inventory list with stock levels.
- Low-stock alerts.
- Real-time stock updates.

---

## Project Structure

### Frontend:
- **React.js**: For building the user interface.
- **Material-UI**: For UI components and styling.

### Backend:
- **Node.js**: Server-side logic.
- **Express.js**: REST API framework.

### Database:
- **MongoDB**: For storing product details, user data, and inventory records.

---

## Installation and Setup

### Prerequisites:
1. **Node.js** installed on your system.
2. **MongoDB** running locally or on a cloud service (e.g., MongoDB Atlas).
3. Basic knowledge of JavaScript and the MERN stack.

### Steps:

#### 1. Clone the Repository
```bash
git clone https://github.com/your-repository/inventory-management.git
cd inventory-management
```

#### 2. Install Dependencies

- For the backend:
  ```bash
  cd backend
  npm install
  ```

- For the frontend:
  ```bash
  cd frontend
  npm install
  ```

#### 3. Configure Environment Variables

- Create a `.env` file in the backend directory and add the following:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  SOCKET_PORT=5001
  ```

#### 4. Start the Application

- Start the backend server:
  ```bash
  cd backend
  npm start
  ```

- Start the frontend server:
  ```bash
  cd frontend
  npm start
  ```

#### 5. Access the Application

- Open your browser and navigate to `http://localhost:3000` for the frontend.
- The backend API will run on `http://localhost:5000`.

---

## Usage

### Admin Login
1. Login with admin credentials.
2. Access features like adding products, generating reports, and managing users.

### Employee Login
1. Login with employee credentials.
2. View inventory list and stock levels.
3. Get notified of low-stock products.

---

## API Endpoints

### Authentication
- **POST** `/api/auth/login`: Login for admins and employees.
- **POST** `/api/auth/register`: Register a new user (admin only).

### Inventory Management
- **GET** `/api/inventory`: Fetch all inventory items.
- **POST** `/api/inventory`: Add a new product (admin only).
- **PUT** `/api/inventory/:id`: Update product details (admin only).
- **DELETE** `/api/inventory/:id`: Delete a product (admin only).

### Reporting
- **GET** `/api/reports/stock`: Fetch stock movement trends.
- **GET** `/api/reports/sales`: Fetch sales data.

---

## Frontend Implementation

### Role-Based Views
1. **Admin View:**
   - Product List: Includes actions for add, edit, and delete.
   - Stock Reports: Graphs for stock movement.
   - User Management: Manage employee roles.

2. **Employee View:**
   - Product List: View-only access.
   - Low-Stock Alerts: Highlighted products with low inventory.

### Real-Time Updates
- Implemented using **Socket.io** to synchronize inventory changes across all clients.

---

## Backend Implementation

### Database Models
1. **User Model:**
   - Fields: `name`, `email`, `password`, `role` (admin/employee).

2. **Inventory Model:**
   - Fields: `name`, `sku`, `quantity`, `category`, `updatedAt`.

### Middleware
- **Authentication Middleware:** Verifies JWT tokens and assigns user roles.
- **Error Handling Middleware:** Handles errors gracefully and returns appropriate responses.

---

## Deployment

### Frontend Deployment:
1. Build the React application:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the build folder to a static hosting service like **Netlify** or **Vercel**.

### Backend Deployment:
1. Deploy the backend server to a cloud platform like **Heroku** or **AWS**.
2. Set environment variables in the platform settings.

---

## Future Enhancements
1. **Barcode Scanner Integration**: Add support for barcode scanning to manage stock efficiently.
2. **Multi-Warehouse Support**: Enable tracking of stock across multiple warehouses.
3. **Notifications**: Email or SMS alerts for low stock or critical updates.

---

## Conclusion
The **Real-Time Inventory Management System** is a robust solution for businesses to streamline their inventory processes. With role-based access, real-time updates, and detailed reporting, it caters to the needs of both admins and employees, enhancing efficiency and accuracy in inventory management.


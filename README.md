# E-Commerce Platform

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation and Setup](#installation-and-setup)
5. [Usage](#usage)
6. [Database Schema](#database-schema)
7. [Frontend Routes](#frontend-routes)
8. [Backend Routes](#backend-routes)
9. [Contributors](#contributors)

---

## Overview
This is a full-stack e-commerce platform built as part of a collaborative team project. Users can register as customers, sellers, or admins, enabling them to browse products, make purchases, and manage inventories. The platform supports role-based functionality to ensure a secure and personalized experience.

---

## Features
- **General Users:**
  - Browse products by category and subcategory.
  - Filter and search for specific products.
  - View product details.
- **Registered Customers:**
  - Add items to their cart.
  - Manage a wishlist.
  - Place orders and view order history.
  - Rate and review products and sellers.
- **Sellers:**
  - Add, update, and remove products.
  - View and manage their inventory.
- **Admins:**
  - Manage user accounts (view, remove, block/unblock users).
- **Additional Features:**
  - Forgot and reset password functionality.
  - Responsive design for mobile and desktop.

---

## Technologies Used
- **Frontend:**
  - React.js
  - Redux
  - Vite (Bundler)
  - React Router
- **Backend:**
  - Node.js
  - Express.js
- **Database:**
  - PostgreSQL
- **Version Control:**
  - Git and GitHub
- **Project Management:**
  - Trello

---

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone <repository_url>
   
2. Navigate to the project directory:
   ```bash
   cd project-directory 

3. Install dependencies:
- For the backend:
   ```bash
   cd backend
   npm install

- For the frontend:
     ```bash
   cd frontend
   npm install

4. Set up environment variables:
- Create a .env file in the backend directory and add the necessary variables (e.g., DB_URL, JWT_SECRET, etc.).

5. Run the project:
- Start the backend:
  ```bash
   cd backend
  npm run dev

- Start the frontend:
  ```bash
   cd frontend
   npm run dev

---

## Usage
- Visit the homepage to browse products.
- Register/login to access role-specific functionalities.
- Use the admin dashboard for user management.
- Customers can add items to their wishlist or cart, and proceed to checkout.
  
---

## Database Schema
### Users Table
Column	Type	Description
id	Integer	Unique identifier
name	String	User's full name
email	String	User's email address
password	String	Hashed password
role_id	Integer	Role (Admin, Seller, Customer)
blocked	Boolean	User status

### Other Tables
Include tables for Products, Orders, Cart, Reviews, and Categories.

---

## Frontend Routes
#### 1. Home Page: /
#### 2. Register/Login Page: /login or /register
#### 3. Admin Dashboard: /admin
#### 4. Seller Dashboard: /seller
#### 5. Customer Dashboard: /dashboard

---

## Backend Routes
- **User Management:**
   - POST /register
   - POST /login
   - POST /forgot-password
   - POST /reset-password
- **Product Management:**
   - GET /products
   - POST /products
   - PUT /products/:id
   - DELETE /products/:id
- **Order Management:**
    - GET /orders
    - POST /orders
    - PUT /orders/:id

---

## Contributors
- Khaled Al-Khatib (Scrum Master)
- Omar
- Tareq












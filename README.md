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
### General Users
- Browse products by category.
- Filter and search for specific products.
- View product details and reviews.
- Contact admins via the "Contact Us" page.
- Login or register (normal or through Gmail).

### Registered Customers
- Add items to their cart.
- Manage a wishlist.
- Place orders and view order history.
- Rate and review products and sellers.
- Manage their accounts.
- Chat with sellers.

### Sellers
- Access a dashboard with a summary of their performance.
- View and manage their inventory.
- Add, update, and remove products.
- Manage orders.
- Update their profile.
- Chat with customers.

### Admins
- Access a dashboard with a summary of platform activity.
- Manage user accounts:
  - View, remove, block, or unblock users.
- Manage categories:
  - View, add, update, or remove categories.
- Manage products:
  - View and remove products.
- Manage orders:
  - View and remove orders.

- **Additional Features:**
  - Email Verification.
  - Forgot and reset password functionality.
  - Responsive design for mobile and desktop.
  - Online Payment.

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
### General Routes
1. **Home Page:** `/`
2. **Shop Categories:** `/shop`
3. **Shop Category Details:** `/shop/:cId`
4. **Product Details:** `/shop/:cId/:pId`
5. **Search Results:** `/search/:query`
6. **Contact Page:** `/Contact`
7. **Privacy Policy:** `/privacy`
8. **404 Page:** `/*`

### User Authentication & Profile
1. **Register:** `/users`
2. **Login:** `/users/login`
3. **Reset Password:** `/users/reset-password/:resetToken`
4. **Verify Email:** `/users/verifyEmail/:token`
5. **Google Complete Registration:** `/google-complete-register/:userId`
6. **User Profile:** `/users/:userId`
7. **Profile Management:** `/Profile`

### Customer Routes
1. **Cart:** `/cart`
2. **Place Order:** `/placeOrder`
3. **My Orders:** `/MyOrders`
4. **Wishlist:** `/wishlist`

### Seller Routes
1. **Seller Dashboard:** `/seller`

### Admin Routes
1. **Admin Dashboard:** `/Admin`

### Chatting System
1. **General Chat:** `/chat`
2. **Chat with Specific User:** `/chat/:userid`


---

## Backend Routes

### User Management
- **Public Routes:**
  - `POST /users` - Register a new user.
  - `POST /users/verifyEmail/:token` - Verify email using a token.
- **Protected Routes (Blocked/Unverified Check):**
  - `POST /users/login` - User login.
  - `POST /users/forgot-password` - Request password reset.
  - `POST /users/reset-password` - Reset password.
  - `POST /users/google-login` - Google login.
  - `POST /users/google-complete-register/:userId` - Complete Google registration.
- **Protected Routes (Authenticated):**
  - `GET /users/profile` - Get user profile.
  - `PUT /users/profile` - Update profile (with image upload).
  - `PUT /users/change-password` - Update password.
  - `DELETE /users/profile` - Delete user account.
  - `PUT /users/deactivate-profile` - Deactivate account.
  - `PUT /users/reactivate-profile` - Reactivate account.
- **Admin Routes:**
  - `GET /users/admin` - Get all users (Admin only).
  - `DELETE /users/admin/:userId` - Remove a user (Admin only).
  - `PUT /users/admin/block/:userId` - Block a user (Admin only).
  - `PUT /users/admin/unblock/:userId` - Unblock a user (Admin only).

### Roles and Permissions
- **Roles:**
  - `POST /roles` - Create a new role.
- **Permissions:**
  - `POST /roles/permission` - Create a new permission.
- **Role Permissions:**
  - `POST /roles/role_permission` - Assign permissions to roles.

### Product Management
- **Products:**
  - `POST /products` - Add a new product.
  - `POST /products/upload_Image` - Upload product image.
  - `PUT /products/:pId` - Update a product.
  - `DELETE /products/:pId` - Delete a product.
  - `GET /products` - Get all products.
  - `GET /products/:pId` - Get product by ID.
  - `GET /products/category/:cId` - Get products by category.
  - `GET /products/search/:query` - Search products by name.
  - `GET /products/seller` - Get seller-specific products.

### Categories Management
- **Categories:**
  - `POST /category` - Create a new category.
  - `POST /category/upload_Image` - Upload category image.
  - `PUT /category/:catId` - Update a category.
  - `DELETE /category/:catId` - Delete a category.
  - `GET /category` - Get all categories.
  - `GET /category/:catId` - Get category by ID.
- **Subcategories:**
  - `POST /subcategory/:catId` - Create a subcategory.
  - `POST /subcategory/upload_Image` - Upload subcategory image.
  - `PUT /subcategory/:subId` - Update a subcategory.
  - `DELETE /subcategory/:subId` - Delete a subcategory.
  - `GET /subcategory` - Get all subcategories.
  - `GET /subcategory/:categoryId` - Get subcategories by category ID.

### Order Management
- **Orders:**
  - `POST /order` - Create a new order.
  - `DELETE /order/:id` - Cancel an order.
  - `GET /order` - Get all orders for the user.
  - `GET /order/details/:id` - Get order details.
  - `GET /order/seller/summary` - Get seller summary.
  - `GET /order/seller/:sellerId` - Get seller-specific orders.
  - `GET /order/admin/summary` - Get admin summary.
  - `PUT /order/:id/status` - Update order status.
  - `GET /order/:id/invoice` - Generate order invoice.

### Cart Management
- **Cart:**
  - `GET /cart` - Get cart items.
  - `POST /cart/:id` - Add an item to the cart.
  - `PUT /cart/:id` - Update cart item quantity.
  - `DELETE /cart/:id` - Remove an item from the cart.
  - `DELETE /cart` - Clear the cart.

### Wishlist Management
- **Wishlist:**
  - `POST /wishlist` - Add an item to the wishlist.
  - `GET /wishlist` - Get wishlist items.
  - `DELETE /wishlist/:productId` - Remove an item from the wishlist.
  - `DELETE /wishlist/clear` - Clear the wishlist.
  - `GET /wishlist/count` - Get wishlist item count.

### Review Management
- **Product Reviews:**
  - `POST /review/:pId` - Create a review for a product.
  - `PUT /review/:reviewId` - Update a review.
  - `DELETE /review/:reviewId` - Delete a review.
  - `GET /review/:id` - Get all reviews for a product.
- **Seller Reviews:**
  - `POST /review/seller/:id` - Create a review for a seller.
  - `GET /review/seller/:sellerId` - Get reviews for a seller.
  - `PUT /review/seller/:id` - Update a seller review.
  - `DELETE /review/seller/:id` - Delete a seller review.

### Payment
- **Payments:**
  - `POST /pay` - Process a payment.

### Messaging System
- **Messages:**
  - `POST /messages` - Send a message.
  - `GET /messages/:id` - Get messages by ID.


---

## Contributors
- Khaled Al-Khatib (Scrum Master)
- Omar Al-labadi
- Tareq Nabeel












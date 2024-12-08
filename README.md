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

### Additional Features
- Email Verification.
- Forgot and reset password functionality.
- Responsive design for mobile and desktop.
- Online Payment Integration.

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
  
  **Note**: Some features, like adding to cart or wishlist, require user authentication. Role-based access control ensures secure and role-specific functionality.
  
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
1. **Home Page:** `/`  - View homepage with product highlights.
2. **Shop Categories:** `/shop` - Browse categories.
3. **Shop Category Details:** `/shop/:cId` - View products within a specific category.
4. **Product Details:** `/shop/:cId/:pId` - View detailed information and reviews of a product.
5. **Search Results:** `/search/:query` - Search for products by name or keyword.
6. **Contact Page:** `/Contact` - Contact administrators.
7. **Privacy Policy:** `/privacy`  - View the privacy policy.
8. **404 Page:** `/*`  - Fallback for undefined routes.

### User Authentication & Profile
1. **Register:** `/users`  - Register a new account.
2. **Login:** `/users/login` - Login to your account.
3. **Reset Password:** `/users/reset-password/:resetToken` - Reset account password.
4. **Verify Email:** `/users/verifyEmail/:token` - Verify account email.
5. **Google Complete Registration:** `/google-complete-register/:userId` - Complete registration using Google.
6. **User Profile:** `/users/:userId` - View a user profile.
7. **Profile Management:** `/Profile`  - Manage your account details.

### Customer Routes
1. **Cart:** `/cart` - View and manage cart items.
2. **Place Order:** `/placeOrder` - Place an order for items in the cart.
3. **My Orders:** `/MyOrders` - View a list of your orders.
4. **Wishlist:** `/wishlist` - Manage your wishlist items.

### Seller Routes
1. **Seller Dashboard:** `/seller` - Manage inventory and view seller-specific details.

### Admin Routes
1. **Admin Dashboard:** `/Admin`  - Manage the platform, including users, categories, and orders.

### Chatting System
1. **General Chat:** `/chat` - Chat with users.
2. **Chat with Specific User:** `/chat/:userid` - Chat with a specific user.


---

## Backend Routes

### Table of Contents
1. [User Management](#user-management)
2. [Roles and Permissions](#roles-and-permissions)
3. [Product Management](#product-management)
4. [Categories Management](#categories-management)
5. [Order Management](#order-management)
6. [Cart Management](#cart-management)
7. [Wishlist Management](#wishlist-management)
8. [Review Management](#review-management)
9. [Payment](#payment)
10. [Messaging System](#messaging-system)

---

### User Management
- **Public Routes:**
  - `POST /users` - Register a new user.
  - `POST /users/verifyEmail/:token` - Verify user email.
- **Protected Routes:**
  - Manage profiles, passwords, and account statuses (e.g., deactivate/reactivate).
- **Admin Routes:**
  - View, block, unblock, or delete users (requires admin authorization).

---

### Roles and Permissions
- **Roles:**
  - `POST /roles` - Create a new role.
- **Permissions:**
  - `POST /roles/permission` - Create a new permission.
- **Role Permissions:**
  - `POST /roles/role_permission` - Assign permissions to roles.

---

### Product Management
| Method | Endpoint                         | Description                        | Authentication Required |
|--------|----------------------------------|------------------------------------|-------------------------|
| POST   | `/products`                      | Add a new product                  | Yes                     |
| GET    | `/products`                      | Retrieve all products              | No                      |
| GET    | `/products/:pId`                 | Get product details by ID          | No                      |
| PUT    | `/products/:pId`                 | Update a product                   | Yes                     |
| DELETE | `/products/:pId`                 | Delete a product                   | Yes                     |
| POST   | `/products/upload_Image`         | Upload product image               | Yes                     |
| GET    | `/products/category/:cId`        | Filter products by category        | No                      |
| GET    | `/products/search/:query`        | Search products by name            | No                      |
| GET    | `/products/seller`               | Get seller-specific products       | Yes                     |

---

### Categories Management
- **Categories:**
  - CRUD operations for managing categories, including uploading images.
- **Subcategories:**
  - CRUD operations for subcategories, including uploading images.

---

### Order Management
- Customers:
  - Place, view, and cancel orders.
- Admins and Sellers:
  - View summaries, update order statuses, and generate invoices.

---

### Cart Management
| Method | Endpoint            | Description                       | Authentication Required |
|--------|---------------------|-----------------------------------|-------------------------|
| GET    | `/cart`             | Get cart items                    | Yes                     |
| POST   | `/cart/:id`         | Add an item to the cart           | Yes                     |
| PUT    | `/cart/:id`         | Update cart item quantity         | Yes                     |
| DELETE | `/cart/:id`         | Remove an item from the cart      | Yes                     |
| DELETE | `/cart`             | Clear the cart                    | Yes                     |

---

### Wishlist Management
- Add, remove, view, or clear items in the wishlist.

---

### Review Management
- Customers can review products and sellers, with full CRUD capabilities.

---

### Payment
- Process payments for orders through `POST /pay`.

---

### Messaging System
- Send and receive messages between users.


---

## Contributors
- [Khaled Al-Khateeb](https://github.com/AlKhateebKhaled) (Scrum Master)
- [Omar Al-Labadi](https://github.com/omarallabadi)
- [Tareq Nabeel](https://github.com/TareqIzmirli)













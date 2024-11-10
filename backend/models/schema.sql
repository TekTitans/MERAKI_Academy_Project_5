-- Create the 'roles' table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  role VARCHAR(255) NOT NULL UNIQUE 
);

-- Create the 'permissions' table
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  permission VARCHAR(255) NOT NULL UNIQUE 
);

-- Create the 'role_permission' table to link roles and permissions
CREATE TABLE role_permission (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id) 
);

-- Create the 'users' table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  userName VARCHAR(255) UNIQUE NOT NULL, 
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  location VARCHAR(255),
  country VARCHAR(255),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create the 'categories' table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE, 
  description VARCHAR(255),
  category_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE 
);

-- Create the 'subcategories' table
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  description VARCHAR(255),
  subcategory_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create the 'products' table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0), 
  stock_status VARCHAR(50) CHECK (stock_status IN ('in_stock', 'out_of_stock', 'on_demand')), 
  stock_quantity INT NOT NULL CHECK (stock_quantity >= 0), 
  color_options JSONB, 
  size_options JSONB, 
  seller_id INT NOT NULL,
  category_id INT NOT NULL,
  subcategory_id INT NOT NULL,
  product_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

-- Create the 'orders' table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0), 
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0), 
  order_status VARCHAR(50) CHECK (order_status IN ('pending', 'completed', 'cancelled', 'shipped')), 
  shipping_address TEXT,
  payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'completed', 'failed')), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the 'order_items' table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0), 
  price_per_item DECIMAL(10, 2) NOT NULL CHECK (price_per_item >= 0), 
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create the 'cart' table
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  order_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Create the 'reviews' table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), 
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the 'wishlists' table
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create the 'messages' table for user-to-user communication
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Create the 'notifications' table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Create the 'contact_us' table
CREATE TABLE contact_us (
  id SERIAL PRIMARY KEY,
  user_id INT,  
  subject VARCHAR(255) NOT NULL, 
  message TEXT NOT NULL,  
  message_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  is_deleted BOOLEAN DEFAULT FALSE, 
  FOREIGN KEY (user_id) REFERENCES users(id) 
);
-- Create the 'reports' table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,  
  admin_id INT NOT NULL,  
  action_type VARCHAR(50) , 
  action_reason TEXT,  
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  is_deleted BOOLEAN DEFAULT FALSE,  
  FOREIGN KEY (user_id) REFERENCES users(id),  
  FOREIGN KEY (admin_id) REFERENCES users(id)  
);

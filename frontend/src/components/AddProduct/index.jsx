import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/reducers/product/product'; 
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    stock_status: '',
    stock_quantity: '',
    color_options: '',
    size_options: '',
    product_image: '',
    category_id: '',
    subcategory_id: '',
  });
  
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products', product);
      dispatch(addProduct(response.data.product)); 
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product', error);
      alert('Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={product.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <input
        type="number"
        name="stock_quantity"
        value={product.stock_quantity}
        onChange={handleChange}
        placeholder="Stock Quantity"
      />
      <select
        name="stock_status"
        value={product.stock_status}
        onChange={handleChange}
      >
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
      <input
        type="text"
        name="color_options"
        value={product.color_options}
        onChange={handleChange}
        placeholder="Color Options"
      />
      <input
        type="text"
        name="size_options"
        value={product.size_options}
        onChange={handleChange}
        placeholder="Size Options"
      />
      <input
        type="text"
        name="product_image"
        value={product.product_image}
        onChange={handleChange}
        placeholder="Product Image URL"
      />
      <input
        type="text"
        name="category_id"
        value={product.category_id}
        onChange={handleChange}
        placeholder="Category ID"
      />
      <input
        type="text"
        name="subcategory_id"
        value={product.subcategory_id}
        onChange={handleChange}
        placeholder="Subcategory ID"
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;

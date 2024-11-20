import React from 'react';
import SellerProducts from '../../components/SellerProducts';
import AddProduct from '../../components/AddProduct';

const SellerDashboard = () => {
  return (
    <div>
      <h1>Seller Dashboard</h1>
      <AddProduct />
      <SellerProducts />
    </div>
  );
};

export default SellerDashboard;

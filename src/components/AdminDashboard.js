// src/components/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    bidder_id: '',
    amount: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://93j3gckjmc.execute-api.ap-northeast-2.amazonaws.com/default/mg-lambda-backend/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://93j3gckjmc.execute-api.ap-northeast-2.amazonaws.com/default/mg-lambda-backend/admin/products', { withCredentials: true });
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products');
    }
  };
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://93j3gckjmc.execute-api.ap-northeast-2.amazonaws.com/default/mg-lambda-backend/admin/orders', { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      setError('Error fetching orders');
    }
  };

  const createOrder = async (order) => {
    try {
      await axios.post('https://93j3gckjmc.execute-api.ap-northeast-2.amazonaws.com/default/mg-lambda-backend/admin/orders', order, { withCredentials: true });
      fetchOrders();
    } catch (error) {
      alert("입력을 확인해주세요");
      setError('Error creating order');
    }
  };

  const updateOrder = async (orderId, updatedOrder) => {
    try {
      await axios.put(`https://93j3gckjmc.execute-api.ap-northeast-2.amazonaws.com/default/mg-lambda-backend/admin/orders/${orderId}`, updatedOrder, { withCredentials: true });
      fetchOrders();
    } catch (error) {
      setError('Error updating order');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`https://93j3gckjmc.execute-api.ap-northeast-2.amazonaws.com/default/mg-lambda-backend/admin/orders/${orderId}`, { withCredentials: true });
      fetchOrders();
    } catch (error) {
      setError('Error deleting order');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateOrder = () => {
    const newOrder = { ...formData };
    createOrder(newOrder);
  };

  const handleUpdateOrder = (orderId) => {
    const updatedOrder = { ...formData };
    updateOrder(orderId, updatedOrder);
  };

  const handleDeleteOrder = (productId) => {
    deleteOrder(productId);
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const sectionStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  };

  const headingStyle = {
    color: '#333',
    marginBottom: '20px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    backgroundColor: '#e9ecef',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #dee2e6',
  };

  const buttonStyle = {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#343a40',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Admin Dashboard</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Users</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Phone Number</th>
              <th style={thStyle}>Is Active</th>
              <th style={thStyle}>Is Superuser</th>
              <th style={thStyle}>Is Seller</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.phone_number}</td>
                <td style={tdStyle}>{user.is_active ? 'Yes' : 'No'}</td>
                <td style={tdStyle}>{user.is_superuser ? 'Yes' : 'No'}</td>
                <td style={tdStyle}>{user.is_seller ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Products</h2>
        <table style={tableStyle}>
          {<tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.original_source}</td>
                <td>{product.consigner}</td>
                <td>{product.start_price}</td>
                <td>{product.increment}</td>
                <td>{product.end_date}</td>
                <td>{product.last_bid}</td>
                <td>{product.status}</td>
              </tr>
            ))}
          </tbody>}
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Orders</h2>
        <table style={tableStyle}>
          {/* ... keep existing table structure, apply thStyle and tdStyle ... */}
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.product_id}</td>
                <td>{order.bidder_id}</td>
                <td>{order.phone_number}</td>
                <td>{order.amount}</td>
                <td>{order.end_date}</td>
                <td>
                  <button onClick={() => handleUpdateOrder(order.id)}>Update</button>
                  <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Create or Update Order</h2>
        <form style={formStyle}>
          <label style={labelStyle}>
            상품 번호:
            <input
              style={inputStyle}
              type="text"
              name="product_id"
              value={formData.product_id}
              onChange={handleInputChange}
            />
          </label>
          <label style={labelStyle}>
            낙찰자 ID:
            <input
              style={inputStyle}
              type="number"
              name="bidder_id"
              value={formData.bidder_id}
              onChange={handleInputChange}
            />
          </label>
          <label style={labelStyle}>
            낙찰가:
            <input
              style={inputStyle}
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </label>
          <button style={{...buttonStyle, marginTop: '10px'}} type="button" onClick={handleCreateOrder}>Create Order</button>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboard;

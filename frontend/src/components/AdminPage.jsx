import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [product_name, setProductName] = useState('');
  const [product_price, setProductPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [product_image, setProductImage] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState([]); // State to store the fetched users

  // Fetch users when the "Manage Users" tab is active
  useEffect(() => {
    if (activeTab === 'manageUsers') {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/users', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming token is stored in localStorage
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsers(data); // Store the users in the state
          } else {
            setError('Failed to fetch users');
          }
        } catch (err) {
          setError('An error occurred. Please try again.');
        }
      };

      fetchUsers();
    }
  }, [activeTab]); // Run effect when the activeTab changes

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!product_name || !product_price || !quantity || !product_image) {
      setError('Please fill in all fields, including the image.');
      return;
    }

    setError('');
    // setSuccessMessage('');

    const formData = new FormData();
    formData.append('product_name', product_name); 
    formData.append('product_price', product_price); 
    formData.append('quantity', quantity); 
    formData.append('product_image', product_image); 

    try {
      const response = await fetch('http://localhost:5000/add-product', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // setSuccessMessage('Product added successfully!');
        alert('Product added successfully!')
        setProductName('');
        setProductPrice('');
        setQuantity('');
        setProductImage(null);
      } else {
        setError('Failed to add product');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');

  // Handle form submission to add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!employeeName || !employeeEmail || !employeePassword || !employeeRole) {
      setError('Please fill in all fields.');
      return;
    }

    // Reset success/error messages
    setError('');
    // setSuccessMessage('');

    const employeeData = { name: employeeName, email: employeeEmail, password: employeePassword, role: employeeRole };

    try {
      const response = await fetch('http://localhost:5000/admin-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        // setSuccessMessage('Employee added successfully!');
        alert("Employee added successfully!")
        // Optionally, clear the form after success
        setEmployeeName('');
        setEmployeeEmail('');
        setEmployeePassword('');
        setEmployeeRole('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add employee');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };


  const [products, setProducts] = useState([]); // State to hold product data
//   const [error, setError] = useState('');

  // Fetch products when the component mounts
  useEffect(() => {
    if (activeTab === 'viewProducts') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const productData = await response.json();
        setProducts(productData);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products.');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li onClick={() => setActiveTab('addEmployee')}>Add Employee</li>
          <li onClick={() => setActiveTab('addProduct')}>Add Product</li>
          <li onClick={() => setActiveTab('viewProducts')}>View Products</li>
          <li onClick={() => setActiveTab('manageUsers')}>Manage Users</li>
        </ul>
      </div>

      <div className="main-content">
      {activeTab === 'dashboard' && (
        <div className="dashboard">
          <h2>Welcome to the Admin Panel</h2>

          <div className="dashboard-overview">
            <div className="overview-item">
              <h3>Total Products</h3>
              <p>75</p>
            </div>
            <div className="overview-item">
              <h3>Total Users</h3>
              <p>-</p>
            </div>
            <div className="overview-item">
              <h3>Recent Activity</h3>
              <ul>
                <li>New product added: {product_name}</li>
                <li>New user registered: {users[users.length - 1]?.name || 'No recent users'}</li>
              </ul>
            </div>
          </div>

          <div className="sales-summary">
            <h3>Sales Summary</h3>
            <div className="sales-item">
              <h4>Revenue (Last 30 Days)</h4>
              <p>&#x20B9;X</p> {/* Replace with dynamic data */}
            </div>
            <div className="sales-item">
              <h4>Orders (Last 30 Days)</h4>
              <p>-</p> {/* Replace with dynamic data */}
            </div>
          </div>

          

          <div className="notifications">
            <h3>Notifications</h3>
            <ul>
              <li>Product X is running low on stock.</li>
              <li>New user registered today: {users[users.length - 1]?.name}</li>
            </ul>
          </div>
        </div>
      )}




        {activeTab === 'addEmployee' && (
          <div className="form-container">
            <h2>Add Employee</h2>
            <form onSubmit={handleAddEmployee}>
              <input
                type="text"
                placeholder="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
              <button type="submit">Add Employee</button>
            </form>
          </div>
        )}

        {activeTab === 'addProduct' && (
          <div className="form-container">
            <h2>Add Product</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={product_name}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={product_price}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProductImage(e.target.files[0])}
                required
              />
              {product_image && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(product_image)} alt="Product Preview" />
                </div>
              )}
              {error && <p className="error">{error}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
              <button type="submit">Add Product</button>
            </form>
          </div>
        )}

{activeTab === 'viewProducts' && (
  <div className="view-products">
    <h2>Products</h2>
    {error && <p className="error">{error}</p>}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="4">No products available.</td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product._id}>
              <td>{product.product_name}</td>  {/* Access product_name from product object */}
              <td>{product.product_price}</td>  {/* Access product_price */}
              <td>{product.quantity}</td>  {/* Access quantity */}
              <td>
                {product.product_image && (
                  <img
                    src={product.product_image} 
                    alt={product.product_name}  
                    style={{ width: '50px', height: '50px' }}
                  />
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}


        {activeTab === 'manageUsers' && (
          <div className="manage-users">
            <h2>Manage Users</h2>
            {error && <p className="error">{error}</p>}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

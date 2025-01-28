import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', email: '', department: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      const transformedUsers = response.data.map((user) => ({
        id: user.id,
        firstName: user.name.split(' ')[0] || 'N/A',
        lastName: user.name.split(' ')[1] || 'N/A', 
        email: user.email,
        department: user.company?.name || 'N/A', 
      }));
      setUsers(transformedUsers);
      console.log(transformedUsers);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
      setUsers([...users, response.data]);
      setFormData({ id: '', firstName: '', lastName: '', email: '', department: '' });
    } catch (err) {
      setError('Failed to add user.');
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      id: user.id || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      department: user.department || '',
    });
    setIsEditing(true);
  };
  

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${formData.id}`, formData);
      setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
      setFormData({ id: '', firstName: '', lastName: '', email: '', department: '' });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };
  console.log(users);
 

  return (
    <div className="app">
      <h1>User Management</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={isEditing ? handleUpdateUser : handleAddUser} className="user-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="btn">
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <button onClick={() => handleEditUser(user)} className="btn edit-btn">Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="btn delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

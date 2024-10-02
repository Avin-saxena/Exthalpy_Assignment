import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import { Table, Button, Form, Container } from 'react-bootstrap'; // Added Container to the import

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get('/admin/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  };

  const handleRoleChange = (userId, newRole) => {
    axios
      .put(`/admin/users/${userId}`, { role: newRole })
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error('Failed to update user role:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`/admin/users/${userId}`)
        .then(() => {
          fetchUsers();
        })
        .catch((error) => {
          console.error('Failed to delete user:', error);
        });
    }
  };

  return (
    <Container className="mt-4">
      <h2>User Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  {/* Add more roles if needed */}
                </Form.Select>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminUsers;

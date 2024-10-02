import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import { Container, Form, Button } from 'react-bootstrap';

function AdminSettings() {
  const [settings, setSettings] = useState({
    maxUploadSize: 0,
    allowedFileTypes: [],
  });

  useEffect(() => {
    axios
      .get('/admin/settings')
      .then((response) => {
        setSettings(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch settings:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put('/admin/settings', settings)
      .then(() => {
        alert('Settings updated successfully');
      })
      .catch((error) => {
        console.error('Failed to update settings:', error);
      });
  };

  return (
    <Container className="mt-4">
      <h2>System Settings</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="maxUploadSize">
          <Form.Label>Max Upload Size (MB)</Form.Label>
          <Form.Control
            type="number"
            name="maxUploadSize"
            value={settings.maxUploadSize / (1024 * 1024)}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="allowedFileTypes">
          <Form.Label>Allowed File Types (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="allowedFileTypes"
            value={settings.allowedFileTypes.join(', ')}
            onChange={(e) =>
              setSettings({
                ...settings,
                allowedFileTypes: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          Save Settings
        </Button>
      </Form>
    </Container>
  );
}

export default AdminSettings;

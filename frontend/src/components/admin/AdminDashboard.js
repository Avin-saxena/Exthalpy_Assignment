import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#28a745', '#ffc107', '#dc3545'];

function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get('/admin/stats')
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch stats:', error);
      });
  }, []);

  // Only define `data` after stats are available
  const data = [
    { name: 'Processed', value: stats.processedVideos || 0 },
    { name: 'Processing', value: stats.processingVideos || 0 },
    { name: 'Error', value: stats.errorVideos || 0 },
  ];

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats.totalUsers || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Videos</Card.Title>
              <Card.Text>{stats.totalVideos || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Pie Chart for video processing stats */}
        <Col md={6}>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
              label
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;

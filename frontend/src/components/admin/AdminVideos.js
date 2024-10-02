import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import { Table, Button, Container } from 'react-bootstrap';

function AdminVideos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get('/admin/videos')
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error);
      });
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      axios
        .delete(`/admin/videos/${videoId}`)
        .then(() => {
          fetchVideos();
        })
        .catch((error) => {
          console.error('Failed to delete video:', error);
        });
    }
  };

  return (
    <Container className="mt-4">
      <h2>Video Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Filename</th>
            <th>User</th>
            <th>Status</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video._id}>
              <td>{video.originalFilename}</td>
              <td>{video.userId.username}</td>
              <td>{video.status}</td>
              <td>{new Date(video.uploadDate).toLocaleString()}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteVideo(video._id)}
                >
                  Delete
                </Button>
                {/* Add more actions if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminVideos;

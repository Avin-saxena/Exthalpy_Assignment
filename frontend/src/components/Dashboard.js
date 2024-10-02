import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {
  Navbar,
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
} from 'react-bootstrap';

import VideoUploadForm from './VideoUploadForm';
import { io } from 'socket.io-client';
import {
  FaVideo,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from 'react-icons/fa';

function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //fetching videos on component mount
    fetchVideos();

    //Initializing Socket.IO connection
    const newSocket = io('http://localhost:4000', {
      auth: { token: auth.token },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO client connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
    });

    //Cleaning up
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [auth.token]);

  const fetchVideos = () => {
    axios
      .get('/videos')
      .then((response) => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error);
        setError('Failed to fetch videos');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!socket) return;

    //listening for any video status updates
    socket.on('videoStatus', (data) => {
      console.log('Received video status update:', data);
      //updating the videos state accordingly
      setVideos((prevVideos) => {
        const videoExists = prevVideos.some((video) => video._id === data.videoId);

        if (videoExists) {
          //updating existing video
          return prevVideos.map((video) =>
            video._id === data.videoId ? { ...video, status: data.status } : video
          );
        } else {
          //fetching new video
          fetchVideos();
          return prevVideos;
        }
      });
    });

    //handling socket errors
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    //cleaning up event listeners
    return () => {
      socket.off('videoStatus');
      socket.off('connect_error');
    };
  }, [socket]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processed':
        return (
          <Badge bg="success">
            <FaCheckCircle /> Processed
          </Badge>
        );
      case 'processing':
        return (
          <Badge bg="warning">
            <FaHourglassHalf /> Processing
          </Badge>
        );
      case 'error':
        return (
          <Badge bg="danger">
            <FaTimesCircle /> Error
          </Badge>
        );
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  //function to handle "View Details" button click
  const handleViewDetails = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  //Function to close the modal
  const handleCloseModal = () => {
    setSelectedVideo(null);
    setShowModal(false);
  };

  return (
    <>
      
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>

          <Navbar.Brand style={{ cursor: 'default', userSelect: 'none' }}>
            Video Dashboard
          </Navbar.Brand>
         
        </Container>
      </Navbar>


      {/* Main section*/}
      <Container className="mt-4">
        <Row>
          {/* Video upload form */}
          <Col md={4}>
            <h4>Upload New Video</h4>
            <VideoUploadForm />
          </Col>

          {/* videos display */}
          <Col md={8}>
            <h4>Your Videos</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : videos.length > 0 ? (
              <Row xs={1} md={2} lg={2} className="g-4">
                {videos.map((video) => (
                  <Col key={video._id}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <FaVideo /> {video.originalFilename}
                        </Card.Title>
                        <Card.Text>
                          Status: {getStatusBadge(video.status)}
                        </Card.Text>
                        <Card.Text>
                          Duration:{' '}
                          {video.duration
                            ? `${Math.floor(video.duration / 60)}:${Math.floor(
                                video.duration % 60
                              )}`
                            : 'N/A'}
                        </Card.Text>
                        <Card.Text>
                          Uploaded: {new Date(video.uploadDate).toLocaleString()}
                        </Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => handleViewDetails(video)}
                          disabled={!video.metadata}
                        >
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info">No videos uploaded yet.</Alert>
            )}
          </Col>
        </Row>
      </Container>

      {/* video details modal */}
      {selectedVideo && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Video Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>
              <FaVideo /> {selectedVideo.originalFilename}
            </h5>
            <p>
              <strong>Status:</strong> {getStatusBadge(selectedVideo.status)}
            </p>
            <p>
              <strong>Duration:</strong>{' '}
              {selectedVideo.duration
                ? `${Math.floor(selectedVideo.duration / 60)}:${Math.floor(
                    selectedVideo.duration % 60
                  )}`
                : 'N/A'}
            </p>
            <p>
              <strong>Uploaded:</strong>{' '}
              {new Date(selectedVideo.uploadDate).toLocaleString()}
            </p>
            {selectedVideo.metadata && (
              <>
                <h6>Metadata:</h6>
                <pre>{JSON.stringify(selectedVideo.metadata, null, 2)}</pre>
              </>
            )}
            {!selectedVideo.metadata && (
              <p>No metadata available for this video.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Dashboard;

import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { Form, Button, ProgressBar, Alert } from 'react-bootstrap';

function VideoUploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a video file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      setUploading(true);
      setMessage('');
      const response = await axios.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setMessage('Video uploaded successfully');
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Video upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleUpload}>
      {message && <Alert variant="info">{message}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Select Video File</Form.Label>
        <Form.Control
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </Form.Group>
      {uploading && (
        <ProgressBar
          now={uploadProgress}
          label={`${uploadProgress}%`}
          className="mb-3"
        />
      )}
      <Button type="submit" variant="primary" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </Button>
    </Form>
  );
}

export default VideoUploadForm;

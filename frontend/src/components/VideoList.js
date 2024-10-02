import React from 'react';
import { Table } from 'react-bootstrap';

function VideoList({ videos, statusUpdates }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Upload Date</th>
        </tr>
      </thead>
      <tbody>
        {videos.map((video) => (
          <tr key={video._id}>
            <td>{video.originalFilename}</td>
            <td>{statusUpdates[video._id] || video.status}</td>
            <td>{video.duration ? `${video.duration.toFixed(2)} sec` : 'N/A'}</td>
            <td>{new Date(video.uploadDate).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default VideoList;

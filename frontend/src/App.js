import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the Django backend
    axios.get('http://127.0.0.1:8000') // Make sure this is correct and the Django server is running
      .then((response) => {
        setMessage(response.data.message || 'No message found'); // If response doesn't have a message field
      })
      .catch((error) => {
        setError('Error fetching data from the server');
        console.error('Error:', error); // Log error to the console for debugging
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{error ? error : message}</h1>
      {/* If there's an error, display the error message, otherwise show the message */}
    </div>
  );
}

export default App;

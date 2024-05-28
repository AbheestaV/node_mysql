const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to server');

  const query = JSON.stringify({ query: 'SELECT * FROM employees' });
  ws.send(query);
});

ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data);
      console.log('Received:', parsedData);
    } catch (e) {
      console.error('Failed to parse message:', data);
    }
  });

ws.on('close', () => {
  console.log('Disconnected from server');
});

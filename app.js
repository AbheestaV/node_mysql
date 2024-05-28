/*
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database1'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
*/

const WebSocket = require('ws');
const mysql = require('mysql');

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database1'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Parse 
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (e) {
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    // Query
    if (parsedMessage.query) {
      db.query(parsedMessage.query, (error, results) => {
        if (error) {
          ws.send(JSON.stringify({ error: error.message }));
          return;
        }
        ws.send(JSON.stringify({ results: results }));
      });
    } else {
      ws.send(JSON.stringify({ error: 'No query provided' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

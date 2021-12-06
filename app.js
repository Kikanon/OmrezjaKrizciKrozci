import express from 'express';
import { createServer } from 'http';
// import { Server } from 'socket.io';
// import fs from 'fs'

const app = express();
const server = createServer(app);
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(process.cwd() + '/style.css');
});

app.get('/webApp.js', (req, res) => {
    res.sendFile(process.cwd() + '/webApp.js');
});

app.get('/images/*.png', (req, res) => {
    res.sendFile(process.cwd() + req.path)
})

server.listen(port, () => {
  console.log(`webpage listening on localhost:${port}`);
});

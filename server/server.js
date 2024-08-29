/* const express = require('express');
const app = express();


app.use(express.json());
 */
/* app.listen((8000), {
  console.log("App is listening at port 8000");
}) */


const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const sequelize = require('./config/database'); 
const Student = require('./models/student'); 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});


io.on('connection', (socket) => {
  console.log('New client connected');

  const fetchData = async () => {
    try {
      const students = await Student.findAll();
      socket.emit("getData", { data: students.map(student => student.toJSON()) });
      console.log(students);
      
      fetchData();
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  fetchData();

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(8000, () => console.log("Server running on port 8000")); 

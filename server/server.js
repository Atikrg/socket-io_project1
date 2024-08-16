const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// Set up Sequelize
const sequelize = new Sequelize('college', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

// Define Student model
const Student = sequelize.define('Student', {
  rollno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'students',
  timestamps: false
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Function to fetch and emit data
  const fetchData = async () => {
    try {
      const students = await Student.findAll();
      socket.emit("getData", { data: students.map(student => student.toJSON()) });
      
      fetchData();
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Start fetching data automatically when a client connects
  fetchData();

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(8000, () => console.log("Server running on port 8000"));

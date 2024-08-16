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

io.on("connection", async (socket) => {
  try {
    // Sync Sequelize models
    await sequelize.authenticate();
    console.log("Database connected");

    // Send initial data to the client
    const students = await Student.findAll();
    console.log('Initial student data:', students);
    socket.emit("getfirst", { data: students.map(student => student.toJSON()) });

    setInterval(async () => {
      const updatedStudents = await Student.findAll();
      console.log('Updated student data:', updatedStudents);
      io.emit("students", { data: updatedStudents.map(student => student.toJSON()) });
    }, 5000); // Adjust polling interval as needed

    console.log("User connected");

  } catch (error) {
    console.error('Error setting up Sequelize:', error);
  }
});

httpServer.listen(8000, () => console.log("Server running on port 8000"));

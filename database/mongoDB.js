const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ljexam:LjExam@ljexam.vysc2ku.mongodb.net/',{
  writeConcern: {
    w: 'majority', 
  },
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;

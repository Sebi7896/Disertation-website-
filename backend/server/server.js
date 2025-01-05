const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const { json } = require('express');
const cookieParser = require('cookie-parser');
const {getAllStudents}= require('../database/models/Student.js');
const cronJob = require("../utils/cronJobToken");

//rute
const authRoute = require('../routes/login.js');
const logoutRoute = require('../routes/logout');
const refreshRoute = require('../routes/refresh_token');
const logoutAllRoute = require('../routes/logoutAll');

const app = express();
// Middleware
app.use(cors());
app.use(json());
app.use(cookieParser());  // Adaugă middleware-ul pentru cookie-uri

app.use('/auth', authRoute); 
app.use('/auth',logoutRoute);
app.use('/auth',refreshRoute); 
app.use('/auth',logoutAllRoute);
const port = 8000;
app.listen(port, () => {
  getAllStudents();
  console.log(`Server is running on http://localhost:${port}`);
});

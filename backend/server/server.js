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
const chooseTeacher = require('../routes/StudentRoutes/chooseTeacher.js');
const tokenData = require('../routes/tokenData.js');
const homePageTeacher = require("../routes/TeacherRoutes/requestsProfesor.js");
const cerere = require("../routes/StudentRoutes/cereriStudent.js");
const titleMsg = require("../routes/StudentRoutes/adaugaCerere.js");
const idStudentCerere = require("../routes/StudentRoutes/IdStudentCerere.js");
const statusProf = require("../routes/StudentRoutes/statusAcceptareProfesor.js");

const app = express();
// Middleware
app.use(cors());
app.use(json());
app.use(cookieParser());  // Adaugă middleware-ul pentru cookie-uri

app.use('/auth', authRoute); 
app.use('/auth',logoutRoute);
app.use('/auth',refreshRoute); 
app.use('/auth',logoutAllRoute);
app.use('/auth',chooseTeacher);
app.use('/',tokenData);
app.use("/auth",homePageTeacher);
app.use("/auth",cerere);
app.use("/auth",titleMsg);
app.use("/auth",idStudentCerere);
app.use("/auth",statusProf);

const port = 8000;
app.listen(port, () => {
  getAllStudents();
  console.log(`Server is running on http://localhost:${port}`);
});

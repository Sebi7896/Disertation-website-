const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const { json } = require('express');
const cookieParser = require('cookie-parser');
const cronJob = require("../utils/cronJobToken");

//rute
const authRoute = require('../routes/login.js');
const logoutRoute = require('../routes/logout');
const refreshRoute = require('../routes/refresh_token');
const logoutAllRoute = require('../routes/logoutAll');
const chooseTeacher = require('../routes/StudentRoutes/chooseTeacher.js');
const tokenData = require('../routes/tokenData.js');
const homePageTeacher = require("../routes/TeacherRoutes/getProfData.js");
const cerere = require("../routes/StudentRoutes/cereriStudent.js");
const titleMsg = require("../routes/StudentRoutes/adaugaCerere.js");
const statusProf = require("../routes/StudentRoutes/statusAcceptareProfesor.js");
const checkRequests = require("../routes/StudentRoutes/checkRequests.js");
const deleteRequest = require("../routes/TeacherRoutes/stergeCerere.js");
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
app.use("/auth",statusProf);
app.use("/auth",checkRequests);
app.use("/auth",deleteRequest);

const port = 8000;
app.listen(port,async () => {
  console.log(`Server is running on http://localhost:${port}`);
});

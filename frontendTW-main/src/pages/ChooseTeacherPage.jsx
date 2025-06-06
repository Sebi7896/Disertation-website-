import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './../styles/ChooseTeacherPage.css';
import './LoginPage';
import { studentNavigation } from './LoginPage';



function ChooseTeacherPage() {
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [token, setToken] = useState(null);
    const [teachers, setTeachers] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    const getTeachers = async () => {
        try {
            const response = await axios.post('http://localhost:8000/auth/chooseTeacher', {
              token: token
            }, config);
            setStudentName(response.data.student.prenume + ' ' + response.data.student.nume);
            setTeachers(response.data.teachers);
            if(response.status === 401){
              alert('Sesiunea a expirat');
              navigate('/auth');
            }
        } catch (error) {

        }
    };

    async function getCookies(){
        var accessToken = Cookies.get('accessToken');
        if(!accessToken){
          navigate('/auth');
        }
        setToken(accessToken);
    };

    useEffect(()=>{
        (async ()=> {
            await getCookies();
        })();
        return () =>{}
    }, []);

    async function setareUser(){
      try{
        const tokenData = await axios.post('http://localhost:8000/tokenData', {
            "accessToken": token
        });
        if(tokenData.status === 401){
          alert('Sesiunea a expirat');
          navigate('/auth');
        }
        setUserRole(tokenData.data.role);
      }
      catch(error){
          return;
      }
    }

    useEffect(()=>{
      function checkUser(){
        if(userRole !== 'student'){
          navigate('/auth');
        }
      }
      if(userRole){
        checkUser();
      }
    }, [userRole, navigate]);

    useEffect(() => {
      if (token) {
        setareUser();
        getTeachers();
      }
        
    }, [token]);


  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacherId(teacherId);
  };

  const handleSubmit =async () => {
    //de facut
    let role =await studentNavigation(token,navigate);
                if(role === '/cerereaprobata' || role ==='/paginafinalastudent'  ) {
                  navigate(role);
                  return;
                }
    if (selectedTeacherId) {
      Cookies.set('selectedTeacher', selectedTeacherId);
      navigate('/seteazatitlu');
    } else {
    }
  };

  return (
    <div className="center-container">
    <button className="back-button" onClick={() => navigate('/studenthome')}>Inapoi</button>
    <button className="next-button"onClick={handleSubmit}disabled={!selectedTeacherId}>Continuare</button>
      <div>
        <h1>Bine ai venit, {studentName}</h1>
        <p>Alege profesorul dorit pentru lucrarea de licenta!</p>
  
        {teachers && teachers.length > 0 ? (
          <ul className="teacher-list">
            {teachers.map((teacher) => (
              <li 
                key={teacher.id}
                className={`teacher-item ${teacher.id === selectedTeacherId ? 'selected' : ''}`}
              >
                <span className="teacher-name">{teacher.nume + ' ' + teacher.prenume}</span>
                <span className="teacher-students">Studenți disponibili: {teacher.remainingStudents}</span>
                <button 
                  onClick={() => handleTeacherSelect(teacher.id)} 
                  disabled={teacher.remainingStudents === 0} 
                  className={teacher.remainingStudents === 0 ? 'disabled-btn' : ''}
                >
                  Selecteaza
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nu sunt profesori valabili.</p>
        )}

          
        </div>
      </div>
  );
} 

export default ChooseTeacherPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./../styles/StudentHomePage.css";
import { studentNavigation } from "./LoginPage";


const StudentHomePage = () => {
  const navigate = useNavigate();
  const [numeStudent, setNumeStudent] = useState("Student");
  const [cereri, setCereri] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  function getTokenFromCookie() {
    try {
      var token = Cookies.get("accessToken");
      setAccessToken(token);
    } catch {
      navigate("/auth");
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (!accessToken) return;

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      try{
        const tokenData = await axios.post('http://localhost:8000/tokenData', {
            "accessToken": accessToken
        });
        setUserRole(tokenData.data.role);        
      }
      catch(error){
          return;
      }
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/cereriStudent",
          config
        );
        if(response.status === 401){
          alert('Sesiunea a expirat');
          navigate('/auth');
        }
        if (response.data && response.data.cereri) {
          setCereri(response.data.cereri);
          setNumeStudent(response.data.student.nume + ' ' + response.data.student.prenume);
        } else {
          setCereri([]);
        }
      } catch (error) {
        navigate("/auth");
      }
    }

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    getTokenFromCookie();
  }, []);

  const handleAddCerere =async () => {
    let role =await studentNavigation(accessToken,navigate);
    if(role === '/cerereaprobata' || role ==='/paginafinalastudent'  ) {
      navigate(role);
      return;
    }
    navigate("/ChooseTeacher");
  };

  const handleModifyCerere =async (id) => {
    let role =await studentNavigation(accessToken,navigate);
    if(role === '/cerereaprobata' || role ==='/paginafinalastudent'  ) {
      navigate(role);
      return;
    }

    Cookies.set('selectedCerere', id);
    navigate('/editcerere')
  };

  useEffect(()=>{
    function checkRole(){
      if(userRole != 'student'){
        navigate('/auth');
      }
    }
    if(userRole){
      checkRole();
    }
  }, [userRole]);

  async function handleDeleteCerere(id){
    let route = await studentNavigation(accessToken,navigate);
    if(route === '/cerereaprobata' || route === '/paginafinalastudent') {
      navigate(route);
      return;
    }  

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post('http://localhost:8000/auth/stergeCerere', {
        "idCerere": id
      }, config);
      if(response.status === 401){
        alert('Sesiunea a expirat');
        navigate('/auth');
      }
    }
    catch(error){

    }
    setCereri(prevCereri => prevCereri.filter(cerere => cerere.id !== id));
  };

  return (
    <div className="student-home">
      <button className="logout-button" onClick={() => navigate('/auth')}>Logout</button>
      <h1 className="student-home-title">Bine ai venit, {numeStudent}!</h1>
      <h2 className="student-home-requests-title">Lista cererilor tale:</h2>
      <ul className="student-home-requests-list">
        {cereri.length > 0 ? (
          cereri.map((cerere) => (
            <li key={cerere.id} className="student-home-request-item">
              <h3>{cerere.title}</h3>
              <p>{cerere.message.length>100? cerere.message.slice(0, 100)+'...' : cerere.message}</p>
              <p className="teacher-name">
                Profesor: <strong>{cerere.profesor?.nume + ' ' + cerere.profesor?.prenume || "N/A"}</strong>
              </p>
              <p className="request-status">
                Status: <strong>{cerere.status_acceptare_profesor || "Necunoscut"}</strong>
              </p>
              <div className="student-home-request-actions">
                <button
                  className="student-home-request-modify-btn"
                  onClick={() => handleModifyCerere(cerere.id)}
                >
                  Modifică
                </button>
                <button
                  className="student-home-request-delete-btn"
                  onClick={() => handleDeleteCerere(cerere.id)}
                >
                  Șterge
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="no-requests">Nu ai nicio cerere.</p>
        )}
      </ul>
      <button
        className="student-home-add-request-btn"
        onClick={handleAddCerere}
      >
        Adaugă cerere
      </button>
    </div>
  );
};

export default StudentHomePage;

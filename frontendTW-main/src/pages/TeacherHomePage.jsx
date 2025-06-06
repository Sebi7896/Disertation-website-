import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './../styles/ButoaneInapoiContinuare.css'
import './../styles/TeacherHomePage.css'
const TeacherHomePage = () => {
  const navigate = useNavigate();
  const [cereri, setCereri] = useState([]);
  const [cereriInAsteptare, setCereriInAsteptare] = useState([]);
  const [cereriAprobate, setCereriAprobate] = useState([]);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [nume, setNume] = useState("");
  const [remainingStudents, setRemainingStudents] = useState(null);
  const handleAproba = (id) => {

    async function apeleazaAproba() {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.put(
          'http://localhost:8000/auth/actualizeazaCerereStudent',
          { idCerere: id },
          config
        );
    
        if (response.status === 200) {
          setCereri(prevCereri => {
            const updatedCereri = prevCereri.map(cerere =>
              cerere.id === id
                ? { ...cerere, status_acceptare_profesor: 'aprobat' }
                : cerere
            );
            setCereriAprobate(updatedCereri.filter(c => c.status_acceptare_profesor !== 'pending'));
            setCereriInAsteptare(updatedCereri.filter(c => c.status_acceptare_profesor === 'pending'));
            setRemainingStudents(remainingStudents-1);
            return updatedCereri;
          });
        }

        if (response.status === 401) {
          alert('Sesiunea a expirat');
          navigate('/auth');
          return;
        }

        
      } catch (error) {
      }
    }
    
    if (token) {
      apeleazaAproba();
    }
  };
  
  async function handleDetalii(id){
    Cookies.set('idDetalii', id);
    navigate('/detaliicerere');
    }

    async function handleSterge(id) {
      async function apeleazaStergere() {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.post(
            'http://localhost:8000/auth/stergeCerere',
            { idCerere: id },
            config
          );
    
          if (response.status === 401) {
            alert('Sesiunea a expirat');
            navigate('/auth');
            return;
          }
    
          if (response.status === 200) {
            setCereri(prevCereri => prevCereri.filter(cerere => cerere.id !== id));
          }
        } catch (error) {
        }
      }
    
      if (token) {
        apeleazaStergere();
      }
    }

    useEffect(()=>{
      if(remainingStudents<1){
        setCereri(prevCereri => prevCereri.filter(cerere => cerere.status_acceptare_profesor !== 'pending'));
        setCereriInAsteptare([]);
      }
    }, [remainingStudents])

  useEffect(()=>{
    var accessToken = Cookies.get('accessToken');
    if(!accessToken){
      navigate('/auth');
    }
    setToken(accessToken);
  }, []);

  useEffect(()=>{
    if(userRole){
      function checkUser(){
        if(userRole !== 'professor'){
          navigate('/auth');
        }
      }
      if(userRole){
        checkUser();
      }
    }
  }, [userRole])

  async function fetchData() {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try{
      const response = await axios.get('http://localhost:8000/auth/getProfData', config);
      if(response.status === 401){
        alert('Sesiunea a expirat');
        navigate('/auth');
      }
      setCereri(response.data.cereri);
      setRemainingStudents(response.data.profesor.remainingStudents);
      setNume(response.data.profesor.nume + ' ' + response.data.profesor.prenume);
    }
    catch(error){

    }
    finally{

    }
  }

  useEffect(()=>{
    function setareCereriAprobate(){
      setCereriAprobate(cereri.filter(cerere => cerere.status_acceptare_profesor !== 'pending'));
    }

    function setareCereriInAsteptare(){
      setCereriInAsteptare(cereri.filter(cerere => cerere.status_acceptare_profesor === 'pending'));
    }
    if(cereri){
    setareCereriAprobate();
    setareCereriInAsteptare();
    }
  }, [cereri]);

  useEffect(()=>{
    async function setareUser(){
      try{
        const tokenData = await axios.post('http://localhost:8000/tokenData', {
            "accessToken": token
        });
        setUserRole(tokenData.data.role);
      }
      catch(error){
          return;
      }
    }
    if(token){
      setareUser();
      fetchData();
    }
  }, [token]);

  return (
    <div className="cereri-container">
      <button className="logout-button" onClick={() => navigate('/auth')}>Logout</button>
      <div className="cereri-lists">
        <div className="cereri-list">
          <h2>Studenți Aprobati</h2>
          <ul className="profesor-home-requests-list">
  {cereriAprobate.length > 0 ? (
    cereriAprobate.map((cerere) => (
      <li key={cerere.id} className="profesor-home-request-item">
        <div className="profesor-home-request-info">
          <h3>{cerere.title}</h3>
          <p>
            {cerere.message.length > 99
              ? cerere.message.slice(0, 100) + "..."
              : cerere.message}
          </p>
          <p className="student-name">
            Student: <strong>{cerere.student?.nume + ' ' + cerere.student?.prenume || "N/A"}</strong>
          </p>
        </div>
        <div className="profesor-home-request-actions">
          <button
            onClick={() => handleDetalii(cerere.id)}
            disabled={!cerere.signed_by_student}
            className={!cerere.signed_by_student ? "profesor-button-disabled" : ""}
          >
            {cerere.signed_by_student ? "Semneaza" : "Cererea nu a fost semnata de student"}
          </button>
        </div>
      </li>
    ))
  ) : (
    <p className="no-requests">Nu ai studenți aprobati.</p>
  )}
</ul>
        </div>
      </div>
      <div className="cereri-lists">
        <div className="cereri-list">
          <h2>{remainingStudents == 0 ? 'Nu mai poti aproba studenti!' : 'Studenți în Așteptare - Remaining Students: ' + remainingStudents}</h2>
          <ul className="profesor-home-requests-list">
            {cereriInAsteptare.length > 0 ? (
              cereriInAsteptare.map((cerere) => (
                <li key={cerere.id} className="profesor-home-request-item">
                  <div className="profesor-home-request-info">
                    <h3>{cerere.title}</h3>
                    <p>
                      {cerere.message.length > 99 
                        ? cerere.message.slice(0, 100) + "..." 
                        : cerere.message}
                    </p>
                    <p className="student-name">
                      Student: <strong>{cerere.student?.nume + ' ' + cerere.student?.prenume || "N/A"}</strong>
                    </p>
                  </div>
                  <div className="profesor-home-request-actions">
                    <button onClick={() => handleSterge(cerere.id)}>Sterge</button>
                    <button onClick={() => handleAproba(cerere.id)}>Aproba</button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-requests">{remainingStudents == 0 ? "" : "Nu ai studenți în așteptare."}</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './../styles/PaginaStudentFinala.css';
import { useNavigate } from 'react-router-dom';
const PdfDownloadPage = () => {
    const [numeProfesor, setNumeProfesor] = useState("");
    const [titluCerere, setTitluCerere] = useState("");
    const [numeStudent, setNumeStudent] = useState("");
    const [token, setToken] = useState("");
    const [idCerere, setIdCerere] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const navigate = useNavigate();
    

  function getCookies(){
    var accessToken = Cookies.get('accessToken');
    if(!accessToken){
        navigate('/auth');
    }
    setToken(accessToken);
  }

  async function handleDownload() {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'arraybuffer',
    };
  
    try {
      const response = await axios.post('http://localhost:8000/auth/getPdf', {
        "idCerere": idCerere
      }, config);
  
      if (response.status === 200) {
        setPdfData(response.data)
      }
    } catch (error) {
    }
  }

  useEffect(()=>{
    async function fetchData() {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        try {
          const response = await axios.get(
            "http://localhost:8000/auth/cereriStudent",
            config
          );
          if(response.status === 401){
            alert('Sesiunea a expirat');
            navigate('/auth');
          }
          var student = response.data.student;
          var cerere = response.data.cereri[0];
          var profesor = cerere.profesor;
          setNumeProfesor(profesor.nume + ' ' + profesor.prenume);
          setTitluCerere(cerere.title);
          setNumeStudent(student.nume + ' ' + student.prenume);
          setIdCerere(cerere.id);
        } 
        catch (error) {
        }
      }
      if(token){
        fetchData();
      }
  }, [token]);

useEffect(() => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [pdfData]);

  useEffect(()=>{
    getCookies();
  }, []);

  return (
    <div className="pdf-download-page-container">
      <div className="pdf-download-content">
        <h1>{titluCerere}</h1>
        <h1 className="pdf-download-title">
          Felicitari {numeStudent}, cererea ta a fost semnata de catre {numeProfesor}!
        </h1>
        <p className="pdf-download-subheader">Acum poti descarca cererea semnata in format PDF.</p>
        <button onClick={handleDownload} className="download-btn">
          Descarca PDF
        </button>
      </div>
    </div>
  );
};

export default PdfDownloadPage;
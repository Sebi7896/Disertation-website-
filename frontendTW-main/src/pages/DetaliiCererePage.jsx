import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './../styles/DetaliiCererePage.css';
import { studentNavigation } from "./LoginPage";
const DetaliiCererePage = () => {
  const [semnatStudent, setSemnatStudent] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [token, setToken] = useState(null);
  const [idCerere, setIdCerere] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');


  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      setUploadStatus('Please select a valid PDF file.');
      setSelectedFile(null);
    }
  };

  async function handleUpload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('idCerere', idCerere);
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('http://localhost:8000/auth/uploadPdfProfesor', formData, config);
      if (response.status === 200) {
        setUploadStatus('Upload successful!');
        navigate('/profesorhome');
      } else {
        setUploadStatus('Upload failed.');
      }
    } catch (error) {
      setUploadStatus('Error uploading file.');
    }
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
      if(response.status === 401){
        alert('Sesiunea a expirat');
        navigate('/auth');
      }
      if (response.status === 200) {
        setPdfData(response.data)
      }
    } catch (error) {
    }
  }

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

  async function getCookies (){
    let route = await studentNavigation(token,navigate);
    if(route === '/cerereaprobata' || route === '/paginafinalastudent') {
      navigate(route);
      return;
    }  

    var token = Cookies.get('accessToken');
    
    var idCerere = Cookies.get('idDetalii');
    if(!token){
      navigate('/auth');
    }
    if(!idCerere){
      navigate('/profesorhome');
    }
    setToken(token);
    setIdCerere(idCerere);
  }

  useEffect(()=>{
    async function fetchCerere(){
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
      try{
        const response = await axios.post('http://localhost:8000/auth/getRequestStats',{
          "idCerere": idCerere
        } ,config);
        if(response.status === 401){
          alert('Sesiunea a expirat');
          navigate('/auth');
        }
        setStudentName(response.data.student.nume + ' ' + response.data.student.prenume);
        setTitle(response.data.cerere.title);
        setMessage(response.data.cerere.message);
      }
      catch{

      }
    }
    if(token && idCerere){
      fetchCerere();
    }
  }, [token, idCerere])

  useEffect(()=>{
    getCookies();
  }, []);

  return (
    <div className="detalii-cerere-wrapper">
      <div className="detalii-cerere-container">
        <h1 className="detalii-cerere-title">{title}</h1>
        <p className="detalii-cerere-message">{message}</p>
        <h3 className="detalii-cerere-student-name">Student: {studentName}</h3>
  
        {semnatStudent && (
          <button
            className="detalii-cerere-download-btn"
            onClick={handleDownload}
          >
            Descarca Cererea Semnata de Student
          </button>
        )}
      </div>
      <div className="pdf-upload-container-teacher">
        <h2 className="pdf-upload-header-teacher">Incarca Cererea Semnata in Format PDF</h2>
        <input type="file" accept="application/pdf" className="pdf-upload-input-teacher" onChange={handleFileChange} />
        {selectedFile && <p className="pdf-upload-selected-file-teacher">Selected File: {selectedFile.name}</p>}
        <button onClick={handleUpload} disabled={!selectedFile} className="pdf-upload-button-teacher">
          Incarcare PDF
        </button>
        {uploadStatus && (
          <p className={`pdf-upload-status-teacher ${uploadStatus.includes('successful') ? 'pdf-upload-success' : 'pdf-upload-error'}`}>
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetaliiCererePage;

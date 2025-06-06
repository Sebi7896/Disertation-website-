import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './../styles/CerereAprobataPage.css'
import { use } from 'react';

const PdfUploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [token, setToken] = useState(null);
  const [numeProfesor, setNumeProfesor] = useState("");
  const [titluCerere, setTitluCerere] = useState("");
  const [semnat, setSemnat] = useState(false);
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
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('http://localhost:8000/auth/uploadPdfStudent', formData, config);

      if (response.status === 200) {
        setUploadStatus('Upload successful!');
        setSemnat(true);
      } else if(response.status === 401) {
        alert('Sesiunea a expriat');
        navigate('/auth');
      }
      else{
        setUploadStatus('Upload failed.');
      }
    } catch (error) {
      setUploadStatus('Error uploading file.');
    }
  }

  function getCookies() {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      navigate('/auth');
    }
    setToken(accessToken);
  }

  useEffect(() => {
    getCookies();
  }, []);

  useEffect(()=>{

    async function getData(){
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
      if(response.status === 401) {
        alert('Sesiunea a expriat');
        navigate('/auth');
      }
        var cerere = response.data.cereri[0];
        setNumeProfesor(cerere.profesor.nume + ' ' + cerere.profesor.prenume);
        setTitluCerere(cerere.title)
        setSemnat(cerere.signed_by_student);
      }
      catch(error){

      }
    }
    if(token){
      getData();
    }
  }, [token])

  return (
    <div className="pdf-upload-body">
      <header className="pdf-upload-header-container">
        <h1 className="pdf-upload-main-header">Felicitari, cererea ta a fost aprobata!</h1>
        <h3 className="pdf-upload-teacher">Profesor: {numeProfesor}</h3>
        <h2 className="pdf-upload-title">Cerere: {titluCerere}</h2>
        <p>{semnat ? "Cererea a fost incarcata cu succes. Daca este nevoie, poti incarca alta." : "Incarca cererea, si asteapta sa ca profesorul tau sa o semneze."}</p>
      </header>
      <div className="pdf-upload-container">
        <h2 className="pdf-upload-header">Incarca Cererea Semnata in Format PDF</h2>
        <input type="file" accept="application/pdf" className="pdf-upload-input" onChange={handleFileChange} />
        {selectedFile && <p className="pdf-upload-selected-file">Selected File: {selectedFile.name}</p>}
        <button onClick={handleUpload} disabled={!selectedFile} className="pdf-upload-button">
          Incarcare PDF
        </button>
        {uploadStatus && (
          <p className={`pdf-upload-status ${uploadStatus.includes('successful') ? 'pdf-upload-success' : 'pdf-upload-error'}`}>
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default PdfUploadPage;

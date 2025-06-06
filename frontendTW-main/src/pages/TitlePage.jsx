import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './../styles/TitlePage.css';

function deleteCookie(name, path = '/', domain = '') {
  const expires = 'Thu, 01 Jan 1970 00:00:00 UTC';
  let cookieString = `${name}=; expires=${expires}; path=${path};`;
  if (domain) {
    cookieString += ` domain=${domain};`;
  }
  document.cookie = cookieString;
}

function App() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState(null);
  const [idProfesor, setIdProfesor] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    var userID = null;
    var cerereID = null;
    const fetchData = async () => {     
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
          if(title.trim().length < 1){
            alert('Titlul este obligatoriu!');
            return;
          }
          if(title.trim().length < 3){
            alert('Titlul este prea scurt!');
            return;
          }
          if(description.trim().length < 1){
            alert('Descrierea este obligatorie!');
            return;
          }
          if(description.trim().length < 3){
            alert('Descrierea este prea scurta!');
            return;
          }
          try{
            const responsePut = await axios.put('http://localhost:8000/auth/adaugaCerere', {
              'idProfesor': idProfesor,
              'titlul': title,
              'mesaj': description,
            }, config);
            if(responsePut.status === 401){
              alert('Sesiunea a expirat');
              navigate('/auth');
            }
          }
          catch(error){
            alert('Deja ai trimis o cerere acestui profesor!');
          }
          finally{
            deleteCookie('selectedTeacher');
            navigate('/studenthome');
          }
    };
  
    if (token) {
      fetchData();
    }
  };

  async function getCookies(){
      var accessToken = Cookies.get('accessToken');
      var idProf = Cookies.get('selectedTeacher');
      if(!accessToken){
        navigate("/auth");
      }
      if(!idProf){
        navigate('/chooseteacher');
      }
      setIdProfesor(idProf);
      setToken(accessToken);
      return accessToken;
    }
  
    useEffect(()=>{
      getCookies();
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
      if(userRole)
      {
        if(userRole !== "student"){
        navigate('/auth');
        }
    }
    }, [userRole])

    useEffect(() => {
      if (token) {
        setareUser();
      }
    
    }, [token, idProfesor]);

  return (
    <div>
      <h2>Detalii Cerere</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label> Titlu: </label>
          <input
            type="text"
            placeholder="Alege titlul lucrării"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label> Descriere: </label>
          <textarea
            placeholder="Descrie lucrarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { studentNavigation } from "./LoginPage";
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
  const [userRole, setUserRole] = useState(null);
  const [idCerere, setIdCerere] = useState(null);
  async function handleSubmit(e){
    e.preventDefault();
    if (token) {
        let role =await studentNavigation(token,navigate);
            if(role === '/cerereaprobata' || role ==='/paginafinalastudent'  ) {
              navigate(role);
              return;
            }
        if(title.length == 0){
          alert('Lipseste titlul');
        }
        if(title.length < 4){
          alert('Titlul este prea scurt');
        }
        if(description.length == 0){
          alert('Lipseste descrierea');
        }
        if(description.length < 4){
          alert('Descrierea este prea scurta');
        }

        try{
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.put('http://localhost:8000/auth/actualizeazaTitlulMesaj', {
            "idCerere": idCerere,
            "titlul": title,
            "mesaj": description
          }, config);
          if(response.status === 401){
            alert('Sesiunea a expirat');
            deleteCookie('selectedCerere');
            navigate('/auth');
          }
          if(response.status === 200){
            navigate('/studenthome');
            deleteCookie('selectedCerere');
          }
        }
        catch(error){

        }
    }
  };

  async function getCookies(){
      var accessToken = Cookies.get('accessToken');
      var idCerere = Cookies.get('selectedCerere');
      if(!accessToken){
        navigate("/auth");
      }
      if(!idCerere){
        deleteCookie('selectedCerere');
        navigate('/studenthome');
      }
      setToken(accessToken);
      setIdCerere(idCerere);
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
          deleteCookie('selectedCerere');
          navigate('/auth');
        }
        setUserRole(tokenData.data.role);
      }
      catch(error){
          return;
      }
    }

    useEffect(()=>{
        async function fetchData(){
             try{
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
      
              const response = await axios.post('http://localhost:8000/auth/getCerere', {"idCerere": idCerere}, config);
              if(response.status === 401){
                alert('Sesiunea a expirat');
                deleteCookie('selectedCerere');
                navigate('/auth');
              }
              if(response.status === 200){
                setTitle(response.data.cerere.titlu)
                setDescription(response.data.cerere.mesaj);
              }
             }
             catch(error){
              
             }
        };
        if(token){
          setareUser();
          fetchData();
        }
    }, [token]);

    useEffect(() => {
      if(userRole){
        if(userRole !== 'student'){
          navigate('/auth');
        }
      }
    }, [userRole]);

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

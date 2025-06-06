import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChooseTeacherPage';
import './../styles/global.css';
import './../styles/LoginPage.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function deleteCookie(name, path = '/', domain = '') {
    const expires = 'Thu, 01 Jan 1970 00:00:00 UTC';
    let cookieString = `${name}=; expires=${expires}; path=${path};`;
      if (domain) {
      cookieString += ` domain=${domain};`;
    }
    document.cookie = cookieString;
  }

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [invalidCred, setInvalidCred] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [isAccepted, setIsAccepted] = useState(null);

    async function getCookies(){
        var accessToken = Cookies.get('accessToken');
        if(!accessToken){
            navigate('/auth');
        }
        setAccessToken(accessToken);
        return accessToken;
    }

    async function checkCookies(){
        var accessToken = await getCookies();
        try{
            const response = await axios.post('http://localhost:8000/tokenData', {
                "accessToken": accessToken
            });
            if(response.status === 401){
                alert('Sesiunea a expirat');
                navigate('/auth');
              }
            setUserRole(response.data.role);
            
        }
        catch(error){
            return;
        }
    };

    useEffect(()=>{
        (async ()=> {
            var accessToken = await getCookies();
            if(accessToken){
                setAccessToken('null');
                deleteCookie('accessToken');
                deleteCookie('selectedTeacher');
                setUserRole('');
                setIsAccepted(false);
            }
        })();
        return () =>{}
    }, []);
    useEffect(() => {
        (async () => {
            if (accessToken && userRole === 'student') {
                    let route = await studentNavigation(accessToken,navigate);
                    console.log(route);
                    navigate(route);
                }
                else if(accessToken && userRole == 'professor'){
                    navigate('/profesorhome');
                }
        })();
    }, [userRole, accessToken, isAccepted]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/auth/login', {
                "email": email,
                "password": password,
                "rememberToken": rememberMe
            });
            const token = response.data.accessToken;
            setAccessToken(token);

            if (token) {
            Cookies.set('accessToken', token, {
                expires: 1/24,
                secure: true,
                sameSite: 'None'
            });
        }
            checkCookies();
        } catch (err) {
            setInvalidCred(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
            {invalidCred && (
                <div className="error-message">
                    Invalid credentials. Please try again.
                </div>
                )}
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};


export default LoginPage;

export const studentNavigation = async (accessToken, navigate) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    try {
      const response = await axios.get('http://localhost:8000/auth/checkCerereStudent', config);
      if (response.status === 401) {
        alert('Sesiunea a expirat');
        navigate('/auth');
      } else if (response.status === 200) {
        const route = response.data.route;
        //navigate(route);
        //pentru ai fost aprobat
        return route;
      }
    } catch (error) {
      console.error('Error in studentNavigation:', error);
    }
  };

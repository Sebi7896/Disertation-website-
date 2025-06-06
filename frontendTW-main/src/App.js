import './App.css';
import LoginPage from './pages/LoginPage';
import ChooseTeacherPage from './pages/ChooseTeacherPage'
import TeacherHomePage from './pages/TeacherHomePage';
import TitlePage from './pages/TitlePage';
import StudentHomePage from './pages/StudentHomePage';
import EditCererePage from'./pages/EditCererePage';
import DetaliiCererePage from './pages/DetaliiCererePage'
import CerereAprobataPage from './pages/CerereAprobataPage.jsx';
import PaginaStudentFinala from './pages/PaginaStudentFinala.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginPage/>}></Route>
        <Route path="/chooseteacher" element={<ChooseTeacherPage/>}></Route>
        <Route path="/profesorhome" element={<TeacherHomePage/>}></Route>
        <Route path="/seteazatitlu" element={<TitlePage/>}></Route>
        <Route path="/studenthome" element={<StudentHomePage/>}></Route>
        <Route path="/editcerere" element={<EditCererePage/>}></Route>
        <Route path="/detaliicerere" element={<DetaliiCererePage/>}></Route>
        <Route path="/cerereaprobata" element={<CerereAprobataPage/>}></Route>
        <Route path='/paginafinalastudent' element={<PaginaStudentFinala/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;

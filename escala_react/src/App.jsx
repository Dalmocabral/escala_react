
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Schedule from './pages/Schedule';
import './App.css'

function App() {
  return (
    <Router>
      <div>        
        {/* Se desejar, adicione uma Navbar aqui */}
        
        <Routes>
          <Route path="escala_react/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

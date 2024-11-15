import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BallotIcon from '@mui/icons-material/Ballot';
import './Home.css'; // Importe o arquivo CSS

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Sistema de Escala de Operadores</h1>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<PeopleAltIcon />}
        onClick={() => navigate('escala_react/register')}
        className="home-button"
        style={{ marginBottom: '15px', width: '200px' }}
      >
        Cadastro
      </Button>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<BallotIcon />}
        onClick={() => navigate('escala_react/schedule')}
        className="home-button"
        style={{ width: '200px' }}
      >
        Escala
      </Button>

      <footer className="footer">
        <p>Sistema desenvolvido por Dalmo dos Santos Cabral - 20224/2025</p>
      </footer>
    </div>
  );
};

export default Home;

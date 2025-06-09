import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { database, ref, push, onValue, remove } from '../config/Firebase';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState('');
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    const colaboradoresRef = ref(database, 'colaboradores');
    onValue(colaboradoresRef, (snapshot) => {
      const data = snapshot.val();
      const listaColaboradores = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setColaboradores(listaColaboradores);
    });
  }, []);

  const handleRegister = () => {
    if (colaborador.trim() !== '') {
      const colaboradoresRef = ref(database, 'colaboradores');
      
      // Adiciona o novo colaborador com os campos adicionais
      push(colaboradoresRef, {
        nome: colaborador.trim(),
        dataCreated: new Date().toISOString(),  // Armazena a data atual no formato ISO
        afastado: false,                        // Valor padrão para o campo 'afastado'
        dataDispensa: new Date().toISOString(), // Inicialmente, sem data de dispensa
      });
      
      setColaborador('');
    } else {
      alert('Por favor, insira o nome do colaborador.');
    }
  };

  const handleDelete = (id) => {
    const colaboradorRef = ref(database, `colaboradores/${id}`);
    remove(colaboradorRef);
  };

  return (
    <div className="register-container">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Box sx={{ width: 300, maxWidth: '100%' }}>
          <TextField
            variant="filled"
            fullWidth
            label="Colaborador"
            value={colaborador}
            onChange={(e) => setColaborador(e.target.value)}
          />
        </Box>
        <Button variant="contained" className="register-button" onClick={handleRegister}>
          Registrar
        </Button>
      </Stack>
      <Divider></Divider>
      {/* Lista de Colaboradores */}
      <ul className="colaboradores-list">
        {colaboradores.map(({ id, nome }, index) => (
          <li key={id} className="colaborador-item">
            <span className="contador">{index + 1}.</span>
            <span className="nome-colaborador">{nome}</span>
            <IconButton
              aria-label="delete"
              size="large"
              color="error"
              onClick={() => handleDelete(id)}
              className="excluir-button"
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </li>
        ))}
      </ul>

      {/* Botão "Voltar para Home" centralizado na parte inferior */}
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate('/escala_react')}
        className="back-home-button"
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        Voltar para Home
      </Button>
    </div>
  );
};

export default Register;

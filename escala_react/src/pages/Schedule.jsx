import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { database, ref, onValue, update } from '../config/Firebase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMediaQuery } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Schedule = () => {
  const [colaboradores, setColaboradores] = useState([]);

  const isMobile = useMediaQuery('(max-width:600px)'); // Detectar telas menores que 600px

  // Recuperar colaboradores do Firebase
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

  // Atualizar estado do checkbox no Firebase
  const handleCheckboxChange = (id, isChecked) => {
    const colaboradorRef = ref(database, `colaboradores/${id}`);
    update(colaboradorRef, { afastado: isChecked });

    setColaboradores((prevColaboradores) =>
      prevColaboradores.map((col) =>
        col.id === id ? { ...col, afastado: isChecked } : col
      )
    );
  };

  // Atualizar data de dispensa no Firebase e reordenar
  const handleDispensado = (id) => {
    const colaboradorRef = ref(database, `colaboradores/${id}`);
    const novaDataDispensa = new Date().toISOString(); // Data atual no formato ISO
    update(colaboradorRef, { dataDispensa: novaDataDispensa });

    setColaboradores((prevColaboradores) =>
      prevColaboradores.map((col) =>
        col.id === id ? { ...col, dataDispensa: novaDataDispensa } : col
      )
    );
  };

  // Ordenar lista de colaboradores: "afastados" no final, ordenados por data de dispensa
  const colaboradoresOrdenados = [...colaboradores].sort((a, b) => {
    if (a.afastado !== b.afastado) return a.afastado ? 1 : -1;
    if (!a.dataDispensa || !b.dataDispensa) return a.dataDispensa ? -1 : 1;
    return new Date(a.dataDispensa) - new Date(b.dataDispensa);
  });

  // Função para copiar lista para o WhatsApp
  const copiarParaWhatsApp = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('pt-BR');
    let text = `*DISPENSA ATUALIZADA* ${formattedDate}\n\n`;

    colaboradoresOrdenados.forEach(({ nome, afastado }, index) => {
      if (!afastado) {
        text += `*${index + 1}* - _${nome}_\n`;
      }
    });

    // Copiar para a área de transferência
    navigator.clipboard.writeText(text).then(() => {
      alert('Texto copiado para a área de transferência');
    }).catch((err) => {
      console.error('Erro ao copiar texto: ', err);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Roboto' }}>Escala de Colaboradores</h1>

      {/* Tabela de Colaboradores */}
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: isMobile ? 300 : 650 }} aria-label="tabela colaboradores">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Afastado/Férias</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {colaboradoresOrdenados.map((colaborador, index) => (
                <TableRow
                  key={colaborador.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{colaborador.nome}</TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={colaborador.afastado || false}
                      onChange={(e) => handleCheckboxChange(colaborador.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDispensado(colaborador.id)}
                      size="small"
                    >
                      Dispensar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Botão para copiar a lista para o WhatsApp */}
      <Button
        variant="contained"
        color="success"
        endIcon={<WhatsAppIcon />}
        onClick={copiarParaWhatsApp}
        style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
          marginLeft: 'auto',  // Isto ajuda a garantir que o botão ocupe todo o espaço e se centralize
          marginRight: 'auto' // Centraliza o botão
        }}
      >
        Copiar para WhatsApp
      </Button>
    </div>
  );
};

export default Schedule;

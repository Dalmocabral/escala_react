import React, { useState, useEffect } from 'react';
import {
  useMediaQuery,
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { database, ref, onValue, update } from '../config/Firebase';
import { useNavigate } from 'react-router-dom';
import './Schedule.css';

const Schedule = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [ultimaAcao, setUltimaAcao] = useState(null); // 👈 Novo estado para desfazer
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    const colaboradoresRef = ref(database, 'colaboradores');
    const unsubscribe = onValue(colaboradoresRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setColaboradores(lista);
    });

    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (id, isChecked) => {
    const colaborador = colaboradores.find(col => col.id === id);

    setUltimaAcao({
      tipo: 'afastamento',
      id,
      valorAnterior: colaborador.afastado || false,
    });

    update(ref(database, `colaboradores/${id}`), { afastado: isChecked });

    setColaboradores((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, afastado: isChecked } : col
      )
    );
  };

  const handleDispensado = (id) => {
    const colaborador = colaboradores.find(col => col.id === id);
    const novaData = new Date().toISOString();

    setUltimaAcao({
      tipo: 'dispensa',
      id,
      valorAnterior: colaborador.dataDispensa || null,
    });

    update(ref(database, `colaboradores/${id}`), { dataDispensa: novaData });

    setColaboradores((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, dataDispensa: novaData } : col
      )
    );
  };

  const desfazerUltimaAcao = () => {
    if (!ultimaAcao) return;

    const { tipo, id, valorAnterior } = ultimaAcao;
    const colaboradorRef = ref(database, `colaboradores/${id}`);

    if (tipo === 'afastamento') {
      update(colaboradorRef, { afastado: valorAnterior });
      setColaboradores((prev) =>
        prev.map((col) =>
          col.id === id ? { ...col, afastado: valorAnterior } : col
        )
      );
    }

    if (tipo === 'dispensa') {
      update(colaboradorRef, { dataDispensa: valorAnterior });
      setColaboradores((prev) =>
        prev.map((col) =>
          col.id === id ? { ...col, dataDispensa: valorAnterior } : col
        )
      );
    }

    setUltimaAcao(null); // Limpa a ação após desfazer
  };

  const copiarParaWhatsApp = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    let texto = `*DISPENSA ATUALIZADA* ${dataAtual}\n\n`;

    colaboradoresOrdenados.forEach(({ nome, afastado }, idx) => {
      if (!afastado) texto += `*${idx + 1}* - _${nome}_\n`;
    });

    navigator.clipboard.writeText(texto)
      .then(() => alert('Texto copiado para a área de transferência'))
      .catch((err) => console.error('Erro ao copiar texto:', err));
  };

  const colaboradoresOrdenados = [...colaboradores].sort((a, b) => {
    if (a.afastado !== b.afastado) return a.afastado ? 1 : -1;
    if (!a.dataDispensa || !b.dataDispensa) return a.dataDispensa ? -1 : 1;
    return new Date(a.dataDispensa) - new Date(b.dataDispensa);
  });

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Escala de Operadores</h1>

      {/* Botão de Voltar */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/escala_react')}
        sx={{ marginBottom: 2 }}
      >
        Voltar à Página Principal
      </Button>

      {/* Tabela */}
      <Box className="schedule-table-container">
        <TableContainer component={Paper}>
          <Table
            className={isMobile ? 'schedule-table-small' : 'schedule-table'}
            size="small"
            aria-label="Tabela de colaboradores"
          >
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Afastado/Férias</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {colaboradoresOrdenados.map((col, index) => (
                <TableRow key={col.id} className="schedule-last-row">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{col.nome}</TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={col.afastado || false}
                      onChange={(e) =>
                        handleCheckboxChange(col.id, e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleDispensado(col.id)}
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

      {/* Botões */}
      <Box sx={{ marginTop: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          endIcon={<WhatsAppIcon />}
          onClick={copiarParaWhatsApp}
          className="copy-button"
        >
          Copiar para WhatsApp
        </Button>

        {ultimaAcao && (
          <Button
            variant="outlined"
            color="warning"
            onClick={desfazerUltimaAcao}
          >
            Desfazer ação
          </Button>
        )}
      </Box>
    </div>
  );
};

export default Schedule;

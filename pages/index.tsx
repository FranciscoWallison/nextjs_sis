import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import withAuth from '../hoc/withAuth';
import Image from 'next/image';

const Validador: React.FC = () => {
  const [loadingDots, setLoadingDots] = useState('');

  // Efeito para simular o carregamento dos "..."
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : '')); // Cicla entre '', '.', '..', '...'
    }, 500); // Altera a cada 500ms
    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Centraliza o conteúdo na tela
        flexDirection: 'column', // Para alinhar a imagem e o texto verticalmente
      }}
    >
      {/* Exibe a imagem utilizando next/image */}
      <Box sx={{ maxWidth: '200px', marginBottom: '20px' }}>
        <Image src="/gmp.png" alt="Imagem GMP" width={200} height={200} layout="responsive" />
      </Box>
      
      {/* Exibe o texto de carregamento com animação de "..." */}
      <Typography variant="h6" component="div">
        {loadingDots}
      </Typography>
    </Box>
  );
};

export default withAuth(Validador);

import React, { useState, useEffect } from "react";
import { Chip } from "@mui/material";
import { getStatus } from "@/utils/statusHelper"; // Supondo que a função getStatus está no utils

interface Activity {
  obrigatorio: string;
  Periodicidade: string;
  responsavel: string;
  id_name: string;
  responsavel_info: {
    telefone: string;
    nome: string;
    email: string;
  };
  atividade: string;
  titulo: string;
  id: number;
  data?: string; // Torna 'data' opcional
  category_id?: number; // Torna category_id opcional
}

const ActivityStatus: React.FC<{ activity: Activity }> = ({ activity }) => {
  const [dataStatus, setDataStatus] = useState<{ status: string; dueDate: Date | null }>({
    status: "Carregando...",
    dueDate: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const result = await getStatus(activity); // Aguarda a resolução da Promise
      setDataStatus(result);
    };

    fetchStatus();
  }, [activity]);

  const getColor = (status: string) => {
    switch (status) {
      case "Regular":
        return "success";
      case "A vencer":
        return "warning";
      case "Vencido":
        return "error";
      default:
        return "default";
    }
  };

  return <Chip label={dataStatus.status} color={getColor(dataStatus.status)} size="small" />;
};

export default ActivityStatus;

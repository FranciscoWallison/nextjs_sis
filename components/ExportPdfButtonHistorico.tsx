import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Importa o plugin diretamente
import { Button } from "@mui/material";
import { Activity } from "@/services/firebaseService";
import dayjs from "dayjs";

interface Block {
  id: string;
  name: string;
}

interface ExportPdfButtonProps {
  activities: Activity[];
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ activities }) => {
  const generatePdf = () => {
    const doc = new jsPDF();

    // Título do documento
    doc.setFontSize(18);
    doc.text("Relatório de Manutenção - Origem: Sistema de Atividades", 14, 20);

    // Data de geração
    doc.setFontSize(12);
    doc.text(`Data: ${dayjs().format("DD/MM/YYYY")}`, 14, 30);

    // Cabeçalhos da tabela
    const tableColumnHeaders = [
      "Título",
      "Responsável",
      "Atividade",
      "Periodicidade",
      "Data",
      "Blocos",
    ];

    // Dados da tabela com validações
    const tableRows = activities.map((activity) => [
      activity.updatedFields?.titulo || "Título Indisponível",
      activity.updatedFields?.responsavel || "Responsável Indisponível",
      activity.updatedFields?.atividade || "Atividade Indisponível",
      activity.updatedFields?.Periodicidade || "Periodicidade Indisponível",
      activity.updatedFields?.data
        ? dayjs(activity.updatedFields.data).format("DD/MM/YYYY")
        : "-",
      // Converte blocoIDs em nomes, se existirem
      activity.updatedFields?.blocoIDs
        ?.map((bloco: Block) => bloco.name)
        .join(", ") || "-"
    ]);

    // Configuração da tabela usando autoTable diretamente
    autoTable(doc, {
      startY: 40,
      head: [tableColumnHeaders],
      body: tableRows,
    });

    // Baixar o PDF
    doc.save("Relatorio_Manutencao.pdf");
  };

  return (
    <Button variant="contained" color="primary" onClick={generatePdf}>
      Exportar PDF
    </Button>
  );
};

export default ExportPdfButton;

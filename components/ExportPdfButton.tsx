import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Permite criar tabelas no PDF
import { Button } from "@mui/material";
import { Activity } from "@/services/firebaseService";
import dayjs from "dayjs";

interface ExportPdfButtonProps {
  activities: Activity[];
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ activities }) => {
  const generatePdf = () => {
    const doc = new jsPDF();

    // Título do documento
    doc.setFontSize(18);
    doc.text("Relatório de Manutenção", 14, 20);

    // Data de geração
    doc.setFontSize(12);
    doc.text(`Data: ${dayjs().format("DD/MM/YYYY")}`, 14, 30);

    // Cabeçalhos da tabela
    const tableColumnHeaders = [
      "Título",
      "Responsável",
      "Periodicidade",
      "Última Manutenção",
      "Próxima Manutenção",
      "Blocos",
      "Fornecedores",
    ];

    // Dados da tabela
    const tableRows = activities.map((activity) => [
      activity.titulo,
      activity.responsavel,
      activity.Periodicidade,
      activity.data ? dayjs(activity.data).format("DD/MM/YYYY") : "-",
      activity.dueDate || "-",
      activity.blocoIDs?.join(", ") || "-",
      activity.suppliers?.join(", ") || "-",
    ]);

    // Configuração da tabela
    doc.autoTable({
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

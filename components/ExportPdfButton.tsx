import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";
import dayjs from "dayjs";

// Importando o logotipo PNG
import logoPng from "@/public/logo.png"; // Ajuste o caminho para o arquivo PNG

interface Block {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  nome: string;
}

interface Activity {
  titulo: string;
  responsavel: string;
  data?: string;
  dueDate?: string;
  blocos?: Block[];
  suppliers?: Supplier[];
}

interface ExportPdfButtonProps {
  activities: Activity[];
  blocks: Block[];
  suppliers: Supplier[];
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  activities,
  blocks,
  suppliers,
}) => {
  const generatePdf = async () => {
    const doc = new jsPDF();
    doc.setFillColor(244, 244, 244);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    try {
      // Adiciona o logotipo PNG diretamente ao PDF
      doc.addImage("/logo.png", "PNG", 10, 10, 50, 15);
    } catch (error) {
      console.error("Erro ao adicionar o logotipo PNG:", error);
    }

    // Título do documento
    doc.setFontSize(18);
    doc.text("Relatório de Manutenção", 70, 20);

    // Data de geração
    doc.setFontSize(12);
    doc.text(`Data: ${dayjs().format("DD/MM/YYYY")}`, 14, 40);

    // Cabeçalhos da tabela
    const tableColumnHeaders = [
      "Título",
      "Responsável",
      "Última Manutenção",
      "Próxima Manutenção",
      "Blocos",
      "Fornecedores",
    ];

    // Dados da tabela
    const tableRows = activities.map((activity) => [
      activity.titulo,
      activity.responsavel,
      activity.data ? dayjs(activity.data).format("DD/MM/YYYY") : "-",
      activity.dueDate || "-",
      activity?.blocos?.map((block: Block) => block.name).join(", ") || "-",
      activity?.suppliers?.map((supplier: Supplier) => supplier.nome).join(", ") || "-",
    ]);

    autoTable(doc, {
      startY: 50,
      head: [tableColumnHeaders],
      body: tableRows,
    });

    doc.save("Relatorio_Manutencao.pdf");
  };

  return (
    <Button variant="contained" color="primary" onClick={generatePdf}>
      Exportar PDF
    </Button>
  );
};

export default ExportPdfButton;

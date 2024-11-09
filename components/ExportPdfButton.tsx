import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Importa o plugin diretamente para o TypeScript reconhecer
import { Button } from "@mui/material";
import { Activity } from "@/services/firebaseService";
import dayjs from "dayjs";

interface Block {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  nome: string;
}


interface ExportPdfButtonProps {
  activities: Activity[];
  blocks: Block[];
  suppliers: Supplier[];
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ activities, blocks, suppliers }) => {
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
      // "Periodicidade",
      "Última Manutenção",
      "Próxima Manutenção",
      "Blocos",
      "Fornecedores",
    ];

    // Dados da tabela
    const tableRows = activities.map((activity) => [
      activity.titulo,
      activity.responsavel,
      // activity.Periodicidade,
      activity.data ? dayjs(activity.data).format("DD/MM/YYYY") : "-",
      activity.dueDate || "-",
      activity?.blocos
        ?.map((block: Block) => block?.name || "Bloco Indisponível"
        )
        .join(", ") || "-",
        activity?.suppliers
        ?.map((supplierId: string | number) =>
          suppliers.find((supplier) => supplier.id === supplierId)?.nome || "Fornecedor Indisponível"
        )
        .join(", ") || "-",
    ]);

    // Configuração da tabela usando o método autoTable do plugin
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

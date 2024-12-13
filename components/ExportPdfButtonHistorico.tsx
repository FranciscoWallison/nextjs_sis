import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  activities,
  blocks,
  suppliers,
}) => {
  const generatePdf = async () => {
    const doc = new jsPDF();
    doc.setFillColor(244, 244, 244); // Cor RGB (244, 244, 244) equivalente ao var(--scrollbar-bg-color)
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F"); // "F" para preenchimento
    // Carregar a imagem local e adicionar ao PDF
    const imagePath = "./logo-gmp.svg"; // Caminho para a imagem local
    const loadImageToBase64 = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("Erro ao carregar a imagem."));
        img.src = url;
      });
    };

    try {
      const logoBase64 = await loadImageToBase64(imagePath);
      doc.addImage(logoBase64, "PNG", 10, 10, 50, 15); // Adiciona a logo ao PDF
    } catch (error) {
      console.error("Erro ao carregar a imagem da logo:", error);
    }

    // Título do documento
    doc.setFontSize(18);

    

    // Data de geração
    doc.setFontSize(12);
    doc.text(`Data: ${dayjs().format("DD/MM/YYYY")}`, 14, 40);

    // Cabeçalhos da tabela
    const tableColumnHeaders = [
      // "Título",
      "Periodicidade",
      "Data",
      "Blocos",
      "Fornecedor",
    ];

    // Dados da tabela com validações
    const tableRows = activities.map((activity) => {
      doc.text(activity.updatedFields?.titulo, 70, 20);
      return [
      // activity.updatedFields?.titulo || "Título Indisponível",
      activity.updatedFields?.Periodicidade || "Periodicidade Indisponível",
      activity.updatedFields?.data
        ? dayjs(activity.updatedFields.data).format("DD/MM/YYYY")
        : "-",
      activity.updatedFields?.blocoIDs
        ?.map((blockId: string | number) =>
          blocks.find((block) => block.id === blockId)?.name ||
          "Bloco Indisponível"
        )
        .join(", ") || "-",
      activity.updatedFields?.suppliers
        ?.map((supplierId: string | number) =>
          suppliers.find((supplier) => supplier.id === supplierId)?.nome ||
          "Fornecedor Indisponível"
        )
        .join(", ") || "-",
    ]});

    // Configuração da tabela usando autoTable diretamente
    autoTable(doc, {
      startY: 50, // Ajusta para começar após o título e a logo
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

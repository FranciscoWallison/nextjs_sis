import React from "react";
import jsPDF from "jspdf";
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
  statusData: Record<string, Activity>;
}

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  activities,
  blocks,
  suppliers,
  statusData,
}) => {
  const generatePdf = async () => {
    try {
      const doc = new jsPDF();

      // Define o fundo do PDF
      doc.setFillColor(244, 244, 244);
      doc.rect(
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight(),
        "F"
      );

      // Adiciona título e logo
      const logoPath = "/logo.png";
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
        const logoBase64 = await loadImageToBase64(logoPath);
        doc.addImage(logoBase64, "PNG", 10, 10, 50, 15);
      } catch (error) {
        console.error("Erro ao carregar a imagem da logo:", error);
      }

      // Pega a primeira chave do objeto
      const firstKey = Object.keys(statusData)[0];

      // Garante que a chave existe antes de acessar o objeto
      if (!firstKey) {
        throw new Error("Nenhum dado encontrado em statusData.");
      }

      // Pega o valor associado a essa chave
      const activityData = statusData[firstKey];
      const title = activityData.updatedFields?.titulo || "Título Indisponível";
      const dataUltima = activityData.updatedFields?.data
        ? dayjs(activityData.updatedFields.data).format("DD/MM/YYYY")
        : "-";

      doc.setFontSize(18);
      doc.text(title, 14, 40);
      doc.setFontSize(12);
      doc.text(`Última manutenção: ${dataUltima}`, 14, 50);
      doc.text(
        `Próxima manutenção: ${activityData.dueDate || "Não definida"}`,
        14,
        55
      );

      // Restante do código para gerar os cards...
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Erro ao gerar o PDF. Por favor, tente novamente.");
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={generatePdf}
      aria-label="Exportar relatório em PDF"
    >
      Exportar PDF
    </Button>
  );
};

export default ExportPdfButton;

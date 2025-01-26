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
  telefone?: string; // Adicionando campo telefone como opcional
  email?: string;    // Adicionando campo email como opcional
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
      const dataPeriodicidade = activityData.updatedFields?.Periodicidade || "Não disponível";
      const maxLineWidth = 180; // Defina a largura máxima do texto no documento (pode ajustar)


      doc.setFontSize(18);
      doc.text(title, 14, 40);
      doc.setFontSize(12);

      // Usa splitTextToSize para quebrar a linha em até 60 caracteres
      const wrappedText = doc.splitTextToSize(`Periodicidade: ${dataPeriodicidade}`, maxLineWidth);
      doc.text(wrappedText, 14, 50);

      doc.setFontSize(12);
      doc.text(`Última manutenção: ${dataUltima}`, 14, 65);
      doc.text(
        `Próxima manutenção: ${activityData.dueDate || "Não definida"}`,
        14,
        70
      );

      // Posição inicial para os cards
      let yPosition = 85;
      const pageHeight = doc.internal.pageSize.height;

      // Adicionando cards das atividades ao PDF
      activities.forEach((activity, index) => {
        const updatedFields = activity.updatedFields || {};
        const periodicidade = updatedFields.Periodicidade || "Periodicidade Indisponível";
        const data = updatedFields.data ? dayjs(updatedFields.data).format("DD/MM/YYYY") : "-";

        // Processamento dos blocos - exibir apenas nomes se existirem
        const blocos =
          updatedFields.blocoIDs?.map((blockId: string | number) => {
            const blocoObj = blocks.find((block) => block.id === blockId);
            return blocoObj ? blocoObj.name : "Bloco Indisponível";
          }).filter(Boolean) || [];  // Filtra valores vazios ou undefined

        // Processamento dos fornecedores - exibir telefone, nome e email se existirem
        const fornecedores =
          updatedFields.suppliers?.map((supplierId: string | number) => {
            const supplierObj = suppliers.find((supplier) => supplier.id === supplierId);
            return supplierObj
              ? {
                nome: supplierObj?.nome || "Nome Indisponível",
                telefone: supplierObj?.telefone || "Telefone Indisponível",
                email: supplierObj?.email || "Email Indisponível",
              }
              : { nome: "Fornecedor Indisponível", telefone: "-", email: "-" };
          }).filter(Boolean) || [];  // Filtra valores vazios ou undefined

        // Verifica se ainda há espaço na página, senão pula para a próxima
        if (yPosition + 50 > pageHeight) {
          doc.addPage();
          yPosition = 20; // Reinicia no topo da nova página
        }

        // Desenha o card com cor e bordas
        doc.setDrawColor(0, 0, 0); // Cor da borda (preto)
        doc.setLineWidth(0.5); // Espessura da borda
        doc.setFillColor(255, 255, 255); // Fundo branco do card
        doc.roundedRect(10, yPosition, 190, 40, 3, 3, "FD"); // Card com bordas arredondadas

        // Adiciona os textos no card
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`#${index + 1} Data da manutenção  -  ${data}`, 14, yPosition + 5);

        doc.setTextColor(100, 100, 100); // Cor secundária para textos

        // Exibir blocos apenas se houver dados
        if (blocos.length > 0) {
          doc.text(`Blocos: ${blocos.join(", ")}`, 14, yPosition + 18);
        } else {
          doc.text(`Blocos: Nenhum bloco associado`, 14, yPosition + 18);
        }

        // Exibir fornecedores apenas se houver dados
        if (fornecedores.length > 0) {
          fornecedores.forEach(
            (fornecedor: { nome: string; telefone?: string; email?: string }, idx: number) => {
              doc.text(
                `Fornecedor ${idx + 1}: ${fornecedor.nome}, Tel: ${fornecedor.telefone || "Telefone Indisponível"
                }, Email: ${fornecedor.email || "Email Indisponível"}`,
                14,
                yPosition + 24 + idx * 6
              );
            }
          );
        } else {
          doc.text(`Fornecedores: Nenhum fornecedor associado`, 14, yPosition + 24);
        }

        console.log(blocos);
        console.log(fornecedores);

        // Incrementa a posição vertical para o próximo card
        yPosition += 50;
      });

      // Salva o PDF
      doc.save("Relatorio_Manutencao.pdf");

      console.log("PDF gerado com sucesso!");
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

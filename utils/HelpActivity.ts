import { getStatus } from "@/utils/statusHelper";
import { Activity } from "@/services/firebaseService";

class HelpActivity {
  static formatDateToDDMMYYYY = async (activity: Activity): Promise<string> => {
    const dataStatus = await getStatus(activity); // Aguarda a resolução da Promise

    if (!dataStatus.dueDate) {
      return "";
    }

    const date = new Date(dataStatus.dueDate);
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }
    console.log('======formatDateToDDMMYYYY==========');
    console.log(date);
    console.log('====================================');

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  static formatDate = (input: string | undefined) => {
    if (!input) return "";

    // Verifica se a data já está no formato dd/mm/yyyy
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(input)) {
      return input; // Já está no formato correto
    }

    // Caso contrário, reformata a data no formato dd/mm/yyyy
    const [year, month, day] = input.split("-");
    return `${day}/${month}/${year}`;
  };

  static formatDateToISO = (input: string | undefined) => {
    if (!input) return "";

    // Expressão regular para validar se a data já está no formato yyyy-mm-dd
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(input)) {
      return input; // Já está no formato correto
    }

    // Tentativa de formatar a data para yyyy-mm-dd se estiver em outro formato
    // Aqui assumimos que a data pode estar em formato dd/mm/yyyy
    const dateParts = input.split(/[\/\-\.]/); // Divide a string em qualquer delimitador comum (/, -, .)

    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      if (year.length === 4 && month.length === 2 && day.length === 2) {
        return `${year}-${month}-${day}`; // Retorna no formato yyyy-mm-dd
      }
    }

    return ""; // Retorna vazio se não for possível validar ou converter
  };
}

export default HelpActivity;

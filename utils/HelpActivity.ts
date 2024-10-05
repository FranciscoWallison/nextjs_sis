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

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };
}

export default HelpActivity;

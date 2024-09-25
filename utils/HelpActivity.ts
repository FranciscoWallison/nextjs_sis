import { getStatus } from "@/utils/statusHelper";
import { Activity } from "@/services/firebaseService";
class HelpActivity {
  static formatDateToDDMMYYYY = (activity: Activity): string => {
    const dataStatus = getStatus(activity);

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

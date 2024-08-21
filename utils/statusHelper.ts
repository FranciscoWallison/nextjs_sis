import { add, differenceInDays, isValid, parseISO } from "date-fns";
import { Activity } from "@/services/firebaseService";

const calculateNextDate = (startDate: string, periodicity: string) => {
  if (startDate === "") {
    return null;
  }

  const date = parseISO(startDate); // Converte a string diretamente para uma data, mantendo a interpretação correta

  switch (periodicity) {
    case "A cada semana":
      return add(date, { weeks: 1 });
    case "A cada duas semanas":
      return add(date, { weeks: 2 });
    case "A cada 15 dias":
      return add(date, { days: 15 });
    case "A cada mês":
      return add(date, { months: 1 });
    case "A cada dois meses":
      return add(date, { months: 2 });
    case "A cada três meses":
      return add(date, { months: 3 });
    case "A cada seis meses":
      return add(date, { months: 6 });
    case "A cada ano":
      return add(date, { years: 1 });
    case "A cada dois anos":
      return add(date, { years: 2 });
    case "A cada três anos":
      return add(date, { years: 3 });
    case "A cada cinco anos":
      return add(date, { years: 5 });
    default:
      return null;
  }
};

// Função que determina o status com base na data e periodicidade
export const getStatus = (activity: Activity) => {
  if (!activity.data) return "Desconhecido"; // Lidar com data indefinida

  const today = new Date();
  const nextDate = calculateNextDate(activity.data, activity.Periodicidade);

  if (!nextDate || !isValid(nextDate)) return "Desconhecido";

  const daysDifference = differenceInDays(nextDate, today);

  if (daysDifference > 7) return "Regular";
  if (daysDifference <= 7 && daysDifference >= 0) return "A vencer";
  return "Vencido";
};

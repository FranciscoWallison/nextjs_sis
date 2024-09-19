import { add, differenceInDays, isValid, parseISO } from "date-fns";
import { Activity } from "@/services/firebaseService";

// Função para calcular a próxima data com base na data de início e na periodicidade
const calculateNextDate = (startDate: string, periodicity: string) => {
  if (startDate === "") {
    return null;
  }

  const date = parseISO(startDate);
  console.log('====================================');
  console.log(startDate);
  console.log('====================================');
  if (!isValid(date)) {
    return null; // Retorna null se a data não for válida
  }

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

// Função para determinar o status e a data de vencimento
export const getStatus = (
  activity: Activity
): { status: string; dueDate: Date | null } => {
  if (activity.activityRegular && activity.Periodicidade === "Não aplicável") {
    return { status: "Regular", dueDate: null };
  } if (!activity.activityRegular && activity.Periodicidade === "Não aplicável"){
    return { status: "Não Regularizado", dueDate: null };
  } // Lida com data indefinida

  if (!activity.data) return { status: "Data não cadastrada", dueDate: null }; // Lida com data indefinida

  const today = new Date();
  const nextDate = calculateNextDate(activity.data, activity.Periodicidade);

  if (!nextDate || !isValid(nextDate))
    return { status: "Data não cadastrada", dueDate: null };

  const daysDifference = differenceInDays(nextDate, today);

  if (daysDifference > 7) return { status: "Regular", dueDate: nextDate };
  if (daysDifference <= 7 && daysDifference >= 0)
    return { status: "A vencer", dueDate: nextDate };
  return { status: "Vencido", dueDate: nextDate };
};

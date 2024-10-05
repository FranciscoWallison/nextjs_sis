import {
  add,
  differenceInDays,
  isValid,
  parseISO,
  differenceInYears,
} from "date-fns";
import { Activity } from "@/services/firebaseService";
import AuthStorage from "@/utils/AuthStorage";
import { FirebaseUser } from "@/interface/FirebaseUser";
import { pegarUsuarioPeriodicidades } from "@/services/firebaseService";
// Função para calcular a próxima data com base na data de início e na periodicidade
const calculateNextDate = (
  startDate: string,
  periodicity: string,
  buildingAge: number | null
) => {
  if (startDate === "") {
    return null;
  }

  const date = parseISO(startDate);
  if (!isValid(date)) {
    return null; // Retorna null se a data não for válida
  }

  // Caso de periodicidade dependente da idade do edifício
  if (
    periodicity.includes(
      "A cada 5 anos para edifícios de até 10 anos de entrega, A cada 3 anos para"
    )
  ) {
    if (buildingAge !== null) {
      if (buildingAge <= 10) {
        return add(date, { years: 5 }); // Retorna a data após 5 anos
      } else if (buildingAge >= 11 && buildingAge <= 30) {
        return add(date, { years: 3 }); // Retorna a data após 3 anos
      } else if (buildingAge > 30) {
        return add(date, { years: 1 }); // Retorna a data após 1 ano
      }
    }
    return null;
  }

  // Outras periodicidades
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
export const getStatus = async (
  activity: Activity
): Promise<{ status: string; dueDate: Date | null }> => {
  const user: FirebaseUser | null = AuthStorage.getUser();

  // Verifica se o usuário existe e se os dados do usuário estão disponíveis
  let responseP = user ? user.data_user : null;

  if (!responseP) {
    // Se responseP for null, tenta buscar os dados do usuário com o uid
    responseP = await pegarUsuarioPeriodicidades(user?.uid);

    // Se ainda assim não encontrar os dados, retorna um status apropriado
    if (!responseP) {
      return { status: "Dados do usuário não encontrados", dueDate: null };
    }
  }

  // Verifica a idade do edifício
  const buildingDeliveryDate = parseISO(responseP.buildingAge);
  const today = new Date();

  const buildingAge = isValid(buildingDeliveryDate)
    ? differenceInYears(today, buildingDeliveryDate)
    : null;

  if (activity.activityRegular && activity.Periodicidade === "Não aplicável") {
    return { status: "Regular", dueDate: null };
  }

  if (!activity.activityRegular && activity.Periodicidade === "Não aplicável") {
    return { status: "Não Regularizado", dueDate: null };
  }

  if (!activity.data) return { status: "Data não cadastrada", dueDate: null };

  const nextDate = calculateNextDate(
    activity.data,
    activity.Periodicidade,
    buildingAge
  );

  if (!nextDate || !isValid(nextDate))
    return { status: "Data não cadastrada", dueDate: null };

  const daysDifference = differenceInDays(nextDate, today);

  if (daysDifference > 7) return { status: "Regular", dueDate: nextDate };
  if (daysDifference <= 7 && daysDifference >= 0)
    return { status: "A vencer", dueDate: nextDate };

  return { status: "Vencido", dueDate: nextDate };
};

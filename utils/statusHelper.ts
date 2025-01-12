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
import HelpActivity from "@/utils/HelpActivity";

// Defina as interfaces
interface PeriodicidadeResponse {
  questions: Activity[];
  buildingAge?: string;
  buildingName?: string;
  bairro?: string;
  address?: string;
  firstName?: string;
  cidade?: string;
  lastName?: string;
  spda?: string | boolean; // Permitir que spda seja string ou boolean
  spda_para_raios?: string | boolean;
  uf?: string;
}

interface BuildingData {
  buildingAge: string;
  buildingName: string;
  bairro: string;
  address: string;
  firstName: string;
  cidade: string;
  lastName: string;
  spda: string;
  spda_para_raios: string;
  uf: string;
}

// Tipo combinado que unifica PeriodicidadeResponse e BuildingData
type CombinedData = PeriodicidadeResponse;

// Função para calcular a próxima data com base na data de início e na periodicidade
const calculateNextDate = (
  startDate: string,
  periodicity: string,
  buildingAge: number | null
) => {
  if (startDate === "") {
    return null;
  }
  const dateValid = HelpActivity.formatDateToISO(startDate);

  const date = parseISO(dateValid);

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
    case "A cada 2 semanas":
      return add(date, { weeks: 2 });
    case "A cada 15 dias":
      return add(date, { days: 15 });
    case "A cada 1 mês":
      return add(date, { months: 1 });
    case "A cada 2 meses":
      return add(date, { months: 2 });
    case "A cada 3 meses":
      return add(date, { months: 3 });
    case "A cada 6 meses":
      return add(date, { months: 6 });
    case "A cada 1 ano":
      return add(date, { years: 1 });
    case "A cada 2 anos":
      return add(date, { years: 2 });
    case "A cada 3 anos":
      return add(date, { years: 3 });
    case "A cada 5 anos":
      return add(date, { years: 5 });
    default:
      return null; // Valor não aplicável
  }
};

// Função para determinar o status e a data de vencimento
export const getStatus = async (
  activity: Activity
): Promise<{ status: string; dueDate: Date | null }> => {
  const user: FirebaseUser | null = AuthStorage.getUser();

  // Verifica se o usuário existe e se os dados do usuário estão disponíveis
  let responseP: PeriodicidadeResponse | null = null;

  if (user?.data_user && "questions" in user.data_user) {
    // Converte `user.data_user` para `PeriodicidadeResponse`, convertendo booleanos para strings quando necessário
    const dataUser = user.data_user as unknown as Record<string, unknown>;

    responseP = {
      ...dataUser,
      spda:
        typeof dataUser.spda === "boolean"
          ? dataUser.spda
            ? "true"
            : "false"
          : dataUser.spda,
      spda_para_raios:
        typeof dataUser.spda_para_raios === "boolean"
          ? dataUser.spda_para_raios
            ? "true"
            : "false"
          : dataUser.spda_para_raios,
    } as PeriodicidadeResponse;
  }

  if (!responseP) {
    // Se responseP for null, tenta buscar os dados do usuário com o uid
    responseP = await pegarUsuarioPeriodicidades(user?.uid);

    // Se ainda assim não encontrar os dados, retorna um status apropriado
    if (!responseP) {
      return { status: "Dados do usuário não encontrados", dueDate: null };
    }
  }
  // Verifica a idade do edifício e combina dados do edifício se necessário
  const buildingData: BuildingData = {
    buildingAge: responseP?.buildingAge || "2020-01-01",
    buildingName: responseP?.buildingName || "Nome Padrão",
    bairro: responseP?.bairro || "Bairro Padrão",
    address: responseP?.address || "Endereço Padrão",
    firstName: responseP?.firstName || "Primeiro Nome",
    lastName: responseP?.lastName || "Último Nome",
    cidade: responseP?.cidade || "Cidade Padrão",
    spda:
      typeof responseP.spda === "boolean"
        ? responseP.spda
          ? "true"
          : "false"
        : responseP.spda || "SPDA Padrão",
    spda_para_raios:
      typeof responseP.spda_para_raios === "boolean"
        ? responseP.spda_para_raios
          ? "true"
          : "false"
        : responseP.spda_para_raios || "SPDA para Raios Padrão",
    uf: responseP?.uf || "UF Padrão",
  };

  // Combina responseP com os dados do edifício
  const combinedData: CombinedData = {
    ...responseP,
    ...buildingData, // Adiciona ou sobrescreve com os dados do edifício
  };

  const buildingDeliveryDate = combinedData.buildingAge
    ? parseISO(combinedData.buildingAge)
    : new Date("2020-01-01"); // Define uma data padrão caso buildingAge seja undefined

  const today = new Date();

  const buildingAge = isValid(buildingDeliveryDate)
    ? differenceInYears(today, buildingDeliveryDate)
    : null;

  if (
    activity?.nao_feito &&
    activity?.neverDone &&
    activity?.data === "0000-00-00"
  ) {
    return { status: "Vencido", dueDate: null };
  }

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

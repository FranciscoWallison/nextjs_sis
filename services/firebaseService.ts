// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import AuthStorage from "@/utils/AuthStorage";
import { LoginData } from "@/interface/Login";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  getFirestore,
  Timestamp,
  query,
  where,
  orderBy,
  // "@firebase/firestore";
} from "firebase/firestore";

import { FirebaseUser } from "@/interface/FirebaseUser";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAJXhhTYScTaOFUjeKWJ3yMcB7sbmknHrw",
  authDomain: "manut-mais-inteligente.firebaseapp.com",
  databaseURL: "https://manut-mais-inteligente-default-rtdb.firebaseio.com",
  projectId: "manut-mais-inteligente",
  storageBucket: "manut-mais-inteligente.appspot.com",
  messagingSenderId: "1077928484057",
  appId: "1:1077928484057:web:237e84101bffdac463b2c8",
  measurementId: "G-2JCT8W4KGM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const CriarUsuario = async (data: LoginData): Promise<boolean> => {
  const auth = getAuth(app);

  return await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => true)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return false;
    });
};

export const Login = async (data: LoginData): Promise<boolean> => {
  const auth = getAuth(app);

  try {
    // Faz o login do usuário
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // Obtenha os dados de periodicidade do usuário
    const dataUser = await pegarUsuarioPeriodicidades(user.uid);

    // Adicione o campo data_user ao objeto user
    const userWithFullData = {
      ...user, // Mantém os dados existentes
      data_user: dataUser, // Adiciona o campo data_user
    };

    // Armazena o objeto completo no AuthStorage (localStorage)
    AuthStorage.setUser(userWithFullData);

    return true;
  } catch (error) {
    console.error("Erro no login:", error);
    return false;
  }
};

export const ObservadorEstado = async (): Promise<boolean> => {
  const auth = getAuth();

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

export const validaUsuarioForm = async (): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      return false;
    }
    const db = getFirestore(app);

    const return_infor = doc(db, "cliente", user.uid);
    const infor = await getDoc(return_infor);

    if (infor.data() === undefined) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("====================================");
    console.log("validaUsuarioForm", error);
    console.log("====================================");
    return false;
  }
  return false;
};

// Interface para o tipo Block
export interface Block {
  id: string;
  name: string;
  userId: string;
}

export interface ResponsibleInfo {
  nome: string;
  telefone: string;
  email: string;
}

export interface Activity {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
  category_id?: number;
  blocoIDs?: string[]; // Adicionando blocoIDs ao tipo, permitindo que seja opcional
  activityRegular?: boolean; // Adicionando activityRegular como opcional
  status?: string;
  dueDate?: string;
  updatedFields?: any;
  blocos?: any[];
  suppliers?: any[];
}

export interface CategoryData {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
  category_id?: number;
  blocoIDs?: string[]; // Adicione a propriedade blocoIDs aqui se ela deveria existir
}

export interface PeriodicidadeResponse {
  userId: string; // O ID do usuário associado a esta resposta
  questions: Activity[]; // Array de atividades do tipo 'Activity'
  lastUpdate?: string; // Opcional: Data da última atualização
}

export const pegarUsuarioPeriodicidades = async (
  uid?: string // uid é opcional
): Promise<PeriodicidadeResponse | null> => {
  try {
    // Se o uid não for passado como parâmetro, obtém o usuário do AuthStorage
    if (!uid) {
      const user: FirebaseUser | null = AuthStorage.getUser();
      if (!user || !user.uid) {
        return null; // Se não encontrar o usuário ou uid, retorna null
      }
      uid = user.uid; // Usa o uid do usuário autenticado
    }

    // Conexão com o Firestore
    const db = getFirestore(app);
    const docRef = doc(db, "cliente", uid); // Usa o uid fornecido ou do AuthStorage
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null; // Se o documento não existir, retorna null
    }

    const data = docSnap.data() as PeriodicidadeResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("permissions")) {
        return null;
      }
      console.error("pegarUsuarioPeriodicidades error", error);
    } else {
      console.error("Erro desconhecido", error);
    }
    throw error;
  }
};

export const usuarioPeriodicidadesAtualizar = async (
  updatedActivity: Activity
): Promise<boolean> => {
  try {
    // Obter os dados atuais do usuário
    const data = await pegarUsuarioPeriodicidades();
    if (data === null) {
      return false;
    }

    // Verificar se a atividade já existe na lista
    const activityExists = data.questions.some(
      (activity: Activity) => activity.id === updatedActivity.id
    );

    let updatedData;

    if (activityExists) {
      // Se a atividade já existe, atualiza ela
      updatedData = data.questions.map((activity: Activity) =>
        activity.id === updatedActivity.id
          ? { ...activity, ...updatedActivity } // Atualiza a atividade correspondente
          : activity
      );
    } else {
      // Se a atividade não existe, adiciona ela à lista
      updatedData = [...data.questions, updatedActivity];
    }

    // Substituir as atividades no objeto data
    data.questions = updatedData;

    // Salvar os dados atualizados no servidor
    await salvarNovo(data);
    await registrarHistoricoManutencao(updatedActivity);

    return true;
  } catch (error) {
    console.error("Erro em usuarioPeriodicidadesAtualizar:", error);
    return false;
  }
};

export const usuarioPeriodicidadesAdicionar = async (
  updatedActivity: any
): Promise<boolean> => {
  try {
    // Obter as periodicidades do usuário
    const data = await pegarUsuarioPeriodicidades();

    if (data === null) {
      return false;
    }

    // Atividades existentes
    const questions = data.questions;

    // Cria um conjunto de IDs para verificar quais atividades já existem
    const idsInQuestions = new Set(questions.map((q) => q.id));

    // Encontra o maior ID existente em 'questions'
    const maxId = Math.max(...questions.map((q) => q.id), 0); // Garante que o mínimo seja 0 se não houver atividades

    // Filtra as atividades que não estão em 'questions' e gera novo ID se id === 0
    const uniqueInUpdatedActivity = updatedActivity
      .map((activity: any) => {
        if (activity.id === 0) {
          // Se o id for 0, gera um novo id baseado no maior ID existente
          return { ...activity, id: maxId + 1 };
        }
        return activity;
      })
      .filter((activity: any) => !idsInQuestions.has(activity.id));

    if (uniqueInUpdatedActivity.length === 0) {
      console.log("Nenhuma nova atividade para adicionar.");
      return false; // Retorna falso se não houver novas atividades
    }

    // Adiciona as novas atividades ao array 'questions'
    data.questions = [...questions, ...uniqueInUpdatedActivity];

    console.log("Adicionando atividades:", uniqueInUpdatedActivity);

    // Salvar os dados atualizados
    await salvarNovo(data);

    // Registrar o histórico da primeira nova atividade (se houver mais de uma)
    await registrarHistoricoManutencao(uniqueInUpdatedActivity[0]);

    return true;
  } catch (error) {
    console.log("Erro em usuarioPeriodicidadesAdicionar:", error);
    return false;
  }
};

export const salvarNovo = async (data: any): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      return false;
    }

    console.log("Dados recebidos para salvarNovo:", data);
    console.log("Tipo de data:", typeof data);
    console.log("É array?", Array.isArray(data));

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Data must be a valid object");
    }

    const db = getFirestore(app);
    await setDoc(doc(db, "cliente", user.uid), data);

    return await validaUsuarioForm();
  } catch (error) {
    console.log("============salvarNovo ERRO================");
    console.error(error);
    console.log("====================================");
  }
  return false;
};

// Função para buscar blocos do usuário autenticado
export const fetchBlocks = async (): Promise<Block[] | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) {
    // Usuário não autenticado
    return null;
  }

  const db = getFirestore(app);
  const blocksCollection = collection(db, "bloco");
  // Busca apenas os blocos do usuário autenticado
  const blocksQuery = query(blocksCollection, where("userId", "==", user.uid));
  const blocksSnapshot = await getDocs(blocksQuery);
  const blocksList = blocksSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Block[];
  return blocksList;
};

// Função para adicionar um novo bloco ao Firestore com o id do usuário
export const addBlock = async (blockName: string): Promise<Block | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) {
    // Usuário não autenticado
    return null;
  }

  const db = getFirestore(app);
  const newBlockRef = await addDoc(collection(db, "bloco"), {
    name: blockName,
    userId: user.uid, // Adiciona o ID do usuário ao bloco
  });
  return { id: newBlockRef.id, name: blockName, userId: user.uid };
};

// Função para atualizar um bloco existente no Firestore associado ao usuário
export const updateBlock = async (
  blockId: string,
  blockName: string
): Promise<void | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) {
    // Usuário não autenticado
    return null;
  }

  const db = getFirestore(app);
  const blockRef = doc(db, "bloco", blockId);

  // Atualiza apenas o nome do bloco, sem modificar o userId
  await updateDoc(blockRef, { name: blockName });
};

// Função para remover um bloco do Firestore associado ao usuário
export const deleteBlock = async (blockId: string): Promise<void | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) {
    return null;
  }

  const db = getFirestore(app);
  const blockRef = doc(db, "bloco", blockId);
  const blockSnapshot = await getDoc(blockRef);

  // Verifica se o bloco pertence ao usuário autenticado antes de deletar
  if (blockSnapshot.exists() && blockSnapshot.data().userId === user.uid) {
    await deleteDoc(blockRef);
  } else {
    console.error("Bloco não encontrado ou não pertence ao usuário.");
    return null;
  }
};

// Função para buscar o único registro da coleção "bloco" no Firestore
export const fetchSingleBlock = async (): Promise<Block | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();

  if (!user || !user.uid) {
    // Usuário não autenticado
    return null;
  }

  const db = getFirestore(app);
  const blocksCollection = collection(db, "bloco");

  // Filtra os blocos pelo userId do usuário autenticado
  const blocksQuery = query(blocksCollection, where("userId", "==", user.uid));
  const blocksSnapshot = await getDocs(blocksQuery);

  if (blocksSnapshot.empty) {
    return null; // Retorna null se não houver registros
  }

  // Retorna o primeiro registro encontrado
  return blocksSnapshot.docs[0].data() as Block;
};

// Função para buscar um bloco pelo ID
export const fetchBlockById = async (
  blocoID: string
): Promise<{ name: string } | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) {
    return null;
  }

  try {
    const db = getFirestore(app);
    const blocoRef = doc(db, "bloco", blocoID);
    const blocoSnapshot = await getDoc(blocoRef);

    // Verifica se o bloco existe e se pertence ao usuário autenticado
    if (blocoSnapshot.exists() && blocoSnapshot.data().userId === user.uid) {
      return { name: blocoSnapshot.data().name };
    } else {
      console.error("Bloco não encontrado ou não pertence ao usuário.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar bloco pelo ID:", error);
    return null;
  }
};

// Função para registrar o histórico de alteração no Firestore, vinculando ao usuário autenticado
const registrarHistoricoManutencao = async (updatedActivity: Activity) => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) {
    console.error("Usuário não autenticado.");
    return null;
  }

  try {
    const db = getFirestore(app);
    const historicoCollectionRef = collection(db, "historico_manutencao");

    const historicoData = {
      activityId: updatedActivity.id,
      updatedFields: updatedActivity, // Salvar todos os campos atualizados
      timestamp: Timestamp.now(),
      userId: user.uid, // Adicionar o ID do usuário que fez a alteração
    };

    await addDoc(historicoCollectionRef, historicoData);
    console.log("Histórico registrado com sucesso.");
  } catch (error) {
    console.error("Erro ao registrar histórico de alteração:", error);
  }
};

// Função para buscar o histórico de alterações de uma atividade específica, filtrado pelo usuário autenticado
export const getActivityHistory = async (activityId: number) => {
  const user: FirebaseUser | null = AuthStorage.getUser();

  if (!user || !user.uid) {
    console.error("Usuário não autenticado.");
    return [];
  }

  if (!activityId) {
    console.error("ID da atividade indefinido.");
    return [];
  }

  console.log("activityId:", activityId);
  console.log("user.userId:", user.uid);

  try {
    const db = getFirestore(app);
    const historicoCollectionRef = collection(db, "historico_manutencao");

    const q = query(
      historicoCollectionRef,
      where("activityId", "==", activityId),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const historicoList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return historicoList;
  } catch (error) {
    console.error("Erro ao buscar histórico de atividade:", error);
    return [];
  }
};

export const addActivity = async (newActivity: Activity): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      console.error("Usuário não autenticado.");
      return false;
    }

    const db = getFirestore(app);
    const activityRef = collection(db, "atividades");

    // Adiciona a nova atividade ao Firestore
    await addDoc(activityRef, {
      ...newActivity,
      userId: user.uid, // Relaciona a atividade ao usuário
      createdAt: Timestamp.now(),
    });

    console.log("Atividade adicionada com sucesso.");
    return true;
  } catch (error) {
    console.error("Erro ao adicionar atividade:", error);
    return false;
  }
};

export const updateActivity = async (
  activityId: string | number,
  updatedActivity: Activity
): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      console.error("Usuário não autenticado.");
      return false;
    }

    const db = getFirestore(app);
    const activityRef = doc(db, "atividades", activityId.toString());

    // Atualiza os campos da atividade no Firestore
    await updateDoc(activityRef, {
      ...updatedActivity,
      updatedAt: Timestamp.now(), // Marca a data da última atualização
    });

    console.log("Atividade atualizada com sucesso.");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    return false;
  }
};

export const deleteActivity = async (
  activityId: string | number
): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      console.error("Usuário não autenticado.");
      return false;
    }

    const db = getFirestore(app);
    const activityRef = doc(db, "atividades", activityId.toString());

    // Remove a atividade do Firestore
    await deleteDoc(activityRef);

    console.log("Atividade removida com sucesso.");
    return true;
  } catch (error) {
    console.error("Erro ao remover atividade:", error);
    return false;
  }
};

// Tipo Supplier para Firebase
export interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  area: string;
  estado: string;
  cidade: string;
  link: string;
}

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const db = getFirestore(app);
  const suppliersCollection = collection(db, "fornecedores");
  const snapshot = await getDocs(suppliersCollection);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Supplier)
  );
};

export const addSupplier = async (
  data: Omit<Supplier, "id">
): Promise<void> => {
  const db = getFirestore(app);
  await addDoc(collection(db, "fornecedores"), data);
};

export const updateSupplier = async (
  id: string,
  data: Omit<Supplier, "id">
): Promise<void> => {
  const db = getFirestore(app);
  const supplierRef = doc(db, "fornecedores", id);
  await updateDoc(supplierRef, data);
};

export const deleteSupplier = async (id: string): Promise<void> => {
  const db = getFirestore(app);
  const supplierRef = doc(db, "fornecedores", id);
  await deleteDoc(supplierRef);
};

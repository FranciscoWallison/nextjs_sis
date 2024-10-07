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
  query,
  where,
} from "firebase/firestore";
import { app } from "./firebaseService";
import AuthStorage from "@/utils/AuthStorage";
import { FirebaseUser } from "@/interface/FirebaseUser";
import { Activity, PeriodicidadeResponse } from "@/interface/Activity";

// Função para pegar as periodicidades do usuário autenticado
export const pegarUsuarioPeriodicidades = async (
  uid?: string
): Promise<PeriodicidadeResponse | null> => {
  try {
    if (!uid) {
      const user: FirebaseUser | null = AuthStorage.getUser();
      if (!user || !user.uid) return null;
      uid = user.uid;
    }
    const db = getFirestore(app);
    const docRef = doc(db, "cliente", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as PeriodicidadeResponse;
  } catch (error) {
    console.error("pegarUsuarioPeriodicidades error", error);
    return null;
  }
};

// Função para atualizar as periodicidades do usuário
export const usuarioPeriodicidadesAtualizar = async (
  updatedActivity: Activity
): Promise<boolean> => {
  try {
    const data = await pegarUsuarioPeriodicidades();
    if (data === null) return false;

    const updatedData = data.questions.map((activity: Activity) =>
      activity.id === updatedActivity.id
        ? { ...activity, ...updatedActivity }
        : activity
    );

    data.questions = updatedData;

    await salvarNovo(data);
    await registrarHistoricoAlteracao(updatedActivity);

    return true;
  } catch (error) {
    console.error("Erro em usuarioPeriodicidadesAtualizar:", error);
    return false;
  }
};

// Função para adicionar periodicidades do usuário
export const usuarioPeriodicidadesAdicionar = async (
  updatedActivity: any
): Promise<boolean> => {
  try {
    const data = await pegarUsuarioPeriodicidades();
    if (data === null) return false;

    const questions = data.questions;
    const idsInQuestions = new Set(questions.map((q) => q.id));
    const uniqueInUpdatedActivity = updatedActivity.filter(
      (activity: any) => !idsInQuestions.has(activity.id)
    );

    data.questions = updatedActivity;

    await salvarNovo(data);
    await registrarHistoricoAlteracao(uniqueInUpdatedActivity[0]);
    return true;
  } catch (error) {
    console.error("usuarioPeriodicidadesAdicionar", error);
    return false;
  }
};

// Função para salvar dados no Firestore
export const salvarNovo = async (data: any): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) return false;

    const db = getFirestore(app);
    await setDoc(doc(db, "cliente", user.uid), data);

    return await validaUsuarioForm();
  } catch (error) {
    console.error("Erro ao salvarNovo:", error);
    return false;
  }
};

// Função para buscar blocos do usuário autenticado
export const fetchBlocks = async (): Promise<Block[] | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) return null;

  const db = getFirestore(app);
  const blocksCollection = collection(db, "bloco");
  const blocksQuery = query(blocksCollection, where("userId", "==", user.uid));
  const blocksSnapshot = await getDocs(blocksQuery);
  return blocksSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Block[];
};

// Função para adicionar um bloco ao Firestore
export const addBlock = async (blockName: string): Promise<Block | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) return null;

  const db = getFirestore(app);
  const newBlockRef = await addDoc(collection(db, "bloco"), {
    name: blockName,
    userId: user.uid,
  });
  return { id: newBlockRef.id, name: blockName, userId: user.uid };
};

// Função para atualizar um bloco no Firestore
export const updateBlock = async (
  blockId: string,
  blockName: string
): Promise<void | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) return null;

  const db = getFirestore(app);
  const blockRef = doc(db, "bloco", blockId);
  await updateDoc(blockRef, { name: blockName });
};

// Função para remover um bloco do Firestore
export const deleteBlock = async (blockId: string): Promise<void | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) return null;

  const db = getFirestore(app);
  const blockRef = doc(db, "bloco", blockId);
  const blockSnapshot = await getDoc(blockRef);

  if (blockSnapshot.exists() && blockSnapshot.data().userId === user.uid) {
    await deleteDoc(blockRef);
  } else {
    console.error("Bloco não encontrado ou não pertence ao usuário.");
  }
};

// Função para buscar um único bloco pelo ID
export const fetchBlockById = async (
  blocoID: string
): Promise<{ name: string } | null> => {
  const user: FirebaseUser | null = AuthStorage.getUser();
  if (!user || !user.uid) return null;

  const db = getFirestore(app);
  const blocoRef = doc(db, "bloco", blocoID);
  const blocoSnapshot = await getDoc(blocoRef);

  if (blocoSnapshot.exists() && blocoSnapshot.data().userId === user.uid) {
    return { name: blocoSnapshot.data().name };
  } else {
    console.error("Bloco não encontrado ou não pertence ao usuário.");
    return null;
  }
};

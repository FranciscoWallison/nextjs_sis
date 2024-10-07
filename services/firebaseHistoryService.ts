import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, getFirestore } from "firebase/firestore";
import { app } from './firebaseService';
import AuthStorage from "@/utils/AuthStorage";
import { Activity } from "@/interface/Activity";

export const registrarHistoricoManutencao = async (updatedActivity: Activity) => {
  const user = AuthStorage.getUser();
  if (!user || !user.uid) return null;
  const db = getFirestore(app);
  const historicoCollectionRef = collection(db, "historico_manutencao");
  const historicoData = { activityId: updatedActivity.id, updatedFields: updatedActivity, timestamp: Timestamp.now(), userId: user.uid };
  await addDoc(historicoCollectionRef, historicoData);
};

export const getActivityHistory = async (activityId: number) => {
  const user = AuthStorage.getUser();
  if (!user || !user.uid || !activityId) return [];
  const db = getFirestore(app);
  const q = query(collection(db, "historico_manutencao"), where("activityId", "==", activityId), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

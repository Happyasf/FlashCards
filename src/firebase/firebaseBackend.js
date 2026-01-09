import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  where,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebaseApp";


export const readTopics = async () => {
  const snap = await getDocs(collection(db, "topics"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addTopic = async (name, description = "") => {
  try {
    const cleanName = name.trim().toLowerCase();

    const colRef = collection(db, "topics");
    const snap = await getDocs(colRef);

    
    const exists = snap.docs.some(
      d => d.data().name?.toLowerCase() === cleanName
    );

    if (exists) {
      return false;
    }

    await addDoc(colRef, {
      name: name.trim(),         
      description: description,
      key: cleanName             
    });

    return true;
  } catch (err) {
    console.error("Hiba a témakör hozzáadásakor:", err);
    return false;
  }
};


export const deleteTopic = async (topicId) => {
  try {
    const batch = writeBatch(db);

 
    const cardsRef = collection(db, "topics", topicId, "cards");
    const cardsSnap = await getDocs(cardsRef);

    cardsSnap.forEach((d) => {
      batch.delete(doc(db, "topics", topicId, "cards", d.id));
    });

    batch.delete(doc(db, "topics", topicId));


    await batch.commit();
  } catch (err) {
    console.error("Hiba a témakör törlésekor:", err);
  }
};


export const readCards = async (topicId) => {
  const colRef = collection(db, "topics", topicId, "cards");
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addCard = async (topicId, card) => {
  try {
    const colRef = collection(db, "topics", topicId, "cards");
    await addDoc(colRef, card);
  } catch (err) {
    console.error("Hiba a kártya létrehozásakor:", err);
  }
};


export const deleteCard = async (topicId, cardId) => {
  try {
    await deleteDoc(doc(db, "topics", topicId, "cards", cardId));
  } catch (err) {
    console.error("Hiba a kártya törlésekor:", err);
  }
};

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const ATTEMPTS_COLLECTION = 'attempts';

export async function saveAttempt(userId, attempt) {
  const docRef = await addDoc(collection(db, ATTEMPTS_COLLECTION), {
    userId,
    imageUrl: attempt.imageUrl,
    hints: attempt.hints,
    sampleAnswer: attempt.sampleAnswer,
    essayText: attempt.essayText,
    evaluation: attempt.evaluation,
    notes: attempt.notes,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchAttemptsForUser(userId) {
  const q = query(
    collection(db, ATTEMPTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}


import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, deleteDoc, Firestore } from 'firebase/firestore';
import { User, Field, Sensor } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCeyl_T15XCsu0-tbXoXaZ2t7C3oMLjyF8",
  authDomain: "agricare-4c725.firebaseapp.com",
  projectId: "agricare-4c725",
  storageBucket: "agricare-4c725.appspot.com",
  messagingSenderId: "629410782904",
  appId: "1:629410782904:web:4d8f43225d8a6b4ad15e4d"
};

// Initialize App once and cache it
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Explicitly register services to the specific app instance
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export const isFirebaseEnabled = () => !!db;

const handleFirestoreError = (e: any, context: string) => {
  if (e?.code === 'permission-denied') {
    console.warn(`Firestore Permission Denied for: [${context}].`);
    return true;
  }
  console.error(`Firestore Error in ${context}:`, e);
  return false;
};

export const loginUser = async (email: string, pass: string): Promise<User | null> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      const fallbackUser: User = {
        id: cred.user.uid,
        name: email.split('@')[0],
        email: email,
        subscriptionPlan: 'basic',
        subscriptionEnd: new Date(Date.now() + 31536000000).toISOString()
      };
      await setDoc(userDocRef, fallbackUser);
      return fallbackUser;
    }
  } catch (authError: any) {
    throw authError;
  }
};

export const registerUser = async (user: User, pass: string): Promise<User> => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, user.email, pass);
    const userData = { ...user, id: cred.user.uid };
    await setDoc(doc(db, 'users', cred.user.uid), userData);
    return userData;
  } catch (e: any) {
    handleFirestoreError(e, 'users');
    throw e;
  }
};

export const syncFields = async (userId: string): Promise<Field[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'fields'), where('user_id', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Field);
  } catch (e) {
    handleFirestoreError(e, 'fields');
    return [];
  }
};

export const addFieldToDb = async (field: Field): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  try {
    await setDoc(doc(db, 'fields', field.field_id.toString()), field);
  } catch (e) {
    handleFirestoreError(e, 'fields');
  }
};

const FIRESTORE_IN_QUERY_LIMIT = 10;

export const syncSensorsFromDb = async (userFields: Field[]): Promise<Sensor[]> => {
  if (!db || userFields.length === 0) return [];
  try {
    const userFieldIds = userFields.map(f => f.field_id);
    const allSensors: Sensor[] = [];
    for (let i = 0; i < userFieldIds.length; i += FIRESTORE_IN_QUERY_LIMIT) {
      const chunk = userFieldIds.slice(i, i + FIRESTORE_IN_QUERY_LIMIT);
      const q = query(collection(db, 'sensors'), where('field_id', 'in', chunk));
      const snap = await getDocs(q);
      allSensors.push(...snap.docs.map(d => d.data() as Sensor));
    }
    return allSensors;
  } catch (e) {
    handleFirestoreError(e, 'sensors');
    return [];
  }
};

export const addOrUpdateSensorInDb = async (sensor: Sensor): Promise<void> => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'sensors', sensor.sensor_id.toString()), sensor);
  } catch (e) {
    handleFirestoreError(e, 'sensors');
  }
};

export const deleteSensorFromDb = async (id: number): Promise<void> => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'sensors', id.toString()));
  } catch (e) {
    handleFirestoreError(e, 'sensors');
  }
};

export const saveManualDiagnostic = async (fieldId: number, data: any): Promise<void> => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'manual_diagnostics', fieldId.toString()), {
      field_id: fieldId,
      ...data,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    handleFirestoreError(e, 'manual_diagnostics');
  }
};

export const getManualDiagnosticsForFields = async (fieldIds: number[]): Promise<Record<number, any>> => {
  if (!db || fieldIds.length === 0) return {};
  try {
    const results: Record<number, any> = {};
    for (let i = 0; i < fieldIds.length; i += FIRESTORE_IN_QUERY_LIMIT) {
      const chunk = fieldIds.slice(i, i + FIRESTORE_IN_QUERY_LIMIT);
      const q = query(collection(db, 'manual_diagnostics'), where('field_id', 'in', chunk));
      const snap = await getDocs(q);
      snap.forEach(snapDoc => {
        const data = snapDoc.data();
        results[data.field_id] = data;
      });
    }
    return results;
  } catch (e) {
    handleFirestoreError(e, 'manual_diagnostics');
    return {};
  }
};

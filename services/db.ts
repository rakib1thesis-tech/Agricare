
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, deleteDoc, Firestore } from 'firebase/firestore';
import { User, Field, Sensor } from '../types';

// Configuration for project: agricare-4c725
const firebaseConfig = {
  apiKey: "AIzaSyAZ7-leDg1XzaH8wHJn_0C2rz4qathFhJw",
  authDomain: "agricare2-c8edb.firebaseapp.com",
  projectId: "agricare2-c8edb",
  storageBucket: "agricare2-c8edb.firebasestorage.app",
  messagingSenderId: "894995380966",
  appId: "1:894995380966:web:feaa35ce8f1237b6861927"
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export const isFirebaseEnabled = () => !!db;

/**
 * Enhanced error handler for Firestore permissions.
 * If rules are not set correctly in the Firebase Console, we want to warn the dev
 * but allow the app to function with local/mock states where possible.
 */
const handleFirestoreError = (e: any, context: string) => {
  if (e.code === 'permission-denied') {
    console.warn(`Firestore Permission Denied for collection: [${context}]. This is likely a security rule configuration issue in the Firebase Console. Falling back to local/mock data state.`);
    return true; // Handled
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

export const syncSensorsFromDb = async (userFields: Field[]): Promise<Sensor[]> => {
  if (!db || userFields.length === 0) return [];
  try {
    const userFieldIds = userFields.map(f => f.field_id);
    const q = query(collection(db, 'sensors'), where('field_id', 'in', userFieldIds));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Sensor);
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

/**
 * Manual Diagnostics Persistence
 */
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
    const q = query(collection(db, 'manual_diagnostics'), where('field_id', 'in', fieldIds));
    const snap = await getDocs(q);
    const results: Record<number, any> = {};
    snap.forEach(doc => {
      const data = doc.data();
      results[data.field_id] = data;
    });
    return results;
  } catch (e) {
    handleFirestoreError(e, 'manual_diagnostics');
    return {}; // Return empty object to prevent downstream errors
  }
};

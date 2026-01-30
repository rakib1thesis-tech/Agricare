
// Fix: Use 'firebase/compat/app' to support namespaced properties like .apps, .auth(), and .firestore()
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { User, Field, Sensor } from '../types';

// Configuration for project: agricare-4c725
const firebaseConfig = {
  apiKey: "AIzaSyCeyl_T15XCsu0-tbXoXaZ2t7C3oMLjyF8",
  authDomain: "agricare-4c725.firebaseapp.com",
  projectId: "agricare-4c725",
  storageBucket: "agricare-4c725.appspot.com",
  messagingSenderId: "629410782904",
  appId: "1:629410782904:web:4d8f43225d8a6b4ad15e4d"
};

// Initialize Firebase using the compat/namespaced API to resolve export and type errors.
// Using 'firebase/compat/app' and associated side-effect imports restores the namespaced API.
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();

export const isFirebaseEnabled = () => !!db;

/**
 * Enhanced error handler for Firestore permissions.
 */
const handleFirestoreError = (e: any, context: string) => {
  if (e?.code === 'permission-denied') {
    console.warn(`Firestore Permission Denied for collection: [${context}]. Falling back to local/mock data state.`);
    return true;
  }
  console.error(`Firestore Error in ${context}:`, e);
  return false;
};

export const loginUser = async (email: string, pass: string): Promise<User | null> => {
  try {
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    if (!cred.user) return null;
    
    const userDoc = await db.collection('users').doc(cred.user.uid).get();
    
    if (userDoc.exists) {
      return userDoc.data() as User;
    } else {
      const fallbackUser: User = {
        id: cred.user.uid,
        name: email.split('@')[0],
        email: email,
        subscriptionPlan: 'basic',
        subscriptionEnd: new Date(Date.now() + 31536000000).toISOString()
      };
      await db.collection('users').doc(cred.user.uid).set(fallbackUser);
      return fallbackUser;
    }
  } catch (authError: any) {
    throw authError;
  }
};

export const registerUser = async (user: User, pass: string): Promise<User> => {
  try {
    const cred = await auth.createUserWithEmailAndPassword(user.email, pass);
    if (!cred.user) throw new Error("Registration failed");
    
    const userData = { ...user, id: cred.user.uid };
    await db.collection('users').doc(cred.user.uid).set(userData);
    return userData;
  } catch (e: any) {
    handleFirestoreError(e, 'users');
    throw e;
  }
};

export const syncFields = async (userId: string): Promise<Field[]> => {
  if (!db) return [];
  try {
    const snap = await db.collection('fields').where('user_id', '==', userId).get();
    return snap.docs.map(d => d.data() as Field);
  } catch (e) {
    handleFirestoreError(e, 'fields');
    return [];
  }
};

export const addFieldToDb = async (field: Field): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  try {
    await db.collection('fields').doc(field.field_id.toString()).set(field);
  } catch (e) {
    handleFirestoreError(e, 'fields');
  }
};

export const syncSensorsFromDb = async (userFields: Field[]): Promise<Sensor[]> => {
  if (!db || userFields.length === 0) return [];
  try {
    const userFieldIds = userFields.map(f => f.field_id);
    const snap = await db.collection('sensors').where('field_id', 'in', userFieldIds).get();
    return snap.docs.map(d => d.data() as Sensor);
  } catch (e) {
    handleFirestoreError(e, 'sensors');
    return [];
  }
};

export const addOrUpdateSensorInDb = async (sensor: Sensor): Promise<void> => {
  if (!db) return;
  try {
    await db.collection('sensors').doc(sensor.sensor_id.toString()).set(sensor);
  } catch (e) {
    handleFirestoreError(e, 'sensors');
  }
};

export const deleteSensorFromDb = async (id: number): Promise<void> => {
  if (!db) return;
  try {
    await db.collection('sensors').doc(id.toString()).delete();
  } catch (e) {
    handleFirestoreError(e, 'sensors');
  }
};

export const saveManualDiagnostic = async (fieldId: number, data: any): Promise<void> => {
  if (!db) return;
  try {
    await db.collection('manual_diagnostics').doc(fieldId.toString()).set({
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
    const snap = await db.collection('manual_diagnostics').where('field_id', 'in', fieldIds).get();
    const results: Record<number, any> = {};
    snap.forEach(doc => {
      const data = doc.data();
      results[data.field_id] = data;
    });
    return results;
  } catch (e) {
    handleFirestoreError(e, 'manual_diagnostics');
    return {};
  }
};

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  addDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CulturalItem, Contribution, FeedbackData, ContentReport } from '../types';

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  return errInfo;
}

// Validate connection to Firestore on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Successfully connected to Cloud Firestore database!');
  } catch (error) {
    console.warn('Firestore connection notice (offline or initial connection sync):', error instanceof Error ? error.message : error);
  }
}

// Auth helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout Error:', err);
  }
}

// Firestore persistence helpers
export async function saveContributionToFirestore(contribution: Contribution) {
  const path = 'contributions';
  try {
    const docRef = doc(db, path, contribution.id);
    await setDoc(docRef, {
      ...contribution,
      contributorId: auth.currentUser?.uid || 'anonymous',
    });
    return contribution;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function saveFeedbackToFirestore(feedback: FeedbackData) {
  const path = 'feedback';
  try {
    const docRef = doc(db, path, feedback.id);
    await setDoc(docRef, {
      ...feedback,
      userId: auth.currentUser?.uid || 'anonymous',
    });
    return feedback;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function saveReportToFirestore(report: ContentReport) {
  const path = 'reports';
  try {
    const docRef = doc(db, path, report.id);
    await setDoc(docRef, {
      ...report,
      userId: auth.currentUser?.uid || 'anonymous',
    });
    return report;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export function subscribeToContributions(callback: (contributions: Contribution[]) => void) {
  const path = 'contributions';
  try {
    const q = query(collection(db, path));
    return onSnapshot(q, (snapshot) => {
      const items: Contribution[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          contributorName: data.contributorName || 'Anonymous',
          region: data.region || 'all',
          category: data.category || 'kissa',
          title: data.title || '',
          description: data.description || '',
          mediaUrl: data.mediaUrl,
          audioUrl: data.audioUrl,
          mediaType: data.mediaType,
          createdAt: data.createdAt || Date.now(),
        });
      });
      callback(items);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}


/**
 * KONFIGURIMI FINAL I LIDHJES ME FIREBASE
 * Projekti: skenderaj-live-portal
 */

const firebaseConfig = {
  apiKey: "AIzaSyANsS1dX_Ekr6URD_61RHdenGQVv__i9X4",
  authDomain: "skenderaj-live-portal.firebaseapp.com",
  projectId: "skenderaj-live-portal",
  storageBucket: "skenderaj-live-portal.firebasestorage.app",
  messagingSenderId: "1074723806981",
  appId: "1:1074723806981:web:3ce67dc4a3f41bb3c0216c",
  measurementId: "G-5T78DW86ER"
};

// Inicializimi i sigurt i Firebase (Compat mode për të mbështetur logjikën ekzistuese)
if (!(window as any).firebase.apps.length) {
  (window as any).firebase.initializeApp(firebaseConfig);
} else {
  (window as any).firebase.app();
}

// Eksportojmë instancën e Firestore për përdorim në të gjithë faqen
export const db = (window as any).firebase.firestore();

// Emrat e tabelave (Koleksioneve) në Firestore
export const COLLECTIONS = {
  NEWS: 'news',
  TICKER: 'ticker',
  ADS: 'ads',
  REQUESTS: 'requests',
  USERS: 'users'
};

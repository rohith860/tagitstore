import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcctvLsBAbKlJ8cKpmZsqbyGMXf8IaMuY",
  authDomain: "tagitstore.firebaseapp.com",
  projectId: "tagitstore",
  storageBucket: "tagitstore.firebasestorage.app",
  messagingSenderId: "886233980150",
  appId: "1:886233980150:web:7773b165a1e42a730ca0d7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
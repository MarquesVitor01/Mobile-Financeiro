import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXExxtCLdyyku_hFBgFP-VrxPJr0K9yK4",
  authDomain: "mobile-finaceiro.firebaseapp.com",
  projectId: "mobile-finaceiro",
  storageBucket: "mobile-finaceiro.appspot.com", 
  messagingSenderId: "359282834941",
  appId: "1:359282834941:web:50e53c5e8ccb05a5be2d94",
  measurementId: "G-S6BMN16W2C",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC9AWk85bl_y-PBOUuPynvc_DJ7LKoHTDE",
    authDomain: "prepwise-d5a13.firebaseapp.com",
    projectId: "prepwise-d5a13",
    storageBucket: "prepwise-d5a13.firebasestorage.app",
    messagingSenderId: "130554971348",
    appId: "1:130554971348:web:eb1ebbd010435f1c286741",
    measurementId: "G-YSFTP3L9NH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
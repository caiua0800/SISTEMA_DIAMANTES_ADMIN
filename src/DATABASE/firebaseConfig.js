import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnwSOjrqasUNSCp6UrK2moHd1OtLUMj28",
  authDomain: "wldata.firebaseapp.com",
  projectId: "wldata",
  storageBucket: "wldata.appspot.com",
  messagingSenderId: "86184173654",
  appId: "1:86184173654:web:9463c36b71d142b684dbf7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { firebaseConfig, auth, db, storage };
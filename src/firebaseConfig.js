// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCnwSOjrqasUNSCp6UrK2moHd1OtLUMj28",
    authDomain: "wldata.firebaseapp.com",
    projectId: "wldata",
    storageBucket: "wldata.appspot.com",
    messagingSenderId: "86184173654",
    appId: "1:86184173654:web:9463c36b71d142b684dbf7"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

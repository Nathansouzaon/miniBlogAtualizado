import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";// e o banco
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIgFjhCyz4wQ1OlmkTj40QDTKaY011GaA",
  authDomain: "miniblog-f58c4.firebaseapp.com",
  projectId: "miniblog-f58c4",
  storageBucket: "miniblog-f58c4.appspot.com",
  messagingSenderId: "820504745216",
  appId: "1:820504745216:web:50e12f4c311fb53d38cfe5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export {  db  };
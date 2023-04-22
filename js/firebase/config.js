import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEVUDjPK4hSwfij4BkJeydYyyAkfx61K4",
  authDomain: "nathusiasts.firebaseapp.com",
  projectId: "nathusiasts",
  storageBucket: "nathusiasts.appspot.com",
  messagingSenderId: "914418983510",
  appId: "1:914418983510:web:da8f07fcd3a2364fe5d1f7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'

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
const db = getFirestore(app)
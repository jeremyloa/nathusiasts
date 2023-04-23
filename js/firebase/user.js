import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js'
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'

const auth = getAuth()
const db = getFirestore()

const reg_btn = document.getElementById('reg_btn')
reg_btn.addEventListener("click", (e)=>{
  e.preventDefault()
  let name = document.getElementById('reg_name')
  let mail = document.getElementById('reg_mail')
  let pass = document.getElementById('reg_pass')
  if (name.value  === "" || mail.value  === "" || pass.value  === "") alert('Fields should not be empty')
  else if (name.value.length  < 8 || mail.value.length  < 8 || pass.value.length  < 8) alert('Length of each fields should be at least 8 characters')
  else {
    createUserWithEmailAndPassword(auth, mail.value , pass.value )
      .then((creds) => {
          updateProfile(creds.user, {displayName: name.value })
          .then(() =>{ 
            setDoc(doc(db, "MasterUser", creds.user.uid), {
              name: name.value,
            })
            .then(() => {
              alert('User succesfully registered. Please Sign In.')
              name.value = ''
              mail.value = ''
              pass.value = ''
            })
          })
      })
      .catch((e) => {
          console.log(e)
      })
  }
})

const log_btn = document.getElementById('log_btn')
log_btn.addEventListener("click", (e)=>{
  e.preventDefault()
  let mail = document.getElementById('log_mail')
  let pass = document.getElementById('log_pass')
  if ( mail.value  === "" || pass.value  === "") alert('Fields should not be empty')
  else if (mail.value.length  < 8 || pass.value.length  < 8) alert('Length of each fields should be at least 8 characters')
  else {
    signInWithEmailAndPassword(auth, mail.value, pass.value)
    .then(() => {
      alert('User succesfully logged in.')
      mail.value = ''
      pass.value = ''
    })
    .catch((e) => {
      if (e.code === "auth/wrong-password" || e.code === "auth/invalid-email") {
        alert("Invalid email or password.");
      } else if (e.code === "auth/user-not-found") {
        alert("User not found. Please check your email and try again.");
      } else {
        console.log(e.code, e.message);
      }
    })
  }
})

export var user = null
onAuthStateChanged(auth, (authUser) => {
  if (authUser) {
    getDoc(doc(db, "MasterUser", authUser.uid))
    .then((doc) => user = doc.data())
  } else {
    user = null
  }
});

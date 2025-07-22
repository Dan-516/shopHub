import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"
import { app } from "../firebaseconfig.js"
console.log('hello');

const auth = getAuth(app);

const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');

const signIn = async () => {
    console.log("Signing In...");
    const  email = emailEl.value;
    const password = passwordEl.value;
    const errorMessage = document.getElementById('errorMessage');
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)

        const user = await userCredentials.user

        if (user.emailVerified) {
              showAlert('Welcome');
              errorMessage.classList.add(('d-none'))

      setTimeout(() => {
                window.location.href = "../dashboard/dashboard.html";
            }, 2000);
        }else{
            showAlert('Please verify your email before signing in.');
        }
    } catch (error) {
        console.log(error);
        if (error.code == "auth/invalid-credential") {
                errorMessage.textContent = "Invalid Credentials"
            } else if (error.code == auth / invalid - email) {
                errorMessage.textContent = "Invalid Email"
            }
        
    }
    finally{
        console.log("Done!");
        const spinner = document.querySelector('.spinner-border');
    spinner.classList.add('d-none')
        
    }
    
};

const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    signIn()
    const spinner = document.querySelector('.spinner-border');
    spinner.classList.remove('d-none')
})

function showAlert(message) {
  const modalBody = document.getElementById('alertModalBody');
  modalBody.innerText = message;

  const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
  alertModal.show();
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.emailVerified) {
         showAlert('Welcome Back!');
      setTimeout(() => {
                window.location.href = "../dashboard/dashboard.html";
            }, 2000);

    } else {
      
    }
  }
});


// document.getElementById('logoutBtn').addEventListener('click', async () => {
//   try {
//     await signOut(auth);
//     // Redirect to login page
//     window.location.href = 'login.html';
//   } catch (error) {
//     console.error('Error signing out:', error);
//   }
// });
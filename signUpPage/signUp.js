import {getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { app } from "../firebaseconfig.js"

const emailEl = document.getElementById('email');
const passwordEl =  document.getElementById('password')
const usernameEl =  document.getElementById('username')
const confirmPasswordEl = document.getElementById('confirmPassword')

confirmPasswordEl.addEventListener('input', ()=>{
    const errorMessage = document.getElementById('errorMessage');
    const confirmPassword = confirmPasswordEl.value;
    const password = passwordEl.value;
    if(password !== confirmPassword){
        errorMessage.textContent = 'Passwords do not match!'
    }else{
        errorMessage.textContent = ''
    }
})


const auth = getAuth(app);

const signUp = async () =>{
    console.log('Signing UP');
    const email = emailEl.value;
    const password = passwordEl.value;
    const username = usernameEl.value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email,password);
        const user = await userCredentials.user;
         await updateProfile(user, {
        displayName: username 
    });
        await sendEmailVerification(user);
        if (user) {
            showAlert('Verification email has been sent. Please check your inbox.');
            
            setTimeout(() => {
                window.location.href = "../signInPage/signIN.html";
            }, 2000);
            
        }
    } catch (error) {
        console.log(error);
        
    }
    finally{
        console.log('Done');
        
    }
    
}

const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    // saveToken()
    signUp()
    const spinner = document.querySelector('.spinner-border');
    spinner.classList.remove('d-none')
})

function showAlert(message) {
  const modalBody = document.getElementById('alertModalBody');
  modalBody.innerText = message;

  const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
  alertModal.show();
}

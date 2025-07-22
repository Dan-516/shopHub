import { onAuthStateChanged, getAuth, signOut, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {  collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { db } from "../firebaseconfig.js"

 let currentUser = null
 let cart = [];

const menuBar = document.getElementById('menuBar');
menuBar.addEventListener('click', (event)=>{

    const dashboard = document.getElementById('dashboard');
    dashboard.classList.toggle('showDashboard')

    // if(dashboard){
    //   window.onclick = dashboard.classList.toggle('showDashboard')
    // }

});

import { getMenProducts, getWomenProducts, app, auth } from "../firebaseconfig.js";

let   userId
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user
    userId = user.uid
    console.log('User signed in:', user.displayName);
    const welcome = document.getElementById('welcome')
welcome.textContent = `Welcome ${user.displayName}`
welcome.style.color = '#fff'
    const storedCart = localStorage.getItem(`cart_user_${currentUser.uid}`);
    console.log(storedCart);
    
    if (storedCart) {
      cart = JSON.parse(storedCart);
      saveCart()
      renderCart();
    }
    // else {
    //   cart = []; 
    // }
    
    if (user.emailVerified) {
        console.log('welcome', user.email);
        
    } else {
      
      alert('Please verify your email before proceeding.');
      window.location.href = '../signInPage/signIn.html';
    }
  } else {
     console.log('No user signed in');
    window.location.href = '../signInPage/signIn.html';
  }
});

const  signOutToggle = document.getElementById('signOutToggle');
const profileDropdown = document.getElementById('profileDropdown')


const logoutBtn = document.getElementById('logoutBtn')
logoutBtn.addEventListener('click', (e)=>{
  handleSignOut()
  e.preventDefault()
  profileDropdown.style.display = 'none';
;
})


signOutToggle.addEventListener('click', (e) =>{
//   handleSignOut()
profileDropdown.classList.toggle('d-none')
e.preventDefault()
})

async function handleSignOut() {
  try {
    await signOut(auth);
    
    alert('Signed out successfully!');
    
    window.location.href = '../signInPage/signIn.html';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}



 const dashboardMenToggle = document.getElementById('dashboardMenToggle')
 dashboardMenToggle.addEventListener("click", ()=>{
   
    window.location.href = '../products/products.html'
 });

 const dashboardWomenToggle = document.getElementById('dashboardWomenToggle');
 dashboardWomenToggle.addEventListener('click', ()=>{
    window.location.href = '../products/products.html' 
    window.addEventListener('DOMContentLoaded', ()=>{

        getWomenProducts()
        toggleAndDisplayWomen()
    })
    
    
 })
const orders = []

const cartIcon = document.getElementById('cartIcon');
const emptyCart = document.getElementById('emptyCart');
cartIcon.addEventListener('click', ()=>{
    emptyCart.classList.toggle('showEmptyCart')

    const checkOut = document.getElementById('checkout');
  
  checkOut.addEventListener('click', ()=>{
  orders.push(...cart)
  console.log(orders);
  handleCheckout()
  
  })
   
})



async function handleCheckout() {
  const checkOut = document.getElementById('checkout');
  checkOut.textContent = 'Checking Out...'

  if (!currentUser || !currentUser.uid) {
    alert('User not signed in.');
    return;
  }
   const cartItems = [...cart];
    console.log('adding');
    
  const order = {
    userId: currentUser.uid,
    items: cartItems,
    orderDate: new Date(),
    status: 'Pending'
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), order);
    
    showToast('Order Placed Successfully! ID: ' + docRef.id)
    cart = [];
    saveCart();
    renderCart();
  } catch (e) {
    console.error('Error saving order:', e);
  }
  finally{
    console.log('done');
    
  }
}


const shopBtn = document.getElementById('shopBtn');
shopBtn.addEventListener('click', ()=>{
  const spinner = document.querySelector('.spinner-border');
    spinner.classList.remove('d-none')
    window.location.href = '../products/products.html'
})



import { fetchUserOrders } from '../orders/orders.js';
const myOrders = document.getElementById('myOrders');
myOrders.addEventListener('click', ()=>{
  showOrdersInModal(userId);
})


async function showOrdersInModal(userId) {
  const modal = document.getElementById('ordersModal');
  const contentDiv = document.getElementById('modalOrdersContent');

  // Fetch user orders
  const orders = await fetchUserOrders(userId);

  let html = '';
  if (orders.length === 0) {
    html = '<p>No orders found.</p>';
  } else {
    orders.forEach(order => {
      const itemsHtml = order.items.map(item => `
        <li>
          <img src="${item.image}" alt="${item.name}" width="50" height="50"/>
          ${item.name} - Quantity: ${item.quantity}
        </li>`).join('');
      
      html += `
        <div class="order">
          <h3>Order ID: ${order.id}</h3>
          <p>Order Date: ${order.orderDate.toDate ? order.orderDate.toDate() : order.orderDate}</p>
          <p>Status: ${order.status}</p>
          <h4>Items:</h4>
          <ul>
            ${itemsHtml}
          </ul>
        </div>
        <hr/>
      `;
    });
  }

  contentDiv.innerHTML = html;
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('ordersModal').style.display = 'none';
}

document.getElementById('closeModal').onclick = closeModal;


window.onclick = function(event) {
  const modal = document.getElementById('ordersModal');
  if (event.target === modal) {
    closeModal();
  }

  // const dashboard = document.getElementById('dashboard');
  // if (event.target === dashboard){

  //   dashboard.classList.remove('showDashboard')
  // }


};


function attachCartButtonEvents() {
  const increase = document.querySelectorAll('.increase')

  increase.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      cart[index].quantity += 1;
      getTotal()
      renderCart();
      saveCart()

    });
  });
  const decrease = document.querySelectorAll('.decrease')
  decrease.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      getTotal()
      renderCart();
      saveCart()

    });
  });

  const remove = document.querySelectorAll('.remove')
  remove.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      cart.splice(index, 1);
      getTotal()
      renderCart();
      saveCart()

    });
  });
}

let pricesSum 

const renderCart = ()=>{
  
    const defaultEmptyCart = document.querySelector('.defaultEmptyCart')
    console.log('rendering cart');
    getTotal()
  defaultEmptyCart.innerHTML = `<button id='checkout'>checkout: $ ${pricesSum}</button>`

   
   
 
  if (cart.length > 0) { 
    cart.forEach((item, index) => {
      defaultEmptyCart.innerHTML += `
        <div class='cartDisplayItems'>
          <img src="${item.image}" alt="" width="100px">
            <p>${item.name}</p>
            <p>${item.price}</p>
            <div style="display: flex; gap: 5px;">
             <button class="decrease" data-index="${index}">-</button>
              <span>${item.quantity}</span>
              <button class="increase" data-index="${index}">+</button>
              <button class="remove" data-index="${index}">Remove</button>
            </div>
        </div>
        
      `;
    })
  } else {
      defaultEmptyCart.innerHTML = `
        <div id="emptyItem">
          <h3>Looks like you haven't added anything yet!</h3>
          <button>Start Shopping <i class="fa-solid fa-cart-shopping fa-xl" style="color: #1F2937;"></i></button>
        </div>
      `
    }
    
    attachCartButtonEvents()
    // saveCart()
    
}
function saveCart() {
 
  if (currentUser) {
    localStorage.setItem(`cart_user_${currentUser.uid}`, JSON.stringify(cart));
  }
}


function getTotal(){
   if (!currentUser || !currentUser.uid) {
    console.warn('User not signed in or currentUser not set');
    return;
  }
  
  // localStorage.setItem(`cart_user_${currentUser.uid}`, JSON.stringify(cart));
 if(cart.length > 0){

  const cartPrices = cart.map(item => Number(item.price.replace('$', ''))*item.quantity);
  
  
  pricesSum = cartPrices.reduce((prev, cur) => prev + cur)
  console.log(cartPrices);
  console.log(pricesSum);
   const cartQuantities = cart.map(item => Number(item.quantity))
  const totalQuantity = cartQuantities.reduce((a, b)=> a+b) 
   const cartCounter = document.getElementById('cartCounter');
   cartCounter.classList.remove('d-none')
   cartCounter.textContent = `${totalQuantity}`
 }else{
  console.log('hello');
  cartCounter.classList.add('d-none')
  
 }
  
}


function showToast(message) {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

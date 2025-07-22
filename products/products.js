import { getWomenProducts, getMenProducts,  db, app, auth } from "../firebaseconfig.js"

import { onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {  collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentUser = null
let cart = []

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user
    
    //  cart = localStorage.setItem(`cart_user_${currentUser.uid}`, JSON.stringify(cart)) || [];

    console.log('User signed in:', user.displayName);
    const storedCart = localStorage.getItem(`cart_user_${user.uid}`);
    // console.log(storedCart);
    
    
    
if (storedCart && storedCart !== "undefined") {
  try {
    cart = JSON.parse(storedCart);
    // console.log(cart);
    
  } catch (e) {
    console.error("Error parsing stored cart:", e);
    cart = [];
  }
}
    localStorage.setItem(`cart_user_${currentUser.uid}`, JSON.stringify(cart));
    
    if (user.emailVerified) {
        console.log('welcome', user.email);
        
    } else {
      
      alert('Please verify your email before proceeding.');
      window.location.href = '../signIn/signIn.html';
    }

    // if (storedCart) {
    //   cart.splice(0, cart.length, ...JSON.parse(storedCart)); 
    // } else {
    //   cart.length = 0;
    // }
    // if (typeof cart !== 'undefined') {
    //   cart.length = 0;
    // }
    renderCart();
    getTotal();
  } else {
     console.log('No user signed in');
    window.location.href = '../signIn/signIn.html';
    cart = []
    renderCart();
    // getTotal();
  
  }
});

function saveCart() {
 
  if (currentUser) {
    localStorage.setItem(`cart_user_${currentUser.uid}`, JSON.stringify(cart));
  }
}



const homeToggle = document.getElementById('homeToggle');
homeToggle.addEventListener('click', () => {
  window.location.href = '../dashboard/dashboard.html'
})

const cartIcon = document.getElementById('cartIcon');
const emptyCart = document.getElementById('emptyCart');


window.addEventListener('DOMContentLoaded', ()=>{
  getTotal()
  saveCart()
  // renderCart()
  toggleAndDisplayMen()
  
})

const orders = []

cartIcon.addEventListener('click', () => {
  emptyCart.classList.toggle('showEmptyCart')
  const checkOut = document.getElementById('checkout');
  
  checkOut.addEventListener('click', ()=>{
  orders.push(...cart)
  console.log(orders);
  handleCheckout()
  
  })
   
})

const toggleMen = document.getElementById('toggleMen');
const toggleWomen = document.getElementById('toggleWomen');

toggleMen.addEventListener('click', async()=>{
  getMenProducts()
  toggleAndDisplayMen()
    
})
 
toggleWomen.addEventListener('click', async()=>{
  getWomenProducts()
  toggleAndDisplayWomen()
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
    // alert('Order placed! ID: ' + docRef.id);
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

const toggleAndDisplayMen = async()=>{
   toggleWomen.style.borderBottom = ""
    const products = await getMenProducts()

    updateBtnContent()
   const addBtn = document.querySelectorAll('#addBtn')
  addBtn.forEach(btn=>{
      const productEl = btn.closest('#eachProduct');
    const productName = productEl.querySelector('#productName').innerHTML;
    
    btn.addEventListener('click', ()=>{
    
     const   productEl = btn.closest('#eachProduct')
    const image = productEl.querySelector('#productImg').src;
    console.log(image);

    const productName = productEl.querySelector('#productName').innerHTML;
    const productPrice = productEl.querySelector('#productPrice').innerHTML
    

    const cartItem = {
       productId: productName,
    image: `${image}`,
    name: `${productName}`,
    price: `${productPrice}`,
    quantity: 1
    
    }
    
       const existingIndex = cart.findIndex(item => item.productId === productName);
if (existingIndex !== -1) {
  
  cart[existingIndex].quantity += quantity;

} else {
  
  cart.push(cartItem);
}
    console.log(cart); 
    getTotal()
    renderCart()
    saveCart()
    });
    
   })
}

const updateBtnContent = ()=>{
  const addBtn = document.querySelectorAll('#addBtn')
  addBtn.forEach(btn=>{
     const productEl = btn.closest('#eachProduct');
    const productName = productEl.querySelector('#productName').innerHTML;
    const existingItem = cart.find(item => item.productId === productName);

    if (existingItem) {
      
      btn.innerHTML = 'Added To Cart';
      btn.disabled = true;
      btn.style.cursor = 'not-allowed'

      btn.style.backgroundColor = '#39476c'
    } else {
      
      btn.innerHTML = 'Add To Cart';
      btn.disabled = false;
      btn.style.backgroundColor = '#1F2937'
      btn.style.cursor = 'pointer'
    }
}
)}

const toggleAndDisplayWomen = async()=>{
  toggleMen.style.borderBottom = ""
  const section = await getWomenProducts()
 
    updateBtnContent()
  const addBtn = document.querySelectorAll('#addBtn')
  addBtn.forEach(btn=>{
     const productEl = btn.closest('#eachProduct');
    const productName = productEl.querySelector('#productName').innerHTML;
    

  btn.addEventListener('click', ()=>{
    
   const   productEl = btn.closest('#eachProduct')
    const image = productEl.querySelector('#productImg').src;
    console.log(image);

    const productName = productEl.querySelector('#productName').innerHTML;
    const productPrice = productEl.querySelector('#productPrice').innerHTML
   
    const cartItem = {
      productId: productName,
    image: `${image}`,
    name: `${productName}`,
    price: `${productPrice}`,
    quantity: 1
    
    }
    
        
   const existingIndex = cart.findIndex(item => item.productId === productName);
if (existingIndex !== -1) {
  
  cart[existingIndex].quantity += quantity;

} else {
  
  cart.push(cartItem);
}
    console.log(cart); 
    getTotal()
    renderCart()
    saveCart()
    });
    
  })
}



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
        <div class='cartDisplayItems' id='cartDisplayItems'>
          <img src="${item.image}" alt="" width="100px">
            <p>${item.name}</p>
            <p>${item.price}</p>
            <div style="display: flex; gap: 5px;">
             <button class="decrease" id="cartMod" data-index="${index}" >-</button>
              <span>${item.quantity}</span>
              <button class="increase" id="cartMod" data-index="${index}" >+</button>
              <button class="remove" id="cartMod" data-index="${index}">Remove</button>
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
    saveCart()
    
    
}


document.addEventListener('click', (e)=>{
  updateBtnContent()
  e.preventDefault()
})

function getTotal(){
   if (!currentUser || !currentUser.uid) {
    console.warn('User not signed in or currentUser not set');
    return;
  }
  
  localStorage.setItem(`cart_user_${currentUser.uid}`, JSON.stringify(cart));
 if(cart.length > 0){

  const cartPrices = cart.map(item => Number(item.price.replace('$', ''))*item.quantity);
  
  const cartQuantities = cart.map(item => Number(item.quantity))
  const totalQuantity = cartQuantities.reduce((a, b)=> a+b) 
   const cartCounter = document.getElementById('cartCounter');
   cartCounter.classList.remove('d-none')
   cartCounter.textContent = `${totalQuantity}`
  
  
  pricesSum = cartPrices.reduce((prev, cur) => prev + cur)
  console.log(cartPrices);
  console.log(pricesSum);
   
 }else{
  console.log('hello');
  cartCounter.classList.add('d-none')
  
 }
  
}


console.log(auth.currentUser);


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

// export { renderCart }
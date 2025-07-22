import {   getFirestore, collection, query, where, getDocs  } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { app, db, auth }  from '../firebaseconfig.js'

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


let currentUser

export async function fetchUserOrders(userId) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const orders = [];
  console.log(orders);
  
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });
  return orders;
}

function displayOrders(orders) {
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = '<p>No orders found.</p>';
    return;
  }

  orders.forEach(order => {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order';

 
    const itemsHtml = order.items.map(item => `
      <li>
        <img src="${item.image}" alt="${item.name}" width="50" height="50"/>
        ${item.name} - Quantity: ${item.quantity}
      </li>`).join('');

    orderDiv.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p>Order Date: ${order.orderDate.toDate ? order.orderDate.toDate() : order.orderDate}</p>
      <p>Status: ${order.status}</p>
      <h4>Items:</h4>
      <ul>
        ${itemsHtml}
      </ul>
    `;
    container.appendChild(orderDiv);
  });
}


// 

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     currentUser = user;
//     fetchUserOrders(user.uid).then(orders => {
//       displayOrders(orders);
//     });
//   } else {
//     currentUser = null;
//   }
// });
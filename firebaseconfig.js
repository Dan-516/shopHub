import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyCgzQOhX5OkZ36jmip9HkpEWVNun2a8D60",
  authDomain: "eshop-63092.firebaseapp.com",
  projectId: "eshop-63092",
  storageBucket: "eshop-63092.firebasestorage.app",
  messagingSenderId: "686236558581",
  appId: "1:686236558581:web:5d599f5136e638397951bc",
  measurementId: "G-YKKRB963FQ"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const db = getFirestore(app)

 const user = auth.currentUser;
const getWomenProducts = async () => {
    console.log('loading...');
    products.innerHTML = ''

    try {
        const res1 = await fetch(`${baseUrl}/category/women%27s%20clothing`);
        const dat1 = await res1.json();


        const res2 = await fetch(`${baseUrl}/category/jewelery`);
        const dat2 = await res2.json();

        const data = dat1.concat(dat2);


        data.forEach((ele, index) => {
            products.innerHTML += `
            <div id = "eachProduct">
            <img src="${ele.image}" id = "productImg" width="200"/>
            <h4 id = "productName">${ele.title}</h4>
            <span>${ele.category}</span>
            <p id = "productPrice">$${ele.price}</p>
             <button id = "addBtn">Add To Cart</button>
            </div>
            `        
        });
         
            
            
        toggleWomen.style.borderBottom = ""


    } catch (error) {
        console.log(error);

    }
    finally {
        toggleWomen.style.borderBottom = "2px solid #1F2937"
    }

}


const getMenProducts = async () => {
    console.log('loading...');
    products.innerHTML = ''

    try {
        const response1 = await fetch(`${baseUrl}/category/men%27s%20clothing`);
        const data1 = await response1.json();

        const response2 = await fetch(`${baseUrl}/category/electronics`);
        const data2 = await response2.json();

        const data = data1.concat(data2)

        data.forEach((ele, index) => {
            products.innerHTML += `
            <div id = "eachProduct">
            <img src="${ele.image}" id = "productImg" width="200"/>
            <h4 id = "productName">${ele.title}</h4>
            <span>${ele.category}</span>
            <p id = "productPrice">$${ele.price}</p>
             <button id = "addBtn">Add To Cart</button>
            </div>
            `
            
        });


    } catch (error) {
        console.log(error);

    }
    finally {
        toggleMen.style.borderBottom = "2px solid #1F2937"
    }
}




const baseUrl = 'https://fakestoreapi.com/products'




export {
    app, getWomenProducts, getMenProducts, baseUrl,  auth, db
}



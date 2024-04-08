// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBoZ48VAm9ToUkr-latnalNj_FkZcu4Vx0",
    authDomain: "bon-viveur-57281.firebaseapp.com",
    projectId: "bon-viveur-57281",
    storageBucket: "bon-viveur-57281.appspot.com",
    messagingSenderId: "525526447048",
    appId: "1:525526447048:web:6d3354abcc850483db46fd",
    measurementId: "G-RK3WT0L0DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const restaurantsCollection = collection(db, 'restaurants');

// Get a list of restaurants from your database
export async function getRestaurants() {
    const restaurants = await getDocs(restaurantsCollection);
    const restaurantsList = restaurants.docs.map(doc => {
        let newDoc = doc.data();
        newDoc.id = doc.id;
        return newDoc;
    });
    return restaurantsList;
}

export async function addLocation(data) {
    let result, error;

    result = await addDoc(restaurantsCollection, data).catch((e) => error = e);

    if (error) {
        console.log(error);
    }
    return { result, error };
}


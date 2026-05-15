import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPijLo4sNDABZ7VJ8Y7fRkNx4d7K_fiMg",
  authDomain: "sales-monitoring-ab387.firebaseapp.com",
  projectId: "sales-monitoring-ab387",
  storageBucket: "sales-monitoring-ab387.firebasestorage.app",
  messagingSenderId: "803819259202",
  appId: "1:803819259202:web:707df5c3e5466e800b74db"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

console.log("Firebase Connected");

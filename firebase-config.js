
// firebase-config.js
// 🚨 Thay giá trị bên dưới bằng config Firebase của bạn trong Firebase Console
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXdS5ZGyYmPwrYcp6BHxXZtdhzCVHYCAw",
  authDomain: "du-an-web-c3981.firebaseapp.com",
  projectId: "du-an-web-c3981",
  storageBucket: "du-an-web-c3981.appspot.com",
  messagingSenderId: "842940712678",
  appId: "1:842940712678:web:95913546497e14b1339d27",
  measurementId: "G-JQYG7F7WXY"
};
export const app = initializeApp(firebaseConfig);

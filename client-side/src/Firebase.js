import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-YigdoPYpzGUMgx5Fn_2jb8_WLtSFqjw",
  authDomain: "slack-app-7c053.firebaseapp.com",
  projectId: "slack-app-7c053",
  storageBucket: "slack-app-7c053.appspot.com",
  messagingSenderId: "915377461459",
  appId: "1:915377461459:web:75c450cfc1a62690de1c26",
  measurementId: "G-LM115GY4MK"
};
firebase.initializeApp(firebaseConfig);

export default firebase;

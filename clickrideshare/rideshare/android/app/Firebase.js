   import * as firebase from 'firebase';
   import firebase from 'firebase/firestore'

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCBIrUh92HPjUrL2tXaiTvDnhFj8LCrDNo",
    authDomain: "clickrideshare-6f541.firebaseapp.com",
    databaseURL: "https://clickrideshare-6f541.firebaseio.com",
    projectId: "clickrideshare-6f541",
    storageBucket: "clickrideshare-6f541.appspot.com",
    messagingSenderId: "436428259074",
    appId: "1:436428259074:web:72e12bcca13d95ba0bcc1b",
    measurementId: "G-EEP2QSW4NG"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

export default firebase;

const {initializeApp} = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyCN-wbaSA3Xl_UPmSI0u15jutg5Wo1WYbQ",
    authDomain: "catcares.firebaseapp.com",
    projectId: "catcares",
    storageBucket: "catcares.appspot.com",
    messagingSenderId: "668987714058",
    appId: "1:668987714058:web:50e768c2ad7bbd8bd50df3"
};

const app = initializeApp(firebaseConfig);

module.exports = app;
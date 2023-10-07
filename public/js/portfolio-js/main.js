// const cookies = require('plugins/cookies.js');

// setCookie("username", "humberto", 1);
// setCookie("username", "Scheph", 1);
// setCookie("username", "Omar", 1);

// getCookie();

// function setCookie(name, value, expirationHours = 720, path = "/") {
//     const date = new Date();

//     date.setTime(date.getTime() + (expirationHours * 60 * 60 * 1000));
//     let expires = "expires=" + date.toUTCString();
//     document.cookie = name + "=" + value + ";" + expires + ";path=" + path;
//     // console.log(document.cookie);
// }


// function getCookie() {
//     let x = document.cookie;
//     console.log(document.cookie);
// }


import { profile, workFilter, moreProgrammingLanguage } from './plugins/website_events.js';

profile();
workFilter();
moreProgrammingLanguage();
// hide();



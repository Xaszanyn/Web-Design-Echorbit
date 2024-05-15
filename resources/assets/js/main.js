const navigation = document.querySelector("nav");
const menu = document.querySelector("nav ul");
const menuButton = document.querySelector("#menu");
const menuCloseButton = document.querySelector("nav #close");
const menuCloseScreenButton = document.querySelector("nav #close-screen");
const categories = document.querySelectorAll("nav ul a");

window.addEventListener("scroll", () => {
  if (window.scrollY == 0) navigation.classList.add("initial");
  else navigation.classList.remove("initial");
});

menuButton.addEventListener("click", (event) => {
  event.preventDefault();
  menu.classList.toggle("closed");
});

menuCloseButton.addEventListener("click", (event) => {
  event.preventDefault();
  menu.classList.add("closed");
});

menuCloseScreenButton.addEventListener("click", (event) => {
  event.preventDefault();
  menu.classList.add("closed");
});

categories.forEach((category) => {
  category.addEventListener("click", (event) => {
    menu.classList.add("closed");
  });
});

// if (window.innerWidth < window.innerHeight) {
//   document.body.innerHTML = `<p style="color: red; font-size: 25px;">
// Mobile version not identified!
//   </p><br /><br /><p style="color: red;font-size: 25px;">
//     The service worker navigation preload request was cancelled before 'preloadResponse' settled. If you intend to use
//     'preloadResponse', use waitUntil() or respondWith() to wait for the promise to settle.
//   </p>`;
// }

// window.addEventListener("resize", () => {
//   if (window.innerWidth < window.innerHeight) {
//     document.body.innerHTML = `<p style="color: red; font-size: 25px;">
// Mobile version not identified!
//   </p><br /><br /><p style="color: red;font-size: 25px;">
//     The service worker navigation preload request was cancelled before 'preloadResponse' settled. If you intend to use
//     'preloadResponse', use waitUntil() or respondWith() to wait for the promise to settle.
//   </p>`;
//   }
// });

/* =========={ General }========================================================================================== */

function assign(element, action, mobile = false) {
  if (mobile) {
    element.addEventListener("keypress", (event) => {
      event.preventDefault();
      action(event);
    });

    element.addEventListener("touchstart", (event) => {
      event.preventDefault();
      action(event);
    });
  } else
    element.addEventListener("click", (event) => {
      event.preventDefault();
      action(event);
    });
}

/* =========={ UI }========================================================================================== */

function openPopUp(section) {
  popUp.classList.add("active");
  section.classList.add("active");
}

function closePopUp() {
  popUp.classList.remove("active");

  let section = document.querySelector("#pop-up .active");

  if (section) section.classList.remove("active");
}

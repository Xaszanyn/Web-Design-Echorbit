/* =========={ General }========================================================================================== */

function assign(element, action, mobile = false, event = true) {
  if (event)
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
  else if (mobile) {
    element.addEventListener("keypress", (event) => action(event));
    element.addEventListener("touchstart", (event) => action(event));
  } else element.addEventListener("click", (event) => action(event));
}

function notify(message = "An error occurred, please try again.", duration = 5000) {
  notification.innerHTML = message;
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
    setTimeout(() => (notification.innerHTML = ""), 500);
  }, duration);
}

async function post(endpoint, body) {
  try {
    return await fetch("//services/" + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  } catch {
    return {
      status: "error",
    };
  }
}

async function get(endpoint) {
  try {
    return await fetch("//services/" + endpoint, {
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  } catch {
    return {
      status: "error",
    };
  }
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

/* =========={ Register }========================================================================================== */

async function registerFirstPhase(event) {
  if (!register.email.value) {
    notify("Please enter your e-mail address.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("register.php", { phase: "register", email: register.email.value });

  loading.classList.remove("loading");

  switch (response.status) {
    case "error":
      notify();
      break;
    case "email_invalid":
      notify("Please enter a valid e-mail address.");
      break;
    case "email_used":
      notify("This e-mail address is in use, please enter a new e-mail address.");
      break;
    case "success":
      register.phase.classList.remove("first");
      register.phase.classList.add("second");
      break;
  }
}

async function registerSecondPhase(event) {
  if (!register.code.value) {
    notify("Please enter the verification code.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("register.php", { phase: "confirm", code: register.code.value });

  loading.classList.remove("loading");

  register.hidden.value = response.code;

  switch (response.status) {
    case "error":
      notify();
      break;
    case "timeout":
      notify("The verification code has timed out.");
      register.phase.classList.remove("second");
      register.phase.classList.add("first");
      closePopUp();
      break;
    case "maximum_attempt":
      notify("You have reached your maximum number of attempts.");
      register.phase.classList.remove("second");
      register.phase.classList.add("first");
      closePopUp();
      break;
    case "code_invalid":
      notify("You entered an incorrect code, please try again.");
      break;
    case "success":
      register.phase.classList.remove("second");
      register.phase.classList.add("third");
      break;
  }
}

async function registerThirdPhase(event) {
  if (!register.password.value) {
    notify("Please enter your password.");
    return;
  }

  if (register.password.value != register.check.value) {
    notify("Passwords do not match, please try again.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("register.php", {
    phase: "create",
    code: register.hidden.value,
    password: register.password.value,
  });

  loading.classList.remove("loading");

  switch (response.status) {
    case "error":
      notify();
      break;
    case "timeout":
      notify("Registration has timed out.");
      register.phase.classList.remove("third");
      register.phase.classList.add("first");
      closePopUp();
      break;
    case "maximum_attempt":
      notify("You have reached your maximum number of attempts.");
      register.phase.classList.remove("third");
      register.phase.classList.add("first");
      closePopUp();
      break;
    case "code_invalid":
      notify("You entered an incorrect code, please try again.");
      break;
    case "success":
      notify("Signed up successfully.");
      register.phase.classList.remove("third");
      register.phase.classList.add("first");
      closePopUp();
      // let email = localStorage.register;
      // localStorage.clear();
      // loginDirect(email, register.password.value);
      break;
  }
}

/* =========={ Login }======================================== */

function loginUser() {
  if (!login.email.value) {
    notify("Please enter your e-mail address.");
    return;
  } else if (!login.password.value) {
    notify("Please enter your password.");
    return;
  }

  loginDirect(login.email.value, login.password.value);
}

async function loginDirect(email, password, remembered = false) {
  loading.classList.add("loading");

  let response = await post("login.php", {
    email,
    password,
  });

  loading.classList.remove("loading");

  switch (response.status) {
    case "error":
      notify();
      break;
    case "user_invalid":
      notify("E-mail or password is incorrect, please try again.");
      break;
    case "success":
      // userButton.style.display = "flex";
      // loginButton.style.display = "none";
      // registerButton.style.display = "none";
      // menuLoginButton.style.display = "none";
      // document.querySelector("#menu hr").style.display = "none";

      // userName.innerHTML = response.information.name;
      // userEmail.innerHTML = response.information.email;
      // userPhone.innerHTML = response.information.phone;
      // userAddress.innerHTML = response.information.address;

      // response.information.orders.individual.forEach((order) => {
      //   userOrders.innerHTML += `<li>
      //     <span>Tarih: ${order.date}</span>
      //     <span>Menü: ${order.menu_id}</span>
      //     <span>Gün Sayısı: ${order.days}</span>
      //     <span>Teslimat Saati: ${order.time}</span>
      //     <span>Adres: ${order.province_id} ${order.district_id} ${order.address}</span>
      //   </li>`;
      // });

      // response.information.orders.company.forEach((order) => {
      //   userOrders.innerHTML += `<li>
      //     <span>Şirket: ${order.company_name}</span>
      //     <span>Tarih: ${order.date}</span>
      //     <span>Gün Sayısı: ${order.days}</span>
      //     <span>Teslimat Saati: ${order.time}</span>
      //     <span>Teslimat Adresi: ${order.province_id} ${order.district_id} ${order.address}</span>
      //     <span>Menü: ${order.menu_id}</span>
      //     <span>Alerji Durumu: ${order.allergy}</span>
      //     <span>Hastalık Durumu: ${order.disease}</span>
      //     <span>Ek Açıklama: ${order.extra}</span>
      //   </li>`;
      // });

      // if (response.information.picture == "-") {
      //   userPicture.style.display = "none";
      // } else {
      //   userPictureDefault.style.display = "none";
      //   userPicture.src = response.information.picture;
      // }

      if (!remembered) {
        // localStorage.email = email;
        // localStorage.password = password;
        // localStorage.time = new Date().getTime();

        notify("Successfully logged in. { SUCCESS: 'USER DATA FETCHED' }");
        // load(userButton, user);
        closePopUp();
      }
      break;
  }
}

// function loginRememberedUser() {
//   if (!localStorage.time) return;

//   if ((new Date().getTime() - parseInt(localStorage.time)) / (1000 * 60 * 60 * 24) > 30) {
//     localStorage.clear();
//     return;
//   }

//   loginDirect(localStorage.email, localStorage.password, true);
// }

// function logoutUser() {
//   localStorage.clear();
//   location.reload();
// }

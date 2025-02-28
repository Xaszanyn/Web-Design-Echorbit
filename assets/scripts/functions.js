/* =========={ General }========================================================================================== */

function assign(element, action, mobile = false, event = true) {
  if (event) {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      action(event);
    });

    if (mobile)
      element.addEventListener("keypress", (event) => {
        event.preventDefault();
        action(event);
      });
  } else if (mobile) {
    element.addEventListener("keypress", (event) => action(event));
    element.addEventListener("touchstart", (event) => action(event));
  } else element.addEventListener("click", (event) => action(event));
}

function notify(
  message = "An error occurred, please try again.",
  duration = 5000
) {
  notification.innerHTML = message;
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
    setTimeout(() => (notification.innerHTML = ""), 500);
  }, duration);
}

async function post(endpoint, body) {
  try {
    // return await fetch("https://echorbitaudio.com/services/" + endpoint, {
    return await fetch("/services/" + endpoint, {
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
    // return await fetch("https://echorbitaudio.com/services/" + endpoint, {
    return await fetch("/services/" + endpoint, {
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  } catch {
    return {
      status: "error",
    };
  }
}

function redirect(redirect, action, alternative = () => {}) {
  if (typeof redirect == "string")
    if (location.href.includes(redirect)) action();
    else alternative();
  else if (
    redirect.reduce((redirected, string) => {
      if (location.href.includes(string)) {
        action();
        return false;
      }
      return redirected;
    }, true)
  )
    alternative();
}

async function acceptCookies(cookie) {
  document.querySelector("#cookie").style.display = "none";
  localStorage.setItem("cookie", true);

  await post("user.php", {
    action: "cookie",
    cookie,
  });
}

/* =========={ UI }========================================================================================== */

function openPopUp(section) {
  popUp.classList.add("active");
  section.classList.add("active");
}

function closePopUp() {
  popUp.classList.remove("active");

  let sections = document.querySelectorAll("#pop-up .active");

  if (sections.length)
    sections.forEach((section) => section.classList.remove("active"));
}

function showPassword(element) {
  element.parentElement.children[1].type =
    element.parentElement.children[1].type == "password" ? "text" : "password";
  element.classList.toggle("fa-eye");
  element.classList.toggle("fa-eye-slash");
}

function dark(force) {
  darkButton.children[0].classList.toggle("fa-moon");
  darkButton.children[0].classList.toggle("fa-sun");
  darkButton.children[0].classList.add("beat");
  document.body.classList.toggle("dark");
  setTimeout(() => darkButton.children[0].classList.remove("beat"), 500);

  if (force) return;

  if (localStorage.getItem("dark")) localStorage.removeItem("dark");
  else localStorage.setItem("dark", true);
}

/* =========={ Register }========================================================================================== */

async function registerFirstPhase() {
  if (!register.email.value) {
    notify("Please enter your e-mail address.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("register.php", {
    phase: "register",
    email: register.email.value,
  });

  loading.classList.remove("loading");

  switch (response.status) {
    case "error":
      notify();
      break;
    case "email_invalid":
      notify("Please enter a valid e-mail address.");
      break;
    case "email_used":
      notify(
        "This e-mail address is in use, please enter a new e-mail address."
      );
      break;
    case "success":
      register.phase.classList.remove("first");
      register.phase.classList.add("second");
      break;
  }
}

async function registerSecondPhase() {
  if (!register.code.value) {
    notify("Please enter the verification code.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("register.php", {
    phase: "confirm",
    code: register.code.value,
  });

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

async function registerThirdPhase() {
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
    guest: localStorage.getItem("guest") ? localStorage.getItem("guest") : "-",
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
      localStorage.setItem("registered", true);
      localStorage.setItem("session", response.session);

      redirect(
        "store",
        () => loginUserSession(setUser),
        () => (location.href = "/store/?user")
      );

      break;
  }
}

/* =========={ Forgot Password }========================================================================================== */

async function forgotFirstPhase() {
  if (!forgot.email.value) {
    notify("Please enter your registered e-mail address.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("forgot.php", {
    phase: "forgot",
    email: forgot.email.value,
  });

  loading.classList.remove("loading");

  switch (response.status) {
    case "error":
      notify();
      break;
    case "email_invalid":
      notify("Unfortunately, this e-mail address is not in use.");
      break;
    case "success":
      forgot.phase.classList.remove("first");
      forgot.phase.classList.add("second");
      break;
  }
}

async function forgotSecondPhase() {
  if (!forgot.code.value) {
    notify("Please enter the verification code.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("forgot.php", {
    phase: "confirm",
    code: forgot.code.value,
  });

  loading.classList.remove("loading");

  forgot.hidden.value = response.code;

  switch (response.status) {
    case "error":
      notify();
      break;
    case "timeout":
      notify("The verification code has timed out.");
      forgot.phase.classList.remove("second");
      forgot.phase.classList.add("first");
      closePopUp();
      break;
    case "maximum_attempt":
      notify("You have reached your maximum number of attempts.");
      forgot.phase.classList.remove("second");
      forgot.phase.classList.add("first");
      closePopUp();
      break;
    case "code_invalid":
      notify("You entered an incorrect code, please try again.");
      break;
    case "success":
      forgot.phase.classList.remove("second");
      forgot.phase.classList.add("third");
      break;
  }
}

async function forgotThirdPhase() {
  if (!forgot.password.value) {
    notify("Please enter your password.");
    return;
  }

  if (forgot.password.value != forgot.check.value) {
    notify("Passwords do not match, please try again.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("forgot.php", {
    phase: "change",
    code: forgot.hidden.value,
    password: forgot.password.value,
  });

  loading.classList.remove("loading");

  switch (response.status) {
    case "error":
      notify();
      break;
    case "timeout":
      notify("Operation has timed out.");
      forgot.phase.classList.remove("third");
      forgot.phase.classList.add("first");
      closePopUp();
      break;
    case "maximum_attempt":
      notify("You have reached your maximum number of attempts.");
      forgot.phase.classList.remove("third");
      forgot.phase.classList.add("first");
      closePopUp();
      break;
    case "code_invalid":
      notify("You entered an incorrect code, please try again.");
      break;
    case "success":
      localStorage.setItem("registered", true);
      localStorage.setItem("session", response.session);

      redirect(
        "store",
        () => loginUserSession(setUser),
        () => (location.href = "/store/?user")
      );

      break;
  }
}

/* =========={ Login }========================================================================================== */

async function loginUser() {
  if (!login.email.value) {
    notify("Please enter your e-mail address.");
    return;
  } else if (!login.password.value) {
    notify("Please enter your password.");
    return;
  }

  loading.classList.add("loading");

  let response = await post("login.php", {
    email: login.email.value,
    password: login.password.value,
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
      localStorage.setItem("session", response.session);
      location.replace("/store");
      break;
  }
}

async function loginUserSession(user) {
  let session = localStorage.getItem("session");

  if (!session) {
    let guest = localStorage.getItem("guest");
    if (guest) user = JSON.parse(guest);
    return;
  }

  loading.classList.add("loading");

  let response = await post("login.php", { session });

  loading.classList.remove("loading");

  switch (response.status) {
    case "success":
      registerButton.classList.add("hidden");
      loginButton.classList.add("hidden");
      userButton.classList.remove("hidden");
      if (user) user(response);
      break;
  }
}

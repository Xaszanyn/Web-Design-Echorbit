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
    return await fetch("https://echorbitaudio.com/services/" + endpoint, {
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
    return await fetch("https://echorbitaudio.com/services/" + endpoint, {
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

async function registerSecondPhase(event) {
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
      localStorage.setItem("registered", true);
      register.phase.classList.remove("third");
      register.phase.classList.add("first");
      notify("Signed up successfully.");
      closePopUp();
      break;
  }
}

/* =========={ Login }======================================== */

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

async function loginUserSession() {
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
      notify("Successfully logged in.", 1000);
      registerButton.classList.add("hidden");
      loginButton.classList.add("hidden");
      userButton.classList.remove("hidden");
      handleUserData(response);
      break;
  }
}

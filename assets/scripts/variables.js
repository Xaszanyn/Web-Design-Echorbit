const navigation = document.querySelector("nav");

const menu = document.querySelector("nav ul");
const menuButton = document.querySelector("#menu");
const menuCloseButton = document.querySelector("nav #close");
const menuCloseScreenButton = document.querySelector("nav #close-screen");
const menuCategories = document.querySelectorAll("nav ul a");

const popUp = document.querySelector("#pop-up");
const popUpCloses = document.querySelectorAll("#pop-up section .close");

const notification = document.querySelector("#notification");
const loading = document.querySelector("#loading");

const loginButton = document.querySelector("#login-button");
const loginFromRegisterSection = document.querySelector(
  "#register-section #login-from-register-section"
);
const loginSection = document.querySelector("#login-section");
const login = {
  email: document.querySelector("#login-section .input:nth-of-type(1) input"),
  password: document.querySelector(
    "#login-section .input:nth-of-type(2) input"
  ),

  button: document.querySelector("#login-section .button"),
};

const registerButton = document.querySelector("#register-button");
const registerFromLoginSection = document.querySelector(
  "#login-section #register-from-login-section"
);
const registerSection = document.querySelector("#register-section");
const register = {
  phase: document.querySelector("#register-phase"),

  email: document.querySelector("#register-phase .first input"),
  code: document.querySelector("#register-phase .second input"),
  hidden: document.querySelector("#register-phase .third input[type=hidden]"),
  password: document.querySelector(
    "#register-phase .third .input:nth-of-type(1) input"
  ),
  check: document.querySelector(
    "#register-phase .third .input:nth-of-type(2) input"
  ),

  firstButton: document.querySelector("#register-phase .first button"),
  secondButton: document.querySelector("#register-phase .second button"),
  thirdButton: document.querySelector("#register-phase .third button"),
};

const userButton = document.querySelector("#user-button");

const darkButton = document.querySelector("nav #dark-button");

const forgotFromRegisterSection = document.querySelector(
  "#register-section #forgot-from-register-section"
);
const forgotFromLoginSection = document.querySelector(
  "#login-section #forgot-from-login-section"
);
const forgotSection = document.querySelector("#forgot-section");
const forgot = {
  phase: document.querySelector("#forgot-phase"),

  email: document.querySelector("#forgot-phase .first input"),
  code: document.querySelector("#forgot-phase .second input"),
  hidden: document.querySelector("#forgot-phase .third input[type=hidden]"),
  password: document.querySelector(
    "#forgot-phase .third .input:nth-of-type(1) input"
  ),
  check: document.querySelector(
    "#forgot-phase .third .input:nth-of-type(2) input"
  ),

  firstButton: document.querySelector("#forgot-phase .first button"),
  secondButton: document.querySelector("#forgot-phase .second button"),
  thirdButton: document.querySelector("#forgot-phase .third button"),
};

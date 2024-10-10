window.addEventListener("scroll", () => {
  if (window.scrollY == 0) navigation.classList.add("initial");
  else navigation.classList.remove("initial");
});

assign(menuButton, () => menu.classList.toggle("closed"), true);
assign(menuCloseButton, () => menu.classList.add("closed"), true);
assign(menuCloseScreenButton, () => menu.classList.add("closed"), true);
menuCategories.forEach((category) => {
  assign(category, () => menu.classList.add("closed"), false, false);
}, true);

popUpCloses.forEach((close) => assign(close, closePopUp));

assign(registerButton, () => openPopUp(registerSection));
assign(loginButton, () => openPopUp(loginSection));
assign(registerFromLoginSection, () => {
  closePopUp();
  setTimeout(() => openPopUp(registerSection), 200);
});
assign(loginFromRegisterSection, () => {
  closePopUp();
  setTimeout(() => openPopUp(loginSection), 200);
});

assign(register.firstButton, registerFirstPhase);
assign(register.secondButton, registerSecondPhase);
assign(register.thirdButton, registerThirdPhase);

assign(login.button, loginUser);

assign(popUp, (event) => {
  if (event.target == popUp) closePopUp();
});

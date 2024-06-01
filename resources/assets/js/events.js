window.addEventListener("scroll", () => {
  if (window.scrollY == 0) navigation.classList.add("initial");
  else navigation.classList.remove("initial");
});

assign(menuButton, () => menu.classList.toggle("closed"), true);
assign(menuCloseButton, () => menu.classList.add("closed"), true);
assign(menuCloseScreenButton, () => menu.classList.add("closed"), true);
menuCategories.forEach((category) => {
  assign(category, () => menu.classList.add("closed"));
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

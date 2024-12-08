const list = document.querySelector("#store #products");
const category = document.querySelector("#category");
const radios = document.querySelectorAll("button.radio");

var products, allCategories;
var userCart, userFavorites;

var type, search;
var categories = [];
var sortState = 0;

const productSection = document.querySelector("#product-section");
const productImage = document.querySelector("#product-section #product-image");
const productContent = document.querySelector(
  "#product-section #product-content"
);

const featured = document.querySelector("#featured");

const typeMusic = document.querySelector("#type .music");
const typeSFX = document.querySelector("#type .sfx");

const cartSection = document.querySelector("#cart-section");
const cartButton = document.querySelector("#cart-button");
const cartProducts = document.querySelector("#cart-section #cart-products");
const cartCheckout = document.querySelector("#cart-section #cart-checkout");
const cartControl = document.querySelector("#cart-section #cart-control");
const loginFromCartSection = document.querySelector(
  "#cart-section #cart-control button:nth-of-type(1)"
);
const registerFromCartSection = document.querySelector(
  "#cart-section #cart-control button:nth-of-type(2)"
);
const cartCheckoutButton = document.querySelector(
  "#cart-section #cart-checkout button"
);
const cartLoading = document.querySelector("#cart-section #cart-loading");
const cartMobileButton = document.querySelector("#mobile-cart");

var scrollPosition = 0;

var user = {
  inventory: [],
  cart: [],
  favorites: [],
};

if (localStorage.getItem("guest"))
  user = JSON.parse(localStorage.getItem("guest"));

const userSection = document.querySelector("#user-section");
const userName = document.querySelector("#user-section #user-name");
const userEmail = document.querySelector("#user-section #user-email");
const userPhone = document.querySelector("#user-section #user-phone");
const userCountry = document.querySelector("#user-section #user-country");
const userSaveButton = document.querySelector("#user-section #user-save");
const userLoading = document.querySelector("#user-section #user-loading");
const userInventoryProducts = document.querySelector(
  "#user-section #inventory #inventory-products"
);

// const productCover = document.querySelector("#product-cover");
// var coverPercentage = 0;
// var coverInterpolation = 0;

const musicButton = document.querySelector("#store #store-first #type .music");
const sfxButton = document.querySelector("#store #store-first #type .sfx");

(async function () {
  await loginUserSession(setUser);

  products = await get("get.php?target=products");

  setUserInventory();

  if (location.href.includes("store")) {
    allCategories = await get("get.php?target=categories");

    renderProducts();
    renderFeatured();

    document
      .querySelector("#search input")
      .addEventListener("input", (event) => {
        search = event.target.value.toLowerCase();
        renderProducts();
      });

    redirect("user", () => {
      if (localStorage.getItem("session")) openPopUp(userSection);
    });

    redirect("error", () =>
      notify("An error occurred during checkout. Please try again.")
    );

    redirect("success", () => {
      notify(
        "Payment received successfully. The receipt has been sent to your e-mail."
      );
      openPopUp(userSection);
    });

    redirect("cart", () => {
      viewCart();
    });

    assign(userSaveButton, userInputSave);

    assign(musicButton, () => selectType("music"));
    assign(sfxButton, () => selectType("sfx"));
  } else {
    renderProduct();

    // Cover Interpolation Removed

    // setInterval(() => {
    //   coverInterpolation =
    //     coverInterpolation + (coverPercentage - coverInterpolation) * 0.025;

    //   if (innerWidth / innerHeight > 1)
    //     productCover.style.backgroundPosition = `50% ${coverInterpolation.toFixed(
    //       2
    //     )}%`;
    //   else
    //     productCover.style.backgroundPosition = `${coverInterpolation.toFixed(
    //       2
    //     )}% 50%`;
    // }, 10);
  }

  renderCartButtons();

  assign(cartButton, viewCart);
  assign(cartMobileButton, viewCart);

  assign(loginFromCartSection, () => {
    closePopUp();
    setTimeout(() => openPopUp(loginSection), 300);
  });
  assign(registerFromCartSection, () => {
    closePopUp();
    setTimeout(() => openPopUp(registerSection), 300);
  });
  assign(cartCheckoutButton, checkout);

  assign(userButton, () => openPopUp(userSection));
})();

function selectType(selectedType) {
  if (type == selectedType) return;

  type = selectedType;

  switch (selectedType) {
    case "music":
      typeMusic.classList.add("selected");
      typeSFX.classList.remove("selected");
      break;
    case "sfx":
      typeMusic.classList.remove("selected");
      typeSFX.classList.add("selected");
      break;
  }

  renderCategories();
  renderProducts();
}

function renderFeatured() {
  products
    .filter((product) => product.feature)
    .forEach((product, index) => {
      featured.children[
        index
      ].children[0].src = `https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/${product.image}`;
      featured.children[index].setAttribute("onclick", `view(${product.id})`);
    });
}

function renderProducts() {
  list.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;

  let result = products.filter((product) => product.display);

  if (type) result = result.filter((product) => product.type == type);
  if (search)
    result = result.filter((product) =>
      product.name.toLowerCase().includes(search)
    );
  if (categories.length)
    result = result.filter((product) => {
      let productsCategories = product.category.split(",");

      for (let index = 0; index < categories.length; index++)
        if (!productsCategories.includes(categories[index])) return false;

      return true;
    });

  switch (sortState) {
    case 1:
      result.sort((first, second) => second.favorite - first.favorite);
      break;
    case 2:
      result.sort(
        (first, second) => new Date(second.date) - new Date(first.date)
      );
  }

  list.innerHTML = result.reduce((content, product) => {
    return (
      content +
      (user.inventory.includes(product.id)
        ? ""
        : `<button onclick="view(${
            product.id
          })"><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/small/${
            product.image
          }" /><h6>${product.name} | <span>&euro;${
            product.price
          }</span></h6><a ${
            user.cart.includes(product.id)
              ? `class="disabled" onclick="uncart(${product.id}, event)">Added`
              : `onclick="cart(${product.id}, event)">Add`
          } to Cart</a>${
            user.favorites.includes(product.id)
              ? `<i class="fa-solid fa-heart"></i>`
              : `<i class="fa-solid fa-heart hidden"></i>`
          }</button>`)
    );
  }, "");
}

function renderCategories() {
  category.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  content = "";

  allCategories.forEach((category) => {
    if (type == category.type)
      content += `<button data-id="${category.id}" onclick="selectCategory(event)"><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/icons/${category.image}" /> ${category.name}</button>`;
  });

  category.innerHTML = content;
}

function sort(state) {
  radios[0].classList.remove("selected");
  radios[1].classList.remove("selected");
  radios[2].classList.remove("selected");

  radios[state].classList.add("selected");

  sortState = state;

  renderProducts();
}

function selectCategory(event) {
  event.target.classList.toggle("selected");

  let index = categories.indexOf(event.target.dataset.id);

  if (index == -1) categories.push(event.target.dataset.id);
  else categories.splice(index, 1);

  renderProducts();
}

function view(id) {
  window.open(`/product/?${id}`, "_blank");

  /* Pop-Up Removed */

  // let product = products.find((item) => id == item.id);

  // productImage.src = `https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/${product.image}`;
  // productContent.innerHTML = `<h3>${product.name}<span>&euro;${
  //   product.price
  // }</span><span>${product.type}</span>${
  //   user.favorites.includes(product.id)
  //     ? `<button class="active" onclick="unfavorite(${product.id})"><i class="fa-solid fa-heart"></i> Liked</button>`
  //     : `<button onclick="favorite(${product.id})"><i class="fa-solid fa-heart"></i> Like</button>`
  // }<button ${
  //   user.cart.includes(product.id)
  //     ? `class="disabled" onclick="uncart(${product.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Added`
  //     : `onclick="cart(${product.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Add`
  // } to Cart</button></h3>${product.soundcloud}<p>${product.content}</p>`;

  // openPopUp(productSection);
}

function setUser(response) {
  user.inventory = JSON.parse(response.inventory);
  user.cart = JSON.parse(response.cart);
  user.favorites = JSON.parse(response.favorites);

  redirect(["store", "product"], () => {
    userName.value = response.name;
    userEmail.value = response.email;
    userPhone.value = response.phone;
    userCountry.value = response.country;
  });
}

async function favorite(id) {
  let session = localStorage.getItem("session");

  user.favorites.push(id);

  if (session)
    await post("user.php", {
      action: "favorite",
      session,
      id,
    });
  else localStorage.setItem("guest", JSON.stringify(user));

  redirect("store", () => {
    view(id);
    renderProducts();
  });
  redirect("product", renderProduct);

  notify("Product liked.", 1000);
}

async function unfavorite(id) {
  let session = localStorage.getItem("session");

  let index = user.favorites.indexOf(id);
  if (index >= 0) user.favorites.splice(index, 1);

  if (session)
    await post("user.php", {
      action: "unfavorite",
      session,
      id,
    });
  else {
    localStorage.setItem("guest", JSON.stringify(user));
  }

  redirect("store", () => {
    view(id);
    renderProducts();
  });
  redirect("product", renderProduct);

  notify("Product like removed.", 1000);
}

async function cart(id, event) {
  event.stopPropagation();
  event.preventDefault();

  let session = localStorage.getItem("session");

  user.cart.push(id);

  if (session)
    await post("user.php", {
      action: "cart",
      session,
      id,
    });
  else localStorage.setItem("guest", JSON.stringify(user));

  if (event.target.parentElement.parentElement.id == "product") view(id);

  renderCartButtons();

  redirect("store", renderProducts);
  redirect("product", renderProduct);

  notify("Product added to cart.", 1000);
}

async function uncart(id, event) {
  event.stopPropagation();
  event.preventDefault();

  let session = localStorage.getItem("session");

  let index = user.cart.indexOf(id);
  if (index >= 0) user.cart.splice(index, 1);

  let cart = event.target.parentElement.parentElement.id == "cart-products";

  if (cart) cartLoading.classList.add("loading");

  if (session)
    await post("user.php", {
      action: "uncart",
      session,
      id,
    });
  else localStorage.setItem("guest", JSON.stringify(user));

  if (event.target.parentElement.parentElement.id == "product") view(id);
  else if (cart) {
    cartLoading.classList.remove("loading");
    viewCart();
  }

  renderCartButtons();

  redirect("store", renderProducts);
  redirect("product", renderProduct);

  notify("Product removed from cart.", 1000);
}

function renderCartButtons() {
  cartButton.children[0].children[1].innerHTML = user.cart.length;
  cartMobileButton.children[1].innerHTML = user.cart.length;

  cartButton.classList.add("beat");
  cartMobileButton.classList.add("beat");

  setTimeout(() => {
    cartButton.classList.remove("beat");
    cartMobileButton.classList.remove("beat");
  }, 500);

  if (user.cart.length) {
    cartButton.classList.add("active");
    cartMobileButton.classList.add("active");
  } else {
    cartButton.classList.remove("active");
    cartMobileButton.classList.remove("active");
  }
}

function viewCart() {
  localStorage.getItem("session")
    ? cartControl.classList.add("hidden")
    : cartControl.classList.remove("hidden");

  let price = 0;

  cartProducts.innerHTML = products.reduce((content, product) => {
    if (user.cart.includes(product.id)) {
      price += product.price;
      return (
        content +
        `<li><i onclick="uncart(${product.id}, event)" class="fa-solid fa-xmark close"></i><div><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/small/${product.image}" /><div><span>${product.stripe_name}</span><span>Type: <b>${product.type}</b></span></div></div><span>&euro;${product.price}</span></li>`
      );
    } else return content;
  }, "");

  if (price) {
    cartCheckout.children[0].innerHTML = `Total Price: &euro;${price.toFixed(
      1
    )}`;
    cartCheckout.style.display = "flex";
  } else {
    cartCheckout.children[0].innerHTML = "";
    cartCheckout.style.display = "none";
    cartProducts.innerHTML = `<li>Cart is empty.</li>`;
  }

  openPopUp(cartSection);
}

function renderProduct() {
  let product = products.find(
    (item) => parseInt(location.href.split("?")[1]) == item.id
  );

  if (product.premium && Number.isInteger(product.premium))
    product.premium = products.find((item) => product.premium == item.id);

  if (!product) {
    notify();
    return;
  }

  // productCover.style.backgroundImage = `url("https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/${product.image}")`;

  productImage.src = `https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/${product.image}`;
  productContent.innerHTML = `<h3>${product.stripe_name}<span>&euro;${
    product.price
  }</span><span>${product.type}</span><button ${
    user.cart.includes(product.id)
      ? `class="cart-button disabled" onclick="uncart(${product.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Added`
      : `class="cart-button" onclick="cart(${product.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Add`
  } to Cart</button>${
    user.favorites.includes(product.id)
      ? `<button class="favorite-button active" onclick="unfavorite(${product.id})"><i class="fa-solid fa-heart"></i> Liked</button>`
      : `<button class="favorite-button" onclick="favorite(${product.id})"><i class="fa-solid fa-heart"></i> Like</button>`
  }</h3>${
    product.premium
      ? `<h3>${product.premium.stripe_name}<span>&euro;${
          product.premium.price
        }</span><span>${product.premium.type}</span><button ${
          user.cart.includes(product.premium.id)
            ? `class="cart-button disabled" onclick="uncart(${product.premium.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Added`
            : `class="cart-button" onclick="cart(${product.premium.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Add`
        } to Cart</button></h3>`
      : ""
  }${product.soundcloud}<p>${product.content}</p>`;
}

async function checkout() {
  cartLoading.classList.add("loading");

  let response = await post("user.php", {
    action: "checkout",
    session: localStorage.getItem("session"),
  });

  switch (response.status) {
    case "success":
      location.href = response.stripe;
      break;
    case "error":
      notify();
      break;
    case "intersection":
      notify("You already own at least one product in your cart.");
  }

  cartLoading.classList.remove("loading");
}

function userInput() {
  userSaveButton.classList.remove("disabled");
}

async function userInputSave() {
  if (userSaveButton.classList.contains("disabled")) return;

  if (!userName.value) userName.value = "—";
  if (!userPhone.value) userPhone.value = "—";
  if (!userCountry.value) userCountry.value = "—";

  userLoading.classList.add("loading");

  let response = await post("user.php", {
    action: "information",
    session: localStorage.getItem("session"),
    name: userName.value,
    phone: userPhone.value,
    country: userCountry.value,
  });

  userLoading.classList.remove("loading");

  switch (response.status) {
    case "success":
      notify("Changes saved successfully.");
      userSaveButton.classList.add("disabled");
      break;
    case "error":
      notify();
      break;
  }
}

function setUserInventory() {
  userInventoryProducts.innerHTML = products.reduce((content, product) => {
    return (
      content +
      (user.inventory.includes(product.id)
        ? `<li><div><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/small/${product.image}" /><div><span>${product.name}</span><span>Type: <b>${product.type}</b></span></div></div><button class="button" onclick="download(${product.id})"><i class="fa-solid fa-cloud-arrow-down"></i> Download</button></li>`
        : "")
    );
  }, "");

  if (userInventoryProducts.innerHTML == "")
    userInventoryProducts.innerHTML =
      "<li>You haven't made a purchase yet.</li>";
}

async function download(id) {
  let session = localStorage.getItem("session");

  if (!session) return;

  userLoading.classList.add("loading");

  let response = await post("user.php", {
    action: "download",
    session,
    id,
  });

  userLoading.classList.remove("loading");

  switch (response.status) {
    case "success":
      notify("Downloading.");
      window.open(response.url, "_blank");
      break;
    case "error":
      notify();
      break;
  }
}

// function setCoverPercentage(cover) {
//   coverPercentage =
//     (cover.scrollTop / (cover.scrollHeight - cover.clientHeight)) * 100;
// }

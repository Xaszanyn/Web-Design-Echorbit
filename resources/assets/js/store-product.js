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

var user = {
  cart: [],
  favorites: [],
};

var scrollPosition = 0;

(async function () {
  await loginUserSession();

  products = await get("get.php?target=products");

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
  } else {
    renderProduct();

    window.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        // let backgroundImageHeight = window.innerWidth * 2;

        // let scrollRatio = Math.ceil(
        //   (Math.max(0, window.scrollY - backgroundImageHeight) /
        //     (document.body.offsetHeight - window.innerHeight - backgroundImageHeight)) *
        //     100
        // );

        console.log(event.deltaY);

        if (event.deltaY > 0) {
          scrollPosition += 50;
        } else {
          scrollPosition -= 50;
        }

        window.scrollTo(0, scrollPosition);
      },
      { passive: false }
    );
  }
  renderCartButton();

  assign(cartButton, viewCart);

  assign(loginFromCartSection, () => {
    closePopUp();
    setTimeout(() => openPopUp(loginSection), 300);
  });
  assign(registerFromCartSection, () => {
    closePopUp();
    setTimeout(() => openPopUp(registerSection), 300);
  });
  assign(cartCheckoutButton, checkout);
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
  let featuredProducts = products.filter((product) => product.feature);

  products
    .filter((product) => product.feature)
    .forEach((product, index) => {
      featured.children[
        index
      ].children[0].src = `/resources/images/covers/${product.image}`;
      featured.children[index].setAttribute("onclick", `view(${product.id})`);
    });
}

function renderProducts() {
  list.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  let content = "";

  let result = Array.from(products);

  if (type) result = result.filter((product) => product.type == type);
  if (search)
    result = result.filter((product) =>
      product.name.toLowerCase().includes(search)
    );
  if (categories.length)
    result = result.filter(
      (product) =>
        product.category
          .split(",")
          .filter((category) => categories.includes(category)).length
    );
  switch (sortState) {
    case 1:
      result.sort((first, second) => second.favorite - first.favorite);
      break;
    case 2:
      result.sort(
        (first, second) => new Date(second.date) - new Date(first.date)
      );
  }

  result.forEach((product) => {
    content += `<button onclick="view(${
      product.id
    })"><img src="/resources/images/covers/small/${product.image}" /><h6>${
      product.name
    } | <span>&euro;${product.price}</span></h6><a href="#" ${
      user.cart.includes(product.id)
        ? `class="disabled" onclick="uncart(${product.id}, event)">Added`
        : `onclick="cart(${product.id}, event)">Add`
    } to Cart</a>${
      user.favorites.includes(product.id)
        ? `<i class="fa-solid fa-heart"></i>`
        : `<i class="fa-solid fa-heart hidden"></i>`
    }</button>`;
  });

  list.innerHTML = content;
}

function renderCategories() {
  category.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  content = "";

  allCategories.forEach((category) => {
    if (type == category.type)
      content += `<button data-id="${category.id}" onclick="selectCategory(event)"><img src="/resources/images/icons/${category.image}" /> ${category.name}</button>`;
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
  let product = products.find((item) => id == item.id);

  productImage.src = `/resources/images/covers/${product.image}`;
  productContent.innerHTML = `<h3>${product.name}<span>&euro;${
    product.price
  }</span><span>${product.type}</span>${
    user.favorites.includes(product.id)
      ? `<button class="active" onclick="unfavorite(${product.id})"><i class="fa-solid fa-heart"></i> Liked</button>`
      : `<button onclick="favorite(${product.id})"><i class="fa-solid fa-heart"></i> Like</button>`
  }<button ${
    user.cart.includes(product.id)
      ? `class="disabled" onclick="uncart(${product.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Added`
      : `onclick="cart(${product.id}, event)"><i class="fa-solid fa-cart-shopping"></i> Add`
  } to Cart</button></h3>${product.soundcloud}<p>${product.content}</p>`;

  openPopUp(productSection);
}

function handleUserData(data) {
  user.cart = JSON.parse(data.cart);
  user.favorites = JSON.parse(data.favorites);
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

  view(id);
  renderProducts();

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

  view(id);
  renderProducts();

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
  renderCartButton();
  renderProducts();

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

  renderCartButton();
  renderProducts();

  notify("Product removed from cart.", 1000);
}

function renderCartButton() {
  cartButton.children[0].children[1].innerHTML = user.cart.length;

  cartButton.classList.add("beat");
  setTimeout(() => cartButton.classList.remove("beat"), 350);

  if (user.cart.length) {
    cartButton.classList.add("active");
  } else cartButton.classList.remove("active");
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
        `<li><i onclick="uncart(${product.id}, event)" class="fa-solid fa-xmark close"></i><div><img src="/resources/images/covers/small/${product.image}" /><div><span>${product.name}</span><span>Type: <b>${product.type}</b></span></div></div><span>&euro;${product.price}</span></li>`
      );
    } else return content;
  }, "");

  if (price) {
    cartCheckout.children[0].innerHTML = `Total Price: &euro;${price}`;
    cartCheckout.style.display = "flex";
  } else {
    cartCheckout.children[0].innerHTML = "";
    cartCheckout.style.display = "none";
    cartProducts.innerHTML = `<li>Cart is empty.</li>`;
  }

  openPopUp(cartSection);
}

function renderProduct() {
  let product = products.find((item) => location.href.split("?")[1] == item.id);

  if (!product) {
    // HANDLE ERROR /* ============================================================================================= */
    return;
  }

  console.log(product);

  // productImage.src = `/resources/images/covers/${product.image}`;
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
}

function checkout() {
  //
}

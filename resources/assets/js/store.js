const list = document.querySelector("#store #products");
const category = document.querySelector("#category");
const radios = document.querySelectorAll("button.radio");

var products, sfxs, musicCategories, sfxCategories;

const productSection = document.querySelector("#product-section");
const productImage = document.querySelector("#product-section img");
const productContent = document.querySelector("#product-section #product");

const featured = document.querySelector("#featured");

async function initialize() {
  products = await get("get.php?target=products");
  musicCategories = await get("get.php?target=music_categories");
  sfxCategories = await get("get.php?target=sfx_categories");

  renderProducts();
  renderFeatured();
  renderMusicCategories();
}

initialize();

function renderFeatured() {
  let featuredProducts = products.filter((product) => product.feature);

  products
    .filter((product) => product.feature)
    .forEach((product, index) => {
      featured.children[
        index
      ].children[0].src = `https://echorbitaudio.com/resources/products/images/${product.image}`;
      featured.children[index].setAttribute("onclick", `view(${product.id})`);
    });
}

function renderProducts() {
  list.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  let content = "";

  products.forEach((product) => {
    content += `<button onclick="view(${product.id})"><img src="https://echorbitaudio.com/resources/products/images/${product.image}" /><h6>${product.name} | <span>&euro;${product.price}</span></h6><a href="#" onclick="cart(${product.id})">Add to Cart</a></button>`;
  });

  list.innerHTML = content;
}

function renderMusicCategories() {
  category.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  let html = "";

  musicCategories.forEach((musicCategory) => {
    html += `<button onclick="selectCategory(${musicCategory.id})"><img src="https://www.echorbitaudio.com/resources/images/icons/${musicCategory.icon}" /> ${musicCategory.name}</button>`;
  });

  category.innerHTML = html;
}

function sort(state) {
  radios[0].classList.remove("selected");
  radios[1].classList.remove("selected");
  radios[2].classList.remove("selected");

  switch (state) {
    case 0:
      radios[0].classList.add("selected");
      products.sort((first, second) => first.id - second.id);
      break;
    case 1:
      radios[1].classList.add("selected");
      products.sort((first, second) => second.favorite - first.favorite);
      break;
    case 2:
      radios[2].classList.add("selected");
      products.sort(
        (first, second) =>
          new Date(first.date).getTime() - new Date(second.date).getTime()
      );
      break;
  }

  // renderMusics();
}

function like(id) {
  document
    .querySelectorAll(".like")
    [id - 1].children[0].classList.toggle("fa-regular");
  document
    .querySelectorAll(".like")
    [id - 1].children[0].classList.toggle("fa-solid");
}

function selectCategory(id) {
  category.children[id - 1].classList.toggle("selected");
}

function view(id) {
  let product = products.find((item) => id == item.id);

  productImage.src = `https://echorbitaudio.com/resources/products/images/${product.image}`;
  productContent.innerHTML = `<h3>${product.name}<span>${product.type}</span><button onclick="cart(${product.id})">&euro;${product.price} <i class="fa-solid fa-cart-shopping"></i> Add to Cart</button></h3>${product.soundcloud}<p>${product.content}</p>`;

  openPopUp(productSection);
}

const list = document.querySelector("#store #products");
const category = document.querySelector("#category");
const radios = document.querySelectorAll("button.radio");

var products, sfxs, allCategories;

var type, search, categories, sort;

const productSection = document.querySelector("#product-section");
const productImage = document.querySelector("#product-section img");
const productContent = document.querySelector("#product-section #product");

const featured = document.querySelector("#featured");

const typeMusic = document.querySelector("#type .music");
const typeSFX = document.querySelector("#type .sfx");

(async function () {
  products = await get("get.php?target=products");
  allCategories = await get("get.php?target=categories");

  renderProducts();
  renderFeatured();
  // renderMusicCategories();
})();

document.querySelector("#search input").addEventListener("input", (event) => {
  search = event.target.value.toLowerCase();
  renderProducts();
});

function selectType(selectedType) {
  if (type == selectedType) {
    type = null;

    typeMusic.classList.remove("selected");
    typeSFX.classList.remove("selected");

    renderProducts();
    return;
  }

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

  renderProducts();
}

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

  let result = Array.from(products);

  if (type) result = result.filter((product) => product.type == type);
  if (search)
    result = result.filter((product) =>
      product.name.toLowerCase().includes(search)
    );

  result.forEach((product) => {
    content += `<button onclick="view(${product.id})"><img src="https://echorbitaudio.com/resources/products/images/${product.image}" /><h6>${product.name} | <span>&euro;${product.price}</span></h6><a href="#" onclick="cart(${product.id})">Add to Cart</a></button>`;
  });

  list.innerHTML = content;
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

function selectCategory(id) {
  category.children[id - 1].classList.toggle("selected");
}

function view(id) {
  let product = products.find((item) => id == item.id);

  productImage.src = `https://echorbitaudio.com/resources/products/images/${product.image}`;
  productContent.innerHTML = `<h3>${product.name}<span>${product.type}</span><button onclick="cart(${product.id})">&euro;${product.price} <i class="fa-solid fa-cart-shopping"></i> Add to Cart</button></h3>${product.soundcloud}<p>${product.content}</p>`;

  openPopUp(productSection);
}

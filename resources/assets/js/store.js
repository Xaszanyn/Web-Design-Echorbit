const list = document.querySelector("#store ul");
const category = document.querySelector("#category");
const radios = document.querySelectorAll("button.radio");

var products, sfxs, musicCategories, sfxCategories;

async function initialize() {
  products = await get("get.php?target=products");
  musicCategories = await get("get.php?target=music_categories");
  sfxCategories = await get("get.php?target=sfx_categories");

  renderProducts();
  renderMusicCategories();
}

initialize();

function renderProducts() {
  list.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  let content = "";

  products.forEach((product) => {
    content += `<button onclick="view(${product.id})"><img src="https://echorbitaudio.com/resources/products/images/${product.image}" /><span>${product.name}</span><span>${product.price}</span><button onclick="cart(${product.id})">Add to Cart</button></button>`;
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

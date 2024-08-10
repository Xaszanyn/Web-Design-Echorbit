const list = document.querySelector("#store ul");
const category = document.querySelector("#category");
const radios = document.querySelectorAll("button.radio");

var musics, sfxs, musicCategories, sfxCategories;

async function initialize() {
  musics = await get("get.php?target=musics");
  sfxs = await get("get.php?target=sfxs");
  musicCategories = await get("get.php?target=music_categories");
  sfxCategories = await get("get.php?target=sfx_categories");

  renderMusics();
}

initialize();

function renderMusics() {
  list.innerHTML = `<center><i class="fa-solid fa-circle-notch fa-spin"></i></center>`;
  let html = "";

  musics.forEach((music) => {
    html += `<li><a href="#"><img src="https://www.echorbitaudio.com/resources/musics/images/${
      music.image
    }" /></a><div><span>${music.name}</span><span>${music.album ? music.album : " "}</span></div>
  <audio class="soundwave" controls><source src="https://www.echorbitaudio.com/resources/musics/audios/${
    music.audio
  }" type="audio/mp3" /></audio>
  <div class="price" onclick="cart(${music.id})"><span>${
      music.price
    }$</span> <i class="fa-solid fa-cart-shopping"></i> Add to cart</div>
  <div class="like" onclick="like(${music.id})"><i class="fa-regular fa-heart"></i></div></li>`;
  });

  list.innerHTML = html;
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
      musics.sort((first, second) => first.id - second.id);
      break;
    case 1:
      radios[1].classList.add("selected");
      musics.sort((first, second) => second.favorite - first.favorite);
      break;
    case 2:
      radios[2].classList.add("selected");
      musics.sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime());
      break;
  }

  renderMusics();
}

function like(id) {
  document.querySelectorAll(".like")[id - 1].children[0].classList.toggle("fa-regular");
  document.querySelectorAll(".like")[id - 1].children[0].classList.toggle("fa-solid");
}

function selectCategory(id) {
  category.children[id - 1].classList.toggle("selected");
}

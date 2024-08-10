const list = document.querySelector("#store ul");

async function renderMusics() {
  let musics = await get("get.php?target=musics");

  list.innerHTML = "";

  musics.forEach((music) => {
    list.innerHTML += `<li><a href="#"><img src="https://www.echorbitaudio.com/resources/musics/images/${
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
}

renderMusics();

const storeButtons = document.querySelectorAll("#store section:first-of-type button");
const likes = document.querySelectorAll("#store  section:last-of-type .like");

storeButtons.forEach((button) =>
  button.addEventListener("click", (event) => {
    button.classList.toggle("selected");
  })
);

likes.forEach((like) =>
  like.addEventListener("click", (event) => {
    like.children[0].classList.toggle("fa-regular");
    like.children[0].classList.toggle("fa-solid");
  })
);

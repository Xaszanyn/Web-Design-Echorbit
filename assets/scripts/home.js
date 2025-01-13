const featuredShowcase = document.querySelector("#featured-showcase");
const showcase = document.querySelector("#showcase");

(async function () {
  let slider = document.querySelector("header #slider");
  let slides = slider.children.length;

  document.querySelector("header i.right").addEventListener("click", () => {
    let pointer = (parseInt(slider.dataset.slide) + 1) % slides;
    slider.style.transform = `translateX(${pointer * -100}%)`;
    slider.dataset.slide = pointer;
  });

  document.querySelector("header i.left").addEventListener("click", () => {
    let pointer =
      slider.dataset.slide != 0 ? slider.dataset.slide - 1 : slides - 1;
    slider.style.transform = `translateX(${pointer * -100}%)`;
    slider.dataset.slide = pointer;
  });

  loginUserSession(false);

  (await get("get.php?target=featured-showcase")).forEach(
    (product) =>
      (featuredShowcase.innerHTML += `<a href="/product/?${product.id}" target="_blank"><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/${product.image}" /><span>${product.name}</span></a>`)
  );

  (await get("get.php?target=products")).forEach(
    (product) =>
      (showcase.innerHTML += product.display
        ? `<a href="/product/?${product.id}" target="_blank"><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/small/${product.image}" /></a>`
        : "")
  );
})();

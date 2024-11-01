const featuredShowcase = document.querySelector("#featured-showcase");
const showcase = document.querySelector("#showcase");

(async function () {
  loginUserSession(false);

  (await get("get.php?target=featured-showcase")).forEach(
    (product) =>
      (featuredShowcase.innerHTML += `<a href="/product/?${product.id}" target="_blank"><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/${product.image}" /><span>${product.name}</span></a>`)
  );

  (await get("get.php?target=products")).forEach(
    (product) =>
      (showcase.innerHTML += `<a href="/product/?${product.id}" target="_blank"><img src="https://echorbit-audio-public.s3.eu-north-1.amazonaws.com/covers/small/${product.image}" /></a>`)
  );
})();

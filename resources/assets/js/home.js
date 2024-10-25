const featuredShowcase = document.querySelector("#featured-showcase");
const showcase = document.querySelector("#showcase");

(async function () {
  loginUserSession(false);

  (await get("get.php?target=featured-showcase")).forEach(
    (product) =>
      (featuredShowcase.innerHTML += `<a href="/product?${product.id}"><img src="/resources/images/covers/${product.image}" /><span>${product.name}</span></a>`)
  );

  (await get("get.php?target=products")).forEach(
    (product) =>
      (showcase.innerHTML += `<a href="/product?${product.id}"><img src="/resources/images/covers/small/${product.image}" /></a>`)
  );
})();

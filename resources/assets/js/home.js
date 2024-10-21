const featuredShowcase = document.querySelector("#featured-showcase");
const showcase = document.querySelector("#showcase");

(async function () {
  (await get("get.php?target=featured-showcase")).forEach(
    (product) =>
      (featuredShowcase.innerHTML += `<a href="/product?${product.id}"><img src="/resources/images/covers/${product.image}" /><span>${product.name}</span></a>`)
  );

  showcases = await get("get.php?target=showcase");
  // await loginUserSession();
  // products = await get("get.php?target=products");
  // allCategories = await get("get.php?target=categories");
  // renderCartButton();
  // renderProducts();
  // renderFeatured();
  // assign(cartButton, viewCart);
})();

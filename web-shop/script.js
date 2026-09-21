const hero = document.querySelector(",flavor-hero")
hero.style.setProperty(
  "--hero-color-dark",
  flavor.colors.dark,
);

const typeElement = document.querySelector("#hero-type");
typeElement.textContent = flavor.type;

const titleElement = document.querySelector("#hero-title");
titleElement.textContent = flavor.title;

const descriptionElement = document.querySelector("#hero-description");
descriptionElement.textContent = flavor.description;

const priceElement = document.querySelector("#hero-price")
priceElement.textContent =`${flavor.price.toLocaleString("ru-RU")} ₽`;
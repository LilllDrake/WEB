/* изменение кнопок и банок */
const heroFlavors = [
  {
    type: "Варенье",
    title: "Яблоко и корица",
    description: "Янтарное варенье с кусочками яблок и тёплым ароматом корицы",
    price: 380,
    image: "images/hero-apple-cinnamon.png",
    alt: "Банка яблочного варенья с корицей",
    colors: {
      dark: "#633315",
      main: "#a76025",
      light: "#dca35f",
      glow: "#ffc263",
    },
  },
  {
    type: "Варенье",
    title: "Клубничное",
    description: "Нежное варенье из спелой клубники с ярким летним ароматом",
    price: 410,
    image: "images/hero-strawberry.png",
    alt: "Банка клубничного варенья",
    colors: {
      dark: "#59151d",
      main: "#c13c4d",
      light: "#f08b93",
      glow: "#ff5367",
    },
  },
  {
    type: "Варенье",
    title: "Облепиховое",
    description: "Золотистое варенье из облепихи с приятной цитрусовой кислинкой",
    price: 450,
    image: "images/hero-sea-buckthorn.png",
    alt: "Банка облепихового варенья",
    colors: {
      dark: "#71320e",
      main: "#c56719",
      light: "#efa43c",
      glow: "#ffac32",
    },
  },
  {
    type: "Варенье",
    title: "Чёрная смородина",
    description: "Густое варенье из чёрной смородины с насыщенным ягодным вкусом",
    price: 440,
    image: "images/hero-blackcurrant.png",
    alt: "Банка варенья из чёрной смородины",
    colors: {
      dark: "#25102f",
      main: "#59305f",
      light: "#9b628f",
      glow: "#c25fc9",
    },
  },
  {
    type: "Варенье",
    title: "Сосновые шишки",
    description: "Необычное лесное варенье с хвойным ароматом и мягким смолистым вкусом",
    price: 490,
    image: "images/hero-pine-cone.png",
    alt: "Банка варенья из сосновых шишек",
    colors: {
      dark: "#25301d",
      main: "#536035",
      light: "#9d8c52",
      glow: "#b9a45b",
    },
  },
  {
    type: "Варенье",
    title: "Малиновое",
    description: "Густое варенье из спелой малины с лёгкой ягодной кислинкой",
    price: 390,
    image: "images/hero-raspberry.png",
    alt: "Банка малинового варенья",
    colors: {
      dark: "#4b1027",
      main: "#a92e55",
      light: "#e37c93",
      glow: "#ff5c8a",
    },
  },
  {
    type: "Варенье",
    title: "Вишнёвое",
    description: "Ароматное варенье из сочной вишни с глубоким рубиновым вкусом",
    price: 420,
    image: "images/hero-cherry.png",
    alt: "Банка вишнёвого варенья",
    colors: {
      dark: "#3f0917",
      main: "#8d1735",
      light: "#d94c6a",
      glow: "#e62e5c",
    },
  },
  {
    type: "Конфитюр",
    title: "Черничный",
    description: "Нежный конфитюр из лесной черники с бархатистой текстурой",
    price: 450,
    image: "images/hero-blueberry.png",
    alt: "Банка черничного конфитюра",
    colors: {
      dark: "#201342",
      main: "#4b347d",
      light: "#8d6bc0",
      glow: "#8f6cff",
    },
  },
];

const hero = document.querySelector(".flavor-hero");
const heroPicture = document.querySelector(".flavor-hero__picture");
const typeElement = document.querySelector("#hero-type");
const titleElement = document.querySelector("#hero-title");
const descriptionElement = document.querySelector("#hero-description");
const priceElement = document.querySelector("#hero-price");
const imageElement = document.querySelector("#hero-image");
const flavorButtons = document.querySelectorAll(".flavor-hero__flavor");

const HERO_CHANGE_DELAY = 5000;
const HERO_FADE_DELAY = 220;

let currentHeroIndex = 0;
let heroTimerId;
let heroChangeTimeoutId;

function applyHeroFlavor(index, animate = true) {
  const flavor = heroFlavors[index];
  currentHeroIndex = index;

  clearTimeout(heroChangeTimeoutId);

  if (animate) {
    imageElement.classList.add("is-changing");
  }

  function updateContent() {
    typeElement.textContent = flavor.type;
    titleElement.textContent = flavor.title;
    descriptionElement.textContent = flavor.description;
    priceElement.textContent =
      `${flavor.price.toLocaleString("ru-RU")} ₽`;

    imageElement.src = flavor.image;
    imageElement.alt = flavor.alt;

    hero.style.setProperty("--hero-color-dark", flavor.colors.dark);
    hero.style.setProperty("--hero-color-main", flavor.colors.main);
    hero.style.setProperty("--hero-color-light", flavor.colors.light);
    hero.style.setProperty("--hero-glow-color", flavor.colors.glow);

    flavorButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    imageElement.classList.remove("is-changing");
  }

  if (animate) {
    heroChangeTimeoutId = setTimeout(updateContent, HERO_FADE_DELAY);
  } else {
    updateContent();
  }
}

function stopHeroTimer() {
  clearInterval(heroTimerId);
}

function startHeroTimer() {
  stopHeroTimer();

  heroTimerId = setInterval(() => {
    const nextIndex = (currentHeroIndex + 1) % heroFlavors.length;
    applyHeroFlavor(nextIndex);
  }, HERO_CHANGE_DELAY);
}

flavorButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    applyHeroFlavor(index);
    startHeroTimer();
  });
});

heroPicture.addEventListener("mouseenter", stopHeroTimer);
heroPicture.addEventListener("mouseleave", startHeroTimer);

applyHeroFlavor(0, false);
startHeroTimer();
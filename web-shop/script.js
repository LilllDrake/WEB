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

// длительность работы баннера - 5 секунд
const HERO_CHANGE_DELAY = 5000;
// ожидание 0,22 пока старая банка не исчезнет
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

// добавление карточек товаров
const products = [
  { title: "Яблочные чипсы", image: "images/apple-chips.jpeg", price: 280, category: "Фруктовые снеки", weight: "80 г", 
    description: "Хрустящие яблочные дольки с лёгким ароматом корицы" },
  { title: "Яблоко и корица", image: "images/apple-cinnamon-jam.png", price: 380, category: "Варенье", weight: "250 г", 
    description: "Ароматное янтарное варенье с кусочками яблок и пряной корицей" },
  { title: "Ягодный мармелад", image: "images/berry-marmalade.jpeg", price: 320, category: "Мармелад и пастила", weight: "180 г", 
    description: "Мягкий мармелад из малины, смородины и черники" },
  { title: "Варенье из чёрной смородины", image: "images/blackcurrant-jam.jpeg", price: 440, category: "Варенье", weight: "250 г", 
    description: "Густое варенье из чёрной смородины с глубоким ягодным вкусом и лёгкой кислинкой" },
  { title: "Черничный конфитюр", image: "images/blueberry-confiture.png", price: 450, category: "Джемы и конфитюры", weight: "220 г", 
    description: "Нежный конфитюр из лесной черники с однородной текстурой" },
  { title: "Вишнёвое варенье", image: "images/cherry-jam.png", price: 420, category: "Варенье", weight: "250 г", 
    description: "Ароматное варенье из сочной вишни с насыщенным вкусом" },
  { title: "Подарочный набор", image: "images/gift-set.jpeg", price: 1290, category: "Подарочные наборы", weight: "3 банки по 120 г", 
    description: "Малиновое, черничное и шишечное варенье в подарочной коробке" },
  { title: "Лимон и имбирь", image: "images/lemon-ginger-jam.jpeg", price: 430, category: "Варенье", weight: "250 г", 
    description: "Яркое цитрусовое варенье с кусочками лимона и лёгкой имбирной остротой" },
  { title: "Брусничное варенье", image: "images/lingonberry-jam.png", price: 460, category: "Варенье", weight: "250 г", 
    description: "Ароматное варенье из лесной брусники с выразительным кисло-сладким вкусом" },
  { title: "Манго и маракуйя", image: "images/mango-passionfruit-confiture.jpeg", price: 520, category: "Джемы и конфитюры", weight: "220 г",
    description: "Яркий тропический конфитюр из спелого манго и ароматной маракуйи",
    tags: ["Необычные вкусы"], },
  { title: "Груша и розмарин", image: "images/pear-rosemary-jam.jpeg", price: 490, category: "Варенье", weight: "250 г", 
    description: "Золотистое варенье с кусочками спелой груши и тонким ароматом розмарина",
    tags: ["Необычные вкусы"], },
  { title: "Варенье из сосновых шишек", image: "images/pine-cone-jam.png", price: 490, category: "Варенье", weight: "220 г", 
    description: "Необычное лесное варенье с хвойным ароматом и мягким смолистым вкусом",
    tags: ["Необычные вкусы"], },
  { title: "Слива и шоколад", image: "images/plum-chocolate-confiture.jpeg", price: 540, category: "Джемы и конфитюры", weight: "220 г", 
    description: "Густой сливовый конфитюр с глубоким вкусом тёмного шоколада",
    tags: ["Необычные вкусы"], },
  { title: "Малиновое варенье", image: "images/raspberry-jam.png", price: 390, category: "Варенье", weight: "250 г", 
    description: "Густое варенье из спелой малины с лёгкой ягодной кислинкой" },
  { title: "Брусничный соус", image: "images/lingonberry-sauce.jpeg", price: 390, category: "Соусы и чатни", weight: "200 г", 
    description: "Кисло-сладкий ягодный соус для сыра, птицы и горячих блюд" },
  { title: "Малина и роза", image: "images/raspberry-rose-jam.jpeg", price: 510, category: "Варенье", weight: "250 г", 
    description: "Ароматное малиновое варенье с целыми ягодами и нежными лепестками розы",
    tags: ["Необычные вкусы"], },
  { title: "Малиновый сироп", image: "images/raspberry-syrup.jpeg", price: 360, category: "Сиропы и напитки", weight: "250 мл", 
    description: "Концентрированный ягодный сироп для чая, лимонадов и десертов" },
  { title: "Облепиховое варенье", image: "images/sea-buckthorn-jam.png", price: 450, category: "Варенье", weight: "250 г", 
    description: "Яркое золотистое варенье из облепихи с приятной ягодной кислинкой",
    tags: ["Необычные вкусы"], },
  { title: "Клубничное варенье", image: "images/strawberry-jam.jpeg", price: 410, category: "Варенье", weight: "250 г", 
    description: "Нежное варенье из спелой клубники с насыщенным летним ароматом" },
  { title: "Томатный соус с чили", image: "images/tomato-chili-sauce.jpeg", price: 480, category: "Соусы и чатни", weight: "200 г", 
    description: "Густой томатный соус с насыщенным вкусом и умеренной остротой чили",
    tags: ["Необычные вкусы"], },
];

const catalogGrid = document.querySelector("#catalog-grid");
const categoryButtons = document.querySelectorAll(".sidebar__link[data-category]");
const catalogCount = document.querySelector("#catalog-count");

function renderProducts(items) {
  catalogGrid.innerHTML = "";
  catalogCount.textContent = `Найдено: ${items.length}`;

  items.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-card__image-wrap">
        <img
          class="product-card__image"
          src="${product.image}"
          alt="${product.title}"
          loading="lazy"
        />
        <span class="product-card__category">${product.category}</span>
      </div>

      <div class="product-card__body">
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__description">${product.description}</p>
        <p class="product-card__weight">${product.weight}</p>

        <div class="product-card__footer">
          <p class="product-card__price">
            ${product.price.toLocaleString("ru-RU")} ₽
          </p>
          <button type="button">Добавить в корзину</button>
        </div>
      </div>
    `;

    catalogGrid.append(card);
  });
}

// При открытии страницы показываем все товары.
renderProducts(products);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.category;

    const visibleProducts =
      selectedCategory === "Все"
        ? products
        : products.filter(
            (product) => product.category === selectedCategory ||
            product.tags?.includes(selectedCategory),
          );

    renderProducts(visibleProducts);

    categoryButtons.forEach((categoryButton) => {
      categoryButton.classList.toggle(
        "is-active",
        categoryButton === button,
      );
    });
  });
});

// создание карточки
products.forEach((product) => {
  const card = document.createElement("article");
  card.className = "product-card";

card.innerHTML = `
  <div class="product-card__image-wrap">
    <img
      class="product-card__image"
      src="${product.image}"
      alt="${product.title}"
      loading="lazy"
    />
    <span class="product-card__category">${product.category}</span>
  </div>

  <div class="product-card__body">
    <h3 class="product-card__title">${product.title}</h3>
    <p class="product-card__description">${product.description}</p>
    <p class="product-card__weight">${product.weight}</p>
    
    
    <div class="product-card__footer">
      <p class="product-card__price">
        ${product.price.toLocaleString("ru-RU")} ₽
      </p>
      <button type="button">Добавить в корзину</button>
    </div>
  </div>
`;

  catalogGrid.append(card);
});
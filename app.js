// todo:

let toaster = 20;
let carbs = 0;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const toasterHud = document.querySelector("#toaster-hud");
const carbsHud = document.querySelector("#carbs-hud");

function updatetoasterHud() {
  toasterHud.textContent = `🍞 toaster: ${toaster}`;
}

function updateCarbsHud() {
  carbsHud.textContent = `💪 Carbs gained: ${carbs}`;
}

function makeSandwich() {
  return new Promise((resolve, reject) => {
    if (toaster >= 2) {
      resolve("Enjoy your sandwich! 🥪🥪");
      toaster -= 2;
    } else {
      reject("I'm sorry sir we don't have enough toaster 😭😭");
    }
  });
}

const shop = document.querySelector("#shop-wrapper");
const toggleShop = document.querySelector("#toggle-shop");

toggleShop.addEventListener("click", () => {
  shop.classList.toggle("open");
});

function createFeedback(msg, elementTarget) {
  const feedback = document.createElement("p");
  feedback.classList.add("feedback");
  feedback.textContent = msg;

  const rect = elementTarget.getBoundingClientRect();

  x = rect.left + rect.width / 2;
  y = rect.top;

  feedback.style.left = `${x}px`;
  feedback.style.top = `${y - 65}px`;

  feedback.addEventListener("animationend", () => feedback.remove());
  document.body.appendChild(feedback);
}

function spawnSandwich() {
  const pop = new Audio("pop-7.mp3");
  pop.play();

  const sandwich = document.createElement("img");
  sandwich.src = "sandwich.png";
  sandwich.classList.add("sandwich");

  const width = Math.floor(Math.random() * 101) + 200;
  sandwich.style.width = `${width}px`;
  sandwich.style.position = "absolute";

  const sandwichCarbs = Math.round(width / 10);

  sandwich.addEventListener("load", () => {
    const height = sandwich.naturalHeight * (width / sandwich.naturalWidth);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const x = Math.random() * (screenWidth - width);
    const y = Math.random() * (screenHeight - height);

    sandwich.style.left = `${x}px`;
    sandwich.style.top = `${y}px`;
  });

  sandwich.addEventListener("click", () => {
    const munch = new Audio("munch.mp3");
    munch.currentTime = 0.28;
    munch.play();
    sandwich.remove();

    carbs += sandwichCarbs;
    updateCarbsHud();
    createFeedback(`+${sandwichCarbs} carbs 🥖💥`, sandwich);
  });

  document.body.appendChild(sandwich);
}

function makingToaster() {
  const refillBtn = document.querySelector("#refill");
  const btnText = refillBtn.querySelector(".button-text");
  const loader = refillBtn.querySelector(".loader-bar");

  refillBtn.disabled = true;
  btnText.textContent = "Toasting... 🍞";
  loader.style.width = "0%";
  loader.style.transition = "width 3s linear";
  loader.style.display = "block";

  requestAnimationFrame(() => {
    loader.style.width = "100%";
  });

  setTimeout(() => {
    const ding = new Audio("ding.mp3");
    ding.currentTime = 0.53;
    ding.play();

    btnText.textContent = "Refill the toaster!";
    loader.style.display = "none";
    refillBtn.disabled = false;

    toaster = 20;
    updatetoasterHud();
  }, 3000);
}

const sandwichBtn = document.querySelector("#sandwich");
sandwichBtn.addEventListener("click", (e) => {
  makeSandwich()
    .then((msg) => {
      createFeedback(msg, sandwichBtn);
      spawnSandwich();
      updatetoasterHud();
    })
    .catch((msg) => {
      createFeedback(msg, sandwichBtn);
      updatetoasterHud();
    });
});

const refill = document.querySelector("#refill");
refill.addEventListener("click", (e) => {
  if (toaster >= 20) {
    createFeedback("Your toaster is already full sir! 😭", refill);
    return;
  }
  createFeedback("making toaster! 😋", refill);
  makingToaster();
  setTimeout(() => {
    bread = 20;
    updateBreadHud();
    createFeedback("Bread refilled! 😋", refill);
  }, 3000);
});

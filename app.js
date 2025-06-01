import { shopItems, purchases } from "./shopItems.js";

// todo:

let toaster = 20;
let carbs = 0;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const toasterHud = document.querySelector("#toaster-hud");
const carbsHud = document.querySelector("#carbs-hud");
let lastMouseX = 0;
let lastMouseY = 0;

const refillBtn = document.querySelector("#refill");
const btnText = refillBtn.querySelector(".button-text");
const loader = refillBtn.querySelector(".loader-bar");

let isTodd = false;

window.addEventListener("mousemove", (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

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
      todd();
    } else {
      reject("I'm sorry sir we don't have enough toast 😭😭");
    }
  });
}

const shop = document.querySelector("#shop-wrapper");
const toggleShop = document.querySelector("#toggle-shop");

toggleShop.addEventListener("click", () => {
  shop.classList.toggle("open");
});

export function createFeedback(msg, elementTarget, isSandwich = false) {
  const feedback = document.createElement("p");
  feedback.classList.add("feedback");
  feedback.textContent = msg;

  let x, y;

  if (isSandwich) {
    // Place near cursor
    x = lastMouseX;
    y = lastMouseY - 100;
  } else {
    const rect = elementTarget.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top - 65;
  }

  feedback.style.left = `${x}px`;
  feedback.style.top = `${y}px`;

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
    createFeedback(`+${sandwichCarbs} carbs`, sandwich, true);
  });

  document.body.appendChild(sandwich);
}

function makingToaster() {
  createFeedback("making toaster! 😋", refill);
  refillBtn.disabled = true;
  btnText.textContent = "Heating up! 🍞";
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

    btnText.textContent = "Restock toast!";
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
  makingToaster();
  setTimeout(() => {
    toaster = 20;
    updatetoasterHud();
    createFeedback("Toaster refilled! 😋", refill);
  }, 3000);
});

const carbShop = document.querySelector("#carb-shop");

function dramaticPoof(element) {
  element.classList.add("poof");

  element.addEventListener("animationend", () => element.remove());
}

shopItems.forEach((item) => {
  const btn = document.createElement("button");
  btn.classList.add("shop-item");
  btn.textContent = `${item.name} (${item.cost} carbs)`;

  attachTooltip(btn, item.description);

  btn.addEventListener("click", () => {
    if (carbs >= item.cost) {
      carbs -= item.cost;
      updateCarbsHud();
      item.effect();

      dramaticPoof(btn);
    } else {
      createFeedback("Not enough carbs 🥲", btn);
    }
  });

  carbShop.appendChild(btn);
});

const sharedTooltip = document.createElement("div");
sharedTooltip.classList.add("tooltip");
document.body.appendChild(sharedTooltip);

function attachTooltip(element, text) {
  const moveTooltip = (e) => {
    sharedTooltip.style.left = `${e.pageX + 10}px`;
    sharedTooltip.style.top = `${e.pageY + 10}px`;
  };

  element.addEventListener("mouseenter", (e) => {
    sharedTooltip.textContent = text;
    sharedTooltip.style.display = "block";
    moveTooltip(e);
  });

  element.addEventListener("mousemove", moveTooltip);

  element.addEventListener("mouseleave", () => {
    sharedTooltip.style.display = "none";
  });
}

function todd() {
  if (toaster <= 0 && purchases.isTodd) {
    makingToaster();
  } else {
    return;
  }
}

window.give = function (amount) {
  carbs += amount;
  updateCarbsHud();
  console.log(`Gave ${amount} carbs! Total: ${carbs}`);
};

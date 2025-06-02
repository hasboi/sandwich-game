// ============ !imports ============
import { shopItems, purchases } from "./shopItems.js";
import { getUpgradeCost, createFeedback } from "./utils.js";

// ============ !state ============
export const state = {
  toast: 0,
  carbs: 0,
  lastMouseX: 0,
  lastMouseY: 0,
  maxToast: 20,
};

// ============ !DOM refs ============
const $ = (sel) => document.querySelector(sel);
const toasterHud = $("#toaster-hud");
const carbsHud = $("#carbs-hud");
const sandwichBtn = $("#sandwich");
const refillBtn = $("#refill");
const btnText = refillBtn.querySelector(".button-text");
const loader = refillBtn.querySelector(".loader-bar");
const shop = $("#shop-wrapper");
const toggleShop = $("#toggle-shop");
const carbShop = $("#carb-shop");

// ============ !HUD updates ============
const updateHUD = () => {
  toasterHud.textContent = `🍞 Toast slices: ${state.toast}`;
  carbsHud.textContent = `💪 Carbs gained: ${state.carbs}`;
};

// ============ !event listeners ============
window.addEventListener("mousemove", (e) => {
  [state.lastMouseX, state.lastMouseY] = [e.clientX, e.clientY];
});

toggleShop.addEventListener("click", () => {
  shop.classList.toggle("open");
});

sandwichBtn.addEventListener("click", () => {
  makeSandwich()
    .then((msg) => {
      createFeedback(msg, sandwichBtn);
      spawnSandwich();
    })
    .catch((msg) => createFeedback(msg, sandwichBtn))
    .finally(updateHUD);
});

refillBtn.addEventListener("click", () => {
  if (state.toast >= state.maxToast) {
    createFeedback("Your toaster is already full sir! 😭", refillBtn);
    return;
  }
  makingToaster();
  setTimeout(() => {
    state.toast = state.maxToast;
    updateHUD();
    createFeedback("Toaster refilled! 😋", refillBtn);
  }, 3000);
});

// ============ !sandwich logic ============
function makeSandwich() {
  return new Promise((resolve, reject) => {
    if (state.toast >= 2) {
      state.toast -= 2;
      todd();
      resolve("Enjoy your sandwich! 🥪🥪");
    } else {
      reject("I'm sorry sir we don't have enough toast 😭😭");
    }
  });
}

function spawnSandwich() {
  const pop = new Audio("pop-7.mp3");
  pop.play();

  const sandwich = document.createElement("img");
  sandwich.src = "sandwich.png";
  sandwich.classList.add("sandwich");

  const width = Math.floor(Math.random() * 101) + 200;
  const sandwichCarbs = Math.round(width / 10);
  sandwich.style.width = `${width}px`;
  sandwich.style.position = "absolute";

  sandwich.onload = () => {
    const height = sandwich.naturalHeight * (width / sandwich.naturalWidth);
    const x = Math.random() * (window.innerWidth - width);
    const y = Math.random() * (window.innerHeight - height);

    Object.assign(sandwich.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  };

  sandwich.onclick = () => {
    const munch = new Audio("munch.mp3");
    munch.currentTime = 0.28;
    munch.play();
    sandwich.remove();

    state.carbs += sandwichCarbs;
    updateHUD();
    createFeedback(`+${sandwichCarbs} carbs`, sandwich, true);
  };

  document.body.appendChild(sandwich);
}

// ============ !toaster logic ============
function makingToaster() {
  createFeedback("making toaster! 😋", refillBtn);
  refillBtn.disabled = true;
  btnText.textContent = "Heating up! 🍞";

  Object.assign(loader.style, {
    width: "0%",
    display: "block",
    transition: "width 3s linear",
  });

  requestAnimationFrame(() => (loader.style.width = "100%"));

  setTimeout(() => {
    const ding = new Audio("ding.mp3");
    ding.currentTime = 0.53;
    ding.play();

    state.toast = state.maxToast;
    updateHUD();
    btnText.textContent = "Restock toast!";
    loader.style.display = "none";
    refillBtn.disabled = false;
  }, 3000);
}

export function todd() {
  if (state.toast < 2 && purchases.isTodd) {
    makingToaster();
  }
}

// ============ !shop logic ============
shopItems.forEach((item) => {
  const btn = document.createElement("button");
  btn.classList.add("shop-item");

  const getLevel = () =>
    item.upgradable ? purchases[`${item.id}Level`] || 0 : 0;
  const getCost = () =>
    getUpgradeCost(item.baseCost, getLevel(), item.multiplier);

  const updateBtnText = () => {
    const level = getLevel();
    const cost = getCost();
    const lvText = item.upgradable ? ` Lv.${level + 1}` : "";
    btn.textContent = `${item.name}${lvText} (${cost} carbs)`;
  };

  updateBtnText();
  attachTooltip(btn, item.description);

  btn.addEventListener("click", () => {
    const cost = getCost();

    if (state.carbs >= cost) {
      state.carbs -= cost;
      updateHUD();
      item.effect();
      createFeedback(item.feedback, btn);

      if (!item.upgradable) {
        dramaticPoof(btn);
      } else {
        updateBtnText();
      }
    } else {
      createFeedback("Not enough carbs 🥲", btn);
    }
  });

  carbShop.appendChild(btn);
});

// ============ !tooltips ============
const sharedTooltip = document.createElement("div");
sharedTooltip.classList.add("tooltip");
document.body.appendChild(sharedTooltip);

function attachTooltip(el, text) {
  const moveTooltip = (e) => {
    sharedTooltip.style.left = `${e.pageX + 10}px`;
    sharedTooltip.style.top = `${e.pageY + 10}px`;
  };

  el.addEventListener("mouseenter", (e) => {
    sharedTooltip.textContent = text;
    sharedTooltip.style.display = "block";
    moveTooltip(e);
  });

  el.addEventListener("mousemove", moveTooltip);
  el.addEventListener("mouseleave", () => {
    sharedTooltip.style.display = "none";
  });
}

// ============ !utils ============
function dramaticPoof(element) {
  element.classList.add("poof");
  element.addEventListener("animationend", () => element.remove());
}

// ============ !debugs ============
window.give = function (amount) {
  state.carbs += amount;
  updateHUD();
  console.log(`Gave ${amount} carbs! Total: ${state.carbs}`);
};

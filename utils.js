import { state } from "./app.js";

export function getUpgradeCost(baseCost, level, multiplier = 1.5) {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

export function createFeedback(msg, elementTarget, isSandwich = false) {
  const feedback = document.createElement("p");
  feedback.classList.add("feedback");
  feedback.textContent = msg;

  const [x, y] = isSandwich
    ? [state.lastMouseX, state.lastMouseY - 100]
    : [
        elementTarget.getBoundingClientRect().left +
          elementTarget.offsetWidth / 2,
        elementTarget.getBoundingClientRect().top - 65,
      ];

  Object.assign(feedback.style, {
    left: `${x}px`,
    top: `${y}px`,
  });

  feedback.addEventListener("animationend", () => feedback.remove());
  document.body.appendChild(feedback);
}

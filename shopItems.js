import { todd, state } from "./app.js";

export const shopItems = [
  {
    id: "todd",
    name: "Hire Chef Todd",
    baseCost: 350,
    description:
      "When there is no toast, there is only Todd. And when there is only Todd... there will soon be toast.",
    feedback: "Chef Todd hired 👨‍🍳",
    upgradable: false,
    effect: () => {
      purchases.isTodd = true;
      todd();
    },
  },
  {
    id: "coil",
    name: "Toaster Coil",
    baseCost: 300,
    description:
      "*Slaps roof of toaster* This bad boy can fit so much f--king toast in it (adds 5 toast capacity).",
    feedback: "Toaster Coil upgraded 🔥",
    upgradable: true,
    effect: () => {
      purchases.coilLevel += 1;
      state.maxToast += 5;
    },
    multiplier: 1.4,
  },
];

export const purchases = {
  isTodd: false,
  coilLevel: 0,
};

import { createFeedback } from "./app.js";

export const shopItems = [
  {
    name: "Hire Chef Todd",
    cost: 350,
    description:
      "When there is no toast, there is only Todd. And when there is only Todd... there will soon be toast.",
    effect: () => {
      createFeedback(
        "Chef Todd hired 👨‍🍳",
        document.querySelector("#carb-shop")
      );
      purchases.isTodd = true;
    },
  },
];

export const purchases = {
  isTodd: false,
};

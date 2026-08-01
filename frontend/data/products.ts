// Catalog seed data for the prototype store.

export type Category = "Drinks" | "Noodles" | "Chips" | "Biscuits" | "Sweets";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  image: string;
  promo?: boolean;
}

export const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Drinks",
  "Noodles",
  "Chips",
  "Biscuits",
  "Sweets",
];

export const PRODUCTS: Product[] = [
  {
    id: "oreo-biscuit",
    name: "Oreo Biscuit",
    description: "Chocolate sandwich cookies",
    price: 0.8,
    stock: 24,
    category: "Biscuits",
    image: "🍪",
  },
  {
    id: "coca-cola",
    name: "Coca Cola",
    description: "Chilled 330ml can",
    price: 0.75,
    stock: 30,
    category: "Drinks",
    image: "🥤",
    promo: true,
  },
  {
    id: "mama-tom-yum",
    name: "Mama Noodles",
    description: "Tom yum shrimp flavour",
    price: 0.6,
    stock: 40,
    category: "Noodles",
    image: "🍜",
  },
  {
    id: "lays-classic",
    name: "Lay's Classic",
    description: "Salted potato chips",
    price: 1.1,
    stock: 18,
    category: "Chips",
    image: "🍟",
  },
  {
    id: "nescafe-latte",
    name: "Nescafé Latte",
    description: "Ready to drink 240ml",
    price: 1.25,
    stock: 12,
    category: "Drinks",
    image: "☕",
  },
  {
    id: "snickers",
    name: "Snickers Bar",
    description: "Peanut caramel chocolate",
    price: 1.0,
    stock: 20,
    category: "Sweets",
    image: "🍫",
  },
  {
    id: "pocky-strawberry",
    name: "Pocky Strawberry",
    description: "Biscuit sticks, 45g pack",
    price: 1.2,
    stock: 15,
    category: "Biscuits",
    image: "🍓",
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    description: "Chilled 500ml bottle",
    price: 0.4,
    stock: 60,
    category: "Drinks",
    image: "💧",
  },
  {
    id: "cheese-ring",
    name: "Cheese Ring",
    description: "Crispy corn snack rings",
    price: 0.9,
    stock: 22,
    category: "Chips",
    image: "🧀",
  },
  {
    id: "gummy-bears",
    name: "Gummy Bears",
    description: "Fruit chews, 80g bag",
    price: 1.05,
    stock: 16,
    category: "Sweets",
    image: "🐻",
    promo: true,
  },
];

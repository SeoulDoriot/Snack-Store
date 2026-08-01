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
  /** Flags the product for the Offers banner. */
  promo?: boolean;
  /** Flags the product for the "Popular picks" section. */
  popular?: boolean;
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
  // ---- Drinks ----
  {
    id: "coca-cola",
    name: "Coca Cola",
    description: "Chilled 330ml can",
    price: 0.75,
    stock: 30,
    category: "Drinks",
    image: "🥤",
    promo: true,
    popular: true,
  },
  {
    id: "nescafe-latte",
    name: "Nescafé Latte",
    description: "Ready to drink 240ml",
    price: 1.25,
    stock: 12,
    category: "Drinks",
    image: "☕",
    popular: true,
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    description: "Chilled 500ml bottle",
    price: 0.4,
    stock: 60,
    category: "Drinks",
    image: "💧",
    popular: true,
  },
  {
    id: "orange-juice",
    name: "Orange Juice",
    description: "No sugar added, 250ml",
    price: 1.1,
    stock: 18,
    category: "Drinks",
    image: "🧃",
  },
  {
    id: "iced-tea-lemon",
    name: "Lemon Iced Tea",
    description: "Refreshing 500ml bottle",
    price: 0.85,
    stock: 26,
    category: "Drinks",
    image: "🍋",
  },
  {
    id: "milk-choco",
    name: "Chocolate Milk",
    description: "Cold 200ml carton",
    price: 0.95,
    stock: 21,
    category: "Drinks",
    image: "🥛",
  },
  {
    id: "energy-drink",
    name: "Energy Drink",
    description: "For late-night study, 250ml",
    price: 1.5,
    stock: 9,
    category: "Drinks",
    image: "⚡",
  },
  {
    id: "soy-milk",
    name: "Soy Milk",
    description: "Lightly sweetened, 300ml",
    price: 0.9,
    stock: 15,
    category: "Drinks",
    image: "🫘",
  },

  // ---- Noodles ----
  {
    id: "mama-tom-yum",
    name: "Mama Noodles",
    description: "Tom yum shrimp flavour",
    price: 0.6,
    stock: 40,
    category: "Noodles",
    image: "🍜",
    popular: true,
  },
  {
    id: "indomie-goreng",
    name: "Indomie Goreng",
    description: "Fried noodles, classic",
    price: 0.7,
    stock: 35,
    category: "Noodles",
    image: "🍲",
    popular: true,
  },
  {
    id: "cup-noodle-chicken",
    name: "Cup Noodle Chicken",
    description: "Just add hot water",
    price: 1.0,
    stock: 22,
    category: "Noodles",
    image: "🥡",
  },
  {
    id: "kimchi-ramen",
    name: "Kimchi Ramen",
    description: "Spicy Korean style",
    price: 1.3,
    stock: 14,
    category: "Noodles",
    image: "🌶️",
  },
  {
    id: "beef-instant-noodle",
    name: "Beef Noodles",
    description: "Rich beef broth pack",
    price: 0.8,
    stock: 27,
    category: "Noodles",
    image: "🐄",
  },
  {
    id: "glass-noodle-soup",
    name: "Glass Noodle Soup",
    description: "Light and quick",
    price: 0.95,
    stock: 0,
    category: "Noodles",
    image: "🍥",
  },

  // ---- Chips ----
  {
    id: "lays-classic",
    name: "Lay's Classic",
    description: "Salted potato chips",
    price: 1.1,
    stock: 18,
    category: "Chips",
    image: "🍟",
    popular: true,
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
    id: "seaweed-crisps",
    name: "Seaweed Crisps",
    description: "Roasted, lightly salted",
    price: 1.2,
    stock: 16,
    category: "Chips",
    image: "🍘",
  },
  {
    id: "prawn-crackers",
    name: "Prawn Crackers",
    description: "Crunchy shrimp flavour",
    price: 0.85,
    stock: 24,
    category: "Chips",
    image: "🍤",
  },
  {
    id: "tortilla-chips",
    name: "Tortilla Chips",
    description: "Corn chips with a kick",
    price: 1.35,
    stock: 11,
    category: "Chips",
    image: "🌽",
  },
  {
    id: "popcorn-butter",
    name: "Butter Popcorn",
    description: "Ready-to-eat 60g bag",
    price: 1.0,
    stock: 19,
    category: "Chips",
    image: "🍿",
  },

  // ---- Biscuits ----
  {
    id: "oreo-biscuit",
    name: "Oreo Biscuit",
    description: "Chocolate sandwich cookies",
    price: 0.8,
    stock: 24,
    category: "Biscuits",
    image: "🍪",
    popular: true,
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
    id: "cream-wafer",
    name: "Cream Wafer",
    description: "Layered vanilla wafer",
    price: 0.65,
    stock: 30,
    category: "Biscuits",
    image: "🧇",
  },
  {
    id: "butter-cookies",
    name: "Butter Cookies",
    description: "Danish style tin, small",
    price: 1.6,
    stock: 8,
    category: "Biscuits",
    image: "🥮",
  },
  {
    id: "cracker-salt",
    name: "Salt Crackers",
    description: "Light and crispy",
    price: 0.55,
    stock: 33,
    category: "Biscuits",
    image: "🧂",
  },

  // ---- Sweets ----
  {
    id: "snickers",
    name: "Snickers Bar",
    description: "Peanut caramel chocolate",
    price: 1.0,
    stock: 20,
    category: "Sweets",
    image: "🍫",
    popular: true,
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
  {
    id: "lollipop-mix",
    name: "Lollipop Mix",
    description: "Assorted fruit flavours",
    price: 0.35,
    stock: 50,
    category: "Sweets",
    image: "🍭",
  },
  {
    id: "mochi-red-bean",
    name: "Red Bean Mochi",
    description: "Soft rice cake, 4 pieces",
    price: 1.45,
    stock: 10,
    category: "Sweets",
    image: "🍡",
  },
  {
    id: "donut-sugar",
    name: "Sugar Donut",
    description: "Baked fresh this morning",
    price: 0.9,
    stock: 12,
    category: "Sweets",
    image: "🍩",
  },
  {
    id: "ice-cream-cup",
    name: "Ice Cream Cup",
    description: "Vanilla, 100ml",
    price: 1.25,
    stock: 0,
    category: "Sweets",
    image: "🍨",
  },
];

/** Home page sections, in display order. */
export interface Section {
  id: string;
  title: string;
  subtitle: string;
  match: (product: Product) => boolean;
}

export const SECTIONS: Section[] = [
  {
    id: "available",
    title: "Available now",
    subtitle: "Everything in stock right this minute",
    match: (product) => product.stock > 0,
  },
  {
    id: "popular",
    title: "Popular picks",
    subtitle: "What students order most",
    match: (product) => Boolean(product.popular),
  },
  {
    id: "drinks",
    title: "Drinks",
    subtitle: "Cold from the fridge",
    match: (product) => product.category === "Drinks",
  },
  {
    id: "quick",
    title: "Quick snacks",
    subtitle: "Chips and biscuits to grab fast",
    match: (product) =>
      product.category === "Chips" || product.category === "Biscuits",
  },
  {
    id: "sweet",
    title: "Sweet treats",
    subtitle: "For when you need sugar",
    match: (product) => product.category === "Sweets",
  },
  {
    id: "noodles",
    title: "Noodles",
    subtitle: "Hot meals in three minutes",
    match: (product) => product.category === "Noodles",
  },
];

/** Featured posters. Deliberately no price and no add action. */
export interface Feature {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  art: string;
  /** Category the poster jumps to when clicked. */
  target: "All" | Category;
  tone: "0" | "1" | "2";
}

export const FEATURES: Feature[] = [
  {
    id: "late-night",
    eyebrow: "Late night",
    title: "Study fuel, delivered",
    text: "Coffee, energy drinks and noodles until 9PM.",
    art: "☕",
    target: "Drinks",
    tone: "0",
  },
  {
    id: "hot-meals",
    eyebrow: "Three minutes",
    title: "Hot noodles to your room",
    text: "Just add hot water and you're done.",
    art: "🍜",
    target: "Noodles",
    tone: "1",
  },
  {
    id: "sweet-tooth",
    eyebrow: "Treat yourself",
    title: "Something sweet",
    text: "Chocolate, mochi and ice cream in stock.",
    art: "🍫",
    target: "Sweets",
    tone: "2",
  },
];

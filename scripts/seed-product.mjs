// Quick seed script to insert a dummy product for testing
const PRODUCT_DATA = {
  title: "Legends - Color Edition",
  description: "Dive into a world of enchanting myths and legendary creatures with our most intricate coloring book yet. Each page reveals a hidden masterpiece as you color by number, transforming simple tiles into breathtaking mosaic art.",
  shortDescription: "34 unique mosaic illustrations inspired by myths and legends. Transform numbered tiles into stunning artwork.",
  theme: "Animals",
  difficulty: "intermediate",
  coverImage: "https://picsum.photos/seed/noble-cover/600/800",
  galleryImages: [
    "https://picsum.photos/seed/noble-g1/600/800",
    "https://picsum.photos/seed/noble-g2/600/800",
    "https://picsum.photos/seed/noble-g3/600/800",
    "https://picsum.photos/seed/noble-g4/600/800",
    "https://picsum.photos/seed/noble-g5/600/800",
    "https://picsum.photos/seed/noble-g6/600/800",
    "https://picsum.photos/seed/noble-g7/600/800",
    "https://picsum.photos/seed/noble-g8/600/800",
  ],
  amazonLink: "https://www.amazon.com/dp/example",
  bulletPoints: [
    "34 unique mosaic illustrations inspired by myths and legends",
    "Thoughtful quotes on every page from ancient wisdom and legends",
    "Color palette on every page with shade testers for perfect matching",
    "QR code on every page to reveal the original hidden artwork",
    "15 vibrant colors used throughout with easy-to-match guide",
    "5 unique background variations with comfortable coloring",
    "Coloring bookmarks + free book of art/coloring pages as bonus",
  ],
  aPlusContent: [
    {
      type: "fullWidth",
      title: "Discover the Art Hidden in Every Tile",
      content: "Each mosaic conceals a breathtaking illustration. As you color tile by tile, a legendary creature or mythical scene emerges from the pattern.",
      image: "https://picsum.photos/seed/noble-aplus1/1200/600",
    },
    {
      type: "twoColumn",
      title: "Color List with Shade Testers",
      content: "Every page includes a complete list of all the colors used, along with shade testers so you can match your markers perfectly before committing to the page.",
      image: "https://picsum.photos/seed/noble-aplus2/800/600",
    },
    {
      type: "featureHighlight",
      title: "What Makes This Book Special",
      items: [
        {
          title: "List of Colours on Each Page",
          description: "Each page includes a comprehensive list of all colours and markers needed, with shade testers so you can perfectly match your colors before committing.",
          icon: "🎨",
        },
        {
          title: "A True Mystery + Secret Reveal",
          description: "Hidden within every mosaic design is a secret artwork. Scan the QR code to reveal the completed masterpiece and discover what creature hides in the tiles.",
          icon: "🔍",
        },
        {
          title: "Thought & New Legends",
          description: "Every page features an inspiring thought or mythological legend tied to the hidden artwork, giving deeper meaning to your creative journey.",
          icon: "✨",
        },
      ],
    },
    {
      type: "lifestyle",
      title: "Perfect for Relaxation",
      content: "Unwind after a long day with our carefully designed mosaic puzzles. The meditative process of coloring each numbered tile brings calm and focus.",
      image: "https://picsum.photos/seed/noble-aplus3/1200/600",
    },
    {
      type: "twoColumn",
      title: "Bold Lines & 5×5mm Cells",
      content: "Designed with clear, bold outlines and comfortable 5×5mm cell sizes, making it easy to color neatly even with larger markers. No squinting required!",
      image: "https://picsum.photos/seed/noble-aplus4/800/600",
    },
  ],
  rating: 4.8,
  reviewCount: 142,
  price: "$12.99",
  featured: true,
};

async function seed() {
  try {
    const res = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(PRODUCT_DATA),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("✅ Product created successfully!");
      console.log("Slug:", data.product.slug);
      console.log("URL: http://localhost:3000/product/" + data.product.slug);
    } else {
      console.error("❌ Failed:", data);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

seed();

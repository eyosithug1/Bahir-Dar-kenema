import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

import User from './models/User.js';
import Product from './models/Product.js';
import News from './models/News.js';
import LiveScore from './models/LiveScore.js';
import Player from './models/Player.js';

dotenv.config();

const squadData = [
  { name: "Pape N'Diaye", country: "Senegal", age: 34, number: 1, position: "Goalkeeper", role: "GK" },
  { name: "Yigermal Mequanint", country: "Ethiopia", age: 21, number: 16, position: "Goalkeeper", role: "GK" },
  { name: "Saido Pepe", country: "Ethiopia", age: 25, number: 30, position: "Goalkeeper", role: "GK" },
  { name: "Boubacar Doumbia", country: "Mali", age: 33, number: 2, position: "Defender", role: "DF" },
  { name: "Wendimeneh Dereje", country: "Ethiopia", age: 26, number: 3, position: "Defender", role: "DF" },
  { name: "Yihenew Yemata", country: "Ethiopia", age: 28, number: 4, position: "Defender", role: "DF" },
  { name: "Amsalu Sale", country: "Ethiopia", age: 24, number: 5, position: "Defender", role: "DF" },
  { name: "Fitsum Fitalew", country: "Ethiopia", age: 27, number: 13, position: "Defender", role: "DF" },
  { name: "Kidus Yohanes", country: "Ethiopia", age: 22, number: 15, position: "Defender", role: "DF" },
  { name: "Kindu Bayelign", country: "Ethiopia", age: 29, number: 21, position: "Defender", role: "DF" },
  { name: "Getachew Anemut", country: "Ethiopia", age: 28, number: 22, position: "Defender", role: "DF" },
  { name: "Mesay Agegnehu", country: "Ethiopia", age: 25, number: 24, position: "Defender", role: "DF" },
  { name: "Girma Disasa", country: "Ethiopia", age: 26, number: 27, position: "Defender", role: "DF" },
  { name: "Frezer Kasa", country: "Ethiopia", age: 23, number: 33, position: "Defender", role: "DF" },
  { name: "Bereket Tigabu", country: "Ethiopia", age: 27, number: 6, position: "Midfielder", role: "MF" },
  { name: "Fikremichael Alemu", country: "Ethiopia", age: 29, number: 8, position: "Midfielder", role: "MF" },
  { name: "Henok Yebeltal", country: "Ethiopia", age: 26, number: 10, position: "Midfielder", role: "MF" },
  { name: "Fitsum Alemu", country: "Ethiopia", age: 25, number: 14, position: "Midfielder", role: "MF" },
  { name: "Daniel Hailu", country: "Ethiopia", age: 24, number: 18, position: "Midfielder", role: "MF" },
  { name: "Hailu Hassen", country: "Ethiopia", age: 22, number: 20, position: "Midfielder", role: "MF" },
  { name: "Metages Mulye", country: "Ethiopia", age: 21, number: 23, position: "Midfielder", role: "MF" },
  { name: "Kwabena Boateng", country: "Ghana", age: 28, number: 7, position: "Forward", role: "FW" },
  { name: "Seth Osei", country: "Ghana", age: 27, number: 9, position: "Forward", role: "FW" },
  { name: "Amanuel Gebremichael", country: "Ethiopia", age: 25, number: 11, position: "Forward", role: "FW" },
  { name: "Wondwessen Belete", country: "Ethiopia", age: 26, number: 12, position: "Forward", role: "FW" },
  { name: "Yohannes Dereje", country: "Ethiopia", age: 23, number: 17, position: "Forward", role: "FW" },
  { name: "Anteneh Tefera", country: "Ethiopia", age: 24, number: 19, position: "Forward", role: "FW" },
  { name: "Feysel Ahmed", country: "Ethiopia", age: 22, number: 25, position: "Forward", role: "FW" },
  { name: "Chernet Gugsa", country: "Ethiopia", age: 27, number: 26, position: "Forward", role: "FW" },
  { name: "Mujib Kassim", country: "Ethiopia", age: 25, number: 28, position: "Forward", role: "FW" },
  { name: "Firew Solomon", country: "Ethiopia", age: 23, number: 29, position: "Forward", role: "FW" },
  { name: "Jerome Philip", country: "Nigeria", age: 26, number: 31, position: "Forward", role: "FW" },
  { name: "Kidanemaryam Tasfaye", country: "Ethiopia", age: 21, number: 32, position: "Forward", role: "FW" }
];

const shopItems = [
  { name: "Home Jersey 2024/25", price: 850, originalPrice: 1200, category: "Jerseys", description: "Official Bahir Dar Kenema home jersey featuring vibrant blue and waves of Lake Tana motif.", stock: 45, discount: 29, images: [{ url: "/BDK_asset/club jerssey/1ndkit (1).webp" }] },
  { name: "Away Jersey 2024/25", price: 850, originalPrice: 1100, category: "Jerseys", description: "Crisp white away jersey with club heritage accents.", stock: 38, discount: 0, images: [{ url: "/BDK_asset/club jerssey/2ndkit.webp" }] },
  { name: "Third Kit Limited", price: 950, originalPrice: 1300, category: "Jerseys", description: "Exclusive third kit edition featuring gold accents.", stock: 15, discount: 15, images: [{ url: "/BDK_asset/club jerssey/3rdkit.webp" }] },
  { name: "Training Kit Pro", price: 650, originalPrice: 800, category: "Training Wear", description: "Breathable ergonomic training wear engineered for maximum agility.", stock: 50, discount: 0, images: [{ url: "/BDK_asset/club jerssey/images (42).jpeg" }] },
  { name: "Team Scarf", price: 350, originalPrice: 400, category: "Accessories", description: "Double-knit supporter scarf with woven club crest.", stock: 80, discount: 0, images: [{ url: "/BDK_asset/club fan/images (27).jpeg" }] },
  { name: "Baseball Cap", price: 450, originalPrice: 500, category: "Accessories", description: "Premium embroidered snapback cap with reinforced visor.", stock: 65, discount: 0, images: [{ url: "/BDK_asset/club fan/images (29).jpeg" }] },
  { name: "Water Bottle", price: 280, originalPrice: 320, category: "Accessories", description: "Eco-friendly BPA-free sports hydration bottle.", stock: 100, discount: 0, images: [{ url: "/BDK_asset/club jerssey/images (40).jpeg" }] },
  { name: "Phone Case", price: 320, originalPrice: 380, category: "Accessories", description: "Shockproof phone case with high-resolution club insignia.", stock: 75, discount: 0, images: [{ url: "/BDK_asset/club stadium/images (19).jpeg" }] },
  { name: "Backpack", price: 680, originalPrice: 850, category: "Accessories", description: "Durable multi-compartment backpack with padded straps.", stock: 30, discount: 10, images: [{ url: "/BDK_asset/club stadium/images (20).jpeg" }] },
  { name: "Keychain", price: 150, originalPrice: 200, category: "Accessories", description: "Heavy-duty metallic crest keychain.", stock: 120, discount: 0, images: [{ url: "/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp" }] }
];

const matchesData = [
  {
    matchTitle: "BDK vs Saint George SC",
    homeTeam: "Bahir Dar Kenema",
    awayTeam: "Saint George SC",
    homeScore: 2,
    awayScore: 1,
    matchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    matchTime: "15:00",
    venue: "Bahir Dar International Stadium",
    status: "finished",
    competition: "Ethiopian Premier League",
    statistics: {
      possession: { home: 56, away: 44 },
      shots: { home: 14, away: 8 },
      fouls: { home: 9, away: 12 }
    }
  },
  {
    matchTitle: "BDK vs Fasil Kenema",
    homeTeam: "Bahir Dar Kenema",
    awayTeam: "Fasil Kenema",
    homeScore: 0,
    awayScore: 0,
    matchDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    matchTime: "16:00",
    venue: "Bahir Dar International Stadium",
    status: "upcoming",
    competition: "Ethiopian Premier League"
  },
  {
    matchTitle: "Ethiopian Coffee vs BDK",
    homeTeam: "Ethiopian Coffee",
    awayTeam: "Bahir Dar Kenema",
    homeScore: 1,
    awayScore: 1,
    matchDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    matchTime: "15:00",
    venue: "Abebe Bikila Stadium",
    status: "finished",
    competition: "Ethiopian Premier League",
    statistics: {
      possession: { home: 49, away: 51 },
      shots: { home: 10, away: 11 },
      fouls: { home: 14, away: 10 }
    }
  }
];

const newsArticles = [
  {
    title: "Waves of Lake Tana: Historic Victory at Bahir Dar International Stadium",
    description: "Bahir Dar Kenema put on a tactical masterclass in front of 40,000 roaring home fans.",
    content: "The Blue Army demonstrated unparalleled determination yesterday afternoon as Bahir Dar Kenema claimed a vital 2-1 victory. The stadium came alive from the opening whistle with relentless pressing and fast-paced transitions. Coach Degarege praised the collective spirit and congratulated supporters for creating an electrifying atmosphere.",
    category: "Match Report",
    tags: ["Victory", "Premier League", "Lake Tana"],
    featuredImage: { url: "/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp" }
  },
  {
    title: "Official 2024/25 Kit Showcase: Inspired by Tradition",
    description: "The club proudly unveils the official jersey trio celebrating 50 years of excellence.",
    content: "Crafted with lightweight breathable fabrics and traditional motifs, the 2024/25 kit honors Bahir Dar's historic heritage. Available now at our official online club store and the stadium boutique.",
    category: "News",
    tags: ["Merchandise", "Jersey", "Store"],
    featuredImage: { url: "/BDK_asset/club jerssey/1ndkit (1).webp" }
  },
  {
    title: "Squad Focus: Head Coach Degarege Yigzaw Outlines Ambitions",
    description: "Exclusive interview with the manager discussing team chemistry and tactical evolution.",
    content: "In an exclusive chat with the club media, Head Coach Degarege touched upon integrating youth prospects and welcoming foreign additions including Boubacar Doumbia and Pape N'Diaye into the tactical system.",
    category: "Interview",
    tags: ["Coach", "Interview", "Tactics"],
    featuredImage: { url: "/BDK_asset/club team squad/bahir-dar-kenema-continue-chasing-saint-george-in-the-v0-20zfjd3aspsa1.jpg" }
  }
];

export const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bdk_football');
    console.log('Seeder: Connected to MongoDB');

    // 1. Seed or find Admin User
    let admin = await User.findOne({ email: 'admin@bdkfc.com' });
    if (!admin) {
      admin = await User.create({
        firstName: 'BDK',
        lastName: 'Admin',
        email: 'admin@bdkfc.com',
        phone: '0911223344',
        password: 'AdminPassword123!',
        role: 'admin',
        bio: 'Official Bahir Dar Kenema FC administrator'
      });
      console.log('Seeder: Created default admin: admin@bdkfc.com (AdminPassword123!)');
    }

    // 2. Seed Players if empty
    const playerCount = await Player.countDocuments();
    if (playerCount === 0) {
      await Player.insertMany(squadData.map(p => ({
        ...p,
        stats: { appearances: 18, goals: p.role === 'FW' ? 8 : (p.role === 'MF' ? 3 : 0), assists: 4 }
      })));
      console.log(`Seeder: Seeded ${squadData.length} BDK squad players`);
    }

    // 3. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(shopItems.map(item => ({
        ...item,
        createdBy: admin._id
      })));
      console.log(`Seeder: Seeded ${shopItems.length} official merchandise products`);
    }

    // 4. Seed Matches if empty
    const matchCount = await LiveScore.countDocuments();
    if (matchCount === 0) {
      await LiveScore.insertMany(matchesData.map(m => ({
        ...m,
        updatedBy: admin._id
      })));
      console.log(`Seeder: Seeded ${matchesData.length} matches`);
    }

    // 5. Seed News if empty
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      for (const item of newsArticles) {
        await News.create({
          ...item,
          author: admin._id,
          published: true
        });
      }
      console.log(`Seeder: Seeded ${newsArticles.length} news articles`);
    }

    console.log('Seeder: All mock seed checks completed successfully!');
  } catch (error) {
    console.error('Seeder error:', error);
  }
};

// If run directly from terminal
if (process.argv[1] && process.argv[1].endsWith('seedDatabase.js')) {
  seedDatabase().then(() => process.exit(0));
}

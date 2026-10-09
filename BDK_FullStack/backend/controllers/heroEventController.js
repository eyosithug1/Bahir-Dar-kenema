import HeroEvent from '../models/HeroEvent.js';

// Default initial BDK cards to seed if DB is empty
const defaultHeroEvents = [
  {
    title: 'Tana Derby: BDK vs Fasil Kenema',
    category: '🔥 Tana Derby',
    image: {
      url: '/BDK_asset/club team squad/bahir-dar-kenema-continue-chasing-saint-george-in-the-v0-20zfjd3aspsa1.jpg',
      public_id: 'default_1'
    },
    date: 'Sun, Nov 15 • 16:00 EAT',
    venue: "Bahir Dar Int'l Stadium",
    ticketPrice: 'From 50 ETB • VIP 200 ETB',
    badgeColor: 'gold',
    link: '/matches',
    isActive: true,
    order: 1
  },
  {
    title: 'Ethiopian Premier League: BDK vs Saint George',
    category: '🏆 Premier League',
    image: {
      url: '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp',
      public_id: 'default_2'
    },
    date: 'Sat, Nov 21 • 15:00 EAT',
    venue: "Bahir Dar Int'l Stadium (60k)",
    ticketPrice: 'From 60 ETB',
    badgeColor: 'blue',
    link: '/matches',
    isActive: true,
    order: 2
  },
  {
    title: 'CAF Confederation Cup: Group Stage Clash',
    category: '🌍 Continental Cup',
    image: {
      url: '/BDK_asset/club team squad/photo_2026-02-14_09-02-45.jpg',
      public_id: 'default_3'
    },
    date: 'Wed, Dec 02 • 19:00 EAT',
    venue: "Bahir Dar Int'l Stadium",
    ticketPrice: 'From 100 ETB • VIP 350 ETB',
    badgeColor: 'green',
    link: '/matches',
    isActive: true,
    order: 3
  },
  {
    title: '50th Jubilee Fan Festival & Trophy Gala',
    category: '🎉 Club Festival',
    image: {
      url: '/BDK_asset/club jerssey/1ndkit (1).webp',
      public_id: 'default_4'
    },
    date: 'Sat, Dec 12 • 10:00 EAT',
    venue: 'Lake Tana Waterfront Arena',
    ticketPrice: 'Free Entry • Fans Welcome',
    badgeColor: 'purple',
    link: '/fan-wall',
    isActive: true,
    order: 4
  }
];

// Seed default events if collection is empty
const seedDefaultEventsIfNeeded = async () => {
  const count = await HeroEvent.countDocuments();
  if (count === 0) {
    await HeroEvent.insertMany(defaultHeroEvents);
  }
};

// @desc    Get active hero events for client (continuous marquee)
// @route   GET /api/hero-events
// @access  Public
export const getHeroEvents = async (req, res) => {
  try {
    await seedDefaultEventsIfNeeded();
    const events = await HeroEvent.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all hero events (active + inactive) for admin management
// @route   GET /api/admin/hero-events
// @access  Admin
export const getAllHeroEventsAdmin = async (req, res) => {
  try {
    await seedDefaultEventsIfNeeded();
    const events = await HeroEvent.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a new hero event card
// @route   POST /api/admin/hero-events
// @access  Admin
export const createHeroEvent = async (req, res) => {
  try {
    const { title, category, image, date, venue, ticketPrice, badgeColor, link, isActive, order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide event title' });
    }

    if (!image || !image.url) {
      return res.status(400).json({ success: false, message: 'Please provide event image' });
    }

    const newEvent = await HeroEvent.create({
      title,
      category: category || 'Premier League',
      image,
      date: date || 'Matchday Coming Soon',
      venue: venue || "Bahir Dar Int'l Stadium",
      ticketPrice: ticketPrice || 'From 50 ETB',
      badgeColor: badgeColor || 'gold',
      link: link || '/matches',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      createdBy: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Hero event card created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update hero event card
// @route   PUT /api/admin/hero-events/:id
// @access  Admin
export const updateHeroEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let event = await HeroEvent.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Hero event not found' });
    }

    event = await HeroEvent.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Hero event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle whether this card rotates in hero marquee (Admin quick switch)
// @route   PUT /api/admin/hero-events/:id/toggle
// @access  Admin
export const toggleHeroEventActive = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await HeroEvent.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Hero event not found' });
    }

    event.isActive = !event.isActive;
    event.updatedAt = Date.now();
    await event.save();

    res.status(200).json({
      success: true,
      message: event.isActive ? 'Card enabled for hero carousel rotation' : 'Card hidden from hero carousel rotation',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete hero event card
// @route   DELETE /api/admin/hero-events/:id
// @access  Admin
export const deleteHeroEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await HeroEvent.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Hero event not found' });
    }

    await HeroEvent.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Hero event card deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load .env manually for standalone script execution
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
const DB_NAME = process.env.DB_NAME || 'Manoj';

export async function runSeeder() {
  console.log(`Connecting to MySQL at ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);

  // Step 1: Connect to server without DB to ensure DB exists
  const rootConn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD
  });

  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  console.log(`Database '${DB_NAME}' ensured.`);
  await rootConn.end();

  // Step 2: Connect to the Manoj database
  const db = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  console.log(`Connected to database '${DB_NAME}'. Creating tables...`);

  // 1. Admins Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // 2. Rooms Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(50) NOT NULL,
      price INT DEFAULT 0,
      show_price BOOLEAN DEFAULT TRUE,
      price_basis VARCHAR(100) DEFAULT 'Per Room / Per Night',
      capacity VARCHAR(100) NOT NULL,
      location VARCHAR(150) NOT NULL,
      primary_image VARCHAR(255) NOT NULL,
      features JSON NOT NULL,
      dining_note TEXT,
      disclaimer TEXT,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // 3. Room Images Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS room_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_id INT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      caption VARCHAR(255) DEFAULT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 0,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );
  `);

  // 4. Jeep Safaris Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS jeep_safaris (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(150) NOT NULL,
      badge VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      duration VARCHAR(100) NOT NULL,
      terrain_tag VARCHAR(100) NOT NULL,
      price_info VARCHAR(150) DEFAULT '₹2,500 – ₹4,500 per Jeep / Package',
      weather_note TEXT,
      primary_image VARCHAR(255) NOT NULL,
      gallery_images JSON DEFAULT NULL,
      is_featured_trail BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // 5. Tour Packages Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS tour_packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(150) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      badge VARCHAR(100) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      price INT DEFAULT 0,
      show_price BOOLEAN DEFAULT TRUE,
      price_basis VARCHAR(100) DEFAULT 'Per Person (Per Head)',
      destinations VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      poster_image VARCHAR(255) DEFAULT NULL,
      itinerary JSON DEFAULT NULL,
      inclusions JSON NOT NULL,
      exclusions JSON NOT NULL,
      group_note TEXT,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // 6. Destinations Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      tamil VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      image VARCHAR(255) NOT NULL,
      badge VARCHAR(100) NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 0
    );
  `);

  // 7. Sightseeing Spots Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS sightseeing_spots (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      location VARCHAR(150) NOT NULL,
      timing VARCHAR(100) NOT NULL,
      image VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      guidance TEXT NOT NULL,
      badge VARCHAR(100) NOT NULL,
      sort_order INT DEFAULT 0
    );
  `);

  // 8. Gallery Items Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      src VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      sort_order INT DEFAULT 0
    );
  `);

  // 9. Reviews Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      location_tag VARCHAR(150) NOT NULL,
      rating INT DEFAULT 5,
      review_text TEXT NOT NULL,
      sort_order INT DEFAULT 0
    );
  `);

  console.log('Tables created. Seeding initial data...');

  // --- SEED ADMIN ---
  const [existingAdmins] = await db.query('SELECT id FROM admins WHERE username = ?', ['admin']);
  if (existingAdmins.length === 0) {
    const defaultHash = await bcrypt.hash('password', 10);
    await db.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', defaultHash]);
    console.log('Seeded default admin: username="admin", password="password"');
  }

  // --- SEED ROOMS ---
  const roomsSeed = [
    {
      slug: 'standard-non-ac-room',
      name: 'Standard Non-AC Room',
      category: 'deluxe',
      price: 2000,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 Adults (Up to 3 with extra bed)',
      location: 'Marayoor / Kanthalloor, Idukki',
      primary_image: '/assets/images/room_standard_non_ac.jpg',
      features: ['Mountain Air Breezy View', 'Attached Clean Bathroom', 'Comfortable Double Bed', 'Free Wi-Fi & Parking', 'Hot Water Assistance'],
      dining_note: 'Homely Kerala breakfast & dinner available on order.',
      disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season and must be confirmed on WhatsApp.',
      sort_order: 1,
      gallery: [
        '/assets/images/room_standard_non_ac.jpg',
        '/assets/images/hero_munnar_mountain.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'standard-ac-room',
      name: 'Standard AC Room',
      category: 'deluxe',
      price: 2500,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 Adults',
      location: 'Marayoor Town / Valley Edge',
      primary_image: '/assets/images/room_standard_ac.jpg',
      features: ['Individual Air Conditioning', 'Work Desk & Fast Wi-Fi', 'Complimentary Bottled Water', 'Attached Modern Bathroom', 'Power Backup'],
      dining_note: 'Fresh home-style Kerala meals prepared on request.',
      disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.',
      sort_order: 2,
      gallery: [
        '/assets/images/room_standard_ac.jpg',
        '/assets/images/hero_munnar_mountain.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'deluxe-room',
      name: 'Deluxe Room',
      category: 'deluxe',
      price: 2500,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 Adults (Couples & Solo)',
      location: 'Kanthalloor Fruit Orchard Zone',
      primary_image: '/assets/images/room_deluxe.jpg',
      features: ['Panoramic Mist Window View', 'King Size Spring Bed', 'HD Satellite TV', 'Modern Vanity & Hot Shower', 'Tea / Coffee Station'],
      dining_note: 'Delicious local dining & campfire setup available.',
      disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.',
      sort_order: 3,
      gallery: [
        '/assets/images/room_deluxe.jpg',
        '/assets/images/dest_kanthaloor.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'super-deluxe-room',
      name: 'Super Deluxe Room',
      category: 'deluxe',
      price: 3000,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 - 3 Adults',
      location: 'Scenic Mountain Valley Viewpoint',
      primary_image: '/assets/images/room_super_deluxe.jpg',
      features: ['Private Balcony Mountain View', 'Luxury King Bed', 'Warm Ceiling Lighting', 'Work Desk & High-Speed Wi-Fi', '24/7 Hot Water'],
      dining_note: 'In-room or balcony tea & dining service.',
      disclaimer: 'Price Basis: Per Room / Per Night. Reconfirm availability before booking.',
      sort_order: 4,
      gallery: [
        '/assets/images/room_super_deluxe.jpg',
        '/assets/images/hero_munnar_mountain.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'premium-room',
      name: 'Premium Room',
      category: 'deluxe',
      price: 3500,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 - 3 Adults',
      location: 'Munnar / Marayoor Tea Belt',
      primary_image: '/assets/images/room_premium.jpg',
      features: ['Floor-to-Ceiling Glass Views', 'Tea Garden Panorama', 'Balcony Sit-Out Area', 'Luxury Bath Amenities', 'Room Service'],
      dining_note: 'Authentic Kerala Sadya or non-veg curry on order.',
      disclaimer: 'Price Basis: Per Room / Per Night. Rates subject to seasonal reconfirmation.',
      sort_order: 5,
      gallery: [
        '/assets/images/room_premium.jpg',
        '/assets/images/dest_munnar.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'executive-room',
      name: 'Executive Room',
      category: 'deluxe',
      price: 4000,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 Adults (VIP / Business)',
      location: 'Marayoor Heritage Foothills',
      primary_image: '/assets/images/room_executive.jpg',
      features: ['Executive Workstation & Ergonomic Chair', 'Scenic Mountain Balcony', 'Modern Minimalist Decor', 'Large LED TV', 'Mini Fridge'],
      dining_note: 'Gourmet home-cooked dining coordination.',
      disclaimer: 'Price Basis: Per Room / Per Night.',
      sort_order: 6,
      gallery: [
        '/assets/images/room_executive.jpg',
        '/assets/images/dest_marayoor.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'family-room',
      name: 'Family Room',
      category: 'family',
      price: 4500,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '4 Adults + 2 Kids',
      location: 'Spacious Nature Garden Property',
      primary_image: '/assets/images/room_family.jpg',
      features: ['2 Large Double Beds', 'Accommodates 4 Adults comfortably', 'Spacious Living Layout', 'Attached Luxury Bath', 'Children Play Space'],
      dining_note: 'Family dining hall & group campfire with music.',
      disclaimer: 'Price Basis: Per Room / Per Night. Ideal for family groups.',
      sort_order: 7,
      gallery: [
        '/assets/images/room_family.jpg',
        '/assets/images/hero_munnar_mountain.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'swimming-pool-property',
      name: 'Swimming Pool Property',
      category: 'pool',
      price: 5000,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 - 4 Adults',
      location: 'Kanthalloor Valley Resort',
      primary_image: '/assets/images/room_pool_property.jpg',
      features: ['Resort Swimming Pool Access', 'Surrounded by Palms & Hills', 'Poolside Lounge Chairs', 'Music & Campfire Area', 'Scenic Sunset Views'],
      dining_note: 'Buffet or plated Kerala meals with poolside dining.',
      disclaimer: 'Price Basis: Per Room / Per Night. Pool timings and safety rules apply.',
      sort_order: 8,
      gallery: [
        '/assets/images/room_pool_property.jpg',
        '/assets/images/dest_kanthaloor.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'suite-room',
      name: 'Suite Room',
      category: 'family',
      price: 5500,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 Adults (Honeymoon / Luxury)',
      location: 'Marayoor Sandalwood Panorama',
      primary_image: '/assets/images/room_suite.jpg',
      features: ['Private Luxury Living Lounge', 'Premium Woodwork', 'Royal King Bed', 'Scenic Valley Balcony', 'Candlelight Dinner Setup'],
      dining_note: 'Special honeymoon dinner setup available upon advance notice.',
      disclaimer: 'Price Basis: Per Room / Per Night. Subject to date confirmation.',
      sort_order: 9,
      gallery: [
        '/assets/images/room_suite.jpg',
        '/assets/images/dest_marayoor.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'premium-swimming-pool-property',
      name: 'Premium Swimming Pool Property',
      category: 'pool',
      price: 6000,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 - 4 Adults',
      location: 'Exclusive Ridge Resort',
      primary_image: '/assets/images/room_premium_pool.jpg',
      features: ['Infinity Pool Experience', 'Evening Golden Illumination', 'Luxury Gazebo Lounge', 'Mountain Ridge Backdrop', 'Private Sun Deck'],
      dining_note: 'Premium multi-course Kerala delicacies on order.',
      disclaimer: 'Price Basis: Per Room / Per Night. Pool usage guidelines apply.',
      sort_order: 10,
      gallery: [
        '/assets/images/room_premium_pool.jpg',
        '/assets/images/hero_client_jeep.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    // CRITICAL CLIENT REPLACEMENT: River House / Rooms Near the River (replacing any falls house)
    {
      slug: 'riverside-cottage-river-house',
      name: 'Riverside Cottage / River House (Rooms Near the River)',
      category: 'river',
      price: 3500,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 - 4 Adults',
      location: 'Near the River, Marayoor / Anakulam River Stream',
      primary_image: '/assets/images/room_cottage_villa.jpg',
      features: [
        'Rooms Near the River with soothing natural river stream views & breeze',
        'Riverside sit-out veranda & relaxation chairs',
        'Riverside campfire area with music & stars',
        'Attached modern bath & 24/7 hot water',
        'Homely Kerala meals & fresh river fish on order'
      ],
      dining_note: 'Fresh home-style Kerala meals and barbecue setup by the river stream.',
      disclaimer: 'Price Basis: Per Room / Per Night. Waterfront property; advance booking recommended.',
      sort_order: 11,
      gallery: [
        '/assets/images/room_cottage_villa.jpg',
        '/assets/images/dest_anakulam.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'exclusive-cottage-villa',
      name: 'Exclusive Cottage / Villa',
      category: 'cottage',
      price: 7500,
      show_price: 1,
      price_basis: 'Per Night (Full Villa / Cottage)',
      capacity: '4 - 6 Adults (Private Group)',
      location: 'Secluded Private Farm Plantation',
      primary_image: '/assets/images/room_cottage_villa.jpg',
      features: ['Private Standalone Villa', 'Artisanal Wood & Stone Build', 'Private Veranda & Lawn', 'Accommodates up to 6 Guests', 'Dedicated Campfire Pit'],
      dining_note: 'Personal cook / customized meal packages available.',
      disclaimer: 'Price Basis: Per Villa / Per Night. Best for private families & friends.',
      sort_order: 12,
      gallery: [
        '/assets/images/room_cottage_villa.jpg',
        '/assets/images/dest_kanthaloor.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'forest-jungle-stay',
      name: 'Forest Nature / Jungle Stay',
      category: 'jungle',
      price: 3000,
      show_price: 1,
      price_basis: 'Per Room / Per Night',
      capacity: '2 - 4 Adults',
      location: 'Forest Edge, Marayoor / Chinnar Border',
      primary_image: '/assets/images/dest_kanthaloor.jpg',
      features: ['Surrounded by indigenous high-range forest trees', 'Early morning birdwatching & wildlife calls', 'Private forest veranda & campfire pit', 'Attached modern bathroom', 'Homely tribal Kerala food'],
      dining_note: 'Traditional ethnic forest meals cooked in clay pots.',
      disclaimer: 'Price Basis: Per Room / Per Night. Experience raw nature and fresh mountain air.',
      sort_order: 13,
      gallery: [
        '/assets/images/dest_kanthaloor.jpg',
        '/assets/images/hero_munnar_mountain.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'scenic-aframe-cottage',
      name: 'Scenic A-Frame Wooden Nature Cottage',
      category: 'aframe',
      price: 4500,
      show_price: 1,
      price_basis: 'Per Night (Cottage)',
      capacity: '2 - 3 Adults',
      location: 'Kanthalloor Valley Panorama',
      primary_image: '/assets/images/hero_munnar_mountain.jpg',
      features: ['Architectural triangular A-frame glass facade', 'Mezzanine sleeping loft with mountain views', 'Private outdoor sit-out deck & campfire area', 'High-speed Wi-Fi & tea/coffee station', 'Warm ambient lighting'],
      dining_note: 'Cozy balcony breakfast & private candlelit dinner.',
      disclaimer: 'Price Basis: Per Cottage / Per Night. Perfect for couples and photography lovers.',
      sort_order: 14,
      gallery: [
        '/assets/images/hero_munnar_mountain.jpg',
        '/assets/images/dest_marayoor.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    },
    {
      slug: 'adventure-camping-tent-stay',
      name: 'High-Range Adventure Camping & Tent Stay',
      category: 'tent',
      price: 1500,
      show_price: 1,
      price_basis: 'Per Person / Per Night',
      capacity: '2 Adults per Tent',
      location: 'Misty Hilltop Camping Site, Kanthalloor',
      primary_image: '/assets/images/dest_vagamon.jpg',
      features: ['Weatherproof alpine camping tents with sleeping bags', 'Stargazing campsite with campfire & music', 'Clean shared washrooms with hot water', 'Traditional Kerala dinner & breakfast included', 'Safe secure gated camping grounds'],
      dining_note: 'Campfire barbecue & hot Kerala buffet dinner.',
      disclaimer: 'Price Basis: Per Person / Per Night. Camping gear and blankets provided.',
      sort_order: 15,
      gallery: [
        '/assets/images/dest_vagamon.jpg',
        '/assets/images/service_campfire.jpg',
        '/assets/images/hero_client_jeep.jpg',
        '/assets/images/service_kerala_food.jpg'
      ]
    }
  ];

  for (const r of roomsSeed) {
    const [existing] = await db.query('SELECT id FROM rooms WHERE slug = ?', [r.slug]);
    let roomId;
    if (existing.length === 0) {
      const [res] = await db.query(
        `INSERT INTO rooms (slug, name, category, price, show_price, price_basis, capacity, location, primary_image, features, dining_note, disclaimer, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.slug, r.name, r.category, r.price, r.show_price, r.price_basis, r.capacity, r.location, r.primary_image, JSON.stringify(r.features), r.dining_note, r.disclaimer, r.sort_order]
      );
      roomId = res.insertId;
      console.log(`Seeded room: ${r.name}`);
    } else {
      roomId = existing[0].id;
    }

    // Seed room images
    const [imgs] = await db.query('SELECT id FROM room_images WHERE room_id = ?', [roomId]);
    if (imgs.length === 0 && r.gallery) {
      for (let i = 0; i < r.gallery.length; i++) {
        await db.query(
          `INSERT INTO room_images (room_id, image_url, caption, is_primary, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [roomId, r.gallery[i], `${r.name} - Photo ${i + 1}`, i === 0 ? 1 : 0, i]
        );
      }
    }
  }

  // --- SEED 10 JEEP SAFARI TRAILS & EXPERIENCES ---
  const safariSeed = [
    {
      slug: 'muruganpara-off-road-peak',
      title: 'Muruganmala / Muruganpara Off-Road Experience',
      badge: '⛰️ Peak Safari',
      description: 'Thrilling rocky mountain ascent to 6,200+ ft with panoramic 360° views across Kerala & Tamil Nadu borders. High-altitude cool breeze and scenic rock formations.',
      duration: '3 - 4 Hours',
      terrain_tag: 'Rugged Climb',
      price_info: '₹2,500 – ₹3,500 per Jeep',
      weather_note: 'Road conditions and summit mist vary with rain. Driver discretion applies.',
      primary_image: '/assets/images/jeep_mountain_peak.jpg',
      sort_order: 1
    },
    {
      slug: 'bhramaram-misty-mountain-point',
      title: 'Bhramaram Shooting Point',
      badge: '🌫️ Misty Ridge',
      description: 'Famous movie shooting point ridge overlooking fruit orchards, deep fog carpets, and endless rolling Western Ghats. Unmatched sunrise & sunset visual views.',
      duration: '2 - 3 Hours',
      terrain_tag: 'Sunrise / Sunset',
      price_info: '₹2,000 – ₹3,000 per Jeep',
      weather_note: 'Spectacular in morning fog and golden twilight.',
      primary_image: '/assets/images/jeep_safari_mountain.jpg',
      sort_order: 2
    },
    {
      slug: 'irachilpara-kacharam-waterfalls',
      title: 'Irachilpara & Kacharam Waterfalls Trail',
      badge: '🌊 Waterfall Trail',
      description: 'Off-road track winding deep through dense rainforest foliage and crystal boulder streams to secluded forest cascades. Seasonal natural plunge pools and cool sprays.',
      duration: 'Half Day (3 - 4 Hours)',
      terrain_tag: 'Natural Cascades',
      price_info: '₹2,500 – ₹3,500 per Jeep',
      weather_note: 'Best flow during and after monsoon. Non-slip footwear recommended.',
      primary_image: '/assets/images/jeep_green_forest.jpg',
      sort_order: 3
    },
    {
      slug: 'anakulam-wild-elephant-stream',
      title: 'Anakulam Wild Elephant Stream Safari',
      badge: '🐘 Elephant Stream',
      description: 'Watch wild elephant herds gather naturally in the riverbed to drink mineral water, with safe 4x4 boulder-stream crossings and deep forest trails.',
      duration: '4 - 5 Hours',
      terrain_tag: 'Wildlife Sighting',
      price_info: '₹3,000 – ₹4,500 per Jeep',
      weather_note: 'Natural wildlife sighting is subject to forest conditions and animal movement.',
      primary_image: '/assets/images/jeep_adventure_real.jpg',
      sort_order: 4
    },
    {
      slug: 'sandalwood-forest-walk',
      title: 'Sandalwood Forest / Sandal Forest Walk',
      badge: '🌿 Protected Heritage',
      description: 'Scenic drive through India\'s only natural reserve sandalwood forest maintained by Kerala Forest Dept. Guided walking trails through aromatic sandalwood trees.',
      duration: '2 - 3 Hours',
      terrain_tag: 'Protected Forest',
      price_info: 'Included in Marayoor tour packages',
      weather_note: 'Restricted fenced forest zones require official forest department guide.',
      primary_image: '/assets/images/dest_marayoor.jpg',
      sort_order: 5
    },
    {
      slug: 'kanthalloor-fruit-gardens',
      title: 'Kanthalloor Fruit Garden & Strawberry Orchards',
      badge: '🍓 Fruit Orchards',
      description: 'Cool-climate terraced farm drive visiting apple, strawberry, plum, orange, and passion fruit plantations. Taste fresh seasonal fruits right off the tree.',
      duration: '2 - 3 Hours',
      terrain_tag: 'Terraced Farm Trail',
      price_info: 'Included in Kanthalloor packages',
      weather_note: 'Fruit ripening and harvest depend on month and seasonal farm permissions.',
      primary_image: '/assets/images/dest_kanthaloor.jpg',
      sort_order: 6
    },
    {
      slug: 'honey-rock-viewpoint',
      title: 'Honey Rock (Thenkoodu Para) Viewpoint',
      badge: '🪨 Cliff View',
      description: 'Majestic cliff edge famous for giant natural wild bee combs hanging from rocky heights. Breathtaking valley views across tea and sugarcane plains.',
      duration: '2 Hours',
      terrain_tag: 'Scenic Valley Ridge',
      price_info: '₹1,500 – ₹2,500 per Jeep',
      weather_note: 'Keep distance from rock edges and maintain environmental silence.',
      primary_image: '/assets/images/hero_munnar_mountain.jpg',
      sort_order: 7
    },
    {
      slug: 'marayoor-jaggery-unit',
      title: 'Traditional Marayoor Jaggery Unit',
      badge: '🍯 GI-Tagged Craft',
      description: 'Live visit to artisanal jaggery sheds where pure sugarcane juice is hand-boiled into the famous GI-tagged Marayoor Sharkara. Taste warm, fresh jaggery.',
      duration: '1.5 - 2 Hours',
      terrain_tag: 'Artisan Heritage',
      price_info: 'Included in Marayoor sightseeing',
      weather_note: 'Live processing depends on farm production schedule and farm permissions.',
      primary_image: '/assets/images/service_kerala_food.jpg',
      sort_order: 8
    },
    {
      slug: 'muniyara-megalithic-dolmens',
      title: 'Muniyara Megalithic Dolmens',
      badge: '🪨 Ancient Heritage',
      description: 'Ancient stone burial chambers (Dolmens) dating back thousands of years to the Megalithic Iron Age, perched on rocky hills with vast valley panoramas.',
      duration: '2 Hours',
      terrain_tag: 'Archaeological Stone Trail',
      price_info: 'Included in Marayoor sightseeing',
      weather_note: 'Protected archaeological site. Please respect historical monuments.',
      primary_image: '/assets/images/dest_marayoor.jpg',
      sort_order: 9
    },
    {
      slug: 'zipline-adventure',
      title: 'Zipline Adventure Experience',
      badge: '⚡ Thrill Ride',
      description: 'High-speed cable slide over verdant tea bushes and valley dips with professional safety harness. Superb adrenaline rush for young adults and families.',
      duration: '1 Hour',
      terrain_tag: 'Valley Aerial Cable',
      price_info: '₹500 – ₹800 per ride (separate ticket)',
      weather_note: 'Subject to safe weather operations, wind conditions, and operator clearance.',
      primary_image: '/assets/images/service_jeep_safari.jpg',
      sort_order: 10
    }
  ];

  for (const s of safariSeed) {
    const [existing] = await db.query('SELECT id FROM jeep_safaris WHERE slug = ?', [s.slug]);
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO jeep_safaris (slug, title, badge, description, duration, terrain_tag, price_info, weather_note, primary_image, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.slug, s.title, s.badge, s.description, s.duration, s.terrain_tag, s.price_info, s.weather_note, s.primary_image, s.sort_order]
      );
      console.log(`Seeded Jeep Safari: ${s.title}`);
    }
  }

  // --- SEED TOUR PACKAGES (7 Posters + Client Brief) ---
  const packagesSeed = [
    {
      slug: 'pkg-marayoor-1day',
      title: 'Marayoor & Kanthalloor One Day Trip',
      subtitle: 'Nature • Adventure • Relaxation — All in One Package',
      badge: '🔥 Special Offer ₹1,500',
      duration: '1 Night / 1 Day Stay & Safari',
      price: 1500,
      show_price: 1,
      price_basis: 'Per Person (Per Head)',
      destinations: 'Marayoor & Kanthalloor',
      image: '/assets/images/dest_kanthaloor.jpg',
      poster_image: '/assets/images/poster_pkg_marayoor_1day.jpg',
      inclusions: [
        'Homely Food (Dinner & Breakfast included)',
        'Comfortable Stay in Nature',
        'Night Campfire with Music & Fun',
        '4x4 Off-Road Jeep Safari Adventure Ride',
        'Sightseeing: Waterfalls, Scenic Views, Anakotta (Muniyara Dolmens) & Wildlife Spots'
      ],
      exclusions: [
        'Personal expenses & lunches not listed',
        'Optional forest entry/camera fees where applicable',
        'Outstation pickup/drop unless added separately'
      ],
      group_note: 'Ideal for families, friends & groups. Children below 5 yrs FREE; 5–10 yrs ₹300.',
      sort_order: 1
    },
    {
      slug: 'pkg-anakulam',
      title: 'Anakulam Wild Beauty Tour Package',
      subtitle: 'Explore the Hidden Paradise • Nature, Adventure & Memories',
      badge: '🐘 Wild Elephant Special ₹2,000',
      duration: '1 Night / 2 Days Getaway',
      price: 2000,
      show_price: 1,
      price_basis: 'Per Person (Per Head)',
      destinations: 'Anakulam, Mankulam & Forest Riverbed',
      image: '/assets/images/dest_anakulam.jpg',
      poster_image: '/assets/images/poster_pkg_anakulam.jpg',
      inclusions: [
        'Traditional Kerala Breakfast (Idli, Dosa, Sambar & Tea)',
        'Homely Kerala Dinner (Sadya / Meals)',
        'Comfortable Nature-View Room Accommodation',
        'Evening Campfire with String Lights & Music',
        'Open-Top 4x4 Jeep Safari to Anakulam Elephant Stream & River Crossing'
      ],
      exclusions: [
        'Lunch & personal beverages',
        'Forest checkpost/entry permits if applicable'
      ],
      group_note: 'Perfect getaway for friends, family & groups. Wildlife sightings are natural and subject to forest conditions.',
      sort_order: 2
    },
    {
      slug: 'pkg-vagamon',
      title: 'Mesmerizing Vagamon "Scotland of Kerala" Package',
      subtitle: 'Nature • Peace • Adventure — All in One Place!',
      badge: '⛰️ Hill Station Special ₹2,500',
      duration: '1 Night / 2 Days Meadow Tour',
      price: 2500,
      show_price: 1,
      price_basis: 'Per Person (Per Head)',
      destinations: 'Vagamon Green Meadows, Pine Forest, Suicide Point & Misty Mountains',
      image: '/assets/images/dest_vagamon.jpg',
      poster_image: '/assets/images/poster_pkg_vagamon.jpg',
      inclusions: [
        'Food: Homely & Delicious Kerala Meals',
        'Jeep: Thrilling 4x4 Jeep Safari Adventure',
        'Accommodation: Comfortable Stay in Nature',
        'Campfire: Enjoy Music, Fun & Bonfire',
        'Guide: Experienced Local Guide for a Safe Journey'
      ],
      exclusions: [
        'Adventure park / glass bridge / paragliding entry tickets',
        'Personal expenses & additional meals'
      ],
      group_note: 'Covers Green Meadows, Pine Forest, Suicide Point & Misty Mountains. Dates and group size to be confirmed prior to booking.',
      sort_order: 3
    },
    {
      slug: 'pkg-1day-express',
      title: '1-Day Marayoor & Kanthalloor Adventure Combo',
      subtitle: 'Food + Campfire + 4x4 Jeep Safari Value Package',
      badge: '⚡ Best Value ₹900',
      duration: '1 Day Experience (Food + Safari + Campfire)',
      price: 900,
      show_price: 1,
      price_basis: 'Per Person',
      destinations: 'Marayoor & Kanthalloor Off-Road Trail',
      image: '/assets/images/jeep_safari_mountain.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusions: [
        'Homely Kerala Breakfast & Dinner',
        'Evening Campfire with Music',
        '4x4 Off-Road Jeep Safari Experience'
      ],
      exclusions: [
        'Overnight room stay (can be upgraded with any room category)',
        'Forest entry tickets & personal expenses'
      ],
      group_note: 'From our Special Offers poster. Subject to minimum group size and date availability.',
      sort_order: 4
    },
    {
      slug: 'pkg-kanthaloor-pool',
      title: 'Kanthalloor Swimming Pool Property Package',
      subtitle: 'Luxury Poolside Nature Stay & Local Experience',
      badge: '🏊 Pool Resort Offer ₹3,000',
      duration: '1 Night / 2 Days Pool Resort Stay',
      price: 3000,
      show_price: 1,
      price_basis: 'Per Person',
      destinations: 'Kanthalloor & Marayoor',
      image: '/assets/images/room_pool_property.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusions: [
        'Stay at Kanthalloor Swimming Pool Property',
        'Swimming Pool Access (as per resort timings & safety rules)',
        'Homely Meals & Campfire Coordination',
        'Local Sightseeing & Jeep Safari Assistance'
      ],
      exclusions: [
        'Private cab transport & personal expenses',
        'Entry fees at sightseeing spots'
      ],
      group_note: 'Ideal for couples, families and small groups seeking a scenic pool stay in Kanthalloor.',
      sort_order: 5
    },
    {
      slug: 'pkg-2n3d-munnar',
      title: '2N / 3D Munnar & Kanthalloor Complete Package',
      subtitle: 'Tea Gardens, Fruit Orchards, Waterfalls & Off-Road Trails',
      badge: '🌟 3-Day Bestseller ₹4,999',
      duration: '2 Nights / 3 Days',
      price: 4999,
      show_price: 1,
      price_basis: 'Per Person',
      destinations: 'Munnar, Marayoor & Kanthalloor',
      image: '/assets/images/dest_munnar.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusions: [
        '2 Nights Comfortable Accommodation in Munnar / Marayoor / Kanthalloor',
        'Homely Breakfast & Dinner',
        'Munnar Tea Gardens, Kanthalloor Orchards & Marayoor Sandalwood Sightseeing',
        '4x4 Jeep Safari & Campfire with Music'
      ],
      exclusions: [
        'National Park / monument entry tickets',
        'Lunches & personal expenses'
      ],
      group_note: 'Rates are per person and subject to group size and seasonal date confirmation.',
      sort_order: 6
    },
    {
      slug: 'pkg-4d3n-grand',
      title: '4D / 3N Marayoor, Kanthalloor & Munnar Grand Tour',
      subtitle: 'Complete High-Range Kerala Holiday Experience',
      badge: '👑 4-Day Grand Tour ₹5,999',
      duration: '3 Nights / 4 Days',
      price: 5999,
      show_price: 1,
      price_basis: 'Per Person',
      destinations: 'Marayoor, Kanthalloor, Munnar & Anakulam',
      image: '/assets/images/hero_munnar_mountain.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusions: [
        '3 Nights Comfortable Stay across Marayoor / Kanthalloor / Munnar',
        'Homely Kerala Breakfast & Dinner daily',
        'Full Sightseeing covering Munnar Hills, Sandalwood Forest, Muniyara, Waterfalls & Fruit Farms',
        '4x4 Off-Road Jeep Safari, Campfire with Music & Local Guide Support'
      ],
      exclusions: [
        'Entry tickets, boating/park fees & lunches',
        'Personal expenses'
      ],
      group_note: 'Custom pickup/drop available from Cochin, Coimbatore, Madurai, Udumalpet or Pollachi.',
      sort_order: 7
    },
    // Client Brief Packages:
    {
      slug: 'pkg-marayoor-standard',
      title: 'Marayoor Complete Heritage Tour Package',
      subtitle: 'Sandalwood Groves, Jaggery Units, Dolmens & Homely Stays',
      badge: '🌿 Client Brief Offer ₹1,800',
      duration: '1 Night / 2 Days',
      price: 1800,
      show_price: 1,
      price_basis: 'Per Person (Per Head)',
      destinations: 'Marayoor Sandalwood Belt & Anakotta',
      image: '/assets/images/dest_marayoor.jpg',
      poster_image: '/assets/images/poster_pkg_marayoor_1day.jpg',
      inclusions: [
        'Nature Stay Accommodation in Marayoor',
        'Traditional Kerala Breakfast & Dinner',
        'Sandalwood Walk, Muniyara Dolmens & Sugarcane Jaggery visit',
        'Evening Campfire with Music'
      ],
      exclusions: ['Forest entry permits & personal expenses'],
      group_note: 'Minimum 2-4 persons. Group discounts available for 6+ guests.',
      sort_order: 8
    },
    {
      slug: 'pkg-kanthalloor-orchards',
      title: 'Kanthalloor Fruit Orchards & Safari Package',
      subtitle: 'Cool Climate Fruit Farm Walks & 4x4 Off-Road Experience',
      badge: '🍓 Fruit Orchard Special ₹2,500',
      duration: '1 Night / 2 Days',
      price: 2500,
      show_price: 1,
      price_basis: 'Per Person (Per Head)',
      destinations: 'Kanthalloor & Bhramaram Point',
      image: '/assets/images/dest_kanthaloor.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusions: [
        'Stay in scenic Kanthalloor Valley Room',
        'Homely Breakfast & Dinner',
        'Kanthalloor Fruit Garden & Farm Walks',
        '4x4 Jeep Safari to Bhramaram Shooting Point',
        'Campfire & Stargazing'
      ],
      exclusions: ['Personal expenses & additional adventure activities'],
      group_note: 'Seasonal fruit farm walks subject to harvest months.',
      sort_order: 9
    },
    {
      slug: 'pkg-custom-quote',
      title: 'Munnar, Marayoor & Kanthalloor Tailored Grand Circuit',
      subtitle: 'Completely Customized Family & Group Vacation Itinerary',
      badge: '✨ Custom Quote',
      duration: 'Custom Nights / Days',
      price: 0,
      show_price: 0,
      price_basis: 'Tailored Group Quote',
      destinations: 'Munnar, Marayoor, Kanthalloor & Anakulam',
      image: '/assets/images/hero_client_jeep.jpg',
      poster_image: '/assets/images/poster_master_offers.jpg',
      inclusions: [
        'Customized choice of Pool Resorts, Cottages, River Stays or Luxury Suites',
        'Flexible 4x4 Jeep Safari trails & vehicle allocation',
        'Pick-up and drop options from Cochin, Coimbatore, Madurai, Pollachi',
        'Dedicated tour manager & personalized food arrangements'
      ],
      exclusions: ['Custom tailored based on client request'],
      group_note: 'Tell us your dates, group size, and favorite stay type on WhatsApp for a custom quotation.',
      sort_order: 10
    }
  ];

  for (const p of packagesSeed) {
    const [existing] = await db.query('SELECT id FROM tour_packages WHERE slug = ?', [p.slug]);
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO tour_packages (slug, title, subtitle, badge, duration, price, show_price, price_basis, destinations, image, poster_image, inclusions, exclusions, group_note, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.slug, p.title, p.subtitle, p.badge, p.duration, p.price, p.show_price, p.price_basis, p.destinations, p.image, p.poster_image, JSON.stringify(p.inclusions), JSON.stringify(p.exclusions), p.group_note, p.sort_order]
      );
      console.log(`Seeded Package: ${p.title}`);
    }
  }

  // --- SEED 14 DESTINATIONS ---
  const destinationsSeed = [
    { name: 'Marayoor', tamil: 'மறையூர்', state: 'Kerala • Idukki', image: '/assets/images/dest_marayoor.jpg', badge: '🪨 Sandalwood & Dolmens', featured: 1, sort_order: 1 },
    { name: 'Kanthalloor', tamil: 'காந்தளூர்', state: 'Kerala • Idukki', image: '/assets/images/dest_kanthaloor.jpg', badge: '🚙 4x4 Jeep Safari Spot', featured: 1, sort_order: 2 },
    { name: 'Munnar', tamil: 'மூணாறு', state: 'Kerala • Idukki', image: '/assets/images/dest_munnar.jpg', badge: '🍃 Misty Tea Hills', featured: 1, sort_order: 3 },
    { name: 'Vagamon', tamil: 'வாகமன்', state: 'Kerala • Idukki', image: '/assets/images/dest_vagamon.jpg', badge: '🚙 4x4 Off-Road Meadow', featured: 1, sort_order: 4 },
    { name: 'Thekkady', tamil: 'தேக்கடி', state: 'Kerala • Idukki', image: '/assets/images/dest_thekkady.jpg', badge: '🐘 Periyar Lake Safari', featured: 1, sort_order: 5 },
    { name: 'Alappuzha', tamil: 'ஆலப்புழா', state: 'Kerala • Alappuzha', image: '/assets/images/dest_alleppey.jpg', badge: '🚤 Backwater Houseboat', featured: 1, sort_order: 6 },
    { name: 'Anakulam', tamil: 'ஆனைக்குளம்', state: 'Kerala • Idukki', image: '/assets/images/dest_anakulam.jpg', badge: '🐘 Wild Elephant Stream', featured: 1, sort_order: 7 },
    { name: 'Wayanad', tamil: 'வயநாடு', state: 'Kerala • Wayanad', image: '/assets/images/dest_wayanad.jpg', badge: '🌊 Rainforest Waterfalls', featured: 1, sort_order: 8 },
    { name: 'Kodaikanal', tamil: 'கொடைக்கானல்', state: 'Tamil Nadu • Dindigul', image: '/assets/images/dest_kodaikanal.jpg', badge: '🛶 Star Lake & Pine Hills', featured: 1, sort_order: 9 },
    { name: 'Ooty', tamil: 'ஊட்டி', state: 'Tamil Nadu • Nilgiris', image: '/assets/images/dest_ooty.jpg', badge: '🚂 Heritage Toy Train', featured: 1, sort_order: 10 },
    { name: 'Mankulam', tamil: 'மாங்குளம்', state: 'Kerala • Idukki', image: '/assets/images/dest_mankulam.jpg', badge: '🚙 Forest River Crossing', featured: 0, sort_order: 11 },
    { name: 'Kolukkumalai', tamil: 'கொழுக்குமலை', state: 'Kerala / TN Border', image: '/assets/images/dest_kolukkumalai.jpg', badge: '☁️ Sunrise Cloud Safari', featured: 0, sort_order: 12 },
    { name: 'Ramakkalmedu', tamil: 'ராமக்கல்மேடு', state: 'Kerala • Idukki', image: '/assets/images/dest_ramakkalmedu.jpg', badge: '💨 Windmill Ridge Trail', featured: 0, sort_order: 13 },
    { name: 'Valparai', tamil: 'வால்பாறை', state: 'Tamil Nadu • Coimbatore', image: '/assets/images/dest_valparai.jpg', badge: '⛰️ 40 Hairpin Curves', featured: 0, sort_order: 14 }
  ];

  for (const d of destinationsSeed) {
    const [existing] = await db.query('SELECT id FROM destinations WHERE name = ?', [d.name]);
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO destinations (name, tamil, state, image, badge, featured, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [d.name, d.tamil, d.state, d.image, d.badge, d.featured, d.sort_order]
      );
    }
  }

  // --- SEED 7 SIGHTSEEING SPOTS ---
  const sightseeingSeed = [
    {
      title: 'Sandalwood Forest Walk',
      location: 'Marayoor – Chinnar Belt',
      timing: '8:00 AM – 5:00 PM',
      image: '/assets/images/dest_marayoor.jpg',
      description: 'Natural reserve sandalwood forest maintained by Kerala Forest Department. Visitors can enjoy the scenic drive through fragrant sandalwood trees and observe natural conservation. Fenced forest zones are strictly protected; visitors must not enter fenced areas without an authorised forest department guide.',
      guidance: 'Restricted fenced forest zones require official permission; visitors may not enter fenced areas freely.',
      badge: '🌿 Protected Heritage',
      sort_order: 1
    },
    {
      title: 'Irachalpara Waterfalls',
      location: 'Near Kanthalloor (12 km from Marayoor)',
      timing: 'Daytime (Best 8:00 AM – 5:30 PM)',
      image: '/assets/images/jeep_green_forest.jpg',
      description: 'A multi-tiered scenic mountain waterfall secluded amidst dense Western Ghats rainforest foliage. Water flow is seasonal and most majestic during monsoon and post-monsoon months. Rocks can be slippery, so visitors should wear non-slip shoes and follow local safety instructions.',
      guidance: 'Monsoon and post-monsoon offer the best water cascade. Use non-slip footwear.',
      badge: '🌊 Waterfall Trail',
      sort_order: 2
    },
    {
      title: 'Muniyara Megalithic Dolmens',
      location: 'Anakotta / Marayoor Rocky Ridge',
      timing: 'Open Daytime',
      image: '/assets/images/dest_marayoor.jpg',
      description: 'Ancient stone burial chambers (Dolmens) dating back thousands of years to the Megalithic Iron Age, perched on rocky hills overlooking the picturesque Marayoor valley. As this is an archaeological heritage site, visitors are requested to respect monuments and avoid climbing on stone slabs.',
      guidance: 'Protected archaeological site. Please respect monuments and keep surroundings clean.',
      badge: '🪨 Ancient Heritage',
      sort_order: 3
    },
    {
      title: 'Marayoor Jaggery Making Units',
      location: 'Marayoor Sugarcane Fields',
      timing: 'Morning & Afternoon Production Hours',
      image: '/assets/images/service_kerala_food.jpg',
      description: 'Artisan jaggery sheds where the famous GI-tagged Marayoor Sharkara is traditionally hand-crafted from pure sugarcane juice boiled in large iron cauldrons. Live jaggery-making visits can be arranged when production units are operating and local producers permit visitors.',
      guidance: 'Live visits depend on operating production schedules and farm owner permissions.',
      badge: '🍯 GI-Tagged Craft',
      sort_order: 4
    },
    {
      title: 'Kanthalloor Fruit & Strawberry Farms',
      location: 'Kanthalloor Terraced Valleys',
      timing: '9:00 AM – 5:00 PM',
      image: '/assets/images/dest_kanthaloor.jpg',
      description: 'Cool-climate terraced orchards cultivating apples, strawberries, oranges, plums, peaches, and passion fruits. Farm walks and fruit harvesting depend on seasonal fruiting months and whether individual private family farms are open to guests on travel dates.',
      guidance: 'Farm entry and fruit availability vary seasonally. Always confirm harvest dates with guide.',
      badge: '🍓 Fruit Orchards',
      sort_order: 5
    },
    {
      title: 'Thoovanam Waterfalls Trek',
      location: 'Chinnar Wildlife Sanctuary (Pambar River)',
      timing: 'Morning Forest Batches (Subject to Forest Dept)',
      image: '/assets/images/dest_wayanad.jpg',
      description: 'A guided jungle trek through Chinnar Wildlife Sanctuary leading to the breathtaking Thoovanam waterfalls on the Pambar River. Trekking distance (~3-4 km), entry tickets, and an official Forest Department guide are mandatory under current sanctuary rules.',
      guidance: 'Official Forest Department permission, ticket and authorised forest guide are mandatory.',
      badge: '🥾 Forest Trekking',
      sort_order: 6
    },
    {
      title: 'Anakulam Wild Elephant Viewing Area',
      location: 'Anakulam Riverbed (Near Mankulam)',
      timing: 'Late Afternoon & Evening Hours',
      image: '/assets/images/dest_anakulam.jpg',
      description: 'A peaceful forest village river confluence where wild Asian elephant herds naturally emerge from the reserve forest to drink mineral-rich bubbling stream water. Sightings are completely wild and natural; visitors must stay on the safe village riverbank and follow forest safety protocols.',
      guidance: 'Natural wildlife sighting is not guaranteed; maintain safe distance and silence.',
      badge: '🐘 Wild Elephant Stream',
      sort_order: 7
    }
  ];

  for (const s of sightseeingSeed) {
    const [existing] = await db.query('SELECT id FROM sightseeing_spots WHERE title = ?', [s.title]);
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO sightseeing_spots (title, location, timing, image, description, guidance, badge, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.title, s.location, s.timing, s.image, s.description, s.guidance, s.badge, s.sort_order]
      );
    }
  }

  // --- SEED 19 GALLERY ITEMS ---
  const gallerySeed = [
    { src: '/assets/images/hero_client_jeep.jpg', category: 'safari', title: 'Olive-Green 4x4 Mahindra Jeep KL 68 7720 in Munnar Mountains', sort_order: 1 },
    { src: '/assets/images/hero_munnar_mountain.jpg', category: 'landscapes', title: 'Misty Western Ghats Tea Mountain Panorama', sort_order: 2 },
    { src: '/assets/images/room_pool_property.jpg', category: 'rooms', title: 'Kanthalloor Swimming Pool Property with Mountain Views', sort_order: 3 },
    { src: '/assets/images/room_cottage_villa.jpg', category: 'rooms', title: 'Exclusive Standalone Cottage & Wooden Villa Near the River', sort_order: 4 },
    { src: '/assets/images/room_premium_pool.jpg', category: 'rooms', title: 'Luxury Infinity Swimming Pool Resort at Twilight', sort_order: 5 },
    { src: '/assets/images/jeep_mountain_peak.jpg', category: 'safari', title: 'Muruganpara 6,200+ ft Off-Road Mountain Peak Safari', sort_order: 6 },
    { src: '/assets/images/jeep_green_forest.jpg', category: 'safari', title: 'Irachalpara Waterfalls Rainforest Jeep Crossing', sort_order: 7 },
    { src: '/assets/images/jeep_adventure_real.jpg', category: 'safari', title: 'Anakulam Wild Elephant Stream 4x4 Crossing', sort_order: 8 },
    { src: '/assets/images/dest_marayoor.jpg', category: 'landscapes', title: 'Megalithic Muniyara Dolmens & Sandalwood Hills', sort_order: 9 },
    { src: '/assets/images/dest_kanthaloor.jpg', category: 'landscapes', title: 'Kanthalloor Terraced Fruit Orchards & Bhramaram Point', sort_order: 10 },
    { src: '/assets/images/dest_anakulam.jpg', category: 'landscapes', title: 'Wild Asian Elephants Gathering in Anakulam River', sort_order: 11 },
    { src: '/assets/images/dest_alleppey.jpg', category: 'landscapes', title: 'Traditional Kerala Houseboat on Backwaters', sort_order: 12 },
    { src: '/assets/images/service_campfire.jpg', category: 'food', title: 'Misty Night Campfire with Ambient String Lights & Music', sort_order: 13 },
    { src: '/assets/images/service_kerala_food.jpg', category: 'food', title: 'Authentic Traditional Kerala Homely Sadya & Delicacies', sort_order: 14 },
    { src: '/assets/images/service_trekking.jpg', category: 'food', title: 'High-Range Forest Trekking & Hiking Adventure', sort_order: 15 },
    { src: '/assets/images/poster_pkg_anakulam.jpg', category: 'posters', title: 'Anakulam Tour Package ₹2,000 Special Offer Poster', sort_order: 16 },
    { src: '/assets/images/poster_pkg_vagamon.jpg', category: 'posters', title: 'Vagamon Scotland of Kerala ₹2,500 Package Poster', sort_order: 17 },
    { src: '/assets/images/poster_pkg_marayoor_1day.jpg', category: 'posters', title: 'Marayoor & Kanthalloor 1-Day Trip ₹1,500 Poster', sort_order: 18 },
    { src: '/assets/images/poster_master_offers.jpg', category: 'posters', title: 'Master 13 Services + 7 Special Offers Poster', sort_order: 19 }
  ];

  for (const g of gallerySeed) {
    const [existing] = await db.query('SELECT id FROM gallery_items WHERE title = ?', [g.title]);
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO gallery_items (src, category, title, sort_order)
         VALUES (?, ?, ?, ?)`,
        [g.src, g.category, g.title, g.sort_order]
      );
    }
  }

  // --- SEED 5 REVIEWS ---
  const reviewsSeed = [
    {
      name: 'Karthik Sundaram',
      location_tag: 'Chennai, Tamil Nadu • Family Holiday',
      rating: 5,
      review_text: '"Manoj bro is a genuine local legend! The 4x4 Jeep safari to Muruganpara and Bhramaram point was the highlight of our Kerala trip. Very safe driving by drivers Raja Durai and James, clean rooms in Kanthalloor, and wonderful home-cooked dinner!"',
      sort_order: 1
    },
    {
      name: 'Ashwin Nair',
      location_tag: 'Kochi, Kerala • Friends Group Trip',
      rating: 5,
      review_text: '"Booked the ₹2,000 Anakulam package with friends. We saw wild elephants by the river stream in the evening! Campfire with music was unforgettable. Truly honest rates, authentic hospitality, and zero hidden charges at all."',
      sort_order: 2
    },
    {
      name: 'Pooja & Rahul Sharma',
      location_tag: 'Bangalore, Karnataka • Couple Getaway',
      rating: 5,
      review_text: '"The swimming pool property in Kanthalloor had incredible mountain views! Manoj coordinated our Munnar tea garden visit, fruit farm walk, and cab pickup from Coimbatore. 10/10 hospitality!"',
      sort_order: 3
    },
    {
      name: 'Vigneshwaran & Team',
      location_tag: 'Coimbatore, Tamil Nadu • Weekend Trip',
      rating: 5,
      review_text: '"Staying at the Riverside Cottage near the river in Marayoor was the best decision! The sound of the flowing river stream and the night campfire were magical. Manoj\'s jeep safari was thrilling and safe."',
      sort_order: 4
    },
    {
      name: 'Dr. Ananya Sen',
      location_tag: 'Hyderabad, Telangana • Family Holiday',
      rating: 5,
      review_text: '"We traveled with elderly parents and kids. Manoj treated us like his own family members. Comfortable rooms, prompt hot water, tasty homemade Kerala food, and relaxed sightseeing without rush. Highly recommended!"',
      sort_order: 5
    }
  ];

  for (const rv of reviewsSeed) {
    const [existing] = await db.query('SELECT id FROM reviews WHERE name = ?', [rv.name]);
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO reviews (name, location_tag, rating, review_text, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [rv.name, rv.location_tag, rv.rating, rv.review_text, rv.sort_order]
      );
    }
  }

  console.log('Seeder completed successfully! All tables and data populated in Manoj database.');
  await db.end();
}

// Run immediately if executed via node CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeeder()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeder Error:', err);
      process.exit(1);
    });
}



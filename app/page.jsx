'use client';

import { useState, useEffect, useRef } from 'react';

// Fallback initial data matching MySQL seeder
const INITIAL_PACKAGES = [
  {
    id: 1,
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
    group_note: 'Ideal for families, friends & groups. Children below 5 yrs FREE; 5–10 yrs ₹300.'
  },
  {
    id: 2,
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
    group_note: 'Perfect getaway for friends, family & groups. Wildlife sightings are natural and subject to forest conditions.'
  },
  {
    id: 3,
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
    group_note: 'Covers Green Meadows, Pine Forest, Suicide Point & Misty Mountains.'
  },
  {
    id: 4,
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
    group_note: 'From our Special Offers poster. Minimum group size applies.'
  },
  {
    id: 5,
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
      'Swimming Pool Access',
      'Homely Meals & Campfire Coordination',
      'Local Sightseeing & Jeep Safari Assistance'
    ],
    group_note: 'Ideal for couples, families and small groups.'
  },
  {
    id: 6,
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
      '2 Nights Comfortable Accommodation',
      'Homely Breakfast & Dinner',
      'Munnar Tea Gardens, Kanthalloor Orchards & Sandalwood Walk',
      '4x4 Jeep Safari & Campfire with Music'
    ],
    group_note: 'Rates per person and subject to group size.'
  },
  {
    id: 7,
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
      '3 Nights Comfortable Stay across Marayoor / Munnar',
      'Homely Kerala Breakfast & Dinner daily',
      'Full Sightseeing covering Munnar, Sandalwood Forest, Muniyara, Waterfalls',
      '4x4 Off-Road Jeep Safari, Campfire & Local Guide'
    ],
    group_note: 'Custom pickup/drop available from Cochin, Coimbatore, Madurai.'
  }
];

const INITIAL_ROOMS = [
  {
    id: 1,
    slug: 'standard-non-ac-room',
    name: 'Standard Non-AC Room',
    category: 'deluxe',
    price: 2000,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 Adults (Up to 3 with extra bed)',
    location: 'Marayoor / Kanthalloor, Idukki',
    primary_image: '/assets/images/room_standard_non_ac.jpg',
    gallery: [
      '/assets/images/room_standard_non_ac.jpg',
      '/assets/images/hero_munnar_mountain.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Mountain Air Breezy View', 'Attached Clean Bathroom', 'Comfortable Double Bed', 'Free Wi-Fi & Parking', 'Hot Water Assistance'],
    dining_note: 'Homely Kerala breakfast & dinner available on order.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.'
  },
  {
    id: 2,
    slug: 'standard-ac-room',
    name: 'Standard AC Room',
    category: 'deluxe',
    price: 2500,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 Adults',
    location: 'Marayoor Town / Valley Edge',
    primary_image: '/assets/images/room_standard_ac.jpg',
    gallery: [
      '/assets/images/room_standard_ac.jpg',
      '/assets/images/hero_munnar_mountain.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Individual Air Conditioning', 'Work Desk & Fast Wi-Fi', 'Complimentary Bottled Water', 'Attached Modern Bathroom', 'Power Backup'],
    dining_note: 'Fresh home-style Kerala meals prepared on request.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.'
  },
  {
    id: 3,
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    category: 'deluxe',
    price: 2500,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 Adults (Couples & Solo)',
    location: 'Kanthalloor Fruit Orchard Zone',
    primary_image: '/assets/images/room_deluxe.jpg',
    gallery: [
      '/assets/images/room_deluxe.jpg',
      '/assets/images/dest_kanthaloor.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Panoramic Mist Window View', 'King Size Spring Bed', 'HD Satellite TV', 'Modern Vanity & Hot Shower', 'Tea / Coffee Station'],
    dining_note: 'Delicious local dining & campfire setup available.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.'
  },
  {
    id: 4,
    slug: 'super-deluxe-room',
    name: 'Super Deluxe Room',
    category: 'deluxe',
    price: 3000,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 - 3 Adults',
    location: 'Scenic Mountain Valley Viewpoint',
    primary_image: '/assets/images/room_super_deluxe.jpg',
    gallery: [
      '/assets/images/room_super_deluxe.jpg',
      '/assets/images/hero_munnar_mountain.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Private Balcony Mountain View', 'Luxury King Bed', 'Warm Ceiling Lighting', 'Work Desk & High-Speed Wi-Fi', '24/7 Hot Water'],
    dining_note: 'In-room or balcony tea & dining service.',
    disclaimer: 'Price Basis: Per Room / Per Night. Reconfirm availability before booking.'
  },
  {
    id: 5,
    slug: 'premium-room',
    name: 'Premium Room',
    category: 'deluxe',
    price: 3500,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 - 3 Adults',
    location: 'Munnar / Marayoor Tea Belt',
    primary_image: '/assets/images/room_premium.jpg',
    gallery: [
      '/assets/images/room_premium.jpg',
      '/assets/images/dest_munnar.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Floor-to-Ceiling Glass Views', 'Tea Garden Panorama', 'Balcony Sit-Out Area', 'Luxury Bath Amenities', 'Room Service'],
    dining_note: 'Authentic Kerala Sadya or non-veg curry on order.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates subject to seasonal reconfirmation.'
  },
  {
    id: 6,
    slug: 'family-room',
    name: 'Family Room',
    category: 'family',
    price: 4500,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '4 Adults + 2 Kids',
    location: 'Spacious Nature Garden Property',
    primary_image: '/assets/images/room_family.jpg',
    gallery: [
      '/assets/images/room_family.jpg',
      '/assets/images/hero_munnar_mountain.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['2 Large Double Beds', 'Accommodates 4 Adults comfortably', 'Spacious Living Layout', 'Attached Luxury Bath', 'Children Play Space'],
    dining_note: 'Family dining hall & group campfire with music.',
    disclaimer: 'Price Basis: Per Room / Per Night. Ideal for family groups.'
  },
  {
    id: 7,
    slug: 'swimming-pool-property',
    name: 'Swimming Pool Property',
    category: 'pool',
    price: 5000,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 - 4 Adults',
    location: 'Kanthalloor Valley Resort',
    primary_image: '/assets/images/room_pool_property.jpg',
    gallery: [
      '/assets/images/room_pool_property.jpg',
      '/assets/images/dest_kanthaloor.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Resort Swimming Pool Access', 'Surrounded by Palms & Hills', 'Poolside Lounge Chairs', 'Music & Campfire Area', 'Scenic Sunset Views'],
    dining_note: 'Buffet or plated Kerala meals with poolside dining.',
    disclaimer: 'Price Basis: Per Room / Per Night. Pool timings and safety rules apply.'
  },
  {
    id: 8,
    slug: 'riverside-cottage-river-house',
    name: 'Riverside Cottage / River House (Rooms Near the River)',
    category: 'river',
    price: 3500,
    show_price: 1,
    price_basis: 'Per Room / Per Night',
    capacity: '2 - 4 Adults',
    location: 'Near the River, Marayoor / Anakulam River Stream',
    primary_image: '/assets/images/room_cottage_villa.jpg',
    gallery: [
      '/assets/images/room_cottage_villa.jpg',
      '/assets/images/dest_anakulam.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: [
      'Rooms Near the River with soothing natural river stream views & breeze',
      'Riverside sit-out veranda & relaxation chairs',
      'Riverside campfire area with music & stars',
      'Attached modern bath & 24/7 hot water',
      'Homely Kerala meals & fresh river fish on order'
    ],
    dining_note: 'Fresh home-style Kerala meals and barbecue setup by the river stream.',
    disclaimer: 'Price Basis: Per Room / Per Night. Waterfront property; advance booking recommended.'
  },
  {
    id: 9,
    slug: 'exclusive-cottage-villa',
    name: 'Exclusive Cottage / Villa',
    category: 'cottage',
    price: 7500,
    show_price: 1,
    price_basis: 'Per Night (Full Villa / Cottage)',
    capacity: '4 - 6 Adults (Private Group)',
    location: 'Secluded Private Farm Plantation',
    primary_image: '/assets/images/room_cottage_villa.jpg',
    gallery: [
      '/assets/images/room_cottage_villa.jpg',
      '/assets/images/dest_kanthaloor.jpg',
      '/assets/images/service_campfire.jpg',
      '/assets/images/service_kerala_food.jpg'
    ],
    features: ['Private Standalone Villa', 'Artisanal Wood & Stone Build', 'Private Veranda & Lawn', 'Accommodates up to 6 Guests', 'Dedicated Campfire Pit'],
    dining_note: 'Personal cook / customized meal packages available.',
    disclaimer: 'Price Basis: Per Villa / Per Night. Best for private families & friends.'
  }
];

const INITIAL_SAFARIS = [
  {
    id: 1,
    slug: 'muruganpara-off-road-peak',
    title: 'Muruganmala / Muruganpara Off-Road Experience',
    badge: '⛰️ Peak Safari',
    description: 'Thrilling rocky mountain ascent to 6,200+ ft with panoramic 360° views across Kerala & Tamil Nadu borders. High-altitude cool breeze and scenic rock formations.',
    duration: '3 - 4 Hours',
    terrain_tag: 'Rugged Climb',
    price_info: '₹2,500 – ₹3,500 per Jeep',
    primary_image: '/assets/images/jeep_mountain_peak.jpg'
  },
  {
    id: 2,
    slug: 'bhramaram-misty-mountain-point',
    title: 'Bhramaram Shooting Point',
    badge: '🌫️ Misty Ridge',
    description: 'Famous movie shooting point ridge overlooking fruit orchards, deep fog carpets, and endless rolling Western Ghats. Unmatched sunrise & sunset visual views.',
    duration: '2 - 3 Hours',
    terrain_tag: 'Sunrise / Sunset',
    price_info: '₹2,000 – ₹3,000 per Jeep',
    primary_image: '/assets/images/jeep_safari_mountain.jpg'
  },
  {
    id: 3,
    slug: 'irachilpara-kacharam-waterfalls',
    title: 'Irachilpara & Kacharam Waterfalls Trail',
    badge: '🌊 Waterfall Trail',
    description: 'Off-road track winding deep through dense rainforest foliage and crystal boulder streams to secluded forest cascades. Seasonal plunge pools and cool sprays.',
    duration: 'Half Day (3 - 4 Hours)',
    terrain_tag: 'Natural Cascades',
    price_info: '₹2,500 – ₹3,500 per Jeep',
    primary_image: '/assets/images/jeep_green_forest.jpg'
  },
  {
    id: 4,
    slug: 'anakulam-wild-elephant-stream',
    title: 'Anakulam Wild Elephant Stream Safari',
    badge: '🐘 Elephant Stream',
    description: 'Watch wild elephant herds gather naturally in the riverbed to drink mineral water, with safe 4x4 boulder-stream crossings and deep forest trails.',
    duration: '4 - 5 Hours',
    terrain_tag: 'Wildlife Sighting',
    price_info: '₹3,000 – ₹4,500 per Jeep',
    primary_image: '/assets/images/jeep_adventure_real.jpg'
  },
  {
    id: 5,
    slug: 'sandalwood-forest-walk',
    title: 'Sandalwood Forest / Sandal Forest Walk',
    badge: '🌿 Protected Heritage',
    description: 'Scenic drive through India\'s only natural reserve sandalwood forest. Guided walking trails through aromatic sandalwood trees with certified guides.',
    duration: '2 - 3 Hours',
    terrain_tag: 'Protected Forest',
    price_info: 'Included in packages',
    primary_image: '/assets/images/dest_marayoor.jpg'
  },
  {
    id: 6,
    slug: 'kanthalloor-fruit-gardens',
    title: 'Kanthalloor Fruit Garden & Strawberry Orchards',
    badge: '🍓 Fruit Orchards',
    description: 'Cool-climate terraced farm drive visiting apple, strawberry, plum, orange, and passion fruit plantations. Taste fresh seasonal fruits right off the tree.',
    duration: '2 - 3 Hours',
    terrain_tag: 'Terraced Farm Trail',
    price_info: 'Included in Kanthalloor packages',
    primary_image: '/assets/images/dest_kanthaloor.jpg'
  },
  {
    id: 7,
    slug: 'honey-rock-viewpoint',
    title: 'Honey Rock (Thenkoodu Para) Viewpoint',
    badge: '🪨 Cliff View',
    description: 'Majestic cliff edge famous for giant natural wild bee combs hanging from rocky heights. Breathtaking valley views across tea and sugarcane plains.',
    duration: '2 Hours',
    terrain_tag: 'Scenic Valley Ridge',
    price_info: '₹1,500 – ₹2,500 per Jeep',
    primary_image: '/assets/images/hero_munnar_mountain.jpg'
  },
  {
    id: 8,
    slug: 'marayoor-jaggery-unit',
    title: 'Traditional Marayoor Jaggery Unit',
    badge: '🍯 GI-Tagged Craft',
    description: 'Live visit to artisanal jaggery sheds where pure sugarcane juice is hand-boiled into the famous GI-tagged Marayoor Sharkara. Taste warm, fresh jaggery.',
    duration: '1.5 - 2 Hours',
    terrain_tag: 'Artisan Heritage',
    price_info: 'Included in Marayoor tours',
    primary_image: '/assets/images/service_kerala_food.jpg'
  },
  {
    id: 9,
    slug: 'muniyara-megalithic-dolmens',
    title: 'Muniyara Megalithic Dolmens',
    badge: '🪨 Ancient Heritage',
    description: 'Ancient stone burial chambers (Dolmens) dating back thousands of years to the Megalithic Iron Age, perched on rocky hills with vast valley panoramas.',
    duration: '2 Hours',
    terrain_tag: 'Archaeological Stone Trail',
    price_info: 'Included in sightseeing',
    primary_image: '/assets/images/dest_marayoor.jpg'
  },
  {
    id: 10,
    slug: 'zipline-adventure',
    title: 'Zipline Adventure Experience',
    badge: '⚡ Thrill Ride',
    description: 'High-speed cable slide over verdant tea bushes and valley dips with professional safety harness. Superb adrenaline rush for young adults and families.',
    duration: '1 Hour',
    terrain_tag: 'Valley Aerial Cable',
    price_info: '₹500 – ₹800 per ride',
    primary_image: '/assets/images/service_jeep_safari.jpg'
  }
];

const INITIAL_DESTINATIONS = [
  { name: 'Marayoor', tamil: 'மறையூர்', state: 'Kerala • Idukki', image: '/assets/images/dest_marayoor.jpg', badge: '🪨 Sandalwood & Dolmens', featured: 1 },
  { name: 'Kanthalloor', tamil: 'காந்தளூர்', state: 'Kerala • Idukki', image: '/assets/images/dest_kanthaloor.jpg', badge: '🚙 4x4 Jeep Safari Spot', featured: 1 },
  { name: 'Munnar', tamil: 'மூணாறு', state: 'Kerala • Idukki', image: '/assets/images/dest_munnar.jpg', badge: '🍃 Misty Tea Hills', featured: 1 },
  { name: 'Vagamon', tamil: 'வாகமன்', state: 'Kerala • Idukki', image: '/assets/images/dest_vagamon.jpg', badge: '🚙 4x4 Off-Road Meadow', featured: 1 },
  { name: 'Thekkady', tamil: 'தேக்கடி', state: 'Kerala • Idukki', image: '/assets/images/dest_thekkady.jpg', badge: '🐘 Periyar Lake Safari', featured: 1 },
  { name: 'Alappuzha', tamil: 'ஆலப்புழா', state: 'Kerala • Alappuzha', image: '/assets/images/dest_alleppey.jpg', badge: '🚤 Backwater Houseboat', featured: 1 },
  { name: 'Anakulam', tamil: 'ஆனைக்குளம்', state: 'Kerala • Idukki', image: '/assets/images/dest_anakulam.jpg', badge: '🐘 Wild Elephant Stream', featured: 1 },
  { name: 'Wayanad', tamil: 'வயநாடு', state: 'Kerala • Wayanad', image: '/assets/images/dest_wayanad.jpg', badge: '🌊 Rainforest Waterfalls', featured: 1 },
  { name: 'Kodaikanal', tamil: 'கொடைக்கானல்', state: 'Tamil Nadu • Dindigul', image: '/assets/images/dest_kodaikanal.jpg', badge: '🛶 Star Lake & Pine Hills', featured: 1 },
  { name: 'Ooty', tamil: 'ஊட்டி', state: 'Tamil Nadu • Nilgiris', image: '/assets/images/dest_ooty.jpg', badge: '🚂 Heritage Toy Train', featured: 1 },
  { name: 'Mankulam', tamil: 'மாங்குளம்', state: 'Kerala • Idukki', image: '/assets/images/dest_mankulam.jpg', badge: '🚙 Forest River Crossing', featured: 0 },
  { name: 'Kolukkumalai', tamil: 'கொழுக்குமலை', state: 'Kerala / TN Border', image: '/assets/images/dest_kolukkumalai.jpg', badge: '☁️ Sunrise Cloud Safari', featured: 0 },
  { name: 'Ramakkalmedu', tamil: 'ராமக்கல்மேடு', state: 'Kerala • Idukki', image: '/assets/images/dest_ramakkalmedu.jpg', badge: '💨 Windmill Ridge Trail', featured: 0 },
  { name: 'Valparai', tamil: 'வால்பாறை', state: 'Tamil Nadu • Coimbatore', image: '/assets/images/dest_valparai.jpg', badge: '⛰️ 40 Hairpin Curves', featured: 0 }
];

const INITIAL_SIGHTSEEING = [
  {
    title: 'Sandalwood Forest Walk',
    location: 'Marayoor – Chinnar Belt',
    timing: '8:00 AM – 5:00 PM',
    image: '/assets/images/dest_marayoor.jpg',
    description: 'Natural reserve sandalwood forest maintained by Kerala Forest Department. Visitors can enjoy the scenic drive through fragrant sandalwood trees.',
    guidance: 'Restricted fenced forest zones require official permission; visitors may not enter fenced areas freely.',
    badge: '🌿 Protected Heritage'
  },
  {
    title: 'Irachalpara Waterfalls',
    location: 'Near Kanthalloor (12 km from Marayoor)',
    timing: 'Daytime (Best 8:00 AM – 5:30 PM)',
    image: '/assets/images/jeep_green_forest.jpg',
    description: 'A multi-tiered scenic mountain waterfall secluded amidst dense Western Ghats rainforest foliage. Majestic during monsoon and post-monsoon.',
    guidance: 'Monsoon and post-monsoon offer best water cascade. Use non-slip footwear.',
    badge: '🌊 Waterfall Trail'
  },
  {
    title: 'Muniyara Megalithic Dolmens',
    location: 'Anakotta / Marayoor Rocky Ridge',
    timing: 'Open Daytime',
    image: '/assets/images/dest_marayoor.jpg',
    description: 'Ancient stone burial chambers (Dolmens) dating back thousands of years to the Megalithic Iron Age, perched on rocky hills with vast valley views.',
    guidance: 'Protected archaeological site. Please respect monuments and keep surroundings clean.',
    badge: '🪨 Ancient Heritage'
  },
  {
    title: 'Marayoor Jaggery Making Units',
    location: 'Marayoor Sugarcane Fields',
    timing: 'Morning & Afternoon Production Hours',
    image: '/assets/images/service_kerala_food.jpg',
    description: 'Artisan jaggery sheds where the famous GI-tagged Marayoor Sharkara is traditionally hand-crafted from pure sugarcane juice.',
    guidance: 'Live visits depend on operating production schedules and farm permissions.',
    badge: '🍯 GI-Tagged Craft'
  },
  {
    title: 'Kanthalloor Fruit & Strawberry Farms',
    location: 'Kanthalloor Terraced Valleys',
    timing: '9:00 AM – 5:00 PM',
    image: '/assets/images/dest_kanthaloor.jpg',
    description: 'Cool-climate terraced orchards cultivating apples, strawberries, oranges, plums, peaches, and passion fruits.',
    guidance: 'Farm entry and fruit availability vary seasonally. Always confirm harvest dates.',
    badge: '🍓 Fruit Orchards'
  },
  {
    title: 'Thoovanam Waterfalls Trek',
    location: 'Chinnar Wildlife Sanctuary (Pambar River)',
    timing: 'Morning Forest Batches (Subject to Forest Dept)',
    image: '/assets/images/dest_wayanad.jpg',
    description: 'A guided jungle trek through Chinnar Wildlife Sanctuary leading to the breathtaking Thoovanam waterfalls on the Pambar River.',
    guidance: 'Official Forest Department permission, ticket and authorised forest guide mandatory.',
    badge: '🥾 Forest Trekking'
  },
  {
    title: 'Anakulam Wild Elephant Viewing Area',
    location: 'Anakulam Riverbed (Near Mankulam)',
    timing: 'Late Afternoon & Evening Hours',
    image: '/assets/images/dest_anakulam.jpg',
    description: 'A peaceful forest village river confluence where wild Asian elephant herds naturally emerge from the reserve forest to drink mineral water.',
    guidance: 'Natural wildlife sighting is not guaranteed; maintain safe distance and silence.',
    badge: '🐘 Wild Elephant Stream'
  }
];

const INITIAL_GALLERY = [
  { src: '/assets/images/hero_client_jeep.jpg', category: 'safari', title: 'Olive-Green 4x4 Mahindra Jeep KL 68 7720 in Munnar Mountains' },
  { src: '/assets/images/hero_munnar_mountain.jpg', category: 'landscapes', title: 'Misty Western Ghats Tea Mountain Panorama' },
  { src: '/assets/images/room_pool_property.jpg', category: 'rooms', title: 'Kanthalloor Swimming Pool Property with Mountain Views' },
  { src: '/assets/images/room_cottage_villa.jpg', category: 'rooms', title: 'Exclusive Standalone Cottage & Wooden Villa Near the River' },
  { src: '/assets/images/room_premium_pool.jpg', category: 'rooms', title: 'Luxury Infinity Swimming Pool Resort at Twilight' },
  { src: '/assets/images/jeep_mountain_peak.jpg', category: 'safari', title: 'Muruganpara 6,200+ ft Off-Road Mountain Peak Safari' },
  { src: '/assets/images/jeep_green_forest.jpg', category: 'safari', title: 'Irachalpara Waterfalls Rainforest Jeep Crossing' },
  { src: '/assets/images/jeep_adventure_real.jpg', category: 'safari', title: 'Anakulam Wild Elephant Stream 4x4 Crossing' },
  { src: '/assets/images/dest_marayoor.jpg', category: 'landscapes', title: 'Megalithic Muniyara Dolmens & Sandalwood Hills' },
  { src: '/assets/images/dest_kanthaloor.jpg', category: 'landscapes', title: 'Kanthalloor Terraced Fruit Orchards & Bhramaram Point' },
  { src: '/assets/images/dest_anakulam.jpg', category: 'landscapes', title: 'Wild Asian Elephants Gathering in Anakulam River' },
  { src: '/assets/images/dest_alleppey.jpg', category: 'landscapes', title: 'Traditional Kerala Houseboat on Backwaters' },
  { src: '/assets/images/service_campfire.jpg', category: 'food', title: 'Misty Night Campfire with Ambient String Lights & Music' },
  { src: '/assets/images/service_kerala_food.jpg', category: 'food', title: 'Authentic Traditional Kerala Homely Sadya & Delicacies' },
  { src: '/assets/images/service_trekking.jpg', category: 'food', title: 'High-Range Forest Trekking & Hiking Adventure' },
  { src: '/assets/images/poster_pkg_anakulam.jpg', category: 'posters', title: 'Anakulam Tour Package ₹2,000 Special Offer Poster' },
  { src: '/assets/images/poster_pkg_vagamon.jpg', category: 'posters', title: 'Vagamon Scotland of Kerala ₹2,500 Package Poster' },
  { src: '/assets/images/poster_pkg_marayoor_1day.jpg', category: 'posters', title: 'Marayoor & Kanthalloor 1-Day Trip ₹1,500 Poster' },
  { src: '/assets/images/poster_master_offers.jpg', category: 'posters', title: 'Master 13 Services + 7 Special Offers Poster' }
];

const INITIAL_REVIEWS = [
  {
    name: 'Karthik Sundaram',
    location_tag: 'Chennai, Tamil Nadu • Family Holiday',
    rating: 5,
    review_text: '"Manoj bro is a genuine local legend! The 4x4 Jeep safari to Muruganpara and Bhramaram point was the highlight of our Kerala trip. Very safe driving by drivers Raja Durai and James, clean rooms in Kanthalloor, and wonderful home-cooked dinner!"'
  },
  {
    name: 'Ashwin Nair',
    location_tag: 'Kochi, Kerala • Friends Group Trip',
    rating: 5,
    review_text: '"Booked the ₹2,000 Anakulam package with friends. We saw wild elephants by the river stream in the evening! Campfire with music was unforgettable. Truly honest rates, authentic hospitality, and zero hidden charges at all."'
  },
  {
    name: 'Pooja & Rahul Sharma',
    location_tag: 'Bangalore, Karnataka • Couple Getaway',
    rating: 5,
    review_text: '"The swimming pool property in Kanthalloor had incredible mountain views! Manoj coordinated our Munnar tea garden visit, fruit farm walk, and cab pickup from Coimbatore. 10/10 hospitality!"'
  },
  {
    name: 'Vigneshwaran & Team',
    location_tag: 'Coimbatore, Tamil Nadu • Weekend Trip',
    rating: 5,
    review_text: '"Staying at the Riverside Cottage near the river in Marayoor was the best decision! The sound of the flowing river stream and the night campfire were magical. Manoj\'s jeep safari was thrilling and safe."'
  },
  {
    name: 'Dr. Ananya Sen',
    location_tag: 'Hyderabad, Telangana • Family Holiday',
    rating: 5,
    review_text: '"We traveled with elderly parents and kids. Manoj treated us like his own family members. Comfortable rooms, prompt hot water, tasty homemade Kerala food, and relaxed sightseeing without rush. Highly recommended!"'
  }
];

export default function HomePage() {
  // Live dynamic data from MySQL
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [safaris, setSafaris] = useState(INITIAL_SAFARIS);
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [sightseeing, setSightseeing] = useState(INITIAL_SIGHTSEEING);
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Filter states
  const [roomFilter, setRoomFilter] = useState('all');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [showAllDest, setShowAllDest] = useState(false);

  // Modals state
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);
  const [activeModalImage, setActiveModalImage] = useState('');
  const [selectedPosterModal, setSelectedPosterModal] = useState(null);
  const [selectedLightboxModal, setSelectedLightboxModal] = useState(null);

  // Interactive controls state
  const [rainActive, setRainActive] = useState(true);
  const [theme, setTheme] = useState('light');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);

  // Floating Booking Bar state
  const [bookingInDate, setBookingInDate] = useState('');
  const [bookingOutDate, setBookingOutDate] = useState('');
  const [bookingGuests, setBookingGuests] = useState('2');

  // Calculator state
  const [calcRoomId, setCalcRoomId] = useState('');
  const [calcCheckin, setCalcCheckin] = useState('');
  const [calcCheckout, setCalcCheckout] = useState('');
  const [calcAdults, setCalcAdults] = useState(2);
  const [calcChildren, setCalcChildren] = useState(0);
  const [calcExtraBeds, setCalcExtraBeds] = useState(0);
  const [addonJeep, setAddonJeep] = useState(false);
  const [addonCampfire, setAddonCampfire] = useState(false);
  const [addonFood, setAddonFood] = useState(false);
  const [addonPickup, setAddonPickup] = useState(false);

  // FAQ accordion state
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  // Quick Enquiry Form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactDate, setContactDate] = useState('');
  const [contactGuests, setContactGuests] = useState('2 Guests (Couple)');
  const [contactNights, setContactNights] = useState('1 Night');
  const [contactStay, setContactStay] = useState('Homestay / Family Villa');
  const [contactActivities, setContactActivities] = useState('4x4 Jeep Safari & Waterfalls');
  const [contactNotes, setContactNotes] = useState('');

  const rainCanvasRef = useRef(null);

  // Initialize theme, default dates, and fetch MySQL data
  useEffect(() => {
    const savedTheme = localStorage.getItem('manoj_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Set tomorrow & day after dates
    const today = new Date();
    const tmrw = new Date(today);
    tmrw.setDate(tmrw.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const fmt = d => d.toISOString().split('T')[0];
    setBookingInDate(fmt(tmrw));
    setBookingOutDate(fmt(dayAfter));
    setCalcCheckin(fmt(tmrw));
    setCalcCheckout(fmt(dayAfter));

    // Fetch live data from MySQL
    fetch('/api/rooms').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) {
        setRooms(data);
        if (!calcRoomId) setCalcRoomId(data[0].id.toString());
      }
    }).catch(() => {});

    fetch('/api/safaris').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) setSafaris(data);
    }).catch(() => {});

    fetch('/api/packages').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) setPackages(data);
    }).catch(() => {});

    fetch('/api/destinations').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) setDestinations(data);
    }).catch(() => {});

    fetch('/api/sightseeing').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) setSightseeing(data);
    }).catch(() => {});

    fetch('/api/gallery').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) setGallery(data);
    }).catch(() => {});

    fetch('/api/reviews').then(res => res.ok && res.json()).then(data => {
      if (data && data.length) setReviews(data);
    }).catch(() => {});
  }, []);

  // Set default calcRoomId when rooms available
  useEffect(() => {
    if (rooms.length && !calcRoomId) {
      setCalcRoomId(rooms[0].id.toString());
    }
  }, [rooms, calcRoomId]);

  // Rain Canvas Animation Engine
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drops = [];
    const maxDrops = window.innerWidth < 768 ? 60 : 120;
    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: Math.random() * 18 + 10,
        spd: Math.random() * 10 + 12,
        op: Math.random() * 0.35 + 0.15
      });
    }

    const draw = () => {
      if (!rainActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of drops) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(210, 235, 255, ${d.op})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();

        d.y += d.spd;
        d.x -= 1;
        if (d.y > canvas.height) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [rainActive]);

  // Theme toggle handler
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('manoj_theme', next);
  };

  // Hero Slider Auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Floating Booking Bar Search click
  const handleBookingSearch = () => {
    if (bookingInDate) setCalcCheckin(bookingInDate);
    if (bookingOutDate) setCalcCheckout(bookingOutDate);
    if (bookingGuests) setCalcAdults(parseInt(bookingGuests, 10) || 2);

    const target = document.getElementById('packages') || document.getElementById('rooms');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculator computations
  const selectedCalcRoom = rooms.find(r => r.id.toString() === calcRoomId) || rooms[0] || INITIAL_ROOMS[0];
  const roomPrice = selectedCalcRoom ? selectedCalcRoom.price : 2000;
  const roomName = selectedCalcRoom ? selectedCalcRoom.name : 'Standard Room';

  let nights = 1;
  if (calcCheckin && calcCheckout) {
    const dIn = new Date(calcCheckin);
    const dOut = new Date(calcCheckout);
    const diff = (dOut - dIn) / (1000 * 60 * 60 * 24);
    if (diff > 0) nights = Math.round(diff);
  }

  let extraAdultCost = 0;
  if (calcAdults > 2) {
    extraAdultCost = (calcAdults - 2) * 500 * nights;
  }
  const childCost = calcChildren * 300 * nights;
  const extraBedCost = calcExtraBeds * 300 * nights;
  const roomTotal = (roomPrice * nights) + extraAdultCost + childCost + extraBedCost;

  const jeepCost = addonJeep ? 2500 : 0;
  const campfireCost = addonCampfire ? 1000 : 0;
  const foodCost = addonFood ? (600 * calcAdults * nights) : 0;
  const pickupCost = addonPickup ? 3500 : 0;
  const addonsTotal = jeepCost + campfireCost + foodCost + pickupCost;
  const grandTotal = roomTotal + addonsTotal;

  const calcWhatsAppMsg = `Hello Manoj Tours & Travels Kerala!
I calculated my trip cost on your official website:
- Room: ${roomName} (₹${roomPrice?.toLocaleString('en-IN')}/night)
- Duration: ${nights} Night(s) (${calcCheckin || 'TBD'} to ${calcCheckout || 'TBD'})
- Guests: ${calcAdults} Adults, ${calcChildren} Children (Extra beds: ${calcExtraBeds})
- Add-ons: ${addonJeep ? '4x4 Jeep Safari (+₹2,500), ' : ''}${addonCampfire ? 'Campfire (+₹1,000), ' : ''}${addonFood ? `Homely Food (+₹${foodCost}), ` : ''}${addonPickup ? 'Cab Pickup (+₹3,500)' : ''}
*Estimated Total: ₹${grandTotal.toLocaleString('en-IN')}*

Please confirm availability and booking details.`;

  // Quick Contact Form Submit
  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    const msg = `*NEW TRIP ENQUIRY — MANOJ TOURS KERALA*
- Guest Name: ${contactName}
- Phone/WhatsApp: ${contactPhone}
- Travel Date: ${contactDate}
- Number of Guests: ${contactGuests}
- Number of Nights: ${contactNights}
- Preferred Stay: ${contactStay}
- Interested Activities: ${contactActivities}
- Notes / Requirements: ${contactNotes || 'None'}

Sent via official website`;
    window.open(`https://wa.me/919778264090?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filtered rooms
  const filteredRooms = roomFilter === 'all'
    ? rooms
    : rooms.filter(r => r.category === roomFilter);

  // Filtered gallery
  const filteredGallery = galleryFilter === 'all'
    ? gallery
    : gallery.filter(g => g.category === galleryFilter);

  // Filtered destinations
  const visibleDestinations = showAllDest
    ? destinations
    : destinations.filter(d => Boolean(d.featured));

  return (
    <>
      {/* Ambient Rain Canvas */}
      <canvas ref={rainCanvasRef} id="rainCanvas" className="rain-canvas"></canvas>

      {/* ======================================================================
          SITE HEADER (10 Links, Rain & Theme Toggles, Two-Line WhatsApp Pill)
          ====================================================================== */}
      <header className="site-header" id="header">
        <div className="nav-container">
          <a href="#hero" className="brand-wrapper" title="Manoj Tours and Travels Kerala">
            <div className="brand-logo-badge">
              <img src="/assets/images/logo_tight.jpg" alt="Manoj Tours & Travels Kerala Logo" className="brand-logo-img" />
            </div>
          </a>

          <nav className="nav-wrapper">
            <ul className={`nav-menu ${mobileNavOpen ? 'open' : ''}`} id="navMenu">
              <li><a href="#hero" className="nav-link active" onClick={() => setMobileNavOpen(false)}><span>Home</span></a></li>
              <li><a href="#about" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>About Us</span></a></li>
              <li><a href="#rooms" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Stay Options</span> <i className="fas fa-chevron-down nav-caret"></i></a></li>
              <li><a href="#packages" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Tour Packages</span> <i className="fas fa-chevron-down nav-caret"></i></a></li>
              <li><a href="#safari" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Jeep Safari</span> <i className="fas fa-chevron-down nav-caret"></i></a></li>
              <li><a href="#destinations" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Destinations</span></a></li>
              <li><a href="#guide" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Local Guide</span></a></li>
              <li><a href="#gallery" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Gallery</span></a></li>
              <li><a href="#reviews" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Reviews</span></a></li>
              <li><a href="#contact" className="nav-link" onClick={() => setMobileNavOpen(false)}><span>Contact</span></a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              id="rainToggle"
              className={`icon-btn ${rainActive ? 'active' : ''}`}
              title={rainActive ? 'Monsoon Rain Active' : 'Rain Paused'}
              aria-label="Toggle Rain Effect"
              onClick={() => setRainActive(!rainActive)}
            >
              {rainActive ? '🌧️' : '☀️'}
            </button>

            <button
              id="themeToggle"
              className="icon-btn"
              title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <a
              href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels%20Kerala!%20I%20would%20like%20to%20enquire%20about%20stays,%20jeep%20safari%20and%20tour%20packages."
              target="_blank"
              className="btn-whatsapp-header"
              title="Book Now on WhatsApp"
            >
              <span className="wa-header-icon"><i className="fab fa-whatsapp"></i></span>
              <span className="wa-header-text">
                <strong>Book Now</strong>
                <small>WhatsApp</small>
              </span>
            </a>

            <button
              id="hamburgerBtn"
              className={`hamburger-btn ${mobileNavOpen ? 'active' : ''}`}
              aria-label="Toggle Mobile Menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ====================================================================
            HERO SECTION: JEEP KL 68 7720, SCRIPT BADGE, FLOATING BOOKING BAR
            ==================================================================== */}
        <section className="hero-section" id="hero">
          <div className="hero-bg-media" id="heroBgSlider">
            <img
              src="/assets/images/hero_client_jeep.jpg"
              alt="Olive-Green 4x4 Mahindra Jeep KL 68 7720 in Misty Kerala Mountains"
              className={`hero-bg-image hero-slide ${heroSlide === 0 ? 'active' : ''}`}
            />
            <img
              src="/assets/images/hero_munnar_mountain.jpg"
              alt="Misty Munnar and Marayoor Mountain Peaks Kerala"
              className={`hero-bg-image hero-slide ${heroSlide === 1 ? 'active' : ''}`}
            />
            <img
              src="/assets/images/jeep_mountain_peak.jpg"
              alt="4x4 Off-Road Jeep Safari at Mountain Peak Viewpoint"
              className={`hero-bg-image hero-slide ${heroSlide === 2 ? 'active' : ''}`}
            />
          </div>
          <div className="hero-overlay"></div>

          <div className="hero-floating-slogan">
            <span className="slogan-line-1">Explore Kerala.</span>
            <span className="slogan-line-2">Discover yourself.</span>
            <svg className="slogan-brush" viewBox="0 0 200 14" fill="none">
              <path d="M3 11C55 3 135 2 197 9" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="hero-content hero-content-split">
            <div className="hero-left-col">
              <p className="hero-eyebrow-track">YOUR TRUSTED TRAVEL PARTNER IN KERALA</p>
              <h1 className="hero-title-main">
                Manoj Tours and<br />
                Travels <span className="hero-kerala-script">Kerala</span>
              </h1>
              <p className="hero-subtitle-clean">
                Explore the natural beauty of <strong>Marayoor, Kanthalloor, Munnar</strong> and beyond with our stay, 4x4 jeep safari and local sightseeing support.
              </p>

              <div className="hero-feature-pills">
                <a href="#safari" className="h-pill"><i className="fas fa-mountain"></i> <span>Jeep Safari</span></a>
                <span className="h-pill-divider"></span>
                <a href="#rooms" className="h-pill"><i className="fas fa-bed"></i> <span>Comfortable Stays</span></a>
                <span className="h-pill-divider"></span>
                <a href="#packages" className="h-pill"><i className="fas fa-map-marker-alt"></i> <span>Tour Packages</span></a>
                <span className="h-pill-divider"></span>
                <a href="#packages" className="h-pill"><i className="fas fa-users"></i> <span>Group Tours</span></a>
              </div>

              <div className="hero-cta-row">
                <a href="#packages" className="btn-plan-trip">
                  <span>Plan Your Trip</span> <i className="fas fa-arrow-right"></i>
                </a>
                <a href="#rooms" className="btn-hero-secondary">
                  <i className="fas fa-bed"></i> <span>Explore Stay Options</span>
                </a>
                <a
                  href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels%20Kerala!%20I%20want%20to%20plan%20a%20trip%20to%20Marayoor,%20Kanthalloor%20and%20Munnar."
                  target="_blank"
                  className="btn-hero-wa"
                >
                  <i className="fab fa-whatsapp"></i> <span>WhatsApp to Book</span>
                </a>
              </div>
            </div>
          </div>

          <div className="hero-slider-dots" id="heroSliderDots">
            <button className={`hero-dot ${heroSlide === 0 ? 'active' : ''}`} onClick={() => setHeroSlide(0)} aria-label="Slide 1"></button>
            <button className={`hero-dot ${heroSlide === 1 ? 'active' : ''}`} onClick={() => setHeroSlide(1)} aria-label="Slide 2"></button>
            <button className={`hero-dot ${heroSlide === 2 ? 'active' : ''}`} onClick={() => setHeroSlide(2)} aria-label="Slide 3"></button>
          </div>
        </section>

        {/* ====================================================================
            OVERLAPPING FLOATING BOOKING BAR (IMAGE 5)
            ==================================================================== */}
        <div className="container hero-booking-bar-wrap">
          <div className="hero-booking-bar">
            <form className="booking-bar-grid" id="heroBookingBarForm" onSubmit={(e) => { e.preventDefault(); handleBookingSearch(); }}>
              <div className="b-bar-field">
                <div className="b-bar-icon"><i className="far fa-calendar-alt"></i></div>
                <div className="b-bar-inputs">
                  <label htmlFor="heroCheckin">Check In</label>
                  <input
                    type="date"
                    id="heroCheckin"
                    value={bookingInDate}
                    onChange={(e) => setBookingInDate(e.target.value)}
                    aria-label="Check In Date"
                  />
                </div>
              </div>

              <div className="b-bar-divider"></div>

              <div className="b-bar-field">
                <div className="b-bar-icon"><i className="far fa-calendar-check"></i></div>
                <div className="b-bar-inputs">
                  <label htmlFor="heroCheckout">Check Out</label>
                  <input
                    type="date"
                    id="heroCheckout"
                    value={bookingOutDate}
                    onChange={(e) => setBookingOutDate(e.target.value)}
                    aria-label="Check Out Date"
                  />
                </div>
              </div>

              <div className="b-bar-divider"></div>

              <div className="b-bar-field">
                <div className="b-bar-icon"><i className="fas fa-user-friends"></i></div>
                <div className="b-bar-inputs">
                  <label htmlFor="heroSearchGuests">Guests & Stay</label>
                  <select
                    id="heroSearchGuests"
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(e.target.value)}
                    aria-label="Select Guests"
                  >
                    <option value="1">1 Guest (Solo)</option>
                    <option value="2">2 Guests (Couple)</option>
                    <option value="4">4 Guests (Family)</option>
                    <option value="6">6+ Guests (Group / Villa)</option>
                  </select>
                </div>
              </div>

              <div className="b-bar-action">
                <button type="button" id="heroSearchBtn" className="btn-bar-enquire" onClick={handleBookingSearch}>
                  <i className="fas fa-search"></i> <span>Search / Enquire</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ====================================================================
            SERVICES STRIP (8 ICONS + 13 CHIPS)
            ==================================================================== */}
        <section className="services-strip-section" id="services-strip">
          <div className="container">
            <div className="section-header-compact">
              <div className="eyebrow-with-lines">
                <span className="line"></span>
                <span className="eyebrow-text">OUR SERVICES</span>
                <span className="line"></span>
              </div>
              <h2 className="section-title-clean">Everything You Need for a Perfect Trip</h2>
            </div>

            <div className="services-icon-row">
              <a href="#packages" className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-mountain-sun"></i></div>
                <span>Kerala Tour<br />Packages</span>
              </a>
              <a href="#safari" className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-truck-monster"></i></div>
                <span>Jeep Safari &<br />Off-Road</span>
              </a>
              <a href="#rooms" onClick={() => setRoomFilter('family')} className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-bed"></i></div>
                <span>Homestays &<br />Resorts</span>
              </a>
              <a href="#rooms" onClick={() => setRoomFilter('river')} className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-water"></i></div>
                <span>River House /<br />Near River</span>
              </a>
              <a href="#rooms" onClick={() => setRoomFilter('pool')} className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-water-ladder"></i></div>
                <span>Swimming Pool<br />Properties</span>
              </a>
              <a href="#contact" className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-shuttle-van"></i></div>
                <span>Pickup & Drop<br /><small>( Kerala & TN )</small></span>
              </a>
              <a href="#guide" className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-person-hiking"></i></div>
                <span>Trekking &<br />Hiking</span>
              </a>
              <a href="#contact" className="service-circle-item">
                <div className="service-circle-icon"><i className="fas fa-ticket-alt"></i></div>
                <span>Ticket<br />Booking</span>
              </a>
            </div>

            <div className="poster-services-pills">
              <span className="p-service-pill"><i className="fas fa-bus"></i> Jeep / Bus / Tempo Traveller</span>
              <span className="p-service-pill"><i className="fas fa-fire"></i> Campfire with Music</span>
              <span className="p-service-pill"><i className="fas fa-utensils"></i> Homely Kerala Food</span>
              <span className="p-service-pill"><i className="fas fa-car-side"></i> Private & Shared Transport</span>
              <span className="p-service-pill"><i className="fas fa-user-tie"></i> Local Sightseeing Guide</span>
              <span className="p-service-pill"><i className="fas fa-moon"></i> Night Jungle Safari</span>
              <span className="p-service-pill"><i className="fas fa-campground"></i> Wild Stay / Forest Camping / River House</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            ABOUT US SECTION
            ==================================================================== */}
        <section className="section" id="about">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Born & Raised in Marayoor</span>
              <h2>About Manoj Tours and Travels Kerala</h2>
              <p className="section-lead">
                Manoj Tours and Travels Kerala helps visitors plan stays, local sightseeing and travel experiences around Marayoor, Kanthalloor, Munnar and nearby destinations. Contact us to discuss your travel dates, group size and preferred activities, and we will help you check suitable options.
              </p>
            </div>

            <div className="about-pillars-grid">
              <div className="about-pillar-card">
                <div className="pillar-icon"><i className="fas fa-compass"></i></div>
                <h3>Local Trip-Planning Support</h3>
                <p>Direct insider guidance from native residents born and raised in Marayoor who know every valley, off-road track and hidden viewpoint.</p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon"><i className="fas fa-hotel"></i></div>
                <h3>Stays & Sightseeing Together</h3>
                <p>From cozy budget homestays to private swimming pool villas, River House stays, and customized sightseeing itineraries in one seamless place.</p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon"><i className="fas fa-truck-pickup"></i></div>
                <h3>Jeep Safari & Transport</h3>
                <p>4x4 open-top mountain jeeps, tempo travellers, and door-to-door cab pickups from Cochin Airport, Coimbatore, and Madurai.</p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon"><i className="fas fa-users"></i></div>
                <h3>Tailored for Every Group</h3>
                <p>Comfortable, verified stays and itineraries curated specifically for families with kids, honeymoon couples, friends, and corporate groups.</p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon"><i className="fab fa-whatsapp"></i></div>
                <h3>Direct Contact Before Booking</h3>
                <p>Transparent rates, clear per-room or per-person basis, and instant WhatsApp answers to every question before you confirm.</p>
              </div>
            </div>

            <div className="about-trust-strip">
              <span className="trust-badge-item"><i className="fas fa-certificate"></i> Verified Local Support</span>
              <span className="trust-badge-item"><i className="fas fa-file-invoice-dollar"></i> Transparent Price Basis</span>
              <span className="trust-badge-item"><i className="fab fa-whatsapp"></i> Direct WhatsApp Assistance</span>
              <span className="trust-badge-item"><i className="fas fa-star"></i> Rated 5.0 ⭐ by 375+ Guests</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            TOUR PACKAGES SECTION (7 Posters + Client Brief)
            ==================================================================== */}
        <section className="section section-alt" id="packages">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">All-Inclusive Tour Packages</span>
              <h2>Tour Packages & Special Offers</h2>
              <p className="section-lead">
                Hand-crafted vacation packages bundled with comfortable nature stays, delicious home-cooked meals, thrilling 4x4 Jeep Safaris, and musical campfire nights. Click any card to book on WhatsApp or view the full official poster!
              </p>
            </div>

            <div className="packages-grid" id="packagesContainer">
              {packages.map(pkg => (
                <div className="package-card" key={pkg.id} id={pkg.slug}>
                  <div className="pkg-media">
                    <img src={pkg.image} alt={`${pkg.title} - Manoj Tours and Travels Kerala`} className="pkg-img" loading="lazy" />
                    <span className="pkg-badge">{pkg.badge}</span>
                    {pkg.poster_image && (
                      <button
                        type="button"
                        className="btn-poster-preview"
                        onClick={() => setSelectedPosterModal({ src: pkg.poster_image, title: pkg.title })}
                        title="Click to view full package poster"
                      >
                        <i className="fas fa-expand"></i> View Poster
                      </button>
                    )}
                  </div>

                  <div className="pkg-body">
                    <div className="pkg-duration-pill"><i className="fas fa-clock"></i> {pkg.duration}</div>
                    <h3 className="pkg-title">{pkg.title}</h3>
                    <p className="pkg-subtitle">{pkg.subtitle}</p>

                    <div className="pkg-price-strip">
                      {pkg.show_price ? (
                        <span className="pkg-price">₹{pkg.price?.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="pkg-price" style={{ fontSize: '1.1rem' }}>Contact for Rates</span>
                      )}
                      <span className="pkg-basis">{pkg.price_basis}</span>
                    </div>

                    <div className="pkg-inclusions-wrap">
                      <h4 className="pkg-inc-head"><i className="fas fa-check-circle"></i> Inclusions:</h4>
                      <ul className="pkg-inclusions-list">
                        {(Array.isArray(pkg.inclusions) ? pkg.inclusions : []).map((inc, i) => (
                          <li key={i}><i className="fas fa-check"></i> <span>{inc}</span></li>
                        ))}
                      </ul>
                    </div>

                    {pkg.group_note && (
                      <p className="pkg-group-note"><i className="fas fa-info-circle"></i> {pkg.group_note}</p>
                    )}

                    <div className="pkg-action-row">
                      <a
                        href={`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours and Travels! I am interested in booking the *${pkg.title}* (${pkg.badge}). Please send dates and details.`)}`}
                        target="_blank"
                        className="btn-pkg-book"
                      >
                        <i className="fab fa-whatsapp"></i> Book This Package
                      </a>
                      {pkg.poster_image && (
                        <button
                          type="button"
                          className="btn-pkg-poster-text"
                          onClick={() => setSelectedPosterModal({ src: pkg.poster_image, title: pkg.title })}
                        >
                          <i className="fas fa-image"></i> Poster
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="custom-package-banner">
              <div className="cp-info">
                <div className="cp-icon"><i className="fas fa-sliders-h"></i></div>
                <div className="cp-text">
                  <h3>Need a Custom Tour Package?</h3>
                  <p>Planning for a large family, corporate retreat, or specific travel dates? Tell us your group size and budget, and we'll craft a personalized itinerary.</p>
                </div>
              </div>
              <a
                href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels!%20I%20would%20like%20to%20request%20a%20Custom%20Tour%20Package.%20Here%20are%20my%20dates%20and%20group%20size:"
                target="_blank"
                className="btn-primary"
              >
                <i className="fab fa-whatsapp"></i> Request Custom Package
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================================
            ROOMS & STAYS SECTION (River House / Rooms Near River Included!)
            ==================================================================== */}
        <section className="section" id="rooms">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Authentic Accommodations</span>
              <h2>Comfortable Stays in the Heart of Nature</h2>
              <p className="section-lead">
                From affordable cozy mountain retreats to private pool villas and peaceful River House stays near the river stream, explore our authentic room categories with guaranteed local support.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="filter-tabs">
              <button className={`filter-btn ${roomFilter === 'all' ? 'active' : ''}`} onClick={() => setRoomFilter('all')}>
                All Stay Options ({rooms.length})
              </button>
              <button className={`filter-btn ${roomFilter === 'river' ? 'active' : ''}`} onClick={() => setRoomFilter('river')}>
                🌊 River House / Near River
              </button>
              <button className={`filter-btn ${roomFilter === 'pool' ? 'active' : ''}`} onClick={() => setRoomFilter('pool')}>
                🏊 Swimming Pool Properties
              </button>
              <button className={`filter-btn ${roomFilter === 'family' ? 'active' : ''}`} onClick={() => setRoomFilter('family')}>
                👨‍👩‍👧 Homestays & Family Suites
              </button>
              <button className={`filter-btn ${roomFilter === 'cottage' ? 'active' : ''}`} onClick={() => setRoomFilter('cottage')}>
                🏡 Cottages & Villas
              </button>
              <button className={`filter-btn ${roomFilter === 'deluxe' ? 'active' : ''}`} onClick={() => setRoomFilter('deluxe')}>
                🛏️ Deluxe & Standard
              </button>
              <button className={`filter-btn ${roomFilter === 'jungle' ? 'active' : ''}`} onClick={() => setRoomFilter('jungle')}>
                🌿 Jungle Stays
              </button>
              <button className={`filter-btn ${roomFilter === 'aframe' ? 'active' : ''}`} onClick={() => setRoomFilter('aframe')}>
                🔺 A-Frame Cottages
              </button>
              <button className={`filter-btn ${roomFilter === 'tent' ? 'active' : ''}`} onClick={() => setRoomFilter('tent')}>
                ⛺ Tent Stays
              </button>
            </div>

            {/* Rooms Grid */}
            <div className="rooms-grid" id="roomsContainer">
              {filteredRooms.map(room => (
                <div className="room-card" data-category={room.category} id={room.slug} key={room.id}>
                  <div className="room-media">
                    <img src={room.primary_image} alt={`${room.name} - Manoj Tours and Travels Kerala`} className="room-img" loading="lazy" />
                    {room.show_price ? (
                      <span className="room-price-badge">
                        ₹{room.price?.toLocaleString('en-IN')} <small>/night</small>
                      </span>
                    ) : (
                      <span className="room-price-badge" style={{ fontSize: '0.8rem' }}>
                        Contact for rates
                      </span>
                    )}
                    <span className="room-capacity-badge">
                      <i className="fas fa-user-friends"></i> {room.capacity?.split('(')[0]}
                    </span>
                  </div>

                  <div className="room-body">
                    <div className="room-location-tag">
                      <i className="fas fa-map-marker-alt"></i> {room.location}
                    </div>
                    <h3 className="room-title">{room.name}</h3>

                    <ul className="room-features-list">
                      {(Array.isArray(room.features) ? room.features : []).slice(0, 3).map((f, i) => (
                        <li key={i}><i className="fas fa-check"></i> <span>{f}</span></li>
                      ))}
                    </ul>

                    <p className="room-disclaimer-subtext">
                      <i className="fas fa-info-circle"></i> {room.disclaimer}
                    </p>

                    <div className="room-action-row">
                      <a
                        href={`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours and Travels! I want to enquire about booking *${room.name}* (${room.show_price ? `₹${room.price}/night` : 'Current Rates'}). Please confirm availability.`)}`}
                        target="_blank"
                        className="btn-room-book"
                      >
                        <i className="fab fa-whatsapp"></i> Book on WhatsApp
                      </a>
                      <button
                        type="button"
                        className="btn-room-details"
                        onClick={() => {
                          setSelectedRoomModal(room);
                          setActiveModalImage(room.primary_image);
                        }}
                        title="View details and multi-photo gallery"
                      >
                        <i className="fas fa-images"></i> Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Charges Policy */}
            <div className="extra-charges-banner">
              <div className="policy-item">
                <div className="policy-icon"><i className="fas fa-user-plus"></i></div>
                <div className="policy-info">
                  <h4>Extra Adult: ₹500</h4>
                  <p>Per adult per night with full bedding</p>
                </div>
              </div>

              <div className="policy-item">
                <div className="policy-icon"><i className="fas fa-bed"></i></div>
                <div className="policy-info">
                  <h4>Extra Mattress: ₹300</h4>
                  <p>Comfortable floor mattress on request</p>
                </div>
              </div>

              <div className="policy-item">
                <div className="policy-icon"><i className="fas fa-child"></i></div>
                <div className="policy-info">
                  <h4>Children Under 5: FREE</h4>
                  <p>Children 5 to 10 years: only ₹300</p>
                </div>
              </div>

              <div className="policy-item">
                <div className="policy-icon"><i className="fas fa-wifi"></i></div>
                <div className="policy-info">
                  <h4>Free Wi-Fi & Parking</h4>
                  <p>Complimentary for all staying guests</p>
                </div>
              </div>

              <div className="policy-item">
                <div className="policy-icon"><i className="fas fa-shield-alt"></i></div>
                <div className="policy-info">
                  <h4>Price Basis Disclaimer</h4>
                  <p>Tariffs are per room/night; reconfirm on WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            JEEP SAFARI & 10 OFFICIAL TRAILS
            ==================================================================== */}
        <section className="section section-alt" id="safari">
          <div className="container">
            <div className="safari-featured-box">
              <div className="safari-content">
                <span className="section-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}>
                  High-Range Thrill
                </span>
                <h2>JEEP SAFARI & OFF-ROAD EXPERIENCES</h2>
                <p>
                  Explore the mountain roads and scenic countryside around Marayoor and Kanthalloor with a certified local driver. Routes, duration, stops and road conditions may vary by weather and local access. Discover secret waterfalls, elephant trails, and breathtaking 360-degree viewpoints!
                </p>

                <div className="safari-operational-grid">
                  <div className="s-op-item">
                    <i className="fas fa-map-pin"></i>
                    <strong>Pickup Point</strong>
                    <small>Doorstep pickup from Marayoor & Kanthalloor stays</small>
                  </div>
                  <div className="s-op-item">
                    <i className="fas fa-users"></i>
                    <strong>Jeep Capacity</strong>
                    <small>Up to 6–7 passengers per 4x4 off-road Jeep</small>
                  </div>
                  <div className="s-op-item">
                    <i className="fas fa-tag"></i>
                    <strong>Fee Basis</strong>
                    <small>₹2,500 – ₹4,500 per Jeep, or per person in packages</small>
                  </div>
                  <div className="s-op-item">
                    <i className="fas fa-cloud-sun-rain"></i>
                    <strong>Weather Note</strong>
                    <small>Routes subject to weather & forest rules</small>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
                  <a
                    href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours!%20I%20want%20to%20ask%20about%20the%204x4%20Off-road%20Jeep%20Safari%20routes%20and%20rates."
                    target="_blank"
                    className="btn-whatsapp-lg"
                  >
                    <i className="fab fa-whatsapp"></i> Ask About Jeep Safari
                  </a>
                  <a href="#packages" className="btn-glass">
                    <i className="fas fa-gift"></i> View Safari Packages
                  </a>
                </div>
              </div>

              <div className="safari-visual">
                <img src="/assets/images/service_jeep_safari.jpg" alt="Manoj Tours 4x4 Mountain Jeep Safari" className="safari-img-hero" />
              </div>
            </div>

            {/* 10 Safari Highlights Grid */}
            <div className="safari-trails-showcase">
              <div className="section-subheading-wrap">
                <span className="section-eyebrow">Conquer the Trails</span>
                <h3 className="trails-heading">10 Official Jeep Safari Trails & Highlights</h3>
                <p className="trails-subtext">
                  Conquer rugged rocky peaks, misty high-range viewpoints, cascading forest waterfalls, sandalwood walks, fruit orchards, and wild elephant streams.
                </p>
              </div>

              <div className="safari-trails-grid">
                {safaris.map(s => (
                  <div className="safari-trail-card" key={s.id}>
                    <div className="safari-trail-media">
                      <img src={s.primary_image} alt={`${s.title} - Manoj Tours Kerala`} className="safari-trail-img" loading="lazy" />
                      <span className="safari-trail-badge">{s.badge}</span>
                    </div>
                    <div className="safari-trail-body">
                      <h4>{s.title}</h4>
                      <p>{s.description}</p>
                      <div className="safari-trail-meta">
                        <span><i className="fas fa-clock"></i> {s.duration}</span>
                        <span><i className="fas fa-mountain"></i> {s.terrain_tag}</span>
                      </div>
                      <a
                        href={`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours! I want to check availability and book the *${s.title}* (${s.badge}).`)}`}
                        target="_blank"
                        className="btn-trail-book"
                      >
                        Book This Trail <i className="fab fa-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            POPULAR DESTINATIONS 5x2 GRID + NATURE IS CALLING
            ==================================================================== */}
        <section className="section destinations-showcase-section" id="destinations">
          <div className="container">
            <div className="section-header-compact">
              <div className="eyebrow-with-lines">
                <span className="line"></span>
                <span className="eyebrow-text">POPULAR DESTINATIONS</span>
                <span className="line"></span>
              </div>
              <h2 className="section-title-clean">Explore the Beauty of Kerala</h2>
              <p className="section-lead-clean">Discover our 14 signature tourist destinations across Kerala & Tamil Nadu borders. Click any destination card to plan your trip on WhatsApp!</p>
            </div>

            <div className="destinations-split-layout">
              <div className="destinations-left-col">
                <div className="dest-compact-grid" id="destinationsPopularGrid">
                  {visibleDestinations.map((dest, i) => (
                    <div
                      className="dest-compact-card"
                      key={i}
                      onClick={() => window.open(`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours and Travels! I am interested in planning a tour to *${dest.name}*. Please share details.`)}`, '_blank')}
                    >
                      <img src={dest.image} alt={`${dest.name} (${dest.tamil}) - Manoj Tours Kerala`} className="dest-compact-img" loading="lazy" />
                      <span className="dest-compact-badge">{dest.badge}</span>
                      <div className="dest-compact-overlay">
                        <span className="dest-compact-label"><i className="fas fa-map-marker-alt"></i> {dest.name}</span>
                        <small className="dest-compact-tamil">{dest.tamil}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dest-toggle-wrap">
                  <button
                    type="button"
                    id="destToggleBtn"
                    className="btn-glass"
                    onClick={() => setShowAllDest(!showAllDest)}
                  >
                    {showAllDest ? (
                      <>
                        <i className="fas fa-compress-alt"></i> Show Top 10 Popular Hubs
                      </>
                    ) : (
                      <>
                        <i className="fas fa-th-large"></i> View All 14 Beautiful Destinations (Poster Hubs)
                      </>
                    )}
                  </button>
                </div>
              </div>

              <aside className="nature-calling-card">
                <div className="nc-header">
                  <h3 className="nc-title">Nature is Calling <i className="fas fa-leaf"></i></h3>
                  <p className="nc-subtitle">Book your next adventure with <strong>Manoj Tours and Travels Kerala</strong>.</p>
                </div>
                <ul className="nc-check-list">
                  <li><i className="fas fa-check-circle"></i> <span>Transparent Local Rates</span></li>
                  <li><i className="fas fa-check-circle"></i> <span>Safe & Comfortable Travel</span></li>
                  <li><i className="fas fa-check-circle"></i> <span>Experienced Drivers & Guides</span></li>
                  <li><i className="fas fa-check-circle"></i> <span>Customized Packages</span></li>
                </ul>
                <a
                  href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels%20Kerala!%20I%20would%20like%20to%20plan%20a%20trip%20and%20check%20package%20availability."
                  target="_blank"
                  className="btn-nc-whatsapp"
                >
                  <span className="nc-wa-icon"><i className="fab fa-whatsapp"></i></span>
                  <span className="nc-wa-text">
                    <strong>Chat on WhatsApp</strong>
                    <small>For Booking & Enquiries</small>
                  </span>
                </a>
              </aside>
            </div>
          </div>
        </section>

        {/* ====================================================================
            LOCAL SIGHTSEEING GUIDE (7 ATTRACTIONS)
            ==================================================================== */}
        <section className="section section-alt" id="sightseeing">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Local Attractions</span>
              <h2>Marayoor, Kanthalloor & Munnar Local Sightseeing Guide</h2>
              <p className="section-lead">
                Discover the 7 signature wonders of our high-range valley. Real visitor tips, seasonal access notes, and forest department permit guidance.
              </p>
            </div>

            <div className="sightseeing-grid" id="sightseeingContainer">
              {sightseeing.map((spot, i) => (
                <div className="sightseeing-card" key={i}>
                  <div className="ss-media">
                    <img src={spot.image} alt={`${spot.title} - Manoj Tours Kerala`} className="ss-img" loading="lazy" />
                    <span className="ss-badge">{spot.badge}</span>
                  </div>
                  <div className="ss-body">
                    <div className="ss-meta-pill"><i className="fas fa-map-pin"></i> {spot.location}</div>
                    <h3 className="ss-title">{spot.title}</h3>
                    <p className="ss-desc">{spot.description}</p>
                    <div className="ss-guidance-box">
                      <i className="fas fa-shield-alt"></i> <span><strong>Visitor Tip / Permit:</strong> {spot.guidance}</span>
                    </div>
                    <div className="ss-footer">
                      <small><i className="fas fa-clock"></i> {spot.timing}</small>
                      <a
                        href={`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours! I want to include *${spot.title}* in my itinerary.`)}`}
                        target="_blank"
                        className="btn-inquire-dest"
                      >
                        Plan this visit <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            LOCAL TOUR GUIDE & SUPPORT
            ==================================================================== */}
        <section className="section" id="guide">
          <div className="container">
            <div className="guide-showcase-box">
              <div className="guide-content">
                <span className="section-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}>
                  Expert Local Guidance
                </span>
                <h2>LOCAL SIGHTSEEING SUPPORT & TOUR GUIDE</h2>
                <p>
                  Discover the stories and landscapes of Marayoor and Kanthalloor with local sightseeing support. Ask us about available guided visits, route planning, and the best way to combine nearby attractions in your holiday itinerary.
                </p>

                <div className="guide-features-grid">
                  <div className="g-feature-item">
                    <i className="fas fa-map-marked-alt"></i>
                    <div>
                      <strong>Guided Places</strong>
                      <small>Muniyara heritage trails, fruit orchard routes, sandalwood valley viewpoints & waterfall trails</small>
                    </div>
                  </div>

                  <div className="g-feature-item">
                    <i className="fas fa-language"></i>
                    <div>
                      <strong>Languages Supported</strong>
                      <small>Malayalam, Tamil & English spoken fluently</small>
                    </div>
                  </div>

                  <div className="g-feature-item">
                    <i className="fas fa-tree"></i>
                    <div>
                      <strong>Official Forest Rules</strong>
                      <small>Official Forest Department permissions and authorised forest guides coordinated for protected sanctuary zones</small>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <a
                    href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours!%20I%20would%20like%20to%20inquire%20about%20a%20Local%20Tour%20Guide%20for%20Marayoor%20and%20Kanthalloor."
                    target="_blank"
                    className="btn-whatsapp-lg"
                  >
                    <i className="fab fa-whatsapp"></i> Inquire About Local Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CATEGORIZED PHOTO GALLERY (19 PHOTOS)
            ==================================================================== */}
        <section className="section section-alt" id="gallery">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Visual Moments</span>
              <h2>Real Photos & Experiences Gallery</h2>
              <p className="section-lead">Explore high-definition photos of our rooms, 4x4 off-road safari jeeps, tea mountain landscapes, homely meals, and official package posters.</p>
            </div>

            <div className="gallery-tabs filter-tabs">
              <button className={`filter-btn ${galleryFilter === 'all' ? 'active' : ''}`} onClick={() => setGalleryFilter('all')}>All Photos</button>
              <button className={`filter-btn ${galleryFilter === 'rooms' ? 'active' : ''}`} onClick={() => setGalleryFilter('rooms')}>Rooms & Stays</button>
              <button className={`filter-btn ${galleryFilter === 'safari' ? 'active' : ''}`} onClick={() => setGalleryFilter('safari')}>Jeep Safari</button>
              <button className={`filter-btn ${galleryFilter === 'landscapes' ? 'active' : ''}`} onClick={() => setGalleryFilter('landscapes')}>Landscapes</button>
              <button className={`filter-btn ${galleryFilter === 'food' ? 'active' : ''}`} onClick={() => setGalleryFilter('food')}>Homely Food & Campfire</button>
              <button className={`filter-btn ${galleryFilter === 'posters' ? 'active' : ''}`} onClick={() => setGalleryFilter('posters')}>Special Offer Posters</button>
            </div>

            <div className="gallery-grid" id="galleryContainer">
              {filteredGallery.map((item, i) => (
                <div
                  className="gallery-tile"
                  key={i}
                  onClick={() => setSelectedLightboxModal({ src: item.src, title: item.title })}
                >
                  <img src={item.src} alt={item.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-hover-overlay">
                    <i className="fas fa-search-plus"></i>
                    <span>{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            LIVE TRIP & STAY COST CALCULATOR
            ==================================================================== */}
        <section className="section" id="calculator">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Transparent Pricing</span>
              <h2>Interactive Trip & Stay Cost Calculator</h2>
              <p className="section-lead">
                Select your preferred accommodation, dates, group size, and add-on adventures for an instant, transparent cost estimate with direct WhatsApp booking.
              </p>
            </div>

            <div className="calculator-card">
              <div className="calc-mobile-livebar" id="calcMobileLivebar">
                <div className="cml-info">
                  <span className="cml-label"><i className="fas fa-calculator"></i> Live Estimate</span>
                  <strong className="cml-price" id="mobileGrandTotal">₹ {grandTotal.toLocaleString('en-IN')}</strong>
                </div>
                <a href="#calcSummaryBox" className="cml-btn">
                  <span>View Bill</span> <i className="fas fa-arrow-down"></i>
                </a>
              </div>

              <div className="calc-form-col">
                <div className="calc-field">
                  <label htmlFor="calcRoom">
                    <span>Select Room Category</span>
                    <span className="calc-badge">{rooms.length} Stays Available</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="calcRoom"
                      value={calcRoomId}
                      onChange={(e) => setCalcRoomId(e.target.value)}
                      aria-label="Select Room Category"
                    >
                      {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} — ₹{r.price?.toLocaleString('en-IN')}/night ({r.capacity})
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-chevron-down select-chevron"></i>
                  </div>
                </div>

                <div className="calc-row">
                  <div className="calc-field">
                    <label htmlFor="calcCheckin">Check-In Date</label>
                    <div className="input-icon-wrapper">
                      <i className="fas fa-calendar-alt input-icon"></i>
                      <input
                        type="date"
                        id="calcCheckin"
                        value={calcCheckin}
                        onChange={(e) => setCalcCheckin(e.target.value)}
                        aria-label="Check-In Date"
                      />
                    </div>
                  </div>

                  <div className="calc-field">
                    <label htmlFor="calcCheckout">Check-Out Date</label>
                    <div className="input-icon-wrapper">
                      <i className="fas fa-calendar-check input-icon"></i>
                      <input
                        type="date"
                        id="calcCheckout"
                        value={calcCheckout}
                        onChange={(e) => setCalcCheckout(e.target.value)}
                        aria-label="Check-Out Date"
                      />
                    </div>
                  </div>
                </div>

                <div className="calc-row-3">
                  <div className="calc-field">
                    <label htmlFor="calcAdults">Adults (12+ yrs)</label>
                    <div className="calc-stepper">
                      <button type="button" className="stepper-btn" onClick={() => setCalcAdults(Math.max(1, calcAdults - 1))} aria-label="Decrease Adults">-</button>
                      <input
                        type="number"
                        id="calcAdults"
                        value={calcAdults}
                        onChange={(e) => setCalcAdults(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        aria-label="Adults count"
                      />
                      <button type="button" className="stepper-btn" onClick={() => setCalcAdults(calcAdults + 1)} aria-label="Increase Adults">+</button>
                    </div>
                  </div>

                  <div className="calc-field">
                    <label htmlFor="calcChildren">Children (5-10 yrs)</label>
                    <div className="calc-stepper">
                      <button type="button" className="stepper-btn" onClick={() => setCalcChildren(Math.max(0, calcChildren - 1))} aria-label="Decrease Children">-</button>
                      <input
                        type="number"
                        id="calcChildren"
                        value={calcChildren}
                        onChange={(e) => setCalcChildren(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        aria-label="Children count"
                      />
                      <button type="button" className="stepper-btn" onClick={() => setCalcChildren(calcChildren + 1)} aria-label="Increase Children">+</button>
                    </div>
                    <small className="field-hint">Under 5: FREE • 5-10: ₹300</small>
                  </div>

                  <div className="calc-field">
                    <label htmlFor="calcExtraBeds">Extra Beds</label>
                    <div className="calc-stepper">
                      <button type="button" className="stepper-btn" onClick={() => setCalcExtraBeds(Math.max(0, calcExtraBeds - 1))} aria-label="Decrease Extra Beds">-</button>
                      <input
                        type="number"
                        id="calcExtraBeds"
                        value={calcExtraBeds}
                        onChange={(e) => setCalcExtraBeds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        aria-label="Extra Beds count"
                      />
                      <button type="button" className="stepper-btn" onClick={() => setCalcExtraBeds(calcExtraBeds + 1)} aria-label="Increase Extra Beds">+</button>
                    </div>
                    <small className="field-hint">₹300 per bed</small>
                  </div>
                </div>

                <div className="calc-field">
                  <label>Experience Add-ons (Optional)</label>
                  <div className="addons-grid">
                    <label className="addon-tile" htmlFor="addonJeep">
                      <input
                        type="checkbox"
                        id="addonJeep"
                        className="addon-input"
                        checked={addonJeep}
                        onChange={(e) => setAddonJeep(e.target.checked)}
                      />
                      <div className="addon-tile-content">
                        <div className="addon-tile-main">
                          <span className="addon-tile-icon"><i className="fas fa-mountain"></i></span>
                          <div className="addon-tile-text">
                            <strong>4x4 Off-Road Jeep Safari</strong>
                            <small>Muruganpara & Bhramaram viewpoints</small>
                          </div>
                        </div>
                        <span className="badge-price">+₹2,500</span>
                      </div>
                    </label>

                    <label className="addon-tile" htmlFor="addonCampfire">
                      <input
                        type="checkbox"
                        id="addonCampfire"
                        className="addon-input"
                        checked={addonCampfire}
                        onChange={(e) => setAddonCampfire(e.target.checked)}
                      />
                      <div className="addon-tile-content">
                        <div className="addon-tile-main">
                          <span className="addon-tile-icon"><i className="fas fa-fire"></i></span>
                          <div className="addon-tile-text">
                            <strong>Misty Night Campfire</strong>
                            <small>With acoustic music & ambient night lights</small>
                          </div>
                        </div>
                        <span className="badge-price">+₹1,000</span>
                      </div>
                    </label>

                    <label className="addon-tile" htmlFor="addonFood">
                      <input
                        type="checkbox"
                        id="addonFood"
                        className="addon-input"
                        checked={addonFood}
                        onChange={(e) => setAddonFood(e.target.checked)}
                      />
                      <div className="addon-tile-content">
                        <div className="addon-tile-main">
                          <span className="addon-tile-icon"><i className="fas fa-utensils"></i></span>
                          <div className="addon-tile-text">
                            <strong>Kerala Homely Meals</strong>
                            <small>Authentic breakfast & dinner</small>
                          </div>
                        </div>
                        <span className="badge-price">+₹600 / pers</span>
                      </div>
                    </label>

                    <label className="addon-tile" htmlFor="addonPickup">
                      <input
                        type="checkbox"
                        id="addonPickup"
                        className="addon-input"
                        checked={addonPickup}
                        onChange={(e) => setAddonPickup(e.target.checked)}
                      />
                      <div className="addon-tile-content">
                        <div className="addon-tile-main">
                          <span className="addon-tile-icon"><i className="fas fa-taxi"></i></span>
                          <div className="addon-tile-text">
                            <strong>Private Cab Pickup</strong>
                            <small>Kochi Airport / Coimbatore Station</small>
                          </div>
                        </div>
                        <span className="badge-price">+₹3,500</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Calculator Summary */}
              <div className="calc-summary-col" id="calcSummaryBox">
                <div className="summary-card">
                  <h3 className="summary-title"><i className="fas fa-receipt"></i> Trip Cost Estimate</h3>

                  <ul className="summary-items">
                    <li>
                      <span className="item-title">Duration:</span>
                      <strong className="item-val" id="summaryNights">{nights} Night(s)</strong>
                    </li>
                    <li>
                      <span className="item-title">Room & Bedding:</span>
                      <strong className="item-val" id="summaryRoomCost">₹ {roomTotal.toLocaleString('en-IN')}</strong>
                    </li>
                    <li>
                      <span className="item-title">Add-ons Subtotal:</span>
                      <strong className="item-val" id="summaryAddonsCost">₹ {addonsTotal.toLocaleString('en-IN')}</strong>
                    </li>
                  </ul>

                  <div className="summary-total-box">
                    <span className="total-label">Grand Total (Estimated)</span>
                    <span className="total-price" id="calcGrandTotal">₹ {grandTotal.toLocaleString('en-IN')}</span>
                    <small className="total-hint">*Price Basis: Per Room/Night. Reconfirm on WhatsApp.</small>
                  </div>

                  <a
                    href={`https://wa.me/919778264090?text=${encodeURIComponent(calcWhatsAppMsg)}`}
                    id="btnCalcWhatsApp"
                    target="_blank"
                    className="btn-whatsapp-calc"
                  >
                    <i className="fab fa-whatsapp"></i> Book This Estimate on WhatsApp
                  </a>

                  <p className="summary-guarantee">
                    <i className="fas fa-shield-alt"></i> Direct reservation inquiry with Manoj Tours & Travels Kerala.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            YOUTUBE VIRAL VIDEOS SHOWCASE
            ==================================================================== */}
        <section className="section section-alt" id="videos">
          <div className="container">
            <div className="youtube-banner">
              <div className="youtube-info">
                <div className="youtube-icon-badge"><i className="fab fa-youtube"></i></div>
                <div className="youtube-text">
                  <h3>Manoj Tours & Travels Official YouTube Channel</h3>
                  <p>@manojtourstravelskerala • 531+ Subscribers • 37+ Real Adventure Videos & Viral Shorts</p>
                </div>
              </div>
              <a href="https://www.youtube.com/@manojtourstravelskerala" target="_blank" className="btn-primary" style={{ background: '#ff0000' }}>
                <i className="fab fa-youtube"></i> Subscribe on YouTube
              </a>
            </div>

            <div className="video-cards-grid">
              <div className="video-card">
                <div className="video-thumb">
                  <img src="/assets/images/service_night_safari.jpg" alt="Beast on the Road Indian Gaur Wildlife" />
                  <a href="https://www.youtube.com/@manojtourstravelskerala" target="_blank" className="video-play-btn"><i className="fas fa-play"></i></a>
                </div>
                <div className="video-info">
                  <h4>Beast on the Road! (Indian Gaur Encounter)</h4>
                  <span className="video-views"><i className="fas fa-eye"></i> 26,000+ Views • Viral Safari</span>
                </div>
              </div>

              <div className="video-card">
                <div className="video-thumb">
                  <img src="/assets/images/dest_thekkady.jpg" alt="Wild Elephant Encounter Kanthalloor" />
                  <a href="https://www.youtube.com/@manojtourstravelskerala" target="_blank" className="video-play-btn"><i className="fas fa-play"></i></a>
                </div>
                <div className="video-info">
                  <h4>Wild Elephant in Kanthalloor (Real Footage)</h4>
                  <span className="video-views"><i className="fas fa-eye"></i> 23,000+ Views • Kanthalloor Jungle</span>
                </div>
              </div>

              <div className="video-card">
                <div className="video-thumb">
                  <img src="/assets/images/dest_munnar.jpg" alt="Kolukkumalai Sunrise Above Cloud Bed" />
                  <a href="https://www.youtube.com/@manojtourstravelskerala" target="_blank" className="video-play-btn"><i className="fas fa-play"></i></a>
                </div>
                <div className="video-info">
                  <h4>Kolukkumalai Sunrise Above Cloud Bed</h4>
                  <span className="video-views"><i className="fas fa-eye"></i> 18,500+ Views • 7,900 ft Peak</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            FAQ ACCORDIONS
            ==================================================================== */}
        <section className="section" id="faq">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Clear & Transparent Policies</span>
              <h2>Common Booking Questions & Policies</h2>
              <p className="section-lead">Answers to key questions regarding check-in timings, pricing basis, swimming pool rules, jeep safari routes, and cancellation policies.</p>
            </div>

            <div className="faq-accordion">
              {[
                {
                  q: 'What are the standard Check-In, Check-Out timings and parking facilities?',
                  a: 'Standard check-in time is 12:00 PM – 1:00 PM and check-out time is 10:00 AM – 11:00 AM. Early check-in or late check-out is flexible upon request subject to room availability. Complimentary secure private car/bus parking and free Wi-Fi are provided at all properties.'
                },
                {
                  q: 'What is the difference between Per Room and Per Person pricing?',
                  a: 'Room tariffs (₹2,000 to ₹7,500) are charged on a Per Room / Per Night basis for base occupancy (2 adults). In contrast, all-inclusive Tour Packages (such as our ₹900, ₹1,500, ₹2,000, or ₹2,500 packages) are priced on a Per Person (Per Head) basis and include food, accommodation, campfire, and jeep safari. Rates vary by season and must be reconfirmed on WhatsApp.'
                },
                {
                  q: 'What are the Swimming Pool access hours and meals policy?',
                  a: 'Swimming pool access is available exclusively at our Swimming Pool Properties (₹5,000 & ₹6,000) during designated daytime and twilight resort hours, adhering to safety guidelines. Authentic home-cooked Kerala breakfast and dinner are included in package plans or freshly prepared on order for room bookings.'
                },
                {
                  q: 'How long does the 4x4 Jeep Safari take and what about weather changes?',
                  a: '4x4 off-road safaris generally last 2.5 to 4.5 hours depending on the chosen route (e.g., Muruganpara Peak, Bhramaram Point, or Irachalpara Waterfalls). Doorstep pickup is provided from Marayoor and Kanthalloor stays. Because off-road trails wind through Western Ghats mountain ridges, specific stops may adjust based on weather or local access rules.'
                },
                {
                  q: 'Are permits required for forest walks, trekking, or wildlife areas?',
                  a: 'Fenced sandalwood forest reserves and trekking routes inside Chinnar Wildlife Sanctuary (such as Thoovanam Trek) require official Forest Department tickets and authorised guides, which we coordinate for you. Wildlife sightings at Anakulam or forest borders occur in natural habitats and are subject to wild animal movements.'
                },
                {
                  q: 'How do I confirm a booking, make payment, or request date changes?',
                  a: 'All bookings are confirmed directly in writing via WhatsApp upon a small advance reservation token payment (via GPay / PhonePe / Bank Transfer). Date changes or cancellations are accommodated based on advance notice and property terms shared at the time of reservation.'
                }
              ].map((faq, idx) => (
                <div className={`faq-item ${activeFaqIndex === idx ? 'active' : ''}`} key={idx}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <i className="fas fa-chevron-down faq-caret"></i>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            CUSTOMER REVIEWS SECTION
            ==================================================================== */}
        <section className="section section-alt" id="reviews">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Google 5.0 ⭐ Rated</span>
              <h2>What Our Guests Say About Manoj Tours</h2>
              <p className="section-lead">375+ authentic Google reviews from families, couples, and road-trippers across India.</p>
            </div>

            <div className="reviews-grid">
              {reviews.map((rv, idx) => (
                <div className="review-card" key={idx}>
                  <div className="review-stars">{'⭐'.repeat(rv.rating || 5)}</div>
                  <p className="review-text">{rv.review_text}</p>
                  <div className="review-author">
                    <div className="author-avatar"><i className="fas fa-user-circle"></i></div>
                    <div className="author-info">
                      <strong>{rv.name}</strong>
                      <small>{rv.location_tag}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <a
                href="https://maps.google.com/"
                target="_blank"
                className="btn-glass"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', borderColor: '#22c55e', color: '#22c55e' }}
              >
                <i className="fab fa-google"></i> Read More Reviews on Google Business Profile
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================================
            8-FIELD ENQUIRY FORM & CONTACT SECTION
            ==================================================================== */}
        <section className="section" id="contact">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Plan Your Journey</span>
              <h2>Plan Your Trip — Send a Booking Enquiry</h2>
              <p className="section-lead">
                Tell us your travel dates and group size. We’ll help you check suitable stays, safari options and local sightseeing.
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-form-col">
                <form id="quickContactForm" className="contact-form" onSubmit={handleEnquirySubmit}>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="contactName"><i className="fas fa-user"></i> Your Name *</label>
                      <input
                        type="text"
                        id="contactName"
                        placeholder="e.g. Suresh Kumar"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contactPhone"><i className="fab fa-whatsapp"></i> WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        id="contactPhone"
                        placeholder="e.g. +91 98765 43210"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div className="form-field">
                      <label htmlFor="contactDate"><i className="fas fa-calendar-alt"></i> Travel Date *</label>
                      <input
                        type="date"
                        id="contactDate"
                        required
                        value={contactDate}
                        onChange={(e) => setContactDate(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contactGuests"><i className="fas fa-users"></i> Number of Guests *</label>
                      <select
                        id="contactGuests"
                        required
                        value={contactGuests}
                        onChange={(e) => setContactGuests(e.target.value)}
                      >
                        <option value="1 Guest">1 Guest (Solo)</option>
                        <option value="2 Guests (Couple)">2 Guests (Couple)</option>
                        <option value="3-4 Guests (Family)">3 - 4 Guests (Family)</option>
                        <option value="5-8 Guests (Group)">5 - 8 Guests (Group)</option>
                        <option value="9+ Guests (Large Group)">9+ Guests (Large Group / Villa)</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="contactNights"><i className="fas fa-moon"></i> Number of Nights *</label>
                      <select
                        id="contactNights"
                        required
                        value={contactNights}
                        onChange={(e) => setContactNights(e.target.value)}
                      >
                        <option value="1 Night">1 Night</option>
                        <option value="2 Nights">2 Nights</option>
                        <option value="3 Nights">3 Nights</option>
                        <option value="4+ Nights">4+ Nights</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="contactStay"><i className="fas fa-bed"></i> Preferred Stay Type</label>
                      <select
                        id="contactStay"
                        value={contactStay}
                        onChange={(e) => setContactStay(e.target.value)}
                      >
                        <option value="Homestay / Family Villa">Homestay / Family Villa</option>
                        <option value="River House / Near the River">River House / Near the River</option>
                        <option value="Swimming Pool Property">Swimming Pool Property</option>
                        <option value="Mud House / Cottage">Mud House / Cottage</option>
                        <option value="Jungle / Nature Stay">Jungle / Nature Stay</option>
                        <option value="Deluxe / Premium Room">Deluxe / Premium Room</option>
                        <option value="All-Inclusive Tour Package">All-Inclusive Tour Package with Stay</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="contactActivities"><i className="fas fa-mountain"></i> Interested Activities</label>
                      <select
                        id="contactActivities"
                        value={contactActivities}
                        onChange={(e) => setContactActivities(e.target.value)}
                      >
                        <option value="4x4 Jeep Safari & Waterfalls">4x4 Jeep Safari & Waterfalls</option>
                        <option value="Marayoor & Kanthalloor Sightseeing">Marayoor & Kanthalloor Sightseeing</option>
                        <option value="Anakulam Wild Elephant Stream">Anakulam Wild Elephant Stream</option>
                        <option value="Vagamon Scotland of Kerala Package">Vagamon Scotland of Kerala Package</option>
                        <option value="Local Tour Guide & Trekking">Local Tour Guide & Trekking</option>
                        <option value="Campfire & Homely Kerala Food">Campfire & Homely Kerala Food</option>
                        <option value="Pickup & Drop Transport">Pickup & Drop Transport (Kerala & TN)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contactNotes"><i className="fas fa-comment-dots"></i> Message / Special Requirements</label>
                    <textarea
                      id="contactNotes"
                      rows={3}
                      placeholder="Tell us if you need pickup from Cochin/Coimbatore, custom campfire, or specific room preferences..."
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-whatsapp-lg" style={{ width: '100%', justifyContent: 'center' }}>
                    <i className="fab fa-whatsapp"></i> Send Booking Enquiry on WhatsApp
                  </button>
                </form>
              </div>

              <div className="contact-info-col">
                <div className="contact-card">
                  <h3 className="contact-card-title"><i className="fas fa-phone-alt"></i> Direct Contact Support</h3>
                  <p>Connect directly with our local office in Marayoor for instant confirmation, customized packages, and room availability.</p>

                  <div className="contact-methods-list">
                    <a href="tel:+919778264090" className="c-method-item">
                      <div className="c-method-icon"><i className="fas fa-phone"></i></div>
                      <div className="c-method-text">
                        <strong>Primary Booking Call & WhatsApp:</strong>
                        <span>+91 97782 64090</span>
                      </div>
                    </a>

                    <a href="https://wa.me/919496911322" target="_blank" className="c-method-item">
                      <div className="c-method-icon"><i className="fab fa-whatsapp"></i></div>
                      <div className="c-method-text">
                        <strong>Secondary WhatsApp Support:</strong>
                        <span>+91 94969 11322</span>
                      </div>
                    </a>

                    <a href="mailto:manojtoursandtravelskerala@gmail.com" className="c-method-item">
                      <div className="c-method-icon"><i className="fas fa-envelope"></i></div>
                      <div className="c-method-text">
                        <strong>Official Email:</strong>
                        <span>manojtoursandtravelskerala@gmail.com</span>
                      </div>
                    </a>

                    <div className="c-method-item">
                      <div className="c-method-icon"><i className="fas fa-map-marker-alt"></i></div>
                      <div className="c-method-text">
                        <strong>Office Location:</strong>
                        <span>Munnar Road, Marayoor, Idukki District, Kerala – 685620</span>
                      </div>
                    </div>
                  </div>

                  <div className="contact-timings-strip">
                    <i className="fas fa-clock"></i> <span>Office Hours: 6:00 AM – 11:00 PM (Daily Support)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SIGNATURE BOTTOM STRIP
            ==================================================================== */}
        <div className="bottom-contact-strip">
          <div className="container strip-flex">
            <div className="strip-item"><i className="fas fa-map-marker-alt"></i> <span>Marayoor, Idukki, Kerala</span></div>
            <div className="strip-divider">|</div>
            <a href="tel:+919778264090" className="strip-item"><i className="fas fa-phone-alt"></i> <span>+91 97782 64090</span></a>
            <div className="strip-divider">|</div>
            <a href="mailto:manojtoursandtravelskerala@gmail.com" className="strip-item"><i className="fas fa-envelope"></i> <span>manojtoursandtravelskerala@gmail.com</span></a>

            <div className="strip-socials">
              <a href="https://instagram.com/manoj_tourstravels" target="_blank" title="Instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://facebook.com/" target="_blank" title="Facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com/@manojtourstravelskerala" target="_blank" title="YouTube" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="https://maps.google.com/" target="_blank" title="Google Business Profile" aria-label="Google"><i className="fab fa-google"></i></a>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================================
          SITE FOOTER
          ====================================================================== */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <img src="/assets/images/logo_tight.jpg" alt="Manoj Tours Logo" className="footer-logo" />
              <p>Manoj Tours and Travels Kerala — Comfortable stays in the heart of nature, 4x4 off-road jeep safaris, hidden waterfalls and pure memories for a lifetime.</p>
              <div className="footer-trust-badge">
                <i className="fas fa-certificate"></i>
                <span>Google 5.0 ⭐ Rated (375+ Reviews)</span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul className="footer-links">
              <li><a href="#hero"><i className="fas fa-chevron-right"></i> Home</a></li>
              <li><a href="#about"><i className="fas fa-chevron-right"></i> About Us</a></li>
              <li><a href="#packages"><i className="fas fa-chevron-right"></i> Tour Packages</a></li>
              <li><a href="#rooms"><i className="fas fa-chevron-right"></i> Stay Options</a></li>
              <li><a href="#safari"><i className="fas fa-chevron-right"></i> 4x4 Jeep Safari</a></li>
              <li><a href="#destinations"><i className="fas fa-chevron-right"></i> Popular Destinations</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Sightseeing & Policies</h4>
            <ul className="footer-links">
              <li><a href="#sightseeing"><i className="fas fa-chevron-right"></i> Local Sightseeing (7 Spots)</a></li>
              <li><a href="#guide"><i className="fas fa-chevron-right"></i> Local Tour Guide Support</a></li>
              <li><a href="#gallery"><i className="fas fa-chevron-right"></i> Photo Gallery</a></li>
              <li><a href="#calculator"><i className="fas fa-chevron-right"></i> Trip Cost Calculator</a></li>
              <li><a href="#faq"><i className="fas fa-chevron-right"></i> Booking Policies FAQ</a></li>
              <li><a href="#contact"><i className="fas fa-chevron-right"></i> Contact & Enquiry</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container bottom-flex">
            <p>© 2026 Manoj Tours and Travels Kerala. All Rights Reserved. Designed for Authentic Kerala Hospitality.</p>
            <p>Marayoor • Kanthalloor • Munnar • Western Ghats</p>
          </div>
        </div>
      </footer>

      {/* ======================================================================
          ROOM DETAILS & MULTI-PHOTO MODAL
          ====================================================================== */}
      {selectedRoomModal && (
        <div className="modal-overlay active" id="roomModal" onClick={() => setSelectedRoomModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedRoomModal(null)}
              aria-label="Close Modal"
            >
              &times;
            </button>
            <div id="roomModalContent">
              <div className="modal-gallery-wrap">
                <div className="modal-main-img-box">
                  <img
                    id="modalMainImg"
                    src={activeModalImage || selectedRoomModal.primary_image}
                    alt={selectedRoomModal.name}
                    className="modal-main-img"
                  />
                </div>
                <div className="modal-thumbnails-strip">
                  {(selectedRoomModal.gallery || [selectedRoomModal.primary_image]).map((gImg, idx) => (
                    <img
                      key={idx}
                      src={gImg}
                      alt={`Photo ${idx + 1}`}
                      className={`modal-thumb ${activeModalImage === gImg ? 'active' : ''}`}
                      onClick={() => setActiveModalImage(gImg)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-details-body">
                <div className="modal-header-row">
                  <div>
                    <span className="dest-location-tag"><i className="fas fa-map-marker-alt"></i> {selectedRoomModal.location}</span>
                    <h2 className="modal-room-title">{selectedRoomModal.name}</h2>
                  </div>
                  <div className="modal-price-box">
                    {selectedRoomModal.show_price ? (
                      <>
                        <span className="m-price">₹{selectedRoomModal.price?.toLocaleString('en-IN')}</span>
                        <span className="m-basis">{selectedRoomModal.price_basis}</span>
                      </>
                    ) : (
                      <span className="m-price" style={{ fontSize: '1.1rem' }}>Contact for current rates</span>
                    )}
                  </div>
                </div>

                <div className="modal-meta-grid">
                  <div className="m-meta-item"><i className="fas fa-users"></i> <strong>Occupancy:</strong> {selectedRoomModal.capacity}</div>
                  <div className="m-meta-item"><i className="fas fa-utensils"></i> <strong>Dining:</strong> {selectedRoomModal.dining_note}</div>
                </div>

                <h4 className="modal-section-h">Room Amenities & Highlights:</h4>
                <div className="modal-amenities-grid">
                  {(Array.isArray(selectedRoomModal.features) ? selectedRoomModal.features : []).map((f, i) => (
                    <div className="m-amenity" key={i}><i className="fas fa-check-circle"></i> {f}</div>
                  ))}
                </div>

                <div className="modal-disclaimer-alert">
                  <i className="fas fa-shield-alt"></i>
                  <span><strong>Price & Booking Policy:</strong> {selectedRoomModal.disclaimer} Extra adult: ₹500/night; extra mattress: ₹300/night. Children under 5 stay free.</span>
                </div>

                <div className="modal-actions-row">
                  <a
                    href={`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours and Travels! I want to book *${selectedRoomModal.name}* (${selectedRoomModal.show_price ? `₹${selectedRoomModal.price}/night` : 'Current Rates'}). Please confirm availability for my dates.`)}`}
                    target="_blank"
                    className="btn-whatsapp-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <i className="fab fa-whatsapp"></i> Confirm Booking on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          POSTER LIGHTBOX MODAL
          ====================================================================== */}
      {selectedPosterModal && (
        <div className="modal-overlay active" id="posterModal" onClick={() => setSelectedPosterModal(null)}>
          <div className="poster-modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedPosterModal(null)}
              aria-label="Close Poster Modal"
            >
              &times;
            </button>
            <div className="poster-modal-body">
              <img src={selectedPosterModal.src} alt={selectedPosterModal.title} className="poster-modal-img" />
              <div className="poster-modal-footer">
                <span id="posterModalCaption">{selectedPosterModal.title}</span>
                <a
                  href={`https://wa.me/919778264090?text=${encodeURIComponent(`Hello Manoj Tours! I saw the official poster for *${selectedPosterModal.title}* and want to book.`)}`}
                  target="_blank"
                  className="btn-primary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  <i className="fab fa-whatsapp"></i> Book This Poster Offer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          GALLERY LIGHTBOX MODAL
          ====================================================================== */}
      {selectedLightboxModal && (
        <div className="modal-overlay active" id="lightboxModal" onClick={() => setSelectedLightboxModal(null)}>
          <div className="poster-modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedLightboxModal(null)}
              aria-label="Close Lightbox"
            >
              &times;
            </button>
            <div className="poster-modal-body">
              <img src={selectedLightboxModal.src} alt={selectedLightboxModal.title} className="poster-modal-img" />
              <div className="poster-modal-footer">
                <span id="lightboxCaption">{selectedLightboxModal.title}</span>
                <button type="button" className="btn-glass" onClick={() => setSelectedLightboxModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MOBILE STICKY BOTTOM BAR (5 TABS)
          ====================================================================== */}
      <div className="mobile-bottom-bar">
        <div className="bottom-grid">
          <a href="#hero" className="bottom-tab active">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="#rooms" className="bottom-tab">
            <i className="fas fa-bed"></i>
            <span>Stays</span>
          </a>
          <a
            href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours!%20I%20want%20to%20book%20a%20stay/tour%20package."
            target="_blank"
            className="bottom-tab tab-whatsapp"
          >
            <i className="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
          </a>
          <a href="#packages" className="bottom-tab">
            <i className="fas fa-map-marked-alt"></i>
            <span>Packages</span>
          </a>
          <a href="#safari" className="bottom-tab">
            <i className="fas fa-truck-pickup"></i>
            <span>Safari</span>
          </a>
        </div>
      </div>
    </>
  );
}


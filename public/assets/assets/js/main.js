/* ==========================================================================
   MANOJ TOURS AND TRAVELS KERALA — MAIN JAVASCRIPT ENGINE
   Includes: Rain Canvas Engine, Day/Night Theme, Hero Slider & Booking Bar,
   Packages Showcase & Poster Lightbox, 11 Rooms & Multi-Photo Modal,
   Jeep Safari Showcase, Popular Destinations 5x2 + Nature is Calling,
   Local Sightseeing Guide (7 Spots), Categorized Gallery, Live Trip Calculator,
   FAQ Accordions, and 8-Field WhatsApp Booking Form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initRainCanvas();
  initThemeToggle();
  initMobileNav();
  initHeroSlider();
  initHeroBookingBar();
  renderPackages();
  renderRooms();
  renderDestinations(false);
  renderSightseeing();
  renderGallery('all');
  initCalculator();
  initFaqAccordion();
  initEnquiryForm();
  initScrollNavSync();
});

/* ==========================================================================
   1. RAIN CANVAS ANIMATION & MONSOON AUDIO ENGINE
   ========================================================================== */
let rainActive = true;
let rainAnimationId = null;

function initRainCanvas() {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const raindrops = [];
  const maxDrops = window.innerWidth < 768 ? 60 : 120;

  for (let i = 0; i < maxDrops; i++) {
    raindrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 18 + 10,
      speed: Math.random() * 10 + 12,
      opacity: Math.random() * 0.35 + 0.15
    });
  }

  function drawRain() {
    if (!rainActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.2;

    for (let drop of raindrops) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(210, 235, 255, ${drop.opacity})`;
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speed;
      drop.x -= 1;

      if (drop.y > canvas.height) {
        drop.y = -20;
        drop.x = Math.random() * canvas.width;
      }
    }
    rainAnimationId = requestAnimationFrame(drawRain);
  }
  drawRain();

  const rainToggle = document.getElementById('rainToggle');
  if (rainToggle) {
    rainToggle.addEventListener('click', () => {
      rainActive = !rainActive;
      rainToggle.classList.toggle('active', rainActive);
      rainToggle.innerHTML = rainActive ? '🌧️' : '☀️';
      rainToggle.setAttribute('title', rainActive ? 'Monsoon Rain Active' : 'Rain Paused');
      if (rainActive && !rainAnimationId) {
        drawRain();
      }
    });
  }
}

/* ==========================================================================
   2. DAY / NIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('manoj_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('manoj_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode');
  }
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.classList.toggle('active', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   4. HERO BACKGROUND SLIDER & DOT NAVIGATION
   ========================================================================== */
let heroSlideIndex = 0;
let heroSliderInterval = null;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-bg-media .hero-slide');
  const dots = document.querySelectorAll('#heroSliderDots .hero-dot');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    heroSlideIndex = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-slide') || '0', 10);
      showSlide(target);
      resetHeroSliderTimer();
    });
  });

  function startHeroTimer() {
    heroSliderInterval = setInterval(() => {
      let next = (heroSlideIndex + 1) % slides.length;
      showSlide(next);
    }, 6000);
  }

  function resetHeroSliderTimer() {
    if (heroSliderInterval) clearInterval(heroSliderInterval);
    startHeroTimer();
  }

  startHeroTimer();
}

/* ==========================================================================
   5. FLOATING HERO BOOKING BAR & CALCULATOR SYNC
   ========================================================================== */
function initHeroBookingBar() {
  const checkin = document.getElementById('heroCheckin');
  const checkout = document.getElementById('heroCheckout');
  const guests = document.getElementById('heroSearchGuests');
  const searchBtn = document.getElementById('heroSearchBtn');

  // Set default dates: checkin tomorrow, checkout day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = d => d.toISOString().split('T')[0];
  if (checkin) {
    checkin.value = formatDate(tomorrow);
    checkin.min = formatDate(today);
  }
  if (checkout) {
    checkout.value = formatDate(dayAfter);
    checkout.min = formatDate(tomorrow);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const inDate = checkin ? checkin.value : '';
      const outDate = checkout ? checkout.value : '';
      const guestVal = guests ? guests.value : '2';

      // Sync with Calculator inputs
      const calcIn = document.getElementById('calcCheckin');
      const calcOut = document.getElementById('calcCheckout');
      const calcAdults = document.getElementById('calcAdults');

      if (calcIn && inDate) calcIn.value = inDate;
      if (calcOut && outDate) calcOut.value = outDate;
      if (calcAdults && guestVal) {
        calcAdults.value = guestVal;
        calculateTripCost();
      }

      // Smooth scroll to Packages or Rooms
      const targetSec = document.getElementById('packages') || document.getElementById('rooms');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

/* ==========================================================================
   6. 7 CONFIRMED TOUR PACKAGES DATA & RENDER (4 POSTERS + BLUEPRINT 3E)
   ========================================================================== */
const packagesData = [
  {
    id: 'pkg_marayoor_1day',
    title: 'Marayoor & Kanthalloor One Day Trip',
    subtitle: 'Nature • Adventure • Relaxation — All in One Package',
    badge: '🔥 Special Offer ₹1,500',
    duration: '1 Night / 1 Day Stay & Safari',
    price: 1500,
    priceBasis: 'Per Person (Per Head)',
    destinations: 'Marayoor & Kanthalloor',
    image: 'assets/images/dest_kanthaloor.jpg',
    posterImage: 'assets/images/poster_pkg_marayoor_1day.jpg',
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
    groupNote: 'Ideal for families, friends & groups. Children below 5 yrs FREE; 5–10 yrs ₹300.'
  },
  {
    id: 'pkg_anakulam',
    title: 'Anakulam Wild Beauty Tour Package',
    subtitle: 'Explore the Hidden Paradise • Nature, Adventure & Memories',
    badge: '🐘 Wild Elephant Special ₹2,000',
    duration: '1 Night / 2 Days Getaway',
    price: 2000,
    priceBasis: 'Per Person (Per Head)',
    destinations: 'Anakulam, Mankulam & Forest Riverbed',
    image: 'assets/images/dest_anakulam.jpg',
    posterImage: 'assets/images/poster_pkg_anakulam.jpg',
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
    groupNote: 'Perfect getaway for friends, family & groups. Wildlife sightings are natural and subject to forest conditions.'
  },
  {
    id: 'pkg_vagamon',
    title: 'Mesmerizing Vagamon "Scotland of Kerala" Package',
    subtitle: 'Nature • Peace • Adventure — All in One Place!',
    badge: '⛰️ Hill Station Special ₹2,500',
    duration: '1 Night / 2 Days Meadow Tour',
    price: 2500,
    priceBasis: 'Per Person (Per Head)',
    destinations: 'Vagamon Green Meadows, Pine Forest, Suicide Point & Misty Mountains',
    image: 'assets/images/dest_vagamon.jpg',
    posterImage: 'assets/images/poster_pkg_vagamon.jpg',
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
    groupNote: 'Covers Green Meadows, Pine Forest, Suicide Point & Misty Mountains. Dates and group size to be confirmed prior to booking.'
  },
  {
    id: 'pkg_1day_express',
    title: '1-Day Marayoor & Kanthalloor Adventure Combo',
    subtitle: 'Food + Campfire + 4x4 Jeep Safari Value Package',
    badge: '⚡ Best Value ₹900',
    duration: '1 Day Experience (Food + Safari + Campfire)',
    price: 900,
    priceBasis: 'Per Person',
    destinations: 'Marayoor & Kanthalloor Off-Road Trail',
    image: 'assets/images/jeep_safari_mountain.jpg',
    posterImage: 'assets/images/poster_master_offers.jpg',
    inclusions: [
      'Homely Kerala Breakfast & Dinner',
      'Evening Campfire with Music',
      '4x4 Off-Road Jeep Safari Experience'
    ],
    exclusions: [
      'Overnight room stay (can be upgraded with any room category)',
      'Forest entry tickets & personal expenses'
    ],
    groupNote: 'From our Special Offers poster. Subject to minimum group size and date availability.'
  },
  {
    id: 'pkg_kanthaloor_pool',
    title: 'Kanthalloor Swimming Pool Property Package',
    subtitle: 'Luxury Poolside Nature Stay & Local Experience',
    badge: '🏊 Pool Resort Offer ₹3,000',
    duration: '1 Night / 2 Days Pool Resort Stay',
    price: 3000,
    priceBasis: 'Per Person',
    destinations: 'Kanthalloor & Marayoor',
    image: 'assets/images/room_pool_property.jpg',
    posterImage: 'assets/images/poster_master_offers.jpg',
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
    groupNote: 'Ideal for couples, families and small groups seeking a scenic pool stay in Kanthalloor.'
  },
  {
    id: 'pkg_2n3d_munnar',
    title: '2N / 3D Munnar & Kanthalloor Complete Package',
    subtitle: 'Tea Gardens, Fruit Orchards, Waterfalls & Off-Road Trails',
    badge: '🌟 3-Day Bestseller ₹4,999',
    duration: '2 Nights / 3 Days',
    price: 4999,
    priceBasis: 'Per Person',
    destinations: 'Munnar, Marayoor & Kanthalloor',
    image: 'assets/images/dest_munnar.jpg',
    posterImage: 'assets/images/poster_master_offers.jpg',
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
    groupNote: 'Rates are per person and subject to group size and seasonal date confirmation.'
  },
  {
    id: 'pkg_4d3n_grand',
    title: '4D / 3N Marayoor, Kanthalloor & Munnar Grand Tour',
    subtitle: 'Complete High-Range Kerala Holiday Experience',
    badge: '👑 4-Day Grand Tour ₹5,999',
    duration: '3 Nights / 4 Days',
    price: 5999,
    priceBasis: 'Per Person',
    destinations: 'Marayoor, Kanthalloor, Munnar & Anakulam',
    image: 'assets/images/hero_munnar_mountain.jpg',
    posterImage: 'assets/images/poster_master_offers.jpg',
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
    groupNote: 'Custom pickup/drop available from Cochin, Coimbatore, Madurai, Udumalpet or Pollachi.'
  }
];

function renderPackages() {
  const container = document.getElementById('packagesContainer');
  if (!container) return;

  container.innerHTML = packagesData.map(pkg => `
    <div class="package-card" id="${pkg.id}">
      <div class="pkg-media">
        <img src="${pkg.image}" alt="${pkg.title} - Manoj Tours and Travels Kerala" class="pkg-img" loading="lazy">
        <span class="pkg-badge">${pkg.badge}</span>
        <button type="button" class="btn-poster-preview" onclick="openPosterModal('${pkg.posterImage}', '${pkg.title}')" title="Click to view full package poster">
          <i class="fas fa-expand"></i> View Poster
        </button>
      </div>

      <div class="pkg-body">
        <div class="pkg-duration-pill"><i class="fas fa-clock"></i> ${pkg.duration}</div>
        <h3 class="pkg-title">${pkg.title}</h3>
        <p class="pkg-subtitle">${pkg.subtitle}</p>

        <div class="pkg-price-strip">
          <span class="pkg-price">₹${pkg.price.toLocaleString('en-IN')}</span>
          <span class="pkg-basis">${pkg.priceBasis}</span>
        </div>

        <div class="pkg-inclusions-wrap">
          <h4 class="pkg-inc-head"><i class="fas fa-check-circle"></i> Inclusions:</h4>
          <ul class="pkg-inclusions-list">
            ${pkg.inclusions.map(inc => `<li><i class="fas fa-check"></i> <span>${inc}</span></li>`).join('')}
          </ul>
        </div>

        <p class="pkg-group-note"><i class="fas fa-info-circle"></i> ${pkg.groupNote}</p>

        <div class="pkg-action-row">
          <a href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels!%20I%20am%20interested%20in%20booking%20the%20*${encodeURIComponent(pkg.title)}*%20(${pkg.badge}).%20Please%20send%20dates%20and%20details." 
             target="_blank" class="btn-pkg-book">
            <i class="fab fa-whatsapp"></i> Book This Package
          </a>
          <button type="button" class="btn-pkg-poster-text" onclick="openPosterModal('${pkg.posterImage}', '${pkg.title}')">
            <i class="fas fa-image"></i> Poster
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function openPosterModal(posterSrc, title) {
  const modal = document.getElementById('posterModal');
  const img = document.getElementById('posterModalImg');
  const caption = document.getElementById('posterModalCaption');
  if (!modal || !img) return;

  img.src = posterSrc;
  if (caption) caption.textContent = title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePosterModal() {
  const modal = document.getElementById('posterModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   7. 11 ROOMS DATA & MULTI-PHOTO GALLERY MODAL (BLUEPRINT SECTION 3C)
   ========================================================================== */
const roomsData = [
  {
    id: 'room_standard_non_ac',
    name: 'Standard Non-AC Room',
    category: 'deluxe',
    price: 2000,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 Adults (Up to 3 with extra bed)',
    location: 'Marayoor / Kanthalloor, Idukki',
    image: 'assets/images/room_standard_non_ac.jpg',
    gallery: [
      'assets/images/room_standard_non_ac.jpg',
      'assets/images/hero_munnar_mountain.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Mountain Air Breezy View', 'Attached Clean Bathroom', 'Comfortable Double Bed', 'Free Wi-Fi & Parking', 'Hot Water Assistance'],
    diningNote: 'Homely Kerala breakfast & dinner available on order.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season and must be confirmed on WhatsApp.'
  },
  {
    id: 'room_standard_ac',
    name: 'Standard AC Room',
    category: 'deluxe',
    price: 2500,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 Adults',
    location: 'Marayoor Town / Valley Edge',
    image: 'assets/images/room_standard_ac.jpg',
    gallery: [
      'assets/images/room_standard_ac.jpg',
      'assets/images/hero_munnar_mountain.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Individual Air Conditioning', 'Work Desk & Fast Wi-Fi', 'Complimentary Bottled Water', 'Attached Modern Bathroom', 'Power Backup'],
    diningNote: 'Fresh home-style Kerala meals prepared on request.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.'
  },
  {
    id: 'room_deluxe',
    name: 'Deluxe Room',
    category: 'deluxe',
    price: 2500,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 Adults (Couples & Solo)',
    location: 'Kanthalloor Fruit Orchard Zone',
    image: 'assets/images/room_deluxe.jpg',
    gallery: [
      'assets/images/room_deluxe.jpg',
      'assets/images/dest_kanthaloor.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Panoramic Mist Window View', 'King Size Spring Bed', 'HD Satellite TV', 'Modern Vanity & Hot Shower', 'Tea / Coffee Station'],
    diningNote: 'Delicious local dining & campfire setup available.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates and availability vary by season.'
  },
  {
    id: 'room_super_deluxe',
    name: 'Super Deluxe Room',
    category: 'deluxe',
    price: 3000,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 - 3 Adults',
    location: 'Scenic Mountain Valley Viewpoint',
    image: 'assets/images/room_super_deluxe.jpg',
    gallery: [
      'assets/images/room_super_deluxe.jpg',
      'assets/images/hero_munnar_mountain.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Private Balcony Mountain View', 'Luxury King Bed', 'Warm Ceiling Lighting', 'Work Desk & High-Speed Wi-Fi', '24/7 Hot Water'],
    diningNote: 'In-room or balcony tea & dining service.',
    disclaimer: 'Price Basis: Per Room / Per Night. Reconfirm availability before booking.'
  },
  {
    id: 'room_premium',
    name: 'Premium Room',
    category: 'deluxe',
    price: 3500,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 - 3 Adults',
    location: 'Munnar / Marayoor Tea Belt',
    image: 'assets/images/room_premium.jpg',
    gallery: [
      'assets/images/room_premium.jpg',
      'assets/images/dest_munnar.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Floor-to-Ceiling Glass Views', 'Tea Garden Panorama', 'Balcony Sit-Out Area', 'Luxury Bath Amenities', 'Room Service'],
    diningNote: 'Authentic Kerala Sadya or non-veg curry on order.',
    disclaimer: 'Price Basis: Per Room / Per Night. Rates subject to seasonal reconfirmation.'
  },
  {
    id: 'room_executive',
    name: 'Executive Room',
    category: 'deluxe',
    price: 4000,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 Adults (VIP / Business)',
    location: 'Marayoor Heritage Foothills',
    image: 'assets/images/room_executive.jpg',
    gallery: [
      'assets/images/room_executive.jpg',
      'assets/images/dest_marayoor.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Executive Workstation & Ergonomic Chair', 'Scenic Mountain Balcony', 'Modern Minimalist Decor', 'Large LED TV', 'Mini Fridge'],
    diningNote: 'Gourmet home-cooked dining coordination.',
    disclaimer: 'Price Basis: Per Room / Per Night.'
  },
  {
    id: 'room_family',
    name: 'Family Room',
    category: 'family',
    price: 4500,
    priceBasis: 'Per Room / Per Night',
    capacity: '4 Adults + 2 Kids',
    location: 'Spacious Nature Garden Property',
    image: 'assets/images/room_family.jpg',
    gallery: [
      'assets/images/room_family.jpg',
      'assets/images/hero_munnar_mountain.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['2 Large Double Beds', 'Accommodates 4 Adults comfortably', 'Spacious Living Layout', 'Attached Luxury Bath', 'Children Play Space'],
    diningNote: 'Family dining dining hall & group campfire with music.',
    disclaimer: 'Price Basis: Per Room / Per Night. Ideal for family groups.'
  },
  {
    id: 'room_pool_property',
    name: 'Swimming Pool Property',
    category: 'pool',
    price: 5000,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 - 4 Adults',
    location: 'Kanthalloor Valley Resort',
    image: 'assets/images/room_pool_property.jpg',
    gallery: [
      'assets/images/room_pool_property.jpg',
      'assets/images/dest_kanthaloor.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Resort Swimming Pool Access', 'Surrounded by Palms & Hills', 'Poolside Lounge Chairs', 'Music & Campfire Area', 'Scenic Sunset Views'],
    diningNote: 'Buffet or plated Kerala meals with poolside dining.',
    disclaimer: 'Price Basis: Per Room / Per Night. Pool timings and safety rules apply.'
  },
  {
    id: 'room_suite',
    name: 'Suite Room',
    category: 'family',
    price: 5500,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 Adults (Honeymoon / Luxury)',
    location: 'Marayoor Sandalwood Panorama',
    image: 'assets/images/room_suite.jpg',
    gallery: [
      'assets/images/room_suite.jpg',
      'assets/images/dest_marayoor.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Private Luxury Living Lounge', 'Premium Woodwork', 'Royal King Bed', 'Scenic Valley Balcony', 'Candlelight Dinner Setup'],
    diningNote: 'Special honeymoon dinner setup available upon advance notice.',
    disclaimer: 'Price Basis: Per Room / Per Night. Subject to date confirmation.'
  },
  {
    id: 'room_premium_pool',
    name: 'Premium Swimming Pool Property',
    category: 'pool',
    price: 6000,
    priceBasis: 'Per Room / Per Night',
    capacity: '2 - 4 Adults',
    location: 'Exclusive Ridge Resort',
    image: 'assets/images/room_premium_pool.jpg',
    gallery: [
      'assets/images/room_premium_pool.jpg',
      'assets/images/hero_client_jeep.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Infinity Pool Experience', 'Evening Golden Illumination', 'Luxury Gazebo Lounge', 'Mountain Ridge Backdrop', 'Private Sun Deck'],
    diningNote: 'Premium multi-course Kerala delicacies on order.',
    disclaimer: 'Price Basis: Per Room / Per Night. Pool usage guidelines apply.'
  },
  {
    id: 'room_cottage_villa',
    name: 'Exclusive Cottage / Villa',
    category: 'cottage',
    price: 7500,
    priceBasis: 'Per Night (Full Villa / Cottage)',
    capacity: '4 - 6 Adults (Private Group)',
    location: 'Secluded Private Farm Plantation',
    image: 'assets/images/room_cottage_villa.jpg',
    gallery: [
      'assets/images/room_cottage_villa.jpg',
      'assets/images/dest_kanthaloor.jpg',
      'assets/images/service_campfire.jpg',
      'assets/images/service_kerala_food.jpg'
    ],
    features: ['Private Standalone Villa', 'Artisanal Wood & Stone Build', 'Private Veranda & Lawn', 'Accommodates up to 6 Guests', 'Dedicated Campfire Pit'],
    diningNote: 'Personal cook / customized meal packages available.',
    disclaimer: 'Price Basis: Per Villa / Per Night. Best for private families & friends.'
  }
];

function renderRooms(filter = 'all') {
  const container = document.getElementById('roomsContainer');
  if (!container) return;

  const filtered = filter === 'all' 
    ? roomsData 
    : roomsData.filter(r => r.category === filter);

  container.innerHTML = filtered.map(room => `
    <div class="room-card" data-category="${room.category}" id="${room.id}">
      <div class="room-media">
        <img src="${room.image}" alt="${room.name} - Manoj Tours and Travels Kerala" class="room-img" loading="lazy">
        <span class="room-price-badge">₹${room.price.toLocaleString('en-IN')} <small>/night</small></span>
        <span class="room-capacity-badge"><i class="fas fa-user-friends"></i> ${room.capacity.split('(')[0]}</span>
      </div>

      <div class="room-body">
        <div class="room-location-tag"><i class="fas fa-map-marker-alt"></i> ${room.location}</div>
        <h3 class="room-title">${room.name}</h3>
        
        <ul class="room-features-list">
          ${room.features.slice(0, 3).map(f => `<li><i class="fas fa-check"></i> <span>${f}</span></li>`).join('')}
        </ul>

        <p class="room-disclaimer-subtext"><i class="fas fa-info-circle"></i> ${room.disclaimer}</p>

        <div class="room-action-row">
          <a href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels!%20I%20want%20to%20enquire%20about%20booking%20*${encodeURIComponent(room.name)}*%20(₹${room.price}/night).%20Please%20confirm%20availability." 
             target="_blank" class="btn-room-book">
            <i class="fab fa-whatsapp"></i> Book on WhatsApp
          </a>
          <button type="button" class="btn-room-details" onclick="openRoomModal('${room.id}')" title="View details and multi-photo gallery">
            <i class="fas fa-images"></i> Details
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterRooms(category) {
  document.querySelectorAll('.filter-tabs .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
  });
  renderRooms(category);
}

function openRoomModal(roomId) {
  const room = roomsData.find(r => r.id === roomId);
  if (!room) return;

  const modal = document.getElementById('roomModal');
  const modalBody = document.getElementById('roomModalContent');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-gallery-wrap">
      <div class="modal-main-img-box">
        <img id="modalMainImg" src="${room.image}" alt="${room.name}" class="modal-main-img">
      </div>
      <div class="modal-thumbnails-strip">
        ${room.gallery.map((gImg, idx) => `
          <img src="${gImg}" alt="Photo ${idx+1}" class="modal-thumb ${idx === 0 ? 'active' : ''}" 
               onclick="document.getElementById('modalMainImg').src='${gImg}'; document.querySelectorAll('.modal-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
        `).join('')}
      </div>
    </div>

    <div class="modal-details-body">
      <div class="modal-header-row">
        <div>
          <span class="dest-location-tag"><i class="fas fa-map-marker-alt"></i> ${room.location}</span>
          <h2 class="modal-room-title">${room.name}</h2>
        </div>
        <div class="modal-price-box">
          <span class="m-price">₹${room.price.toLocaleString('en-IN')}</span>
          <span class="m-basis">${room.priceBasis}</span>
        </div>
      </div>

      <div class="modal-meta-grid">
        <div class="m-meta-item"><i class="fas fa-users"></i> <strong>Occupancy:</strong> ${room.capacity}</div>
        <div class="m-meta-item"><i class="fas fa-utensils"></i> <strong>Dining:</strong> ${room.diningNote}</div>
      </div>

      <h4 class="modal-section-h">Room Amenities & Highlights:</h4>
      <div class="modal-amenities-grid">
        ${room.features.map(f => `<div class="m-amenity"><i class="fas fa-check-circle"></i> ${f}</div>`).join('')}
      </div>

      <div class="modal-disclaimer-alert">
        <i class="fas fa-shield-alt"></i>
        <span><strong>Price & Booking Policy:</strong> ${room.disclaimer} Extra adult: ₹500/night; extra mattress: ₹300/night. Children under 5 stay free.</span>
      </div>

      <div class="modal-actions-row">
        <a href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels!%20I%20want%20to%20book%20*${encodeURIComponent(room.name)}*%20at%20₹${room.price}/night.%20Please%20confirm%20availability%20for%20my%20dates." 
           target="_blank" class="btn-whatsapp-lg" style="width:100%; justify-content:center;">
          <i class="fab fa-whatsapp"></i> Confirm Booking on WhatsApp
        </a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRoomModal() {
  const modal = document.getElementById('roomModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   8. POPULAR DESTINATIONS 5x2 GRID + NATURE IS CALLING (IMAGE 5)
   ========================================================================== */
const destinationsData = [
  // Top 10 Featured (5x2 Grid from Image 5)
  { name: 'Marayoor', tamil: 'மறையூர்', state: 'Kerala • Idukki', image: 'assets/images/dest_marayoor.jpg', badge: '🪨 Sandalwood & Dolmens', featured: true },
  { name: 'Kanthalloor', tamil: 'காந்தளூர்', state: 'Kerala • Idukki', image: 'assets/images/dest_kanthaloor.jpg', badge: '🚙 4x4 Jeep Safari Spot', featured: true },
  { name: 'Munnar', tamil: 'மூணாறு', state: 'Kerala • Idukki', image: 'assets/images/dest_munnar.jpg', badge: '🍃 Misty Tea Hills', featured: true },
  { name: 'Vagamon', tamil: 'வாகமன்', state: 'Kerala • Idukki', image: 'assets/images/dest_vagamon.jpg', badge: '🚙 4x4 Off-Road Meadow', featured: true },
  { name: 'Thekkady', tamil: 'தேக்கடி', state: 'Kerala • Idukki', image: 'assets/images/dest_thekkady.jpg', badge: '🐘 Periyar Lake Safari', featured: true },
  { name: 'Alappuzha', tamil: 'ஆலப்புழா', state: 'Kerala • Alappuzha', image: 'assets/images/dest_alleppey.jpg', badge: '🚤 Backwater Houseboat', featured: true },
  { name: 'Anakulam', tamil: 'ஆனைக்குளம்', state: 'Kerala • Idukki', image: 'assets/images/dest_anakulam.jpg', badge: '🐘 Wild Elephant Stream', featured: true },
  { name: 'Wayanad', tamil: 'வயநாடு', state: 'Kerala • Wayanad', image: 'assets/images/dest_wayanad.jpg', badge: '🌊 Rainforest Waterfalls', featured: true },
  { name: 'Kodaikanal', tamil: 'கொடைக்கானல்', state: 'Tamil Nadu • Dindigul', image: 'assets/images/dest_kodaikanal.jpg', badge: '🛶 Star Lake & Pine Hills', featured: true },
  { name: 'Ooty', tamil: 'ஊட்டி', state: 'Tamil Nadu • Nilgiris', image: 'assets/images/dest_ooty.jpg', badge: '🚂 Heritage Toy Train', featured: true },
  // Remaining 4 destinations from Master Poster 4
  { name: 'Mankulam', tamil: 'மாங்குளம்', state: 'Kerala • Idukki', image: 'assets/images/dest_mankulam.jpg', badge: '🚙 Forest River Crossing', featured: false },
  { name: 'Kolukkumalai', tamil: 'கொழுக்குமலை', state: 'Kerala / TN Border', image: 'assets/images/dest_kolukkumalai.jpg', badge: '☁️ Sunrise Cloud Safari', featured: false },
  { name: 'Ramakkalmedu', tamil: 'ராமக்கல்மேடு', state: 'Kerala • Idukki', image: 'assets/images/dest_ramakkalmedu.jpg', badge: '💨 Windmill Ridge Trail', featured: false },
  { name: 'Valparai', tamil: 'வால்பாறை', state: 'Tamil Nadu • Coimbatore', image: 'assets/images/dest_valparai.jpg', badge: '⛰️ 40 Hairpin Curves', featured: false }
];

let showAllDestinations = false;

function renderDestinations(showAll = false) {
  const container = document.getElementById('destinationsPopularGrid');
  const toggleBtn = document.getElementById('destToggleBtn');
  if (!container) return;

  showAllDestinations = showAll;
  const list = showAll ? destinationsData : destinationsData.filter(d => d.featured);

  container.innerHTML = list.map(dest => `
    <div class="dest-compact-card" onclick="window.open('https://wa.me/919778264090?text=Hello%20Manoj%20Tours%20and%20Travels!%20I%20am%20interested%20in%20planning%20a%20tour%20to%20*${encodeURIComponent(dest.name)}*.%20Please%20share%20details.', '_blank')">
      <img src="${dest.image}" alt="${dest.name} (${dest.tamil}) - Manoj Tours Kerala" class="dest-compact-img" loading="lazy">
      <span class="dest-compact-badge">${dest.badge}</span>
      <div class="dest-compact-overlay">
        <span class="dest-compact-label"><i class="fas fa-map-marker-alt"></i> ${dest.name}</span>
        <small class="dest-compact-tamil">${dest.tamil}</small>
      </div>
    </div>
  `).join('');

  if (toggleBtn) {
    toggleBtn.innerHTML = showAll 
      ? '<i class="fas fa-compress-alt"></i> Show Top 10 Popular Hubs' 
      : '<i class="fas fa-th-large"></i> View All 14 Beautiful Destinations (Poster Hubs)';
  }
}

function toggleDestinationsView() {
  renderDestinations(!showAllDestinations);
}

/* ==========================================================================
   9. LOCAL SIGHTSEEING GUIDE (7 ATTRACTIONS — BLUEPRINT SECTION 3F)
   ========================================================================== */
const sightseeingData = [
  {
    title: 'Sandalwood Forest Walk',
    location: 'Marayoor – Chinnar Belt',
    timing: '8:00 AM – 5:00 PM',
    image: 'assets/images/dest_marayoor.jpg',
    description: 'Natural reserve sandalwood forest maintained by Kerala Forest Department. Visitors can enjoy the scenic drive through fragrant sandalwood trees and observe natural conservation. Fenced forest zones are strictly protected; visitors must not enter fenced areas without an authorised forest department guide.',
    guidance: 'Restricted fenced forest zones require official permission; visitors may not enter fenced areas freely.',
    badge: '🌿 Protected Heritage'
  },
  {
    title: 'Irachalpara Waterfalls',
    location: 'Near Kanthalloor (12 km from Marayoor)',
    timing: 'Daytime (Best 8:00 AM – 5:30 PM)',
    image: 'assets/images/jeep_green_forest.jpg',
    description: 'A multi-tiered scenic mountain waterfall secluded amidst dense Western Ghats rainforest foliage. Water flow is seasonal and most majestic during monsoon and post-monsoon months. Rocks can be slippery, so visitors should wear non-slip shoes and follow local safety instructions.',
    guidance: 'Monsoon and post-monsoon offer the best water cascade. Use non-slip footwear.',
    badge: '🌊 Waterfall Trail'
  },
  {
    title: 'Muniyara Megalithic Dolmens',
    location: 'Anakotta / Marayoor Rocky Ridge',
    timing: 'Open Daytime',
    image: 'assets/images/dest_marayoor.jpg',
    description: 'Ancient stone burial chambers (Dolmens) dating back thousands of years to the Megalithic Iron Age, perched on rocky hills overlooking the picturesque Marayoor valley. As this is an archaeological heritage site, visitors are requested to respect monuments and avoid climbing on stone slabs.',
    guidance: 'Protected archaeological site. Please respect monuments and keep surroundings clean.',
    badge: '🪨 Ancient Heritage'
  },
  {
    title: 'Marayoor Jaggery Making Units',
    location: 'Marayoor Sugarcane Fields',
    timing: 'Morning & Afternoon Production Hours',
    image: 'assets/images/service_kerala_food.jpg',
    description: 'Artisan jaggery sheds where the famous GI-tagged Marayoor Sharkara is traditionally hand-crafted from pure sugarcane juice boiled in large iron cauldrons. Live jaggery-making visits can be arranged when production units are operating and local producers permit visitors.',
    guidance: 'Live visits depend on operating production schedules and farm owner permissions.',
    badge: '🍯 GI-Tagged Craft'
  },
  {
    title: 'Kanthalloor Fruit & Strawberry Farms',
    location: 'Kanthalloor Terraced Valleys',
    timing: '9:00 AM – 5:00 PM',
    image: 'assets/images/dest_kanthaloor.jpg',
    description: 'Cool-climate terraced orchards cultivating apples, strawberries, oranges, plums, peaches, and passion fruits. Farm walks and fruit harvesting depend on seasonal fruiting months and whether individual private family farms are open to guests on travel dates.',
    guidance: 'Farm entry and fruit availability vary seasonally. Always confirm harvest dates with guide.',
    badge: '🍓 Fruit Orchards'
  },
  {
    title: 'Thoovanam Waterfalls Trek',
    location: 'Chinnar Wildlife Sanctuary (Pambar River)',
    timing: 'Morning Forest Batches (Subject to Forest Dept)',
    image: 'assets/images/dest_wayanad.jpg',
    description: 'A guided jungle trek through Chinnar Wildlife Sanctuary leading to the breathtaking Thoovanam waterfalls on the Pambar River. Trekking distance (~3-4 km), entry tickets, and an official Forest Department guide are mandatory under current sanctuary rules.',
    guidance: 'Official Forest Department permission, ticket and authorised forest guide are mandatory.',
    badge: '🥾 Forest Trekking'
  },
  {
    title: 'Anakulam Wild Elephant Viewing Area',
    location: 'Anakulam Riverbed (Near Mankulam)',
    timing: 'Late Afternoon & Evening Hours',
    image: 'assets/images/dest_anakulam.jpg',
    description: 'A peaceful forest village river confluence where wild Asian elephant herds naturally emerge from the reserve forest to drink mineral-rich bubbling stream water. Sightings are completely wild and natural; visitors must stay on the safe village riverbank and follow forest safety protocols.',
    guidance: 'Natural wildlife sighting is not guaranteed; maintain safe distance and silence.',
    badge: '🐘 Wild Elephant Stream'
  }
];

function renderSightseeing() {
  const container = document.getElementById('sightseeingContainer');
  if (!container) return;

  container.innerHTML = sightseeingData.map(spot => `
    <div class="sightseeing-card">
      <div class="ss-media">
        <img src="${spot.image}" alt="${spot.title} - Manoj Tours Kerala" class="ss-img" loading="lazy">
        <span class="ss-badge">${spot.badge}</span>
      </div>
      <div class="ss-body">
        <div class="ss-meta-pill"><i class="fas fa-map-pin"></i> ${spot.location}</div>
        <h3 class="ss-title">${spot.title}</h3>
        <p class="ss-desc">${spot.description}</p>
        <div class="ss-guidance-box">
          <i class="fas fa-shield-alt"></i> <span><strong>Visitor Tip / Permit:</strong> ${spot.guidance}</span>
        </div>
        <div class="ss-footer">
          <small><i class="fas fa-clock"></i> ${spot.timing}</small>
          <a href="https://wa.me/919778264090?text=Hello%20Manoj%20Tours!%20I%20want%20to%20include%20*${encodeURIComponent(spot.title)}*%20in%20my%20itinerary." 
             target="_blank" class="btn-inquire-dest">
            Plan this visit <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   10. REAL PHOTOS & EXPERIENCES GALLERY (BLUEPRINT SECTION 3J)
   ========================================================================== */
const galleryItems = [
  { src: 'assets/images/hero_client_jeep.jpg', category: 'safari', title: 'Olive-Green 4x4 Mahindra Jeep KL 68 7720 in Munnar Mountains' },
  { src: 'assets/images/hero_munnar_mountain.jpg', category: 'landscapes', title: 'Misty Western Ghats Tea Mountain Panorama' },
  { src: 'assets/images/room_pool_property.jpg', category: 'rooms', title: 'Kanthalloor Swimming Pool Property with Mountain Views' },
  { src: 'assets/images/room_cottage_villa.jpg', category: 'rooms', title: 'Exclusive Standalone Cottage & Wooden Villa' },
  { src: 'assets/images/room_premium_pool.jpg', category: 'rooms', title: 'Luxury Infinity Swimming Pool Resort at Twilight' },
  { src: 'assets/images/jeep_mountain_peak.jpg', category: 'safari', title: 'Muruganpara 6,200+ ft Off-Road Mountain Peak Safari' },
  { src: 'assets/images/jeep_green_forest.jpg', category: 'safari', title: 'Irachalpara Waterfalls Rainforest Jeep Crossing' },
  { src: 'assets/images/jeep_adventure_real.jpg', category: 'safari', title: 'Anakulam Wild Elephant Stream 4x4 Crossing' },
  { src: 'assets/images/dest_marayoor.jpg', category: 'landscapes', title: 'Megalithic Muniyara Dolmens & Sandalwood Hills' },
  { src: 'assets/images/dest_kanthaloor.jpg', category: 'landscapes', title: 'Kanthalloor Terraced Fruit Orchards & Bhramaram Point' },
  { src: 'assets/images/dest_anakulam.jpg', category: 'landscapes', title: 'Wild Asian Elephants Gathering in Anakulam River' },
  { src: 'assets/images/dest_alleppey.jpg', category: 'landscapes', title: 'Traditional Kerala Houseboat on Backwaters' },
  { src: 'assets/images/service_campfire.jpg', category: 'food', title: 'Misty Night Campfire with Ambient String Lights & Music' },
  { src: 'assets/images/service_kerala_food.jpg', category: 'food', title: 'Authentic Traditional Kerala Homely Sadya & Delicacies' },
  { src: 'assets/images/service_trekking.jpg', category: 'food', title: 'High-Range Forest Trekking & Hiking Adventure' },
  { src: 'assets/images/poster_pkg_anakulam.jpg', category: 'posters', title: 'Anakulam Tour Package ₹2,000 Special Offer Poster' },
  { src: 'assets/images/poster_pkg_vagamon.jpg', category: 'posters', title: 'Vagamon Scotland of Kerala ₹2,500 Package Poster' },
  { src: 'assets/images/poster_pkg_marayoor_1day.jpg', category: 'posters', title: 'Marayoor & Kanthalloor 1-Day Trip ₹1,500 Poster' },
  { src: 'assets/images/poster_master_offers.jpg', category: 'posters', title: 'Master 13 Services + 7 Special Offers Poster' }
];

function renderGallery(filter = 'all') {
  const container = document.getElementById('galleryContainer');
  if (!container) return;

  const filtered = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  container.innerHTML = filtered.map(item => `
    <div class="gallery-tile" onclick="openLightbox('${item.src}', '${item.title}')">
      <img src="${item.src}" alt="${item.title}" class="gallery-img" loading="lazy">
      <div class="gallery-hover-overlay">
        <i class="fas fa-search-plus"></i>
        <span>${item.title}</span>
      </div>
    </div>
  `).join('');
}

function filterGallery(category) {
  document.querySelectorAll('.gallery-tabs .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
  });
  renderGallery(category);
}

function openLightbox(src, title) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  if (!modal || !img) return;

  img.src = src;
  if (caption) caption.textContent = title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   11. LIVE TRIP COST CALCULATOR ENGINE
   ========================================================================== */
function initCalculator() {
  const roomSelect = document.getElementById('calcRoom');
  if (!roomSelect) return;

  // Populate Room options from roomsData
  roomSelect.innerHTML = roomsData.map(r => `
    <option value="${r.id}" data-price="${r.price}">
      ${r.name} — ₹${r.price.toLocaleString('en-IN')}/night (${r.capacity})
    </option>
  `).join('');

  const calcInputs = [
    'calcRoom', 'calcCheckin', 'calcCheckout', 'calcAdults', 'calcChildren', 'calcExtraBeds',
    'addonJeep', 'addonCampfire', 'addonFood', 'addonPickup'
  ];

  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', calculateTripCost);
      el.addEventListener('input', calculateTripCost);
    }
  });

  calculateTripCost();
}

function calculateTripCost() {
  const roomSelect = document.getElementById('calcRoom');
  if (!roomSelect) return;

  const selectedOpt = roomSelect.options[roomSelect.selectedIndex];
  const roomPrice = selectedOpt ? parseInt(selectedOpt.getAttribute('data-price') || '2000', 10) : 2000;
  const roomName = selectedOpt ? selectedOpt.text.split('—')[0].trim() : 'Standard Room';

  const checkinInput = document.getElementById('calcCheckin');
  const checkoutInput = document.getElementById('calcCheckout');

  let nights = 1;
  if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
    const dIn = new Date(checkinInput.value);
    const dOut = new Date(checkoutInput.value);
    const diff = (dOut - dIn) / (1000 * 60 * 60 * 24);
    if (diff > 0) nights = Math.round(diff);
  }

  const adults = parseInt(document.getElementById('calcAdults')?.value || '2', 10);
  const children = parseInt(document.getElementById('calcChildren')?.value || '0', 10);
  const extraBeds = parseInt(document.getElementById('calcExtraBeds')?.value || '0', 10);

  // Extra charges from policy
  let extraAdultCost = 0;
  if (adults > 2) {
    extraAdultCost = (adults - 2) * 500 * nights;
  }
  const childCost = children * 300 * nights;
  const extraBedCost = extraBeds * 300 * nights;
  const roomTotal = (roomPrice * nights) + extraAdultCost + childCost + extraBedCost;

  // Addons
  const hasJeep = document.getElementById('addonJeep')?.checked || false;
  const hasCampfire = document.getElementById('addonCampfire')?.checked || false;
  const hasFood = document.getElementById('addonFood')?.checked || false;
  const hasPickup = document.getElementById('addonPickup')?.checked || false;

  const jeepCost = hasJeep ? 2500 : 0;
  const campfireCost = hasCampfire ? 1000 : 0;
  const foodCost = hasFood ? (600 * adults * nights) : 0;
  const pickupCost = hasPickup ? 3500 : 0;

  const grandTotal = roomTotal + jeepCost + campfireCost + foodCost + pickupCost;

  // Update DOM elements
  const elTotal = document.getElementById('calcGrandTotal');
  const elMobileTotal = document.getElementById('mobileGrandTotal');
  const elNights = document.getElementById('summaryNights');
  const elRoomCost = document.getElementById('summaryRoomCost');
  const elAddonsCost = document.getElementById('summaryAddonsCost');

  if (elTotal) elTotal.textContent = `₹ ${grandTotal.toLocaleString('en-IN')}`;
  if (elMobileTotal) elMobileTotal.textContent = `₹ ${grandTotal.toLocaleString('en-IN')}`;
  if (elNights) elNights.textContent = `${nights} Night(s)`;
  if (elRoomCost) elRoomCost.textContent = `₹ ${roomTotal.toLocaleString('en-IN')}`;
  if (elAddonsCost) elAddonsCost.textContent = `₹ ${(jeepCost + campfireCost + foodCost + pickupCost).toLocaleString('en-IN')}`;

  // Update WhatsApp Booking Link
  const waBtn = document.getElementById('btnCalcWhatsApp');
  if (waBtn) {
    const textMsg = `Hello Manoj Tours & Travels Kerala!
I calculated my trip cost on your official website:
- Room: ${roomName} (₹${roomPrice}/night)
- Duration: ${nights} Night(s) (${checkinInput?.value || 'TBD'} to ${checkoutInput?.value || 'TBD'})
- Guests: ${adults} Adults, ${children} Children (Extra beds: ${extraBeds})
- Add-ons: ${hasJeep ? '4x4 Jeep Safari (+₹2,500), ' : ''}${hasCampfire ? 'Campfire (+₹1,000), ' : ''}${hasFood ? `Homely Food (+₹${foodCost}), ` : ''}${hasPickup ? 'Cab Pickup (+₹3,500)' : ''}
*Estimated Total: ₹${grandTotal.toLocaleString('en-IN')}*

Please confirm availability and booking details.`;
    waBtn.href = `https://wa.me/919778264090?text=${encodeURIComponent(textMsg)}`;
  }
}

/* ==========================================================================
   12. FAQ INTERACTIVE ACCORDIONS (BLUEPRINT SECTION 5 & 7)
   ========================================================================== */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      const isOpen = parent.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isOpen) {
        parent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   13. 8-FIELD ENQUIRY FORM HANDLER (BLUEPRINT SECTION 3L)
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById('quickContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim() || '';
    const phone = document.getElementById('contactPhone')?.value.trim() || '';
    const date = document.getElementById('contactDate')?.value || '';
    const guests = document.getElementById('contactGuests')?.value || '2';
    const nights = document.getElementById('contactNights')?.value || '1';
    const stayType = document.getElementById('contactStay')?.value || 'Any';
    const activities = document.getElementById('contactActivities')?.value || 'Sightseeing & Safari';
    const notes = document.getElementById('contactNotes')?.value.trim() || 'None';

    const msg = `*NEW TRIP ENQUIRY — MANOJ TOURS KERALA*
- Guest Name: ${name}
- Phone/WhatsApp: ${phone}
- Travel Date: ${date}
- Number of Guests: ${guests}
- Number of Nights: ${nights}
- Preferred Stay: ${stayType}
- Interested Activities: ${activities}
- Notes / Requirements: ${notes}

Sent via manojtourstravelskerala.in`;

    window.open(`https://wa.me/919778264090?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

/* ==========================================================================
   14. SCROLL SPY & ACTIVE NAV LINK SYNC
   ========================================================================== */
function initScrollNavSync() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-menu .nav-link');
  const bottomTabs = document.querySelectorAll('.mobile-bottom-bar .bottom-tab');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      desktopLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
      bottomTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('href') === `#${currentId}`);
      });
    }
  });
}

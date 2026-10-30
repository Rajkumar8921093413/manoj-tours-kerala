# 🚀 ANTIGRAVITY MASTER PROMPT — MANOJ TOURS AND TRAVELS KERALA (NEXT.JS + MYSQL + FULL ADMIN CRUD + SEEDER)

> **HOW TO USE THIS DOCUMENT:**
> Copy the entire block inside the **MASTER PROMPT FOR ANTIGRAVITY** section below and paste it directly into **Antigravity** inside your existing `manoj static website` workspace folder. It instructs Antigravity to convert your existing static HTML/CSS/JS project (`index.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/images/*`) into a high-speed **Next.js (App Router) + MySQL (`Manoj` database for XAMPP & Hostinger)** application with an automated **Database Seeder**, a hidden **`/admin` Dashboard**, **River House / River-View Rooms update**, and all **Client Word Document updates**, while preserving **100% of your existing UI design**.

---

## 📋 SUMMARY OF ALL ANALYZED CHANGES INCLUDED IN THIS PROMPT

1. **Existing Static Codebase Preserved 100% (`index.html`, `style.css`, `main.js`):**
   - Keeps the exact CSS variables, Day/Night mode (`data-theme="light"` / `dark`), `#rainCanvas` monsoon rain animation, Hero Slider (`KL 68 7720` Jeep), overlapping Floating Booking Bar, 8-Icon Services Strip + 13 Service Pills, Popular Destinations 5×2 Grid + "Nature is Calling" card, Local Sightseeing Guide (7 spots), Categorized Photo Gallery, Live Trip & Room Cost Calculator, YouTube Viral Videos Showcase, 6 FAQ Accordions, 8-Field WhatsApp Enquiry Form, and Mobile 5-Tab Sticky Bottom Bar.
2. **Critical Client Update — Remove "Falls House" & Replace with "River House / Rooms Near the River":**
   - Removes any "Falls House / Waterfall House" room reference and updates the cottage/nature stay & room descriptions to **River House / Riverside Rooms (Rooms Near the River)** overlooking the peaceful Marayoor / Anakulam / Mankulam river stream.
3. **All Updates from the 2 Uploaded Client Word Documents (`Manoj_Tours_and_Travels_Kerala_Website_Plan.docx` & `Manoj_Tours_and_Travels_Kerala_Website_Content_Plan.docx`):**
   - **Jeep Safari 10 Official Highlights:** Added/updated with clear seasonal/weather & forest-rule notes:
     1. *Marayoor & Kanthalloor Jeep Safari*
     2. *Muruganmala / Muruganpara Off-Road Experience*
     3. *Bhramaram Shooting Point*
     4. *Sandalwood Forest / Sandal Forest Walk*
     5. *Kacharam and Irachilpara Waterfalls*
     6. *Fruit Garden (Kanthalloor Fruit & Strawberry Orchards)*
     7. *Honey Rock*
     8. *Traditional Jaggery Unit (Marayoor GI-Tagged Sharkara)*
     9. *Muniyara Dolmens*
     10. *Zipline (Optional adventure activity subject to operation & booking confirmation)*
   - **Rooms & Stays Expanded Categories:** Supports *Family Rooms, Premium Rooms, Deluxe Rooms, Super Deluxe, Executive, Suite, Swimming Pool Property, Premium Pool Property, River House / River-Side Stay (Near the River), Jungle Stay, Homestay / Villa, Tent Stay, and A-Frame / Cottage*. Supports both exact numeric pricing (`₹2,000/night`) OR toggling `"Contact for current rates"` when a price is not yet fixed, plus `"View Photos"`, `"Check Availability"`, and `"WhatsApp Enquiry"` buttons.
   - **Tour Packages Updates:** Includes the 7 existing poster packages PLUS the client brief packages (*Marayoor Tour Package from ₹1,800/person*, *Kanthalloor Tour Package from ₹2,500/person*, and *Marayoor + Kanthalloor + Munnar Custom Quote Package*), complete with Duration, Day-wise Itinerary, Inclusions/Exclusions, Group-size conditions, Pickup/drop options, and Cancellation/Advance policy.
   - **Customer Reviews Updates:** Displays 4–5 genuine Google Business Profile reviews covering Jeep Safari, room comfort, food/hospitality, and family/group trips, plus a **"Read More Reviews on Google"** button.
4. **Full-Stack Next.js + MySQL (`Manoj` Database) + Complete Seeder (`npm run seed`):**
   - Configured for **XAMPP MySQL locally** (`DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_USER=root`, `DB_PASSWORD=""`, `DB_NAME=Manoj`) and ready for **Hostinger MySQL** in production via `.env`.
   - Includes a complete **Database Seeder** (`scripts/seed.js` + `/api/seed` fallback) that automatically creates the `Manoj` database tables and seeds all existing rooms, room gallery images, jeep safari trails/highlights, tour packages, destinations, sightseeing spots, gallery items, reviews, and default admin user (`admin` / `password`).
5. **Hidden Separate Admin Panel (`/admin`) & Auth Flow:**
   - **No Admin button on the public navbar** — public visitors only see the clean travel website.
   - Navigating directly to **`/admin`** opens the Admin Login page.
   - **Default Credentials:** Username: `admin` | Password: `password`.
   - **Admin Profile & Credentials Update:** Inside `/admin`, the admin can change/update their username and password anytime (stored with `bcryptjs` password hashing and HTTP-only JWT cookie authentication).
   - **Full CRUD + Multi-Image Upload/Edit/Delete:**
     - **Rooms & Stays CRUD:** Create new rooms, edit room name/category/location (e.g., Near the River)/occupancy/price or "Contact for rates"/features/disclaimer, delete rooms, and **upload, add, replace, or delete primary & gallery images** for any room.
     - **Jeep Safari CRUD:** Create new Jeep Safari routes/experiences, edit route title/badge/duration/price/weather notes/description, delete routes, and **upload, replace, or delete Jeep Safari images**.
     - **Tour Packages CRUD:** Create, edit, update pricing/inclusions/exclusions/poster images, and delete tour packages so client price updates take 10 seconds.

---

## 📋 MASTER PROMPT FOR ANTIGRAVITY (COPY & PASTE THIS ENTIRE BLOCK)

```markdown
You are an expert Full-Stack Next.js, MySQL, and UI/UX Engineer working inside the existing "manoj static website" project workspace.

### 🎯 OBJECTIVE
Migrate this existing static website (`index.html`, `assets/css/style.css`, `assets/js/main.js`, and `assets/images/*`) into a blazing-fast, production-ready **Next.js (App Router) + MySQL (`Manoj` database)** full-stack web application for **Manoj Tours and Travels Kerala**, compatible with **XAMPP MySQL locally** and **Hostinger MySQL in production**, while keeping **100% of the existing visual design, CSS styling, animations, and responsive layout untouched**.

Read the existing `index.html`, `assets/css/style.css`, and `assets/js/main.js` carefully before writing code so not a single visual detail, class name, animation, or section is lost.

---

### 1. TECH STACK & DATABASE CONFIGURATION (XAMPP + HOSTINGER READY)
1. **Framework:** Next.js 14+ (App Router) with Node.js runtime API routes.
2. **Database:** MySQL using `mysql2/promise` connection pooling (`lib/db.js`).
   - Default local XAMPP `.env` configuration:
     ```env
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=Manoj
     JWT_SECRET=manoj_kerala_super_secret_jwt_key_2026
     NEXT_PUBLIC_WHATSAPP_NUMBER=919778264090
     ```
   - Ensure `lib/db.js` automatically runs `CREATE DATABASE IF NOT EXISTS \`Manoj\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` during initialization/seeding so it works out-of-the-box on XAMPP and Hostinger.
3. **Authentication:** `jose` or `jsonwebtoken` + `bcryptjs` with HTTP-only cookies (`manoj_admin_token`).
4. **Styling & Assets:**
   - Copy all existing images from `assets/images/*` into `public/assets/images/*` so every existing path (`assets/images/...` or `/assets/images/...`) resolves cleanly.
   - Import the entire existing `assets/css/style.css` into `app/globals.css` without altering the visual rules, Day/Night theme variables (`[data-theme="light"]` and `[data-theme="dark"]`), font families (`Outfit`, `Plus Jakarta Sans`, `Caveat`), or responsive breakpoints.

---

### 2. DATABASE SCHEMA (`Manoj` Database) & COMPLETE DATA SEEDER ("SEA DRAW" / SEEDER)
Create a MySQL schema and an automated seeder script (`scripts/seed.js` runnable via `npm run seed`, plus an auto-seed check on first server startup if tables are empty) that creates and populates the following tables in the `Manoj` database:

1. **`admins` table:**
   - `id` INT AUTO_INCREMENT PRIMARY KEY
   - `username` VARCHAR(100) UNIQUE NOT NULL
   - `password_hash` VARCHAR(255) NOT NULL
   - `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   - **Seed Default Admin:** `username`: `'admin'`, `password`: `'password'` (hashed with `bcryptjs`).

2. **`rooms` table:**
   - `id` INT AUTO_INCREMENT PRIMARY KEY
   - `slug` VARCHAR(100) UNIQUE NOT NULL
   - `name` VARCHAR(150) NOT NULL
   - `category` VARCHAR(50) NOT NULL *(e.g., `'deluxe'`, `'family'`, `'pool'`, `'cottage'`, `'river'`, `'jungle'`, `'tent'`, `'aframe'`)*
   - `price` INT NULL *(nullable or 0 if "Contact for current rates" is enabled)*
   - `show_price` BOOLEAN DEFAULT TRUE *(if false, display `"Contact for current rates"` instead of numeric price)*
   - `price_basis` VARCHAR(100) DEFAULT `'Per Room / Per Night'`
   - `capacity` VARCHAR(100) NOT NULL
   - `location` VARCHAR(150) NOT NULL
   - `primary_image` VARCHAR(255) NOT NULL
   - `features` JSON NOT NULL *(array of highlight strings)*
   - `dining_note` TEXT
   - `disclaimer` TEXT
   - `sort_order` INT DEFAULT 0
   - `is_active` BOOLEAN DEFAULT TRUE
   - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

3. **`room_images` table (1-to-Many gallery images per room):**
   - `id` INT AUTO_INCREMENT PRIMARY KEY
   - `room_id` INT NOT NULL (FOREIGN KEY referencing `rooms(id)` ON DELETE CASCADE)
   - `image_url` VARCHAR(255) NOT NULL
   - `caption` VARCHAR(255) NULL
   - `is_primary` BOOLEAN DEFAULT FALSE
   - `sort_order` INT DEFAULT 0

4. **`jeep_safaris` table:**
   - `id` INT AUTO_INCREMENT PRIMARY KEY
   - `slug` VARCHAR(100) UNIQUE NOT NULL
   - `title` VARCHAR(150) NOT NULL
   - `badge` VARCHAR(100) NOT NULL *(e.g., `'⛰️ Peak Safari'`, `'🌫️ Misty Ridge'`, `'🌊 Waterfall Trail'`, `'🐘 Elephant Stream'`)*
   - `description` TEXT NOT NULL
   - `duration` VARCHAR(100) NOT NULL *(e.g., `'3 - 4 Hours'`, `'2 - 3 Hours'`, `'Half Day'`)*
   - `terrain_tag` VARCHAR(100) NOT NULL *(e.g., `'Rugged Climb'`, `'Sunrise / Sunset'`, `'Natural Cascades'`)*
   - `price_info` VARCHAR(150) DEFAULT `'Contact for price / Included in packages'`
   - `weather_note` TEXT DEFAULT `'Routes and stops may vary depending on weather, road conditions, and forest rules.'`
   - `primary_image` VARCHAR(255) NOT NULL
   - `gallery_images` JSON NULL *(array of additional safari image URLs)*
   - `is_featured_trail` BOOLEAN DEFAULT TRUE
   - `sort_order` INT DEFAULT 0
   - `is_active` BOOLEAN DEFAULT TRUE
   - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

5. **`tour_packages` table:**
   - `id` INT AUTO_INCREMENT PRIMARY KEY
   - `slug` VARCHAR(100) UNIQUE NOT NULL
   - `title` VARCHAR(150) NOT NULL
   - `subtitle` VARCHAR(255) NOT NULL
   - `badge` VARCHAR(100) NOT NULL
   - `duration` VARCHAR(100) NOT NULL
   - `price` INT NULL
   - `show_price` BOOLEAN DEFAULT TRUE
   - `price_basis` VARCHAR(100) DEFAULT `'Per Person (Per Head)'`
   - `destinations` VARCHAR(255) NOT NULL
   - `image` VARCHAR(255) NOT NULL
   - `poster_image` VARCHAR(255) NULL
   - `itinerary` JSON NULL *(array of Day 1, Day 2 itinerary steps)*
   - `inclusions` JSON NOT NULL
   - `exclusions` JSON NOT NULL
   - `group_note` TEXT
   - `sort_order` INT DEFAULT 0
   - `is_active` BOOLEAN DEFAULT TRUE

6. **`destinations`, `sightseeing_spots`, `gallery_items`, and `reviews` tables:**
   - Seed all 14 destinations (`destinationsData`), 7 local sightseeing spots (`sightseeingData`), 19 gallery items (`galleryItems`), and 5 verified Google Reviews so the entire site is 100% database-driven with zero hardcoded data loss.

---

### 3. MANDATORY CONTENT & CLIENT BRIEF UPDATES TO SEED & RENDER

#### A. CRITICAL FIX: Remove "Falls House" -> Replace with "River House / Rooms Near the River"
- Ensure there is **NO** mention of "Falls House" or "Waterfall House" anywhere in the rooms or cottages.
- Instead, update the cottage/nature stay and add/seed **"Riverside Cottage / River House (Rooms Near the River)"** located along the peaceful **Marayoor / Anakulam / Mankulam River Stream**, highlighting:
  - *"Rooms Near the River with soothing natural river stream views & breeze"*
  - *"Riverside sit-out veranda, riverside campfire area, attached modern bath & homely Kerala meals"*
- Also update existing riverside/nature room locations so guests looking for rooms near the river can filter or view them immediately.

#### B. Incorporate All Updates from the 2 Client Word Documents (`Website_Plan.docx` & `Website_Content_Plan.docx`)
1. **Jeep Safari 10 Official Highlights & Trails:**
   Seed all 10 Safari experiences requested by the client into `jeep_safaris` so they appear in the Jeep Safari section and can be edited/added/deleted by Admin:
   - *Muruganmala / Muruganpara Off-Road Experience* (`3 - 4 Hours`, rugged mountain ascent to 6,200+ ft)
   - *Bhramaram Shooting Point* (`2 - 3 Hours`, misty ridge & film-location viewpoint in Kanthalloor)
   - *Irachilpara & Kacharam Waterfalls Trail* (`Half Day`, seasonal rainforest cascades)
   - *Anakulam Wild Elephant Stream Safari* (`4 - 5 Hours`, river crossing & natural elephant viewing)
   - *Sandalwood Forest / Sandal Forest Walk* (Protected natural sandalwood reserve drive & guided walk)
   - *Kanthalloor Fruit Garden & Strawberry Orchards* (Seasonal fruit-growing terraced farms)
   - *Honey Rock Viewpoint* (Scenic rock cliff & natural honeycomb landscape stop)
   - *Traditional Marayoor Jaggery Unit* (Live GI-tagged sugarcane sharkara making experience)
   - *Muniyara Megalithic Dolmens* (Ancient Iron-Age stone burial chambers at Anakotta ridge)
   - *Zipline Adventure* (Optional adventure activity where operating; safety rules & separate charges apply)
   - Each Safari card must display: real photo, short description, duration, footwear/weather note, price/rate note, and a **"Book This Trail / Check Jeep Safari Availability"** WhatsApp button.

2. **Rooms & Stays Categories (11 Existing + Client Brief Stay Types):**
   - Seed all 11 existing rooms (`Standard Non-AC ₹2,000`, `Standard AC ₹2,500`, `Deluxe Room ₹2,500`, `Super Deluxe ₹3,000`, `Premium Room ₹3,500`, `Executive Room ₹4,000`, `Family Room ₹4,500`, `Swimming Pool Property ₹5,000`, `Suite Room ₹5,500`, `Premium Swimming Pool Property ₹6,000`, `Riverside Cottage / Villa Near the River ₹7,500`) PLUS support the client's additional stay categories (`Jungle Stay`, `A-Frame Cottage`, `Tent Stay`) in the category filter tabs and Admin dropdown.
   - Each room card must keep the exact existing card design with **"Book on WhatsApp"** and **"Details / View Photos"** (opening the multi-photo gallery modal). If `show_price` is toggled off by Admin for any unconfirmed room, display `"Contact for current rates"` cleanly instead of the price badge.

3. **Tour Packages (Existing 7 Poster Packages + Client Brief Packages):**
   - Seed all 7 existing packages (`₹1,500 Marayoor 1-Day`, `₹2,000 Anakulam`, `₹2,500 Vagamon`, `₹900 1-Day Express`, `₹3,000 Kanthalloor Pool`, `₹4,999 2N/3D Munnar & Kanthalloor`, `₹5,999 4D/3N Grand Tour`) AND include the client's brief packages (*Marayoor Tour Package from ₹1,800/person* and *Kanthalloor Tour Package from ₹2,500/person*).
   - Display Duration, Inclusions, Exclusions, Group-size conditions, Cancellation/Advance policy note, Poster preview button, and WhatsApp CTA.

4. **Customer Reviews Section:**
   - Display 5 genuine Google reviews (covering Jeep Safari & drivers Raja Durai/James, room comfort near the river/pool, homely food, and Mr. Manoj's coordination) + add a prominent **"Read More Reviews on Google"** button linking to their Google Business Profile.

---

### 4. SEPARATE HIDDEN ADMIN PANEL (`/admin`) & AUTHENTICATION FLOW
1. **Strict Route Separation (Hidden from Public Navbar):**
   - Do **NOT** put any "Admin" link in the public header navigation (`#header`) or footer.
   - Public visitors at `/` only see the customer-facing website.
   - Only when someone navigates directly to **`/admin`** (or `/admin/login`) does the Admin interface open.

2. **Authentication & Credentials Management:**
   - Default login:
     - **Username:** `admin`
     - **Password:** `password`
   - Login API (`POST /api/admin/login`) verifies credentials against the `admins` MySQL table, issues an HTTP-only signed JWT cookie, and redirects to `/admin/dashboard`.
   - Logout API (`POST /api/admin/logout`) clears the cookie and redirects to `/admin/login`.
   - **Change Username & Password Settings (`PUT /api/admin/credentials`):**
     - Inside `/admin`, provide an **"Admin Account Settings"** tab where the logged-in admin can update/edit the Admin Username and Password (requires current password confirmation, hashes new password with `bcryptjs`, and updates the `admins` table immediately).
   - **Middleware Protection (`middleware.js`):**
     - Protect `/admin/dashboard/*` and all mutating API routes (`POST`, `PUT`, `DELETE` on `/api/rooms`, `/api/safaris`, `/api/packages`, `/api/upload`, `/api/admin/credentials`) so only an authenticated admin with a valid JWT cookie can add, edit, update, or delete data.

3. **Full Admin CRUD Features (`/admin/dashboard`):**
   Build a clean, fast, responsive Admin Dashboard matching the Emerald Green & Gold brand theme with 4 tabs:
   - **Tab 1: Manage Rooms & Stays (Full CRUD + Multi-Image Manager):**
     - **Create Room:** Add new room/stay with Name, Category (`deluxe`, `family`, `pool`, `cottage`, `river`, `jungle`, `tent`, `aframe`), Price per night, Toggle `"Show numeric price"` vs `"Contact for current rates"`, Price Basis, Occupancy Capacity, Location (e.g., *"Near the River, Marayoor"*), Features list, Dining Note, Disclaimer, Primary Image upload, and Multiple Gallery Images upload.
     - **Edit / Update Room:** Edit any field of any existing room in a modal or form.
     - **Manage Room Images (Add / Replace / Delete):** View all images for a room (`primary_image` + `room_images` gallery), upload new images from computer/phone (saved to `public/uploads/rooms/` and path stored in MySQL), set any image as primary, or delete individual images.
     - **Delete Room:** Delete a room with confirmation modal (cascades to `room_images`).
   - **Tab 2: Manage Jeep Safari Trails & Experiences (Full CRUD + Image Manager):**
     - **Create Jeep Safari:** Add new Safari trail/highlight with Title, Badge, Duration, Terrain Tag, Price Info, Weather/Forest Note, Description, and Upload Safari Image(s) (saved to `public/uploads/safaris/`).
     - **Edit / Update Jeep Safari:** Modify any existing Jeep Safari trail's text, price, duration, or replace/add/delete its images.
     - **Delete Jeep Safari:** Remove any safari item with confirmation.
   - **Tab 3: Manage Tour Packages (Full CRUD + Image/Poster Upload):**
     - Create, Edit, Update price/duration/inclusions/exclusions/poster image, or Delete tour packages.
   - **Tab 4: Admin Credentials & Database Seeder Control:**
     - Form to update Admin Username & Password (default `admin` / `password`).
     - A **"Re-sync / Run Default Seeder"** button (with confirmation) in case the admin ever wants to restore default seeded items.

---

### 5. IMAGE UPLOAD HANDLING (`POST /api/upload`)
- Implement a native Next.js multipart `FormData` upload route (`app/api/upload/route.js`) using Node's `fs/promises` and `path` that saves uploaded `.jpg`, `.jpeg`, `.png`, and `.webp` files into `public/uploads/rooms/`, `public/uploads/safaris/`, or `public/uploads/packages/` with unique sanitized filenames and returns `{ url: '/uploads/...' }`.
- Also allow the admin to paste an image URL or pick from existing `/assets/images/...` files if desired.
- Automatically update the public homepage and calculator in real time (`revalidatePath('/')` and dynamic API fetching) whenever Admin creates, updates, or deletes a Room, Jeep Safari, Package, or Image.

---

### 6. ULTRA-FAST PERFORMANCE & RESPONSIVENESS REQUIREMENTS
1. **Zero UI Regressions:** Keep the exact HTML structure and CSS classes from `index.html` and `style.css` so the site looks identical to the approved design across Mobile (360px–767px), Tablet (768px–1023px), and Desktop (1024px–1920px+).
2. **Fast Response Speed:**
   - Use Server Components or fast cached/revalidated API queries for initial page load so the homepage renders instantaneously.
   - Keep `loading="lazy"` and `decoding="async"` on below-the-fold images and optimize canvas `requestAnimationFrame` so mobile scrolling is 60fps smooth.
3. **Interactive Features Verification:**
   - Verify that the Rain Canvas toggle (`#rainToggle`), Day/Night theme toggle (`#themeToggle`), Hero Slider dots, Floating Booking Bar date sync, Room category filter tabs, Room multi-photo modal, Package poster lightbox, Popular Destinations 10/14 toggle, Gallery filter & lightbox, Live Trip Cost Calculator (dynamically populated with the live MySQL rooms list!), FAQ accordions, and 8-Field WhatsApp Enquiry Form all work with zero console errors.

---

### 7. STEP-BY-STEP EXECUTION & VERIFICATION PLAN
1. Inspect existing `index.html`, `assets/css/style.css`, `assets/js/main.js`, and `assets/images/`.
2. Initialize Next.js project structure (`package.json`, `next.config.mjs`, `.env.example`, `.env`, `lib/db.js`, `lib/auth.js`).
3. Create `scripts/seed.js` with the full `Manoj` MySQL schema and complete initial data (including the River House / Rooms Near the River replacement, 10 Jeep Safari experiences, 11+ Rooms with multi-photo galleries, 7+ Tour Packages, 14 Destinations, 7 Sightseeing spots, 19 Gallery photos, 5 Google Reviews, and `admin` / `password` account).
4. Build REST API routes:
   - `GET / POST /api/rooms` & `PUT / DELETE /api/rooms/[id]` & `POST / DELETE /api/rooms/[id]/images`
   - `GET / POST /api/safaris` & `PUT / DELETE /api/safaris/[id]`
   - `GET / POST /api/packages` & `PUT / DELETE /api/packages/[id]`
   - `POST /api/upload`
   - `POST /api/admin/login`, `POST /api/admin/logout`, `GET / PUT /api/admin/credentials`
5. Build the Public Home Page (`app/page.jsx`) preserving 100% of the existing UI and interactive features, wired to live MySQL data.
6. Build the Hidden Admin Portal (`app/admin/login/page.jsx` and `app/admin/dashboard/page.jsx`) with full CRUD and image upload/edit/delete for Rooms, Jeep Safaris, Packages, and Admin Credentials.
7. Run `npm install`, `npm run seed`, and `npm run build` / `npm run dev` to test every public feature and every Admin CRUD flow end-to-end.
```

---

## 🛠️ BONUS: READY-TO-RUN MYSQL SCHEMA & SEEDER REFERENCE (`database/manoj_schema_and_seed.sql`)

If you also want to import the `Manoj` database directly into **XAMPP phpMyAdmin** or **Hostinger phpMyAdmin**, the prompt above automatically generates `scripts/seed.js`, and here is the core SQL structure it sets up:

```sql
CREATE DATABASE IF NOT EXISTS `Manoj` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Manoj`;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `price` INT DEFAULT 0,
  `show_price` BOOLEAN DEFAULT TRUE,
  `price_basis` VARCHAR(100) DEFAULT 'Per Room / Per Night',
  `capacity` VARCHAR(100) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `primary_image` VARCHAR(255) NOT NULL,
  `features` JSON NOT NULL,
  `dining_note` TEXT,
  `disclaimer` TEXT,
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `room_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `room_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `jeep_safaris` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `terrain_tag` VARCHAR(100) NOT NULL,
  `price_info` VARCHAR(150) DEFAULT '₹2,500 – ₹4,500 per Jeep / Package',
  `weather_note` TEXT,
  `primary_image` VARCHAR(255) NOT NULL,
  `gallery_images` JSON DEFAULT NULL,
  `is_featured_trail` BOOLEAN DEFAULT TRUE,
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

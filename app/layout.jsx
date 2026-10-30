import './globals.css';

export const metadata = {
  metadataBase: new URL('https://manojtourstravelskerala.in'),
  title: 'Manoj Tours and Travels Kerala | Official Website — Resorts, 4x4 Jeep Safari, Tour Packages & Stays in Marayoor & Munnar',
  description: 'Official website of Manoj Tours and Travels Kerala. Best resorts, swimming pool properties, homestays, 4x4 off-road jeep safaris, tour packages, and sightseeing across Marayoor, Kanthalloor, and Munnar. Rated 5.0 ⭐ on Google.',
  keywords: 'Manoj Tours and Travels Kerala, Marayoor Manoj tours, Munnar resort booking, Kanthalloor tour packages, 4x4 Jeep Safari Marayoor, Swimming pool resort Marayoor, Kerala homestay booking, Irachalpara waterfalls, Muruganpara jeep safari, Anakulam elephant tour, Vagamon package, Rooms Near the River, River House Marayoor',
  authors: [{ name: 'Manoj Tours and Travels Kerala' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://manojtourstravelskerala.in/',
    title: 'Manoj Tours and Travels Kerala | Official Website',
    description: 'Explore Kerala. Discover yourself. Stays, 4x4 Jeep Safari, Tour Packages & Local Sightseeing across Marayoor, Kanthalloor & Munnar. Direct WhatsApp Booking!',
    images: [{ url: '/assets/images/hero_client_jeep.jpg' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manoj Tours and Travels Kerala | Official Website',
    description: 'Explore Kerala. Discover yourself. Stays, 4x4 Jeep Safari, Tour Packages & Local Sightseeing across Marayoor, Kanthalloor & Munnar. Direct WhatsApp Booking!',
    images: ['/assets/images/hero_client_jeep.jpg']
  },
  icons: {
    icon: '/assets/images/logo.jpg',
    apple: '/assets/images/logo.jpg'
  }
};

export default function RootLayout({ children }) {
  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LodgingBusiness', 'LocalBusiness'],
    'name': 'Manoj Tours and Travels Kerala',
    'alternateName': 'Marayoor Manoj Tours and Travels Kerala',
    'image': 'https://manojtourstravelskerala.in/assets/images/logo.jpg',
    'url': 'https://manojtourstravelskerala.in/',
    'telephone': '+919778264090',
    'email': 'manojtoursandtravelskerala@gmail.com',
    'priceRange': '₹900 - ₹7500',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Munnar Road, Marayoor',
      'addressLocality': 'Marayoor, Idukki',
      'addressRegion': 'Kerala',
      'postalCode': '685620',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 10.2798,
      'longitude': 77.1601
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      'opens': '06:00',
      'closes': '23:00'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5.0',
      'bestRating': '5',
      'worstRating': '1',
      'reviewCount': '375'
    }
  };

  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

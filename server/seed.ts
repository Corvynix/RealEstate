import { storage } from './storage';

// Image paths for properties
const villImage = '/attached_assets/generated_images/Luxury_villa_exterior_b8b6ef13.png';
const apartmentImage = '/attached_assets/generated_images/Luxury_apartment_interior_fb1b1b6e.png';
const officeImage = '/attached_assets/generated_images/Commercial_building_exterior_f1117d6d.png';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create users
  const user1 = await storage.createUser({
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    role: 'client',
  });

  const user2 = await storage.createUser({
    name: 'Sarah Al-Mansoori',
    email: 'sarah@example.com',
    phone: '+971501234567',
    role: 'client',
  });

  console.log('✅ Users created');

  // Create developers
  const dev1 = await storage.createDeveloper({
    name: 'Mohammed Al-Otaibi',
    companyName: 'Elite Properties Development',
    email: 'info@eliteproperties.sa',
    phone: '+966112345678',
    trustScore: 92.5,
    yearsActive: 15,
    projectsCompleted: 45,
    averageRating: 4.7,
    description: 'Leading real estate developer in Riyadh with a proven track record of delivering high-quality residential and commercial projects on time.',
    deliveryHistory: [
      { project: 'Al-Nakheel Residences', date: '2023-12', status: 'completed' },
      { project: 'Business Tower', date: '2023-06', status: 'completed' },
    ],
    reviews: [
      { user: 'Client A', rating: 5, comment: 'Excellent quality and timely delivery', date: '2024-01-15' },
      { user: 'Client B', rating: 4, comment: 'Professional team, minor delays', date: '2023-11-20' },
    ],
    legalCases: [],
  });

  const dev2 = await storage.createDeveloper({
    name: 'Fatima Al-Zahrani',
    companyName: 'Modern Living Developments',
    email: 'contact@modernliving.ae',
    phone: '+971501234567',
    trustScore: 85.0,
    yearsActive: 8,
    projectsCompleted: 28,
    averageRating: 4.3,
    description: 'Innovative developer focused on modern, sustainable residential projects across the UAE.',
    deliveryHistory: [
      { project: 'Green Valley Apartments', date: '2023-09', status: 'completed' },
    ],
    reviews: [
      { user: 'Client C', rating: 4, comment: 'Good quality, slightly over budget', date: '2023-10-05' },
    ],
    legalCases: [],
  });

  const dev3 = await storage.createDeveloper({
    name: 'Omar Al-Rashid',
    companyName: 'Gulf Horizons Real Estate',
    email: 'info@gulfhorizons.qa',
    phone: '+97444123456',
    trustScore: 78.5,
    yearsActive: 12,
    projectsCompleted: 32,
    averageRating: 4.0,
    description: 'Established developer in Qatar specializing in luxury villas and commercial spaces.',
    deliveryHistory: [
      { project: 'Pearl Villas', date: '2023-03', status: 'completed' },
      { project: 'City Center Mall', date: '2022-12', status: 'completed' },
    ],
    reviews: [
      { user: 'Client D', rating: 4, comment: 'Professional but communication could be better', date: '2023-05-12' },
    ],
    legalCases: [
      { case: 'Minor permit delay', status: 'resolved', date: '2022-08' },
    ],
  });

  console.log('✅ Developers created');

  // Create properties
  const properties = [
    // Luxury Villas
    {
      title: 'Luxury 5BR Villa with Pool',
      titleAr: 'فيلا فاخرة 5 غرف مع مسبح',
      description: 'Stunning modern villa featuring 5 spacious bedrooms, private pool, landscaped garden, and smart home technology. Located in a prestigious gated community.',
      descriptionAr: 'فيلا عصرية مذهلة تضم 5 غرف نوم واسعة، مسبح خاص، حديقة منسقة، وتقنية المنزل الذكي. تقع في مجمع سكني مسور مرموق.',
      city: 'Riyadh',
      cityAr: 'الرياض',
      propertyType: 'villa',
      price: 3500000,
      size: 650,
      bedrooms: 5,
      bathrooms: 6,
      images: [villImage, villImage, villImage],
      developerId: dev1.id,
      riskFlags: [],
      features: ['Private Pool', 'Garden', 'Smart Home', 'Maid Room', 'Driver Room', 'Garage'],
      status: 'available',
    },
    {
      title: 'Modern 4BR Villa in Compound',
      titleAr: 'فيلا عصرية 4 غرف في مجمع سكني',
      description: 'Contemporary villa in a family-friendly compound with excellent amenities including gym, playground, and 24/7 security.',
      descriptionAr: 'فيلا معاصرة في مجمع سكني صديق للعائلة مع مرافق ممتازة تشمل صالة رياضية، ملعب، وأمن على مدار الساعة.',
      city: 'Dubai',
      cityAr: 'دبي',
      propertyType: 'villa',
      price: 4200000,
      size: 550,
      bedrooms: 4,
      bathrooms: 5,
      images: [villImage, villImage],
      developerId: dev2.id,
      riskFlags: [],
      features: ['Community Pool', 'Gym Access', 'Playground', 'Security'],
      status: 'available',
    },
    // Luxury Apartments
    {
      title: 'Premium 3BR Apartment - Downtown',
      titleAr: 'شقة فاخرة 3 غرف - وسط المدينة',
      description: 'High-floor luxury apartment with breathtaking city views, premium finishes, and access to world-class amenities.',
      descriptionAr: 'شقة فاخرة في طابق عالٍ مع إطلالات خلابة على المدينة، تشطيبات فاخرة، ووصول إلى مرافق عالمية المستوى.',
      city: 'Dubai',
      cityAr: 'دبي',
      propertyType: 'apartment',
      price: 2100000,
      size: 220,
      bedrooms: 3,
      bathrooms: 3,
      images: [apartmentImage, apartmentImage, apartmentImage],
      developerId: dev2.id,
      riskFlags: [],
      features: ['City View', 'Balcony', 'Built-in Wardrobes', 'Covered Parking'],
      status: 'available',
    },
    {
      title: '2BR Apartment with Sea View',
      titleAr: 'شقة غرفتين مع إطلالة بحرية',
      description: 'Spacious 2-bedroom apartment offering stunning sea views, modern kitchen, and close proximity to beaches and shopping.',
      descriptionAr: 'شقة واسعة من غرفتي نوم توفر إطلالات بحرية رائعة، مطبخ عصري، وقربها من الشواطئ والتسوق.',
      city: 'Jeddah',
      cityAr: 'جدة',
      propertyType: 'apartment',
      price: 1450000,
      size: 165,
      bedrooms: 2,
      bathrooms: 2,
      images: [apartmentImage, apartmentImage],
      developerId: dev1.id,
      riskFlags: [],
      features: ['Sea View', 'Balcony', 'Pool', 'Gym'],
      status: 'available',
    },
    {
      title: 'Studio Apartment - Investment Opportunity',
      titleAr: 'شقة استوديو - فرصة استثمارية',
      description: 'Well-designed studio in prime location with high rental yield. Perfect for investors or young professionals.',
      descriptionAr: 'استوديو مصمم جيداً في موقع مميز مع عائد إيجار عالٍ. مثالي للمستثمرين أو المهنيين الشباب.',
      city: 'Abu Dhabi',
      cityAr: 'أبو ظبي',
      propertyType: 'apartment',
      price: 680000,
      size: 48,
      bedrooms: 0,
      bathrooms: 1,
      images: [apartmentImage],
      developerId: dev2.id,
      riskFlags: [
        { type: 'size', severity: 'low', description: 'Small studio - may limit resale market' },
      ],
      features: ['Furnished', 'Kitchen Appliances', 'Gym', 'Pool'],
      status: 'available',
    },
    // Commercial Properties
    {
      title: 'Prime Office Space - Business District',
      titleAr: 'مساحة مكتبية مميزة - منطقة الأعمال',
      description: 'Grade A office space in prestigious business district with excellent connectivity and modern facilities.',
      descriptionAr: 'مساحة مكتبية من الدرجة الأولى في منطقة أعمال مرموقة مع اتصال ممتاز ومرافق حديثة.',
      city: 'Riyadh',
      cityAr: 'الرياض',
      propertyType: 'office',
      price: 5500000,
      size: 380,
      bedrooms: 0,
      bathrooms: 4,
      images: [officeImage, officeImage],
      developerId: dev1.id,
      riskFlags: [],
      features: ['Central AC', 'High-speed Internet', 'Meeting Rooms', 'Reception'],
      status: 'available',
    },
    {
      title: 'Retail Shop in Shopping Mall',
      titleAr: 'متجر تجاري في مركز تسوق',
      description: 'High-footfall retail space in popular shopping destination. Excellent for retail businesses.',
      descriptionAr: 'مساحة تجارية عالية الإقبال في وجهة تسوق شهيرة. ممتازة للأعمال التجارية.',
      city: 'Doha',
      cityAr: 'الدوحة',
      propertyType: 'office',
      price: 2800000,
      size: 120,
      bedrooms: 0,
      bathrooms: 1,
      images: [officeImage],
      developerId: dev3.id,
      riskFlags: [
        { type: 'lease', severity: 'medium', description: 'Mall lease terms require review' },
      ],
      features: ['Prime Location', 'Display Windows', 'Storage'],
      status: 'available',
    },
    // Land
    {
      title: 'Residential Plot - Excellent Investment',
      titleAr: 'قطعة أرض سكنية - استثمار ممتاز',
      description: 'Prime residential land in developing area with high growth potential. Approved for residential construction.',
      descriptionAr: 'أرض سكنية مميزة في منطقة نامية ذات إمكانات نمو عالية. معتمدة للبناء السكني.',
      city: 'Riyadh',
      cityAr: 'الرياض',
      propertyType: 'land',
      price: 1200000,
      size: 800,
      bedrooms: 0,
      bathrooms: 0,
      images: [],
      developerId: dev1.id,
      riskFlags: [
        { type: 'development', severity: 'low', description: 'Area infrastructure still under development' },
      ],
      features: ['Corner Plot', 'Approved Plans', 'Utilities Available'],
      status: 'available',
    },
  ];

  for (const propData of properties) {
    await storage.createProperty(propData);
  }

  console.log('✅ Properties created');

  // Create buyer profile for user1
  const profile1 = await storage.createBuyerProfile({
    userId: user1.id,
    riskTolerance: 'medium',
    urgencyLevel: 'high',
    priceSensitivity: 'medium',
    minPrice: 1000000,
    maxPrice: 3000000,
    minSize: 150,
    maxSize: 400,
    preferredCities: ['Riyadh', 'Jeddah'],
    preferredTypes: ['apartment', 'villa'],
    psychologicalProfile: { preferenceStyle: 'modern', prioritizes: 'location' },
    mustHaveFeatures: ['parking', 'security'],
  });

  console.log('✅ Buyer profiles created');

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const colleges = [
    {
      name: "Indian Institute of Technology Madras",
      slug: "iit-madras",
      city: "Chennai",
      state: "Tamil Nadu",
      fees: 200000,
      rating: 4.8,
      type: "Government",
      establishedYear: 1959,
      overview: "IIT Madras is one of the foremost institutes of national importance in higher technological education and research.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 200000 },
          { name: "B.Tech Mechanical", duration: "4 years", fees: 180000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 2000000, highestPackage: 8000000, topRecruiters: ["Google", "Microsoft", "Amazon"] },
        ],
      },
      reviews: {
        create: [
          { rating: 5, comment: "Best institute in India. World class faculty.", authorName: "Arjun R" },
          { rating: 4, comment: "Great research opportunities.", authorName: "Priya S" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Advanced", courseName: "B.Tech CSE", openingRank: 1, closingRank: 100, year: 2024 },
          { examName: "JEE Advanced", courseName: "B.Tech Mechanical", openingRank: 200, closingRank: 500, year: 2024 },
        ],
      },
    },
    {
      name: "Indian Institute of Technology Bombay",
      slug: "iit-bombay",
      city: "Mumbai",
      state: "Maharashtra",
      fees: 210000,
      rating: 4.9,
      type: "Government",
      establishedYear: 1958,
      overview: "IIT Bombay is a premier engineering institution known for excellence in education and research.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 210000 },
          { name: "B.Tech Electrical", duration: "4 years", fees: 190000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 2200000, highestPackage: 9000000, topRecruiters: ["Google", "Apple", "Meta"] },
        ],
      },
      reviews: {
        create: [
          { rating: 5, comment: "Incredible campus and faculty.", authorName: "Rahul M" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Advanced", courseName: "B.Tech CSE", openingRank: 1, closingRank: 80, year: 2024 },
          { examName: "JEE Advanced", courseName: "B.Tech Electrical", openingRank: 150, closingRank: 400, year: 2024 },
        ],
      },
    },
    {
      name: "Anna University",
      slug: "anna-university",
      city: "Chennai",
      state: "Tamil Nadu",
      fees: 80000,
      rating: 4.0,
      type: "Government",
      establishedYear: 1978,
      overview: "Anna University is a technical university offering engineering and technology programs across Tamil Nadu.",
      courses: {
        create: [
          { name: "B.E CSE", duration: "4 years", fees: 80000 },
          { name: "B.E Civil", duration: "4 years", fees: 75000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 600000, highestPackage: 1800000, topRecruiters: ["TCS", "Infosys", "Wipro"] },
        ],
      },
      reviews: {
        create: [
          { rating: 4, comment: "Good college with strong alumni network.", authorName: "Karthik V" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "TNEA", courseName: "B.E CSE", openingRank: 100, closingRank: 2000, year: 2024 },
          { examName: "TNEA", courseName: "B.E Civil", openingRank: 2000, closingRank: 8000, year: 2024 },
        ],
      },
    },
    {
      name: "PSG College of Technology",
      slug: "psg-college-of-technology",
      city: "Coimbatore",
      state: "Tamil Nadu",
      fees: 120000,
      rating: 4.2,
      type: "Private",
      establishedYear: 1951,
      overview: "PSG College of Technology is one of the top private engineering colleges in Tamil Nadu with excellent placements.",
      courses: {
        create: [
          { name: "B.E CSE", duration: "4 years", fees: 120000 },
          { name: "B.E Mechanical", duration: "4 years", fees: 110000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 800000, highestPackage: 2500000, topRecruiters: ["Zoho", "TCS", "Cognizant"] },
        ],
      },
      reviews: {
        create: [
          { rating: 4, comment: "Excellent faculty and infrastructure.", authorName: "Divya K" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "TNEA", courseName: "B.E CSE", openingRank: 500, closingRank: 5000, year: 2024 },
        ],
      },
    },
    {
      name: "National Institute of Technology Trichy",
      slug: "nit-trichy",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      fees: 150000,
      rating: 4.5,
      type: "Government",
      establishedYear: 1964,
      overview: "NIT Trichy is one of the top NITs in India, known for strong placements and quality education.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 150000 },
          { name: "B.Tech ECE", duration: "4 years", fees: 140000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 1200000, highestPackage: 4000000, topRecruiters: ["Samsung", "Qualcomm", "TCS"] },
        ],
      },
      reviews: {
        create: [
          { rating: 5, comment: "Best NIT in South India.", authorName: "Arun P" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Main", courseName: "B.Tech CSE", openingRank: 1000, closingRank: 5000, year: 2024 },
          { examName: "JEE Main", courseName: "B.Tech ECE", openingRank: 5000, closingRank: 12000, year: 2024 },
        ],
      },
    },
    {
      name: "Vellore Institute of Technology",
      slug: "vit-vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      fees: 195000,
      rating: 4.1,
      type: "Private",
      establishedYear: 1984,
      overview: "VIT is a deemed university known for its diverse student community and strong industry connections.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 195000 },
          { name: "B.Tech Biotech", duration: "4 years", fees: 175000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 700000, highestPackage: 2000000, topRecruiters: ["Infosys", "Wipro", "HCL"] },
        ],
      },
      reviews: {
        create: [
          { rating: 4, comment: "Great campus life and facilities.", authorName: "Sneha T" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Main", courseName: "B.Tech CSE", openingRank: 10000, closingRank: 50000, year: 2024 },
        ],
      },
    },
    {
      name: "Coimbatore Institute of Technology",
      slug: "cit-coimbatore",
      city: "Coimbatore",
      state: "Tamil Nadu",
      fees: 90000,
      rating: 3.9,
      type: "Government",
      establishedYear: 1956,
      overview: "CIT Coimbatore is a reputed government engineering college with strong academics.",
      courses: {
        create: [
          { name: "B.E CSE", duration: "4 years", fees: 90000 },
          { name: "B.E EEE", duration: "4 years", fees: 85000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 550000, highestPackage: 1500000, topRecruiters: ["TCS", "Wipro", "L&T"] },
        ],
      },
      reviews: {
        create: [
          { rating: 4, comment: "Affordable and good quality education.", authorName: "Manoj B" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "TNEA", courseName: "B.E CSE", openingRank: 1000, closingRank: 6000, year: 2024 },
        ],
      },
    },
    {
      name: "SRM Institute of Science and Technology",
      slug: "srm-kattankulathur",
      city: "Chennai",
      state: "Tamil Nadu",
      fees: 220000,
      rating: 3.8,
      type: "Private",
      establishedYear: 1985,
      overview: "SRM is a top private deemed university with multiple campuses across India.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 220000 },
          { name: "B.Tech Mechanical", duration: "4 years", fees: 200000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 650000, highestPackage: 1800000, topRecruiters: ["Infosys", "TCS", "Capgemini"] },
        ],
      },
      reviews: {
        create: [
          { rating: 4, comment: "Good infrastructure and placement support.", authorName: "Riya C" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Main", courseName: "B.Tech CSE", openingRank: 40000, closingRank: 120000, year: 2024 },
        ],
      },
    },
    {
      name: "Indian Institute of Technology Delhi",
      slug: "iit-delhi",
      city: "New Delhi",
      state: "Delhi",
      fees: 205000,
      rating: 4.9,
      type: "Government",
      establishedYear: 1961,
      overview: "IIT Delhi is one of the most prestigious engineering institutes globally, located in the capital city.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 205000 },
          { name: "B.Tech Civil", duration: "4 years", fees: 185000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 2500000, highestPackage: 10000000, topRecruiters: ["Google", "Microsoft", "Goldman Sachs"] },
        ],
      },
      reviews: {
        create: [
          { rating: 5, comment: "World class research and faculty.", authorName: "Vikram S" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Advanced", courseName: "B.Tech CSE", openingRank: 1, closingRank: 90, year: 2024 },
        ],
      },
    },
    {
      name: "Manipal Institute of Technology",
      slug: "manipal-institute-of-technology",
      city: "Manipal",
      state: "Karnataka",
      fees: 250000,
      rating: 4.0,
      type: "Private",
      establishedYear: 1957,
      overview: "MIT Manipal is one of India's oldest private engineering colleges with strong global alumni presence.",
      courses: {
        create: [
          { name: "B.Tech CSE", duration: "4 years", fees: 250000 },
          { name: "B.Tech ECE", duration: "4 years", fees: 230000 },
        ],
      },
      placements: {
        create: [
          { year: 2024, avgPackage: 900000, highestPackage: 3000000, topRecruiters: ["Infosys", "Accenture", "Deloitte"] },
        ],
      },
      reviews: {
        create: [
          { rating: 4, comment: "Great exposure and campus life.", authorName: "Ananya M" },
        ],
      },
      cutoffs: {
        create: [
          { examName: "JEE Main", courseName: "B.Tech CSE", openingRank: 15000, closingRank: 60000, year: 2024 },
        ],
      },
    },
  ];

  for (const college of colleges) {
    await prisma.college.create({ data: college });
    console.log(`Created: ${college.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
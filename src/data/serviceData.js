// data/serviceData.js

export const serviceCategories = {
  'All': ['All'],
  'Communication & Emotional Support': [
    'Active listening',
    'Empathy training',
    'Motivational speaking',
    'Public speaking',
    'Cross-cultural communication',
    'Stress counseling (non-clinical)',
    'Break-up support',
    'Conversational English practice'
  ],
  'Arts, Music & Creative Expression': [
    'Singing (Bollywood songs)',
    'Amateur photography',
    'Guitar playing',
    'Sketching & doodling',
    'Calligraphy',
    'Poetry recitation (Hindi/Urdu/Kavita)',
    'Theatre/acting games',
    'Storytelling for kids',
  ],
  'Reading & Knowledge Sharing': [
    'Reading books aloud',
    'History talks (Indian history)',
    'Mythology storytelling (Ramayana/Mahabharata)',
    'Current affairs discussion',
    'Spirituality talks',
  ],
  'Sports & Physical Activities': [
    'Carrom partner',
    'Table tennis partner',
    'Badminton partner',
    'Cricket net practice buddy',
    'Football buddy',
    'Volleyball partner',
    'Kabaddi partner',
    'Running/jogging companion',
    'Cycling buddy',
    'Yoga partner',
    'Zumba fitness partner',
    'Walking companion'
  ],
  'Games & Entertainment': [
    'Ludo/Snakes & ladders/Monopoly',
    'Cards (Rummy, UNO)',
    'Scrabble',
    'Puzzles (Sudoku, logic)',
    'Gaming (PlayStation/Xbox)',
    'PC gaming (FIFA, Counter-Strike)'
  ],
  'Education & Skill Development': [
    'Computer basics',
    'MS Office training',
    'Smartphone literacy for elders',
    'Social media basics',
    'Digital payments guidance',
    'Resume writing help',
    'Job interview practice',
    'Public speaking practice',
    'Financial literacy basics',
    'Goal setting & planning',
    'Basic coding (Scratch, Python)'
  ],
 "Lifestyle & Practical Help": [
  "Know your city",
  "Tea/coffee making rituals",
  "Grocery shopping companion",
  "Cooking simple Indian meals",
  "Wardrobe organizing",
  "Festival celebration guide (Diwali, Holi)",
  "Home decoration ideas",
  "Baking cakes/cookies",
  "Gardening basics",
  "Pet care & dog walking"
],
  'Social & Cultural Engagement': [
    'Bollywood dance',
    'Folk dance (Bhangra, Garba)',
    'Karaoke nights',
    'Movie discussion club',
    'TV serial gossip',
    'Museum companion',
    'Temple/mosque/gurudwara companion',
    'Wedding/festival plus-one service'
  ],
  'Emotional Well-being & Mindfulness': [
    'Life reflections sharing',
    'Bucket list planning buddy'
  ],
  'Political & Social Discussions': [
  'Discussion on Modi - Politics',
  'Discussion on Rahul Gandhi - Politics',
  'Discussion on Mamta Banerjee - Politics',
  'Discussion on Saas Bahu topic - Politics'
],

};

// data/providersData.js - API-based Provider Database

const API_BASE_URL = process.env.REACT_APP_API_URL;
let providersCache = [];
const fallbackProviders = [
  {
    id: "provider-001",
    personalInfo: {
      firstName: "Priya",
      lastName: "Sharma",
      fullName: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+916306539818",
      dateOfBirth: "1985-03-15",
      gender: "Female",
      profileImage: null,
      bio: "Passionate music teacher with over 8 years of experience in teaching Indian classical and Bollywood music. I believe music heals the soul and brings people together."
    },
    address: {
      street: "Block A-123, Sector 14",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
      country: "India",
      coordinates: { lat: 28.4595, lng: 77.0266 }
    },
    services: {
      primary: "Singing (Bollywood songs)",
      secondary: ["Singing (Classical Indian music)", "Karaoke hosting"],
      category: "Arts, Music & Creative Expression",
      subcategories: ["Music", "Entertainment"]
    },
    professional: {
      experience: 8,
      verified: true,
      verificationDate: "2023-06-15",
      verificationDocuments: ["Aadhaar", "Music Degree Certificate", "Background Check"],
      languages: ["Hindi", "English", "Punjabi"],
      specializations: [
        "Bollywood playback singing techniques",
        "Sur and taal training",
        "Performance coaching",
        "Breath control techniques"
      ],
      qualifications: [
        {
          degree: "Bachelor of Music",
          institution: "Delhi University",
          year: "2007",
          specialization: "Indian Classical Music"
        },
        {
          certification: "Certified Music Therapy",
          institution: "Music Therapy Institute",
          year: "2019"
        }
      ]
    },
    ratings: {
      overall: 4.8,
      totalReviews: 167,
      breakdown: {
        5: 120,
        4: 35,
        3: 8,
        2: 3,
        1: 1
      },
      categories: {
        teaching: 4.9,
        punctuality: 4.7,
        communication: 4.8,
        professionalism: 4.9
      }
    },
    availability: {
      status: "available",
      timezone: "Asia/Kolkata",
      workingHours: {
        monday: { start: "10:00", end: "20:00" },
        tuesday: { start: "10:00", end: "20:00" },
        wednesday: { start: "10:00", end: "20:00" },
        thursday: { start: "10:00", end: "20:00" },
        friday: { start: "10:00", end: "20:00" },
        saturday: { start: "09:00", end: "18:00" },
        sunday: { start: "11:00", end: "16:00" }
      },
      bookedSlots: [
        { date: "2025-09-25", time: "14:00-15:00", mode: "video" },
        { date: "2025-09-26", time: "16:00-17:00", mode: "call" }
      ]
    },
    pricing: {
      call: {
        basePrice: 250,
        duration: 30,
        currency: "INR",
        discounts: {
          bulk: { sessions: 10, discount: 15 },
          firstTime: 20
        }
      },
      video: {
        basePrice: 350,
        duration: 45,
        currency: "INR",
        discounts: {
          bulk: { sessions: 10, discount: 15 },
          firstTime: 20
        }
      },
      visit: {
        basePrice: 800,
        duration: 60,
        currency: "INR",
        travelRadius: 15,
        extraCharges: {
          travelBeyond15km: 50,
          equipmentSetup: 100
        }
      }
    },
    portfolio: {
      completedSessions: 234,
      successRate: 97.2,
      repeatCustomers: 45,
      achievements: [
        "Top rated music teacher in Gurugram",
        "500+ students taught",
        "Featured in local music magazine"
      ],
      mediaFiles: [
        {
          type: "audio",
          url: "/audio/priya-sample-1.mp3",
          title: "Classical Raag Demo",
          duration: "2:45"
        },
        {
          type: "video",
          url: "/video/priya-teaching-demo.mp4",
          title: "Teaching Method Demo",
          duration: "5:30"
        }
      ],
      testimonials: [
        {
          client: "Raj Kumar",
          rating: 5,
          comment: "Priya ma'am is an excellent teacher. My daughter learned so much in just 3 months!",
          date: "2024-08-15",
          verified: true
        },
        {
          client: "Neha Singh",
          rating: 5,
          comment: "Amazing voice training techniques. Highly recommended for Bollywood singing!",
          date: "2024-07-22",
          verified: true
        }
      ]
    },
    businessInfo: {
      joinDate: "2022-03-10",
      lastActive: "2024-09-24T14:30:00Z",
      responseTime: "Within 2 hours",
      cancellationPolicy: "24 hours notice required",
      refundPolicy: "Full refund if cancelled 24 hours before session",
      equipment: [
        "Harmonium",
        "Tabla",
        "Professional microphone",
        "Audio interface for online sessions"
      ],
      serviceAreas: ["Gurugram", "Delhi", "Noida", "Faridabad"]
    },
    socialProof: {
      badges: ["Verified Professional", "Top Rated", "Quick Responder"],
      platformStats: {
        joinDate: "March 2022",
        totalEarnings: 89500,
        platformRating: 4.8
      }
    }
  },
  {
    id: "provider-002",
    personalInfo: {
      firstName: "Rajesh",
      lastName: "Kumar",
      fullName: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91-9876543211",
      dateOfBirth: "1980-07-22",
      gender: "Male",
      profileImage: null,
      bio: "Certified yoga instructor and meditation guide with 12 years of experience. Specializing in Hatha Yoga, Pranayama, and stress relief techniques."
    },
    address: {
      street: "C-45, Green Park",
      city: "Delhi",
      state: "Delhi",
      pincode: "110016",
      country: "India",
      coordinates: { lat: 28.5562, lng: 77.2074 }
    },
    services: {
      primary: "Yoga partner",
      secondary: ["Meditation guide", "Breathing exercises"],
      category: "Sports & Physical Activities",
      subcategories: ["Fitness", "Wellness"]
    },
    professional: {
      experience: 12,
      verified: true,
      verificationDate: "2023-05-20",
      verificationDocuments: ["Aadhaar", "Yoga Certification", "Medical Certificate"],
      languages: ["Hindi", "English"],
      specializations: [
        "Hatha Yoga",
        "Pranayama breathing techniques",
        "Stress management",
        "Corporate wellness programs"
      ],
      qualifications: [
        {
          degree: "Certified Yoga Teacher (500 hours)",
          institution: "Yoga Alliance International",
          year: "2012",
          specialization: "Hatha Yoga"
        },
        {
          certification: "Meditation Teacher Training",
          institution: "Art of Living",
          year: "2015"
        }
      ]
    },
    ratings: {
      overall: 4.9,
      totalReviews: 203,
      breakdown: {
        5: 180,
        4: 18,
        3: 4,
        2: 1,
        1: 0
      },
      categories: {
        teaching: 4.9,
        punctuality: 4.8,
        communication: 4.9,
        professionalism: 5.0
      }
    },
    availability: {
      status: "available",
      timezone: "Asia/Kolkata",
      workingHours: {
        monday: { start: "06:00", end: "21:00" },
        tuesday: { start: "06:00", end: "21:00" },
        wednesday: { start: "06:00", end: "21:00" },
        thursday: { start: "06:00", end: "21:00" },
        friday: { start: "06:00", end: "21:00" },
        saturday: { start: "06:00", end: "19:00" },
        sunday: { start: "07:00", end: "18:00" }
      },
      bookedSlots: []
    },
    pricing: {
      call: {
        basePrice: 200,
        duration: 30,
        currency: "INR",
        discounts: {
          bulk: { sessions: 5, discount: 10 },
          firstTime: 25
        }
      },
      video: {
        basePrice: 300,
        duration: 60,
        currency: "INR",
        discounts: {
          bulk: { sessions: 5, discount: 10 },
          firstTime: 25
        }
      },
      visit: {
        basePrice: 600,
        duration: 90,
        currency: "INR",
        travelRadius: 20,
        extraCharges: {
          travelBeyond20km: 30,
          equipmentBringing: 50
        }
      }
    },
    portfolio: {
      completedSessions: 456,
      successRate: 99.1,
      repeatCustomers: 78,
      achievements: [
        "Certified Yoga Alliance Teacher",
        "1000+ students trained",
        "Corporate wellness expert"
      ],
      mediaFiles: [
        {
          type: "video",
          url: "/video/rajesh-yoga-demo.mp4",
          title: "Morning Yoga Routine",
          duration: "15:00"
        }
      ],
      testimonials: [
        {
          client: "Anita Verma",
          rating: 5,
          comment: "Best yoga teacher ever! My back pain is completely gone after 2 months.",
          date: "2024-08-20",
          verified: true
        }
      ]
    },
    businessInfo: {
      joinDate: "2021-11-15",
      lastActive: "2024-09-24T06:00:00Z",
      responseTime: "Within 1 hour",
      cancellationPolicy: "12 hours notice required",
      refundPolicy: "Full refund if cancelled 12 hours before session",
      equipment: [
        "Yoga mats",
        "Meditation cushions",
        "Blocks and straps",
        "Sound bowls"
      ],
      serviceAreas: ["Delhi", "Gurugram", "Noida", "Ghaziabad"]
    },
    socialProof: {
      badges: ["Verified Professional", "Top Rated", "Early Responder", "Wellness Expert"],
      platformStats: {
        joinDate: "November 2021",
        totalEarnings: 156700,
        platformRating: 4.9
      }
    }
  },
  {
    id: "provider-003",
    personalInfo: {
      firstName: "Anjali",
      lastName: "Singh",
      fullName: "Anjali Singh",
      email: "anjali.singh@email.com",
      phone: "+91-9876543212",
      dateOfBirth: "1992-12-08",
      gender: "Female",
      profileImage: null,
      bio: "Professional counselor specializing in active listening and emotional support. Helping people navigate through life's challenges with empathy and understanding."
    },
    address: {
      street: "F-789, Vasant Kunj",
      city: "Delhi",
      state: "Delhi",
      pincode: "110070",
      country: "India",
      coordinates: { lat: 28.5244, lng: 77.1580 }
    },
    services: {
      primary: "Active listening",
      secondary: ["Empathy training", "Stress counseling (non-clinical)", "Break-up support"],
      category: "Communication & Emotional Support",
      subcategories: ["Counseling", "Emotional Support"]
    },
    professional: {
      experience: 6,
      verified: true,
      verificationDate: "2023-08-10",
      verificationDocuments: ["Aadhaar", "Psychology Degree", "Counseling Certificate"],
      languages: ["Hindi", "English", "Bengali"],
      specializations: [
        "Active listening techniques",
        "Emotional intelligence coaching",
        "Stress management",
        "Relationship counseling"
      ],
      qualifications: [
        {
          degree: "Master of Psychology",
          institution: "Jamia Millia Islamia",
          year: "2016",
          specialization: "Clinical Psychology"
        },
        {
          certification: "Certified Life Coach",
          institution: "International Coach Federation",
          year: "2018"
        }
      ]
    },
    ratings: {
      overall: 4.7,
      totalReviews: 89,
      breakdown: {
        5: 65,
        4: 18,
        3: 4,
        2: 2,
        1: 0
      },
      categories: {
        listening: 4.9,
        empathy: 4.8,
        helpfulness: 4.7,
        professionalism: 4.6
      }
    },
    availability: {
      status: "available",
      timezone: "Asia/Kolkata",
      workingHours: {
        monday: { start: "09:00", end: "18:00" },
        tuesday: { start: "09:00", end: "18:00" },
        wednesday: { start: "09:00", end: "18:00" },
        thursday: { start: "09:00", end: "18:00" },
        friday: { start: "09:00", end: "18:00" },
        saturday: { start: "10:00", end: "16:00" },
        sunday: { start: "closed", end: "closed" }
      },
      bookedSlots: [
        { date: "2025-09-25", time: "15:00-16:00", mode: "call" }
      ]
    },
    pricing: {
      call: {
        basePrice: 300,
        duration: 45,
        currency: "INR",
        discounts: {
          bulk: { sessions: 8, discount: 20 },
          firstTime: 30
        }
      },
      video: {
        basePrice: 400,
        duration: 60,
        currency: "INR",
        discounts: {
          bulk: { sessions: 8, discount: 20 },
          firstTime: 30
        }
      },
      visit: {
        basePrice: 1200,
        duration: 90,
        currency: "INR",
        travelRadius: 25,
        extraCharges: {
          travelBeyond25km: 100,
          homeVisitPremium: 200
        }
      }
    },
    portfolio: {
      completedSessions: 167,
      successRate: 94.8,
      repeatCustomers: 34,
      achievements: [
        "Licensed counselor",
        "200+ counseling sessions",
        "Specialized in relationship issues"
      ],
      mediaFiles: [],
      testimonials: [
        {
          client: "Anonymous",
          rating: 5,
          comment: "Anjali helped me through my toughest time. Her listening skills are exceptional.",
          date: "2024-09-10",
          verified: true
        }
      ]
    },
    businessInfo: {
      joinDate: "2022-07-01",
      lastActive: "2024-09-24T16:45:00Z",
      responseTime: "Within 30 minutes",
      cancellationPolicy: "4 hours notice required",
      refundPolicy: "Full refund if cancelled 4 hours before session",
      equipment: [
        "Quiet consultation space",
        "Professional recording setup for online sessions",
        "Therapeutic materials"
      ],
      serviceAreas: ["Delhi", "NCR Region"]
    },
    socialProof: {
      badges: ["Verified Professional", "Licensed Counselor", "Quick Responder"],
      platformStats: {
        joinDate: "July 2022",
        totalEarnings: 67800,
        platformRating: 4.7
      }
    }
  },
   {
    id: "provider-001",
    personalInfo: {
      firstName: "Priya",
      lastName: "Sharma",
      fullName: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+916306539818",
      dateOfBirth: "1985-03-15",
      gender: "Female",
      profileImage: null,
      bio: "Passionate music teacher with over 8 years of experience in teaching Indian classical and Bollywood music. I believe music heals the soul and brings people together."
    },
    address: {
      street: "Block A-123, Sector 14",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
      country: "India",
      coordinates: { lat: 28.4595, lng: 77.0266 }
    },
    services: {
      primary: "Singing (Bollywood songs)",
      secondary: ["Singing (Classical Indian music)", "Karaoke hosting"],
      category: "Arts, Music & Creative Expression",
      subcategories: ["Music", "Entertainment"]
    },
    professional: {
      experience: 8,
      verified: true,
      verificationDate: "2023-06-15",
      verificationDocuments: ["Aadhaar", "Music Degree Certificate", "Background Check"],
      languages: ["Hindi", "English", "Punjabi"],
      specializations: [
        "Bollywood playback singing techniques",
        "Sur and taal training",
        "Performance coaching",
        "Breath control techniques"
      ],
      qualifications: [
        {
          degree: "Bachelor of Music",
          institution: "Delhi University",
          year: "2007",
          specialization: "Indian Classical Music"
        },
        {
          certification: "Certified Music Therapy",
          institution: "Music Therapy Institute",
          year: "2019"
        }
      ]
    },
    ratings: {
      overall: 4.8,
      totalReviews: 167,
      breakdown: {
        5: 120,
        4: 35,
        3: 8,
        2: 3,
        1: 1
      },
      categories: {
        teaching: 4.9,
        punctuality: 4.7,
        communication: 4.8,
        professionalism: 4.9
      }
    },
    availability: {
      status: "available",
      timezone: "Asia/Kolkata",
      workingHours: {
        monday: { start: "10:00", end: "20:00" },
        tuesday: { start: "10:00", end: "20:00" },
        wednesday: { start: "10:00", end: "20:00" },
        thursday: { start: "10:00", end: "20:00" },
        friday: { start: "10:00", end: "20:00" },
        saturday: { start: "09:00", end: "18:00" },
        sunday: { start: "11:00", end: "16:00" }
      },
      bookedSlots: [
        { date: "2025-09-25", time: "14:00-15:00", mode: "video" },
        { date: "2025-09-26", time: "16:00-17:00", mode: "call" }
      ]
    },
    pricing: {
      call: {
        basePrice: 250,
        duration: 30,
        currency: "INR",
        discounts: {
          bulk: { sessions: 10, discount: 15 },
          firstTime: 20
        }
      },
      video: {
        basePrice: 350,
        duration: 45,
        currency: "INR",
        discounts: {
          bulk: { sessions: 10, discount: 15 },
          firstTime: 20
        }
      },
      visit: {
        basePrice: 800,
        duration: 60,
        currency: "INR",
        travelRadius: 15,
        extraCharges: {
          travelBeyond15km: 50,
          equipmentSetup: 100
        }
      }
    },
    portfolio: {
      completedSessions: 234,
      successRate: 97.2,
      repeatCustomers: 45,
      achievements: [
        "Top rated music teacher in Gurugram",
        "500+ students taught",
        "Featured in local music magazine"
      ],
      mediaFiles: [
        {
          type: "audio",
          url: "/audio/priya-sample-1.mp3",
          title: "Classical Raag Demo",
          duration: "2:45"
        },
        {
          type: "video",
          url: "/video/priya-teaching-demo.mp4",
          title: "Teaching Method Demo",
          duration: "5:30"
        }
      ],
      testimonials: [
        {
          client: "Raj Kumar",
          rating: 5,
          comment: "Priya ma'am is an excellent teacher. My daughter learned so much in just 3 months!",
          date: "2024-08-15",
          verified: true
        },
        {
          client: "Neha Singh",
          rating: 5,
          comment: "Amazing voice training techniques. Highly recommended for Bollywood singing!",
          date: "2024-07-22",
          verified: true
        }
      ]
    },
    businessInfo: {
      joinDate: "2022-03-10",
      lastActive: "2024-09-24T14:30:00Z",
      responseTime: "Within 2 hours",
      cancellationPolicy: "24 hours notice required",
      refundPolicy: "Full refund if cancelled 24 hours before session",
      equipment: [
        "Harmonium",
        "Tabla",
        "Professional microphone",
        "Audio interface for online sessions"
      ],
      serviceAreas: ["Gurugram", "Delhi", "Noida", "Faridabad"]
    },
    socialProof: {
      badges: ["Verified Professional", "Top Rated", "Quick Responder"],
      platformStats: {
        joinDate: "March 2022",
        totalEarnings: 89500,
        platformRating: 4.8
      }
    }
  },
  {
    id: "provider-002",
    personalInfo: {
      firstName: "Rajesh",
      lastName: "Kumar",
      fullName: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91-9876543211",
      dateOfBirth: "1980-07-22",
      gender: "Male",
      profileImage: null,
      bio: "Certified yoga instructor and meditation guide with 12 years of experience. Specializing in Hatha Yoga, Pranayama, and stress relief techniques."
    },
    address: {
      street: "C-45, Green Park",
      city: "Delhi",
      state: "Delhi",
      pincode: "110016",
      country: "India",
      coordinates: { lat: 28.5562, lng: 77.2074 }
    },
    services: {
      primary: "Yoga partner",
      secondary: ["Meditation guide", "Breathing exercises"],
      category: "Sports & Physical Activities",
      subcategories: ["Fitness", "Wellness"]
    },
    professional: {
      experience: 12,
      verified: true,
      verificationDate: "2023-05-20",
      verificationDocuments: ["Aadhaar", "Yoga Certification", "Medical Certificate"],
      languages: ["Hindi", "English"],
      specializations: [
        "Hatha Yoga",
        "Pranayama breathing techniques",
        "Stress management",
        "Corporate wellness programs"
      ],
      qualifications: [
        {
          degree: "Certified Yoga Teacher (500 hours)",
          institution: "Yoga Alliance International",
          year: "2012",
          specialization: "Hatha Yoga"
        },
        {
          certification: "Meditation Teacher Training",
          institution: "Art of Living",
          year: "2015"
        }
      ]
    },
    ratings: {
      overall: 4.9,
      totalReviews: 203,
      breakdown: {
        5: 180,
        4: 18,
        3: 4,
        2: 1,
        1: 0
      },
      categories: {
        teaching: 4.9,
        punctuality: 4.8,
        communication: 4.9,
        professionalism: 5.0
      }
    },
    availability: {
      status: "available",
      timezone: "Asia/Kolkata",
      workingHours: {
        monday: { start: "06:00", end: "21:00" },
        tuesday: { start: "06:00", end: "21:00" },
        wednesday: { start: "06:00", end: "21:00" },
        thursday: { start: "06:00", end: "21:00" },
        friday: { start: "06:00", end: "21:00" },
        saturday: { start: "06:00", end: "19:00" },
        sunday: { start: "07:00", end: "18:00" }
      },
      bookedSlots: []
    },
    pricing: {
      call: {
        basePrice: 200,
        duration: 30,
        currency: "INR",
        discounts: {
          bulk: { sessions: 5, discount: 10 },
          firstTime: 25
        }
      },
      video: {
        basePrice: 300,
        duration: 60,
        currency: "INR",
        discounts: {
          bulk: { sessions: 5, discount: 10 },
          firstTime: 25
        }
      },
      visit: {
        basePrice: 600,
        duration: 90,
        currency: "INR",
        travelRadius: 20,
        extraCharges: {
          travelBeyond20km: 30,
          equipmentBringing: 50
        }
      }
    },
    portfolio: {
      completedSessions: 456,
      successRate: 99.1,
      repeatCustomers: 78,
      achievements: [
        "Certified Yoga Alliance Teacher",
        "1000+ students trained",
        "Corporate wellness expert"
      ],
      mediaFiles: [
        {
          type: "video",
          url: "/video/rajesh-yoga-demo.mp4",
          title: "Morning Yoga Routine",
          duration: "15:00"
        }
      ],
      testimonials: [
        {
          client: "Anita Verma",
          rating: 5,
          comment: "Best yoga teacher ever! My back pain is completely gone after 2 months.",
          date: "2024-08-20",
          verified: true
        }
      ]
    },
    businessInfo: {
      joinDate: "2021-11-15",
      lastActive: "2024-09-24T06:00:00Z",
      responseTime: "Within 1 hour",
      cancellationPolicy: "12 hours notice required",
      refundPolicy: "Full refund if cancelled 12 hours before session",
      equipment: [
        "Yoga mats",
        "Meditation cushions",
        "Blocks and straps",
        "Sound bowls"
      ],
      serviceAreas: ["Delhi", "Gurugram", "Noida", "Ghaziabad"]
    },
    socialProof: {
      badges: ["Verified Professional", "Top Rated", "Early Responder", "Wellness Expert"],
      platformStats: {
        joinDate: "November 2021",
        totalEarnings: 156700,
        platformRating: 4.9
      }
    }
  },
  {
    id: "provider-003",
    personalInfo: {
      firstName: "Anjali",
      lastName: "Singh",
      fullName: "Anjali Singh",
      email: "anjali.singh@email.com",
      phone: "+91-9876543212",
      dateOfBirth: "1992-12-08",
      gender: "Female",
      profileImage: null,
      bio: "Professional counselor specializing in active listening and emotional support. Helping people navigate through life's challenges with empathy and understanding."
    },
    address: {
      street: "F-789, Vasant Kunj",
      city: "Delhi",
      state: "Delhi",
      pincode: "110070",
      country: "India",
      coordinates: { lat: 28.5244, lng: 77.1580 }
    },
    services: {
      primary: "Active listening",
      secondary: ["Empathy training", "Stress counseling (non-clinical)", "Break-up support"],
      category: "Communication & Emotional Support",
      subcategories: ["Counseling", "Emotional Support"]
    },
    professional: {
      experience: 6,
      verified: true,
      verificationDate: "2023-08-10",
      verificationDocuments: ["Aadhaar", "Psychology Degree", "Counseling Certificate"],
      languages: ["Hindi", "English", "Bengali"],
      specializations: [
        "Active listening techniques",
        "Emotional intelligence coaching",
        "Stress management",
        "Relationship counseling"
      ],
      qualifications: [
        {
          degree: "Master of Psychology",
          institution: "Jamia Millia Islamia",
          year: "2016",
          specialization: "Clinical Psychology"
        },
        {
          certification: "Certified Life Coach",
          institution: "International Coach Federation",
          year: "2018"
        }
      ]
    },
    ratings: {
      overall: 4.7,
      totalReviews: 89,
      breakdown: {
        5: 65,
        4: 18,
        3: 4,
        2: 2,
        1: 0
      },
      categories: {
        listening: 4.9,
        empathy: 4.8,
        helpfulness: 4.7,
        professionalism: 4.6
      }
    },
    availability: {
      status: "available",
      timezone: "Asia/Kolkata",
      workingHours: {
        monday: { start: "09:00", end: "18:00" },
        tuesday: { start: "09:00", end: "18:00" },
        wednesday: { start: "09:00", end: "18:00" },
        thursday: { start: "09:00", end: "18:00" },
        friday: { start: "09:00", end: "18:00" },
        saturday: { start: "10:00", end: "16:00" },
        sunday: { start: "closed", end: "closed" }
      },
      bookedSlots: [
        { date: "2025-09-25", time: "15:00-16:00", mode: "call" }
      ]
    },
    pricing: {
      call: {
        basePrice: 300,
        duration: 45,
        currency: "INR",
        discounts: {
          bulk: { sessions: 8, discount: 20 },
          firstTime: 30
        }
      },
      video: {
        basePrice: 400,
        duration: 60,
        currency: "INR",
        discounts: {
          bulk: { sessions: 8, discount: 20 },
          firstTime: 30
        }
      },
      visit: {
        basePrice: 1200,
        duration: 90,
        currency: "INR",
        travelRadius: 25,
        extraCharges: {
          travelBeyond25km: 100,
          homeVisitPremium: 200
        }
      }
    },
    portfolio: {
      completedSessions: 167,
      successRate: 94.8,
      repeatCustomers: 34,
      achievements: [
        "Licensed counselor",
        "200+ counseling sessions",
        "Specialized in relationship issues"
      ],
      mediaFiles: [],
      testimonials: [
        {
          client: "Anonymous",
          rating: 5,
          comment: "Anjali helped me through my toughest time. Her listening skills are exceptional.",
          date: "2024-09-10",
          verified: true
        }
      ]
    },
    businessInfo: {
      joinDate: "2022-07-01",
      lastActive: "2024-09-24T16:45:00Z",
      responseTime: "Within 30 minutes",
      cancellationPolicy: "4 hours notice required",
      refundPolicy: "Full refund if cancelled 4 hours before session",
      equipment: [
        "Quiet consultation space",
        "Professional recording setup for online sessions",
        "Therapeutic materials"
      ],
      serviceAreas: ["Delhi", "NCR Region"]
    },
    socialProof: {
      badges: ["Verified Professional", "Licensed Counselor", "Quick Responder"],
      platformStats: {
        joinDate: "July 2022",
        totalEarnings: 67800,
        platformRating: 4.7
      }
    }
  }
];

// Export for backward compatibility - this will be populated from API
export const providersDatabase = providersCache.length > 0 ? providersCache : fallbackProviders;

// Fetch all providers from API
export const getAllProviders = async () => {
  try {
    const API_URL = `${API_BASE_URL}/providers`;
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.warn('API fetch failed, using fallback data');
      return fallbackProviders;
    }
    
    const providers = await response.json();
    
    // Update cache for synchronous access
    providersCache = providers;
    
    return providers;
  } catch (error) {
    console.error('Error fetching providers:', error);
    console.warn('Using fallback data due to API error');
    return fallbackProviders;
  }
};

// Helper function to get all provider data for modal from API
export const getFullProviderData = async (providerId) => {
  try {
    const API_URL = `${API_BASE_URL}/providers`;
    const response = await fetch(`${API_URL}/${providerId}`);
    
    if (!response.ok) {
      // Fallback to cached/fallback data
      const fallbackData = [...providersCache, ...fallbackProviders].find(
        provider => provider._id === providerId
      );
      return fallbackData || null;
    }
    
    const provider = await response.json();
    return provider;
  } catch (error) {
    console.error('Error fetching provider:', error);
    // Fallback to cached/fallback data
    const fallbackData = [...providersCache, ...fallbackProviders].find(
      provider => provider._id === providerId
    );
    return fallbackData || null;
  }
};

// Helper function to get essential data for cards
export const getEssentialProviderData = (provider) => ({
  id: provider._id,
  name: provider.personalInfo?.fullName || provider.name || 'Unknown',
  service: provider.services?.primary || provider.service || 'N/A',
  category: provider.services?.category || provider.category || 'N/A',
  rating: provider.ratings?.overall || provider.rating || 0,
  reviews: provider.ratings?.totalReviews || provider.reviews || 0,
  experience: provider.professional?.experience || provider.experience || 0,
  location: provider.address?.city || provider.location || 'N/A',
  verified: provider.professional?.verified ?? provider.verified ?? false,
  available: provider.availability?.status === 'available' || provider.available === true,
  languages: provider.professional?.languages || provider.languages || [],
  price: {
    call: provider.pricing?.call?.basePrice || provider.price?.call || 0,
    video: provider.pricing?.video?.basePrice || provider.price?.video || 0,
    visit: provider.pricing?.visit?.basePrice || provider.price?.visit || 0
  },
  responseTime: provider.businessInfo?.responseTime || provider.responseTime || 'N/A',
  badges: provider.socialProof?.badges || provider.badges || []
});


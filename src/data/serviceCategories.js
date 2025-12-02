import { Heart, Music, BookOpen, Trophy,Megaphone, Gamepad2, GraduationCap, ChefHat, Users, Flower, MessageCircle, Target, Mic, Globe, Coffee, Headphones, Guitar, Piano, Palette, Pen, Theater, Clock, Brain, Lightbulb, Dumbbell, Move, Home, Car, MapPin, Camera, Gamepad, Laptop, Book, Utensils, TreePine, ShoppingCart, Shirt, Package, Paintbrush, PartyPopper, Film, Tv, Building, Church } from 'lucide-react';

const serviceCategories = [
  {
    category: "Communication & Emotional Support",
    title: "Emotional Well-being & Support",
    description: "Professional emotional support and communication services for mental wellness",
    icon: Heart,
    gradient: "from-pink-500 via-rose-400 to-red-500",
    accentColor: "text-pink-600",
    bgPattern: "hearts",
    services: [
      { 
        skill: "Active listening", 
        icon: MessageCircle, 
        demand: "High", 
        rating: 4.9,
        pricing: {
          chat: "₹15/min",
          audio: "₹20/min",
          video: "₹25/min",
          inPerson: "₹800/hour"
        },
        startingPrice: "₹15/min"
      },
      { 
        skill: "Empathy training", 
        icon: Heart, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹18/min",
          audio: "₹22/min",
          video: "₹25/min",
          inPerson: "₹1200/session"
        },
        startingPrice: "₹18/min"
      },
      { 
        skill: "Motivational speaking", 
        icon: Target, 
        demand: "Medium", 
        rating: 4.8,
        pricing: {
          chat: "₹22/min",
          audio: "₹25/min",
          video: "Not Available",
          inPerson: "₹2500/session"
        },
        startingPrice: "₹22/min"
      },
      { 
        skill: "Public speaking", 
        icon: Mic, 
        demand: "Medium", 
        rating: 4.7,
        pricing: {
          chat: "₹18/min",
          audio: "₹22/min",
          video: "₹25/min",
          inPerson: "₹1500/session"
        },
        startingPrice: "₹18/min"
      },
      { 
        skill: "Cross-cultural communication", 
        icon: Globe, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "₹16/min",
          audio: "₹20/min",
          video: "₹24/min",
          inPerson: "₹1200/hour"
        },
        startingPrice: "₹16/min"
      },
      { 
        skill: "Stress counseling (non-clinical)", 
        icon: Coffee, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹17/min",
          audio: "₹21/min",
          video: "₹24/min",
          inPerson: "₹1000/session"
        },
        startingPrice: "₹17/min"
      },
      { 
        skill: "Break-up support", 
        icon: Heart, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹16/min",
          audio: "₹20/min",
          video: "₹23/min",
          inPerson: "₹1000/session"
        },
        startingPrice: "₹16/min"
      },
      { 
        skill: "Conversational English practice", 
        icon: MessageCircle, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "₹12/min",
          audio: "₹16/min",
          video: "₹20/min",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹12/min"
      }
    ]
  },
  {
    category: "Arts, Music & Creative Expression",
    title: "Creative Arts & Music",
    description: "Artistic expression and musical talent sharing for creative fulfillment",
    icon: Music,
    gradient: "from-purple-500 via-violet-400 to-indigo-500",
    accentColor: "text-purple-600",
    bgPattern: "music",
  services: [
  { 
    skill: "Amateur photography",
    icon: Camera, 
    demand: "Medium",
    rating: 4.6,
    pricing: {
      chat: "₹10/min",
      audio: "₹14/min",
      video: "₹18/min",
      inPerson: "₹900/hour"
    },
    startingPrice: "₹10/min"
  },

  { 
    skill: "Storytelling for kids",
    icon: BookOpen, 
    demand: "High",
    rating: 4.8,
    pricing: {
      chat: "₹12/min",
      audio: "₹16/min",
      video: "₹20/min",
      inPerson: "₹1000/hour"
    },
    startingPrice: "₹12/min"
  },

  { 
    skill: "Singing (Bollywood songs)", 
    icon: Headphones, 
    demand: "High", 
    rating: 4.9,
    pricing: {
      chat: "Not Available",
      audio: "₹18/min",
      video: "₹22/min",
      inPerson: "₹1200/hour"
    },
    startingPrice: "₹18/min"
  },

  { 
    skill: "Poetry recitation (Hindi/Urdu/Kavita)", 
    icon: Book, 
    demand: "Medium", 
    rating: 4.8,
    pricing: {
      chat: "₹11/min",
      audio: "₹15/min",
      video: "₹19/min",
      inPerson: "₹800/hour"
    },
    startingPrice: "₹11/min"
  },

  { 
    skill: "Theatre/acting games", 
    icon: Theater, 
    demand: "Medium", 
    rating: 4.7,
    pricing: {
      chat: "₹13/min",
      audio: "₹18/min",
      video: "₹22/min",
      inPerson: "₹1200/hour"
    },
    startingPrice: "₹13/min"
  },

  { 
    skill: "Sketching & doodling", 
    icon: Pen, 
    demand: "Medium", 
    rating: 4.5,
    pricing: {
      chat: "₹10/min",
      audio: "₹14/min",
      video: "₹18/min",
      inPerson: "₹800/hour"
    },
    startingPrice: "₹10/min"
  },

  { 
    skill: "Calligraphy", 
    icon: Pen, 
    demand: "Low", 
    rating: 4.7,
    pricing: {
      chat: "₹12/min",
      audio: "₹15/min",
      video: "₹19/min",
      inPerson: "₹900/hour"
    },
    startingPrice: "₹12/min"
  },

  { 
    skill: "Guitar playing", 
    icon: Guitar, 
    demand: "High", 
    rating: 4.7,
    pricing: {
      chat: "₹14/min",
      audio: "₹18/min",
      video: "₹22/min",
      inPerson: "₹1500/hour"
    },
    startingPrice: "₹14/min"
  }
]

  },
  {
    category: "Reading & Knowledge Sharing",
    title: "Knowledge & Learning",
    description: "Educational content sharing and intellectual growth opportunities",
    icon: BookOpen,
    gradient: "from-emerald-500 via-teal-400 to-cyan-500",
    accentColor: "text-emerald-600",
    bgPattern: "books",
    services: [
      { 
        skill: "Reading books aloud", 
        icon: Book, 
        demand: "High", 
        rating: 4.9,
        pricing: {
          chat: "Not Available",
          audio: "₹15/min",
          video: "₹19/min",
          inPerson: "₹800/hour"
        },
        startingPrice: "₹15/min"
      },
      { 
        skill: "History talks (Indian history)", 
        icon: Clock, 
        demand: "Medium", 
        rating: 4.7,
        pricing: {
          chat: "₹16/min",
          audio: "₹20/min",
          video: "₹23/min",
          inPerson: "₹1200/session"
        },
        startingPrice: "₹16/min"
      },
      { 
        skill: "Mythology storytelling (Ramayana/Mahabharata)", 
        icon: BookOpen, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹21/min",
          inPerson: "₹900/session"
        },
        startingPrice: "₹13/min"
      },
      { 
        skill: "Current affairs discussion", 
        icon: BookOpen, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹20/min",
          inPerson: "₹900/hour"
        },
        startingPrice: "₹13/min"
      },
      { 
        skill: "Spirituality talks", 
        icon: Heart, 
        demand: "Medium", 
        rating: 4.8,
        pricing: {
          chat: "₹14/min",
          audio: "₹18/min",
          video: "₹22/min",
          inPerson: "₹1100/session"
        },
        startingPrice: "₹14/min"
      },
    ]
  },
  {
    category: "Sports & Physical Activities",
    title: "Sports & Fitness",
    description: "Physical activities and sports companionship for active lifestyle",
    icon: Trophy,
    gradient: "from-orange-500 via-amber-400 to-yellow-500",
    accentColor: "text-orange-600",
    bgPattern: "sports",
    services: [
      { 
        skill: "Carrom partner", 
        icon: Target, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "₹12/min",
          inPerson: "₹300/hour"
        },
        startingPrice: "₹12/min"
      },
      { 
        skill: "Table tennis partner", 
        icon: Trophy, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹500/hour"
        },
        startingPrice: "₹500/hour"
      },
      { 
        skill: "Badminton partner", 
        icon: Trophy, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹600/hour"
      },
      { 
        skill: "Cricket net practice buddy", 
        icon: Trophy, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹700/hour"
        },
        startingPrice: "₹700/hour"
      },
      { 
        skill: "Football buddy", 
        icon: Trophy, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹800/hour"
        },
        startingPrice: "₹800/hour"
      },
      { 
        skill: "Volleyball partner", 
        icon: Trophy, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹500/hour"
        },
        startingPrice: "₹500/hour"
      },
      { 
        skill: "Kabaddi partner", 
        icon: Dumbbell, 
        demand: "Medium", 
        rating: 4.4,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹600/hour"
      },
      { 
        skill: "Running/jogging companion", 
        icon: Move, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹10/min",
          audio: "₹14/min",
          video: "Not Available",
          inPerson: "₹700/hour"
        },
        startingPrice: "₹10/min"
      },
      { 
        skill: "Cycling buddy", 
        icon: Move, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹11/min",
          audio: "₹15/min",
          video: "Not Available",
          inPerson: "₹500/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "Yoga partner", 
        icon: Flower, 
        demand: "High", 
        rating: 4.9,
        pricing: {
          chat: "₹14/min",
          audio: "₹19/min",
          video: "₹23/min",
          inPerson: "₹1000/session"
        },
        startingPrice: "₹14/min"
      },
      { 
        skill: "Zumba fitness partner", 
        icon: Move, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "₹18/min",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹18/min"
      },
      { 
        skill: "Walking companion", 
        icon: Move, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹10/min",
          audio: "₹13/min",
          video: "Not Available",
          inPerson: "₹300/hour"
        },
        startingPrice: "₹10/min"
      }
    ]
  },
  {
    category: "Games & Entertainment",
    title: "Games & Entertainment",
    description: "Fun gaming experiences and entertainment activities for leisure",
    icon: Gamepad2,
    gradient: "from-blue-500 via-indigo-400 to-purple-500",
    accentColor: "text-blue-600",
    bgPattern: "games",
    services: [
      { 
        skill: "Ludo/Snakes & ladders/Monopoly", 
        icon: Gamepad, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹10/min",
          audio: "₹13/min",
          video: "₹16/min",
          inPerson: "₹300/hour"
        },
        startingPrice: "₹10/min"
      },
      { 
        skill: "Cards (Rummy, UNO)", 
        icon: Gamepad, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "₹11/min",
          audio: "₹14/min",
          video: "₹17/min",
          inPerson: "₹450/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "Scrabble", 
        icon: BookOpen, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹11/min",
          audio: "₹15/min",
          video: "₹18/min",
          inPerson: "₹500/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "Puzzles (Sudoku, logic)", 
        icon: Brain, 
        demand: "Medium", 
        rating: 4.5,
        pricing: {
          chat: "₹10/min",
          audio: "₹14/min",
          video: "₹17/min",
          inPerson: "₹450/hour"
        },
        startingPrice: "₹10/min"
      },
      { 
        skill: "Gaming (PlayStation/Xbox)", 
        icon: Gamepad2, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹14/min",
          audio: "₹18/min",
          video: "₹22/min",
          inPerson: "₹800/hour"
        },
        startingPrice: "₹14/min"
      },
      { 
        skill: "PC gaming (FIFA, Counter-Strike)", 
        icon: Laptop, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "₹15/min",
          audio: "₹19/min",
          video: "₹23/min",
          inPerson: "₹900/hour"
        },
        startingPrice: "₹15/min"
      }
    ]
  },
  {
    category: "Education & Skill Development",
    title: "Learning & Development",
    description: "Educational support and skill enhancement for personal growth",
    icon: GraduationCap,
    gradient: "from-green-500 via-lime-400 to-emerald-500",
    accentColor: "text-green-600",
    bgPattern: "education",
    services: [
      { 
        skill: "Computer basics", 
        icon: Laptop, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "₹14/min",
          audio: "₹18/min",
          video: "₹22/min",
          inPerson: "₹1000/hour"
        },
        startingPrice: "₹14/min"
      },
      { 
        skill: "MS Office training", 
        icon: Laptop, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "₹15/min",
          audio: "₹19/min",
          video: "₹23/min",
          inPerson: "₹1200/hour"
        },
        startingPrice: "₹15/min"
      },
      { 
        skill: "Smartphone literacy for elders", 
        icon: Gamepad, 
        demand: "High", 
        rating: 4.9,
        pricing: {
          chat: "₹12/min",
          audio: "₹16/min",
          video: "₹20/min",
          inPerson: "₹700/hour"
        },
        startingPrice: "₹12/min"
      },
      { 
        skill: "Social media basics", 
        icon: Globe, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "₹11/min",
          audio: "₹14/min",
          video: "₹18/min",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "Digital payments guidance", 
        icon: Laptop, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹11/min",
          audio: "₹15/min",
          video: "₹18/min",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "Resume writing help", 
        icon: Pen, 
        demand: "Medium", 
        rating: 4.7,
        pricing: {
          chat: "₹16/min",
          audio: "₹20/min",
          video: "₹23/min",
          inPerson: "₹1200/session"
        },
        startingPrice: "₹16/min"
      },
      { 
        skill: "Job interview practice", 
        icon: MessageCircle, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹17/min",
          audio: "₹21/min",
          video: "₹24/min",
          inPerson: "₹1400/session"
        },
        startingPrice: "₹17/min"
      },
      { 
        skill: "Public speaking practice", 
        icon: Mic, 
        demand: "Medium", 
        rating: 4.7,
        pricing: {
          chat: "₹16/min",
          audio: "₹20/min",
          video: "₹23/min",
          inPerson: "₹1300/session"
        },
        startingPrice: "₹16/min"
      },
      { 
        skill: "Financial literacy basics", 
        icon: BookOpen, 
        demand: "Medium", 
        rating: 4.5,
        pricing: {
          chat: "₹15/min",
          audio: "₹19/min",
          video: "₹22/min",
          inPerson: "₹1000/session"
        },
        startingPrice: "₹15/min"
      },
      { 
        skill: "Goal setting & planning", 
        icon: Target, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹16/min",
          audio: "₹20/min",
          video: "₹23/min",
          inPerson: "₹1200/session"
        },
        startingPrice: "₹16/min"
      },
    ]
  },
  {
    category: "Lifestyle & Practical Help",
    title: "Lifestyle & Home Support",
    description: "Practical lifestyle assistance and home management support",
    icon: ChefHat,
    gradient: "from-amber-500 via-orange-400 to-red-500",
    accentColor: "text-amber-600",
    bgPattern: "lifestyle",
    services: [
      { 
        skill: "Cooking simple Indian meals", 
        icon: Utensils, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹14/min",
          audio: "₹18/min",
          video: "₹22/min",
          inPerson: "₹1200/session"
        },
        startingPrice: "₹14/min"
      },
      { 
        skill: "Baking cakes/cookies", 
        icon: ChefHat, 
        demand: "Medium", 
        rating: 4.7,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹21/min",
          inPerson: "₹1000/session"
        },
        startingPrice: "₹13/min"
      },
      { 
        skill: "Tea/coffee making rituals", 
        icon: Coffee, 
        demand: "High", 
        rating: 4.9,
        pricing: {
          chat: "₹10/min",
          audio: "₹13/min",
          video: "₹16/min",
          inPerson: "₹450/hour"
        },
        startingPrice: "₹10/min"
      },
      { 
        skill: "Gardening basics", 
        icon: TreePine, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹12/min",
          audio: "₹16/min",
          video: "₹19/min",
          inPerson: "₹800/hour"
        },
        startingPrice: "₹12/min"
      },
      { 
        skill: "Pet care & dog walking", 
        icon: Heart, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹11/min",
          audio: "₹14/min",
          video: "Not Available",
          inPerson: "₹400/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "Grocery shopping companion", 
        icon: ShoppingCart, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "₹10/min",
          audio: "₹13/min",
          video: "Not Available",
          inPerson: "₹300/hour"
        },
        startingPrice: "₹10/min"
      },
      { 
        skill: "Wardrobe organizing", 
        icon: Shirt, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹20/min",
          inPerson: "₹900/session"
        },
        startingPrice: "₹13/min"
      },
      { 
        skill: "Know your city", 
        icon: Package, 
        demand: "High", 
        rating: 4.5,
        pricing: {
          chat: "₹14/min",
          audio: "₹18/min",
          video: "₹21/min",
          inPerson: "₹1000/session"
        },
        startingPrice: "₹14/min"
      },
      { 
        skill: "Home decoration ideas", 
        icon: Home, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹15/min",
          audio: "₹19/min",
          video: "₹23/min",
          inPerson: "₹1200/session"
        },
        startingPrice: "₹15/min"
      },
      { 
        skill: "Festival celebration guide (Diwali, Holi)", 
        icon: PartyPopper, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹20/min",
          inPerson: "₹900/hour"
        },
        startingPrice: "₹13/min"
      }
    ]
  },
  {
    category: "Social & Cultural Engagement",
    title: "Social & Cultural Activities",
    description: "Cultural engagement and social companionship services",
    icon: Users,
    gradient: "from-rose-500 via-pink-400 to-purple-500",
    accentColor: "text-rose-600",
    bgPattern: "cultural",
    services: [
      { 
        skill: "Bollywood dance", 
        icon: Music, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹14/min",
          audio: "₹18/min",
          video: "₹22/min",
          inPerson: "₹1200/hour"
        },
        startingPrice: "₹14/min"
      },
      { 
        skill: "Folk dance (Bhangra, Garba)", 
        icon: PartyPopper, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹21/min",
          inPerson: "₹1000/hour"
        },
        startingPrice: "₹13/min"
      },
      { 
        skill: "Karaoke nights", 
        icon: Mic, 
        demand: "High", 
        rating: 4.7,
        pricing: {
          chat: "Not Available",
          audio: "₹16/min",
          video: "₹19/min",
          inPerson: "₹900/hour"
        },
        startingPrice: "₹16/min"
      },
      { 
        skill: "Movie discussion club", 
        icon: Film, 
        demand: "High", 
        rating: 4.6,
        pricing: {
          chat: "₹11/min",
          audio: "₹14/min",
          video: "₹17/min",
          inPerson: "₹600/hour"
        },
        startingPrice: "₹11/min"
      },
      { 
        skill: "TV serial gossip", 
        icon: Tv, 
        demand: "High", 
        rating: 4.5,
        pricing: {
          chat: "₹10/min",
          audio: "₹13/min",
          video: "₹16/min",
          inPerson: "₹450/hour"
        },
        startingPrice: "₹10/min"
      },
      { 
        skill: "Museum companion", 
        icon: Building, 
        demand: "Medium", 
        rating: 4.5,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹500/hour"
        },
        startingPrice: "₹500/hour"
      },
      { 
        skill: "Temple/mosque/gurudwara companion", 
        icon: Church, 
        demand: "High", 
        rating: 4.8,
        pricing: {
          chat: "Not Available",
          audio: "Not Available",
          video: "Not Available",
          inPerson: "₹400/hour"
        },
        startingPrice: "₹400/hour"
      },
    ]
  },
  {
    category: "Emotional Well-being & Mindfulness",
    title: "Wellness & Mindfulness",
    description: "Mental wellness and mindfulness practices for inner peace",
    icon: Flower,
    gradient: "from-teal-500 via-green-400 to-emerald-500",
    accentColor: "text-teal-600",
    bgPattern: "wellness",
    services: [

      { 
        skill: "Life reflections sharing", 
        icon: Heart, 
        demand: "Medium", 
        rating: 4.6,
        pricing: {
          chat: "₹12/min",
          audio: "₹16/min",
          video: "₹19/min",
          inPerson: "₹800/session"
        },
        startingPrice: "₹12/min"
      },
      { 
        skill: "Bucket list planning buddy", 
        icon: Target, 
        demand: "Medium", 
        rating: 4.5,
        pricing: {
          chat: "₹13/min",
          audio: "₹17/min",
          video: "₹20/min",
          inPerson: "₹900/session"
        },
        startingPrice: "₹13/min"
      }
    ]
  },
  {
  category: "Political & Social Discussions",
  title: "Political Conversations",
  description: "Engaging and neutral conversations on Indian political personalities and social topics",
  icon: Megaphone,
  gradient: "from-red-400 via-orange-400 to-yellow-500",
  accentColor: "text-red-600",
  bgPattern: "discussion",
  services: [
    { 
      skill: "Discussion on Modi - Politics",
      icon: MessageCircle,
      demand: "High",
      rating: 4.7,
      pricing: {
        chat: "₹10/min",
        audio: "₹18/min",
        video: "₹22/min",
        inPerson: "₹1000/session"
      },
      startingPrice: "₹10/min"
    },
    { 
      skill: "Discussion on Rahul Gandhi - Politics",
      icon: MessageCircle,
      demand: "Medium",
      rating: 4.6,
      pricing: {
        chat: "₹10/min",
        audio: "₹17/min",
        video: "₹21/min",
        inPerson: "₹900/session"
      },
      startingPrice: "₹10/min"
    },
    { 
      skill: "Discussion on Mamta Banerjee - Politics",
      icon: MessageCircle,
      demand: "Medium",
      rating: 4.5,
      pricing: {
        chat: "₹10/min",
        audio: "₹17/min",
        video: "₹20/min",
        inPerson: "₹900/session"
      },
      startingPrice: "₹10/min"
    },
    { 
      skill: "Discussion on Saas-Bahu topic - Politics",
      icon: Users,
      demand: "High",
      rating: 4.8,
      pricing: {
        chat: "₹10/min",
        audio: "₹16/min",
        video: "₹20/min",
        inPerson: "₹800/session"
      },
      startingPrice: "₹10/min"
    }
  ]
}

];

export default serviceCategories;
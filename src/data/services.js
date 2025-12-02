import { Heart, Music, BookOpen, Megaphone, Trophy, Gamepad2, GraduationCap, ChefHat, Users, Flower, MessageCircle, Target, Mic, Globe, Coffee, Headphones, Guitar, Piano, Palette, Pen, Theater, Clock, Brain, Lightbulb, Dumbbell, Move, Home, Car, MapPin, Camera, Gamepad, Laptop, Book, Utensils, TreePine, ShoppingCart, Shirt, Package, Paintbrush, PartyPopper, Film, Tv, Building, Church, Wedding } from 'lucide-react';
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
      { skill: "Active listening", icon: MessageCircle, demand: "High", price: "₹500/hour", rating: 4.9 },
      { skill: "Empathy training", icon: Heart, demand: "High", price: "₹800/session", rating: 4.8 },
      { skill: "Motivational speaking", icon: Target, demand: "Medium", price: "₹1500/session", rating: 4.8 },
      { skill: "Public speaking", icon: Mic, demand: "Medium", price: "₹900/session", rating: 4.7 },
      { skill: "Cross-cultural communication", icon: Globe, demand: "High", price: "₹800/hour", rating: 4.6 },
      { skill: "Stress counseling (non-clinical)", icon: Coffee, demand: "High", price: "₹700/session", rating: 4.8 },
      { skill: "Break-up support", icon: Heart, demand: "Medium", price: "₹700/session", rating: 4.6 },
      { skill: "Conversational English practice", icon: MessageCircle, demand: "High", price: "₹400/hour", rating: 4.7 }
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
  { skill: "Amateur photography", icon: Camera, demand: "Medium", price: "₹700/hour", rating: 4.6 },
  { skill: "Storytelling for kids", icon: BookOpen, demand: "High", price: "₹600/hour", rating: 4.9 },
  { skill: "Singing (Bollywood songs)", icon: Headphones, demand: "High", price: "₹800/hour", rating: 4.9 },
  { skill: "Poetry recitation (Hindi/Urdu/Kavita)", icon: Book, demand: "Medium", price: "₹500/hour", rating: 4.8 },
  { skill: "Theatre/acting games", icon: Theater, demand: "Medium", price: "₹700/hour", rating: 4.7 },
  { skill: "Sketching & doodling", icon: Pen, demand: "Medium", price: "₹500/hour", rating: 4.5 },
  { skill: "Calligraphy", icon: Pen, demand: "Low", price: "₹600/hour", rating: 4.7 },
  { skill: "Guitar playing", icon: Guitar, demand: "High", price: "₹900/hour", rating: 4.7 }
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
      { skill: "Reading books aloud", icon: Book, demand: "High", price: "₹500/hour", rating: 4.9 },
      { skill: "History talks (Indian history)", icon: Clock, demand: "Medium", price: "₹800/session", rating: 4.7 },
      { skill: "Mythology storytelling (Ramayana/Mahabharata)", icon: BookOpen, demand: "High", price: "₹600/session", rating: 4.8 },
      { skill: "Current affairs discussion", icon: BookOpen, demand: "High", price: "₹600/hour", rating: 4.6 },
      { skill: "Spirituality talks", icon: Heart, demand: "Medium", price: "₹700/session", rating: 4.8 },
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
      { skill: "Carrom partner", icon: Target, demand: "High", price: "₹300/hour", rating: 4.7 },
      { skill: "Table tennis partner", icon: Trophy, demand: "High", price: "₹500/hour", rating: 4.6 },
      { skill: "Badminton partner", icon: Trophy, demand: "High", price: "₹600/hour", rating: 4.7 },
      { skill: "Cricket net practice buddy", icon: Trophy, demand: "High", price: "₹700/hour", rating: 4.8 },
      { skill: "Football buddy", icon: Trophy, demand: "High", price: "₹600/hour", rating: 4.6 },
      { skill: "Volleyball partner", icon: Trophy, demand: "Medium", price: "₹500/hour", rating: 4.6 },
      { skill: "Kabaddi partner", icon: Dumbbell, demand: "Medium", price: "₹600/hour", rating: 4.4 },
      { skill: "Running/jogging companion", icon: Move, demand: "High", price: "₹400/hour", rating: 4.8 },
      { skill: "Cycling buddy", icon: Move, demand: "Medium", price: "₹500/hour", rating: 4.6 },
      { skill: "Yoga partner", icon: Flower, demand: "High", price: "₹700/session", rating: 4.9 },
      { skill: "Meditation guide", icon: Flower, demand: "High", price: "₹600/session", rating: 4.8 },
      { skill: "Zumba fitness partner", icon: Move, demand: "High", price: "₹600/hour", rating: 4.7 },
      { skill: "Walking companion", icon: Move, demand: "High", price: "₹300/hour", rating: 4.8 }
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
      { skill: "Ludo/Snakes & ladders/Monopoly", icon: Gamepad, demand: "High", price: "₹200/hour", rating: 4.8 },
      { skill: "Cards (Rummy, UNO)", icon: Gamepad, demand: "High", price: "₹300/hour", rating: 4.7 },
      { skill: "Scrabble", icon: BookOpen, demand: "Medium", price: "₹350/hour", rating: 4.6 },
      { skill: "Puzzles (Sudoku, logic)", icon: Brain, demand: "Medium", price: "₹300/hour", rating: 4.5 },
      { skill: "Gaming (PlayStation/Xbox)", icon: Gamepad2, demand: "High", price: "₹500/hour", rating: 4.8 },
      { skill: "PC gaming (FIFA, Counter-Strike)", icon: Laptop, demand: "High", price: "₹600/hour", rating: 4.7 }
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
      { skill: "Computer basics", icon: Laptop, demand: "High", price: "₹700/hour", rating: 4.7 },
      { skill: "MS Office training", icon: Laptop, demand: "High", price: "₹800/hour", rating: 4.6 },
      { skill: "Smartphone literacy for elders", icon: Gamepad, demand: "High", price: "₹500/hour", rating: 4.9 },
      { skill: "Social media basics", icon: Globe, demand: "High", price: "₹400/hour", rating: 4.6 },
      { skill: "Digital payments guidance", icon: Laptop, demand: "High", price: "₹400/hour", rating: 4.8 },
      { skill: "Resume writing help", icon: Pen, demand: "Medium", price: "₹800/session", rating: 4.7 },
      { skill: "Job interview practice", icon: MessageCircle, demand: "Medium", price: "₹900/session", rating: 4.6 },
      { skill: "Public speaking practice", icon: Mic, demand: "Medium", price: "₹800/session", rating: 4.7 },
      { skill: "Financial literacy basics", icon: BookOpen, demand: "Medium", price: "₹700/session", rating: 4.5 },
      { skill: "Goal setting & planning", icon: Target, demand: "Medium", price: "₹800/session", rating: 4.6 },
    ]
  },
  {
    category: "Lifestyle & Practical Help",
    title: "Lifestyle & Home Support",
    description: "Practical lifestyle assistance and home management support",
    icon: <ChefHat className="w-8 h-8" />,
    gradient: "from-amber-500 via-orange-400 to-red-500",
    accentColor: "text-amber-600",
    bgPattern: "lifestyle",
    services: [
      { skill: "Cooking simple Indian meals", icon: "🍛", demand: "High", price: "₹800/session", rating: 4.8 },
      { skill: "Baking cakes/cookies", icon: "🧁", demand: "Medium", price: "₹700/session", rating: 4.7 },
      { skill: "Tea/coffee making rituals", icon: "☕", demand: "High", price: "₹300/hour", rating: 4.9 },
      { skill: "Gardening basics", icon: "🌱", demand: "Medium", price: "₹500/hour", rating: 4.6 },
      { skill: "Pet care & dog walking", icon: "🐕", demand: "High", price: "₹400/hour", rating: 4.8 },
      { skill: "Grocery shopping companion", icon: "🛒", demand: "High", price: "₹300/hour", rating: 4.7 },
      { skill: "Wardrobe organizing", icon: "👗", demand: "Medium", price: "₹600/session", rating: 4.6 },
      { skill: "Decluttering coach", icon: "📦", demand: "Medium", price: "₹700/session", rating: 4.5 },
      { skill: "Home decoration ideas", icon: "🏡", demand: "Medium", price: "₹800/session", rating: 4.6 },
      { skill: "Festival celebration guide (Diwali, Holi)", icon: "🪔", demand: "High", price: "₹600/hour", rating: 4.8 }
    ]
  },
  {
    category: "Social & Cultural Engagement",
    title: "Social & Cultural Activities",
    description: "Cultural engagement and social companionship services",
    icon: <Users className="w-8 h-8" />,
    gradient: "from-rose-500 via-pink-400 to-purple-500",
    accentColor: "text-rose-600",
    bgPattern: "cultural",
    services: [
      { skill: "Bollywood dance", icon: "💃", demand: "High", price: "₹800/hour", rating: 4.8 },
      { skill: "Folk dance (Bhangra, Garba)", icon: "🎉", demand: "High", price: "₹700/hour", rating: 4.8 },
      { skill: "Karaoke nights", icon: "🎤", demand: "High", price: "₹600/hour", rating: 4.7 },
      { skill: "Movie discussion club", icon: "🎬", demand: "High", price: "₹400/hour", rating: 4.6 },
      { skill: "TV serial gossip", icon: "📺", demand: "High", price: "₹300/hour", rating: 4.5 },
      { skill: "Museum companion", icon: "🏛️", demand: "Medium", price: "₹500/hour", rating: 4.5 },
      { skill: "Temple/mosque/gurudwara companion", icon: "🙏", demand: "High", price: "₹400/hour", rating: 4.8 },
    ]
  },
  {
    category: "Emotional Well-being & Mindfulness",
    title: "Wellness & Mindfulness",
    description: "Mental wellness and mindfulness practices for inner peace",
    icon: <Flower className="w-8 h-8" />,
    gradient: "from-teal-500 via-green-400 to-emerald-500",
    accentColor: "text-teal-600",
    bgPattern: "wellness",
    services: [
      { skill: "Life reflections sharing", icon: "💭", demand: "Medium", price: "₹500/session", rating: 4.6 },
      { skill: "Bucket list planning buddy", icon: "📋", demand: "Medium", price: "₹600/session", rating: 4.5 }
    ]
  },
  {
  category: "Political & Social Discussions",
  title: "Political Conversation & Social Debates",
  description: "Neutral and engaging conversations on Indian political personalities and social topics",
  icon: <Megaphone className="w-8 h-8" />,
  gradient: "from-red-500 via-orange-400 to-yellow-500",
  accentColor: "text-red-600",
  bgPattern: "debate",
  services: [
    { 
      skill: "Discussion on Modi - Politics", 
      icon: "🗳️", 
      demand: "High", 
      price: "₹500/hour", 
      rating: 4.7 
    },
    { 
      skill: "Discussion on Rahul Gandhi - Politics", 
      icon: "📣", 
      demand: "Medium", 
      price: "₹450/hour", 
      rating: 4.6 
    },
    { 
      skill: "Discussion on Mamta Banerjee - Politics", 
      icon: "🏛️", 
      demand: "Medium", 
      price: "₹450/hour", 
      rating: 4.5 
    },
    { 
      skill: "Discussion on Saas Bahu topic - Politics", 
      icon: "👩‍👩‍👧", 
      demand: "High", 
      price: "₹400/hour", 
      rating: 4.8 
    }
  ]
},

];

export default serviceCategories;
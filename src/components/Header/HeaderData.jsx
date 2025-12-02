import { User, Wallet, Home, Share2, Settings } from 'lucide-react';


export const DUMMY_PROVIDERS = [
  'Jashvik S', 'Kartik A', 'Shaurya S', 'Bharat B',
  'Sonu A', 'Rohit K', 'Akash G', 'Permish M', 'Sumit S',
  'Vijay K', 'Prithvi A', 'Ayush K', 'Ajay M', 'Abhishek C',
  'Veer P', 'Rakesh K', 'Mansi S', 'Anamika S', 'Amita D', 'Anshikha B', 'Tara M', 'Janvi S', 'Anjali D', 'Veronica K', 'Sushmita D'
];

export const ALL_SERVICES = [
   "Active listening",
  "Smartphone literacy for elders",
  "Know your city",
  "Amateur photography",
  "Digital payments guidance",
  "Ludo / Snakes & Ladder / Monopoly",
  "Computer basics",
  "MS Office training",
  "Tea/coffee making rituals",
  "Empathy training",
  "Stress counseling (non-clinical)",
  "Grocery shopping companion",
  "Temple/mosque/gurudwara companion",
  "Break-up support",
  "Resume writing help",
  "Job interview practice",
  "Cooking simple Indian meals",
  "Motivational speaking",
  "Walking companion",
  "Financial literacy basics",
  "Goal setting & planning",
  "Social media basics",
  "Public speaking",
  "Wardrobe organizing",
  "Public speaking practice",
  "Bucket list planning buddy",
  "Storytelling for kids",
  "Spirituality talks",
  "Cycling buddy",
  "Conversational English practice",
  "Reading books aloud",
  "Mythology storytelling (Ramayana/Mahabharata)",
  "Cards (Rummy, UNO)",
  "Museum companion",
  "Life reflections sharing",
  "Cricket net practice buddy",
  "Badminton partner",
  "Cross-cultural communication",
  "Singing (Bollywood songs)",
  "Carrom partner",
  "Festival celebration guide (Diwali, Holi)",
  "Home decoration ideas",
  "Movie discussion club",
  "Kabaddi partner",
  "Running/jogging companion",
  "Poetry recitation (Hindi/Urdu/Kavita)",
  "Table tennis partner",
  "Karaoke nights",
  "Theatre/acting games",
  "Yoga partner",
  "History talks (Indian history)",
  "Gaming (PlayStation/Xbox)",
  "Sketching & doodling",
  "Baking cakes/cookies",
  "Current affairs discussion",
  "Calligraphy",
  "Zumba fitness partner",
  "Scrabble",
  "Puzzles (Sudoku, logic)",
  "Gardening basics",
  "Pet care & dog walking",
  "Bollywood dance",
  "Football buddy",
  "Volleyball partner",
  "PC gaming (FIFA, Counter-Strike)",
  "Folk dance (Bhangra, Garba)",
  "TV serial gossip",
  "Guitar playing",
  'Discussion on Modi - Politics',
  'Discussion on Rahul Gandhi - Politics',
  'Discussion on Mamta Banerjee - Politics',
  'Discussion on Saas Bahu topic - Politics'
];

const BASE_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'services', label: 'Meet Happiness Executive', icon: User, href: '/services' },
  { id: 'getservices', label: 'Services', icon: Settings, href: '/home' },
];

const WALLET_ITEM = { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/wallet' };

export const NAV_ITEMS = (isLoggedIn) => {
  if (isLoggedIn) {
    return [BASE_NAV_ITEMS[0], WALLET_ITEM, ...BASE_NAV_ITEMS.slice(1)];
  }
  return BASE_NAV_ITEMS;
};
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

const testimonials = [
  // CALL REVIEWS
  {
    id: 1,
    mobile: "+91 9876543482",
    rating: 5,
    text: "Being in my early 20s, loneliness hits hard sometimes. Today I booked a call just hoping to get a little support. But I got way more than that — I got comfort and genuine understanding. The executive listened to my stress, my overthinking, my confusion about life. They didn't dismiss anything. They responded with warmth and maturity that felt safe. For the first time, I felt understood without pressure or judgement. We talked about self-worth, goals and handling anxiety. The call left me lighter, stronger and calmer. I will definitely come back again whenever I need emotional grounding. A truly supportive experience.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 2,
    mobile: "+91 9876543917",
    rating: 5,
    text: "The call felt incredibly comforting and warm. I could finally express things I've been holding inside for so long. Such gentle support.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 3,
    mobile: "+91 9876543650",
    rating: 5,
    text: "Beautiful experience. The conversation brought real emotional relief. Felt understood from the very first minute.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 4,
    mobile: "+91 9876543233",
    rating: 5,
    text: "I could talk freely without hesitation. Warm tone, kind words, and a healing conversation.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },
  {
    id: 5,
    mobile: "+91 9876543901",
    rating: 5,
    text: "The call gave me clarity during a stressful moment. Truly grateful for this support.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "teal"
  },
  {
    id: 6,
    mobile: "+91 9876543574",
    rating: 5,
    text: "This call genuinely touched my heart. I didn't feel rushed or judged for even a moment. Every response felt thoughtful and filled with sincerity. I felt emotionally safe while sharing difficult thoughts. By the end, my entire mindset felt calmer and clearer. It was the kind of support I didn't know I needed. Such a deeply comforting experience.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "orange"
  },
  {
    id: 7,
    mobile: "+91 9876543118",
    rating: 5,
    text: "The warmth in their voice made me feel at ease immediately. Wonderful support.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 8,
    mobile: "+91 9876543742",
    rating: 5,
    text: "A peaceful, grounding call. Exactly what I needed today.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 9,
    mobile: "+91 9876543385",
    rating: 5,
    text: "Kind, patient and understanding. A very healing conversation.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 10,
    mobile: "+91 9876543990",
    rating: 5,
    text: "Incredibly soothing call. I felt lighter afterward.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },
  {
    id: 11,
    mobile: "+91 9876543264",
    rating: 5,
    text: "This was a deeply supportive call. I was able to open up without fear. Their tone was calm and comforting. The conversation helped me organize my thoughts. I truly felt heard and understood. A wonderful emotional experience.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "teal"
  },
  {
    id: 12,
    mobile: "+91 9876543579",
    rating: 5,
    text: "Great conversation. Their calmness helped settle my mind.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "orange"
  },
  {
    id: 13,
    mobile: "+91 9876543426",
    rating: 5,
    text: "Filled with warmth and empathy. Perfect emotional support.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 14,
    mobile: "+91 9876543815",
    rating: 5,
    text: "Not once did I feel judged. That meant a lot to me.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 15,
    mobile: "+91 9876543002",
    rating: 5,
    text: "The tone, the patience, the understanding — everything felt perfect.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 16,
    mobile: "+91 9876543137",
    rating: 5,
    text: "This call brought me a sense of peace I haven't felt in a long time. They listened with real sincerity. The conversation felt honest and genuine. I felt encouraged just by being heard. A wonderful and calming experience. Truly thankful.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },
  {
    id: 17,
    mobile: "+91 9876543921",
    rating: 5,
    text: "Lovely conversation. Helped me settle my feelings.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "teal"
  },
  {
    id: 18,
    mobile: "+91 9876543330",
    rating: 5,
    text: "Thoughtful responses and calm guidance. Truly helpful.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "orange"
  },
  {
    id: 19,
    mobile: "+91 9876543556",
    rating: 5,
    text: "The comfort I received cannot be explained in words.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 20,
    mobile: "+91 9876543784",
    rating: 5,
    text: "Gentle, warm and reassuring. Exactly the conversation I needed.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 21,
    mobile: "+91 9876543049",
    rating: 5,
    text: "A very meaningful call. I spoke openly for the first time in weeks. They listened with complete patience. Every response felt soothing. My thoughts felt clearer by the end of it. It felt like emotional support in its purest form. Deeply grateful.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 22,
    mobile: "+91 9876543610",
    rating: 5,
    text: "A very calming voice. I felt understood immediately.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },
  {
    id: 23,
    mobile: "+91 9876543827",
    rating: 5,
    text: "Great support. Helped me think more clearly.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "teal"
  },
  {
    id: 24,
    mobile: "+91 9876543294",
    rating: 5,
    text: "Beautifully comforting call. I felt lighter.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "orange"
  },
  {
    id: 25,
    mobile: "+91 9876543965",
    rating: 5,
    text: "Supportive interaction. Made me feel emotionally stable again.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 26,
    mobile: "+91 9876543502",
    rating: 5,
    text: "I came into the call with a heavy heart. But the conversation slowly soothed my emotions. Every word felt respectful and kind. They didn't try to 'fix' me — they just listened. That alone gave me so much relief. A truly healing experience.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 27,
    mobile: "+91 9876543778",
    rating: 5,
    text: "Very supportive call. Helped me calm my thoughts.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 28,
    mobile: "+91 9876543411",
    rating: 5,
    text: "Kind voice and thoughtful replies. Loved the experience.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },
  {
    id: 29,
    mobile: "+91 9876543069",
    rating: 5,
    text: "I left the call with a peaceful mind.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "teal"
  },
  {
    id: 30,
    mobile: "+91 9876543854",
    rating: 5,
    text: "Warm, gentle and easy to talk to.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "orange"
  },
  {
    id: 31,
    mobile: "+91 9876543723",
    rating: 5,
    text: "This call made me feel safe enough to open up completely. They handled every emotion with such care. I didn't expect to feel such relief afterward. It felt like someone genuinely cared about my wellbeing. I'm thankful for every moment of this conversation. It truly helped me regain emotional balance. Wonderful support.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 32,
    mobile: "+91 9876543590",
    rating: 5,
    text: "Very grounding call. I felt supported all through.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 33,
    mobile: "+91 9876543347",
    rating: 5,
    text: "A truly comforting conversation. Helped me breathe easier.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 34,
    mobile: "+91 9876543481",
    rating: 5,
    text: "The call eased my anxiety beautifully.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },
  {
    id: 35,
    mobile: "+91 9876543162",
    rating: 5,
    text: "Very kind and patient listener.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "teal"
  },
  {
    id: 36,
    mobile: "+91 9876543834",
    rating: 5,
    text: "Warm, calming and emotionally uplifting.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "orange"
  },
  {
    id: 37,
    mobile: "+91 9876543209",
    rating: 5,
    text: "I felt understood in minutes. Great experience.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "blue"
  },
  {
    id: 38,
    mobile: "+91 9876543951",
    rating: 5,
    text: "Beautifully handled conversation. Very comforting.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "emerald"
  },
  {
    id: 39,
    mobile: "+91 9876543628",
    rating: 5,
    text: "It felt good to finally talk openly. Great support.",
    avatar: "👨",
    service: "Emotional Support Call",
    color: "purple"
  },
  {
    id: 40,
    mobile: "+91 9876543782",
    rating: 5,
    text: "Very satisfied with the call. Deeply comforting.",
    avatar: "👩",
    service: "Emotional Support Call",
    color: "indigo"
  },

  // CHAT REVIEWS
  {
    id: 41,
    mobile: "+91 9876543178",
    rating: 5,
    text: "The chat felt incredibly supportive. Warm words that soothed me instantly.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 42,
    mobile: "+91 9876543856",
    rating: 5,
    text: "Very thoughtful responses. Felt emotionally lighter afterward.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 43,
    mobile: "+91 9876543492",
    rating: 5,
    text: "Kind, patient and comforting messages.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 44,
    mobile: "+91 9876543934",
    rating: 5,
    text: "I felt understood through every reply.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },
  {
    id: 45,
    mobile: "+91 9876543310",
    rating: 5,
    text: "Lovely chat. Very respectful and warm.",
    avatar: "👨",
    service: "Chat Support",
    color: "purple"
  },
  {
    id: 46,
    mobile: "+91 9876543667",
    rating: 5,
    text: "The chat felt surprisingly healing. Every reply was gentle and sincere. I could express myself without fear. Their words gave me emotional grounding. I genuinely felt supported. Wonderful experience.",
    avatar: "👩",
    service: "Chat Support",
    color: "indigo"
  },
  {
    id: 47,
    mobile: "+91 9876543504",
    rating: 5,
    text: "The chat eased my stress quickly.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 48,
    mobile: "+91 9876543829",
    rating: 5,
    text: "Warm and thoughtful messages.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 49,
    mobile: "+91 9876543256",
    rating: 5,
    text: "Felt respected and heard.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 50,
    mobile: "+91 9876543702",
    rating: 5,
    text: "Comforting words when I needed them most.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },
  {
    id: 51,
    mobile: "+91 9876543381",
    rating: 5,
    text: "The chat felt like a safe corner in a chaotic day. They replied with patience and clarity. I didn't feel judged for anything I shared. Each message was warm and reassuring. I left feeling calmer and emotionally lighter. Great experience overall. Highly satisfied.",
    avatar: "👨",
    service: "Chat Support",
    color: "purple"
  },
  {
    id: 52,
    mobile: "+91 9876543118",
    rating: 5,
    text: "Beautiful support through text. Felt calming.",
    avatar: "👩",
    service: "Chat Support",
    color: "indigo"
  },
  {
    id: 53,
    mobile: "+91 9876543946",
    rating: 5,
    text: "Genuine and thoughtful replies.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 54,
    mobile: "+91 9876543503",
    rating: 5,
    text: "I felt emotionally supported throughout.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 55,
    mobile: "+91 9876543879",
    rating: 5,
    text: "Great clarity and comfort.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 56,
    mobile: "+91 9876543624",
    rating: 5,
    text: "I never thought chatting could feel this comforting. Their tone was warm and respectful. They understood even the feelings I couldn't express properly. Each response felt human, not mechanical. I genuinely felt lighter by the end. It was a strong emotional support session. Thank you.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },
  {
    id: 57,
    mobile: "+91 9876543795",
    rating: 5,
    text: "Wonderful chat experience.",
    avatar: "👨",
    service: "Chat Support",
    color: "purple"
  },
  {
    id: 58,
    mobile: "+91 9876543340",
    rating: 5,
    text: "Very reassuring messages.",
    avatar: "👩",
    service: "Chat Support",
    color: "indigo"
  },
  {
    id: 59,
    mobile: "+91 9876543051",
    rating: 5,
    text: "Warm and gentle support.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 60,
    mobile: "+91 9876543627",
    rating: 5,
    text: "I felt emotionally safe typing everything out.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 61,
    mobile: "+91 9876543956",
    rating: 5,
    text: "Such a supportive conversation. They responded with thoughtfulness and care. I didn't feel alone while chatting. The words helped me calm down during a rough moment. Very comforting experience. Highly recommended.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 62,
    mobile: "+91 9876543703",
    rating: 5,
    text: "Lovely chat interaction. Very warm.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },
  {
    id: 63,
    mobile: "+91 9876543462",
    rating: 5,
    text: "Kind words that helped ease my anxiety.",
    avatar: "👨",
    service: "Chat Support",
    color: "purple"
  },
  {
    id: 64,
    mobile: "+91 9876543831",
    rating: 5,
    text: "Supportive, calm and comforting.",
    avatar: "👩",
    service: "Chat Support",
    color: "indigo"
  },
  {
    id: 65,
    mobile: "+91 9876543209",
    rating: 5,
    text: "Helped me think more clearly.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 66,
    mobile: "+91 9876543574",
    rating: 5,
    text: "I felt heard and valued.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 67,
    mobile: "+91 9876543641",
    rating: 5,
    text: "Soothing messages throughout.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 68,
    mobile: "+91 9876543922",
    rating: 5,
    text: "The chat gave me mental peace.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },
  {
    id: 69,
    mobile: "+91 9876543451",
    rating: 5,
    text: "Very gentle and reassuring.",
    avatar: "👨",
    service: "Chat Support",
    color: "purple"
  },
  {
    id: 70,
    mobile: "+91 9876543803",
    rating: 5,
    text: "Beautiful conversation. Felt good.",
    avatar: "👩",
    service: "Chat Support",
    color: "indigo"
  },
  {
    id: 71,
    mobile: "+91 9876543334",
    rating: 5,
    text: "Kind and thoughtful replies.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 72,
    mobile: "+91 9876543970",
    rating: 5,
    text: "Messages were calming and respectful.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 73,
    mobile: "+91 9876543568",
    rating: 5,
    text: "I felt emotionally supported.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 74,
    mobile: "+91 9876543749",
    rating: 5,
    text: "Warm tone in every message.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },
  {
    id: 75,
    mobile: "+91 9876543617",
    rating: 5,
    text: "Lovely interaction. Felt lighter afterward.",
    avatar: "👨",
    service: "Chat Support",
    color: "purple"
  },
  {
    id: 76,
    mobile: "+91 9876543284",
    rating: 5,
    text: "Comforting words. Great support.",
    avatar: "👩",
    service: "Chat Support",
    color: "indigo"
  },
  {
    id: 77,
    mobile: "+91 9876543900",
    rating: 5,
    text: "I felt understood through the chat.",
    avatar: "👨",
    service: "Chat Support",
    color: "teal"
  },
  {
    id: 78,
    mobile: "+91 9876543413",
    rating: 5,
    text: "Very soothing. Loved the chat.",
    avatar: "👩",
    service: "Chat Support",
    color: "orange"
  },
  {
    id: 79,
    mobile: "+91 9876543735",
    rating: 5,
    text: "Respectful and comforting.",
    avatar: "👨",
    service: "Chat Support",
    color: "blue"
  },
  {
    id: 80,
    mobile: "+91 9876543286",
    rating: 5,
    text: "Beautiful support through text.",
    avatar: "👩",
    service: "Chat Support",
    color: "emerald"
  },

  // IN-PERSON VISIT REVIEWS
  {
    id: 81,
    mobile: "+91 9876543441",
    rating: 5,
    text: "Very calm and warm presence. Loved the respectful interaction.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "purple"
  },
  {
    id: 82,
    mobile: "+91 9876543872",
    rating: 5,
    text: "Felt very safe and supported throughout.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "indigo"
  },
  {
    id: 83,
    mobile: "+91 9876543503",
    rating: 5,
    text: "Great companionship. Helped me feel emotionally lighter.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "teal"
  },
  {
    id: 84,
    mobile: "+91 9876543934",
    rating: 5,
    text: "The visit meant more to me than expected.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "orange"
  },
  {
    id: 85,
    mobile: "+91 9876543268",
    rating: 5,
    text: "Kind, gentle and warm company.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "blue"
  },
  {
    id: 86,
    mobile: "+91 9876543791",
    rating: 5,
    text: "The in-person session felt deeply comforting. There was honesty and warmth in every moment. I felt relaxed and emotionally supported. We talked, walked and shared thoughts freely. Not once did I feel uncomfortable or rushed. The presence itself felt healing. A truly refreshing experience.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "emerald"
  },
  {
    id: 87,
    mobile: "+91 9876543320",
    rating: 5,
    text: "Beautiful companionship. Very comforting presence.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "purple"
  },
  {
    id: 88,
    mobile: "+91 9876543604",
    rating: 5,
    text: "I felt emotionally connected and supported.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "indigo"
  },
  {
    id: 89,
    mobile: "+91 9876543447",
    rating: 5,
    text: "Wonderful interaction. Very respectful.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "teal"
  },
  {
    id: 90,
    mobile: "+91 9876543982",
    rating: 5,
    text: "Peaceful and uplifting visit.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "orange"
  },
  {
    id: 91,
    mobile: "+91 9876543739",
    rating: 5,
    text: "The visit was filled with warmth and positivity. We spoke openly and comfortably. Their presence made me feel lighter. Such genuine companionship is rare today. I felt emotionally relieved afterward. Very grateful.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "blue"
  },
  {
    id: 92,
    mobile: "+91 9876543215",
    rating: 5,
    text: "Calm, warm and soothing presence.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "emerald"
  },
  {
    id: 93,
    mobile: "+91 9876543681",
    rating: 5,
    text: "Lovely company. Felt at ease the whole time.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "purple"
  },
  {
    id: 94,
    mobile: "+91 9876543530",
    rating: 5,
    text: "Beautiful and respectful interaction.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "indigo"
  },
  {
    id: 95,
    mobile: "+91 9876543024",
    rating: 5,
    text: "The visit brought peace to my day.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "teal"
  },
  {
    id: 96,
    mobile: "+91 9876543867",
    rating: 5,
    text: "Very comforting presence in person. The conversation flowed naturally and easily. I felt emotionally safe and respected. Their kindness showed in every gesture. It truly felt like meaningful companionship. I left feeling refreshed and hopeful. Highly satisfied.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "orange"
  },
  {
    id: 97,
    mobile: "+91 9876543411",
    rating: 5,
    text: "A warm and peaceful meeting.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "blue"
  },
  {
    id: 98,
    mobile: "+91 9876543990",
    rating: 5,
    text: "Amazing experience. Very calming presence.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "emerald"
  },
  {
    id: 99,
    mobile: "+91 9876543773",
    rating: 5,
    text: "Felt supported and understood.",
    avatar: "👨",
    service: "In-Person Companion",
    color: "purple"
  },
  {
    id: 100,
    mobile: "+91 9876543652",
    rating: 5,
    text: "A truly comforting visit. Loved the experience.",
    avatar: "👩",
    service: "In-Person Companion",
    color: "indigo"
  }
];

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(1);
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };


  const maskNumber = (num) => {
    if (!num) return "";
    return num.slice(0, -4).replace(/[0-9]/g, "*") + num.slice(-4);
  };


  return (
 <section
  id="testimonials"
  className="py-4 lg:py-4 bg-white"
>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">

    {/* Header */}
    <div className="mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center lg:text-left">
        Genuine Experiences
      </h2>

      <p className="text-gray-900 mt-2 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
        Discover how our services have made a difference in the lives of families across the community.
      </p>
    </div>

    {/* Carousel */}
    <div className="relative mb-16">

      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#F0F0F0] hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 border border-gray-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#F0F0F0] hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 border border-gray-200"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div
                className={`grid gap-6 ${
                  itemsPerSlide === 1
                    ? "grid-cols-1"
                    : itemsPerSlide === 2
                    ? "grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {testimonials
                  .slice(
                    slideIndex * itemsPerSlide,
                    (slideIndex + 1) * itemsPerSlide
                  )
                  .map((testimonial) => (
                    <article
                      key={testimonial.id}
                      className="bg-[#F0F0F0] border-2 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      onMouseEnter={() => setIsAutoPlaying(false)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>

                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm">
                          <Quote className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Service Badge */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border bg-white">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                          {testimonial.service}
                        </span>
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-gray-700 mb-6 text-sm leading-relaxed italic">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white flex-shrink-0 bg-gray-700">
                          {testimonial.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-300 shadow-sm text-xs tracking-wide font-medium">
                              {maskNumber(testimonial.mobile)}
                            </span>
                          </p>

                          <p className="text-gray-500 text-xs">
                            Verified Customer
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-gray-800" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  </div>
</section>

  );
};

export default TestimonialsSection;
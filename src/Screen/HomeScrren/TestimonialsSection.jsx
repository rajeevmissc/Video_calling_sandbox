import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

const testimonials = [
  {
    id: 1,
    mobile: "+91 9123456780",
    rating: 5,
    text: "The Happiness Executive was a blessing during our family celebration. My elderly mother didn’t feel alone for a single moment — she had someone warm, attentive, and genuinely caring by her side.",
    avatar: "👩",
    service: "Event Companion",
    location: "Kolkata",
    color: "emerald"
  },
  {
    id: 2,
    mobile: "+91 9988776655",
    rating: 5,
    text: "Being a working parent is stressful, but the Happiness Executive who supported my children felt like an extension of our family. They listened, cared, and created a calm space for my kids after school.",
    avatar: "👨",
    service: "Childcare Companion",
    location: "Delhi",
    color: "blue"
  },
  {
    id: 3,
    mobile: "+91 9876543210",
    rating: 5,
    text: "We wanted someone who could bring warmth and creativity to our dinner evenings. The executive made the experience memorable with friendly conversation, beautiful support, and calm presence throughout.",
    avatar: "👩",
    service: "Home Companion Service",
    location: "Kolkata",
    color: "purple"
  },
  {
    id: 4,
    mobile: "+91 9234567890",
    rating: 5,
    text: "After my father's surgery, loneliness was affecting him more than the recovery. The Happiness Executive became his daily emotional anchor — someone who listened, talked, and truly cared.",
    avatar: "👨",
    service: "Elder Companionship",
    location: "Delhi",
    color: "orange"
  },
  {
    id: 5,
    mobile: "+91 9345678901",
    rating: 5,
    text: "The companionship sessions helped my daughter regain confidence. Her executive made learning fun, supported her emotionally, and encouraged her to express herself freely.",
    avatar: "👩",
    service: "Education Support Companion",
    location: "Faridabad",
    color: "indigo"
  },
  {
    id: 6,
    mobile: "+91 9456789012",
    rating: 5,
    text: "Long drives used to feel tiring and lonely. Now, the Happiness Executive makes every trip peaceful, engaging, and stress-free with warm conversation and thoughtful presence.",
    avatar: "👨",
    service: "Travel & Journey Companionship",
    location: "Gurgaon",
    color: "teal"
  },
  {
    id: 7,
    mobile: "+91 9876512340",
    rating: 5,
    text: "Living alone in a fast-moving city can feel overwhelming. My Happiness Executive became the one person I could talk to every evening without judgement.",
    avatar: "👩",
    service: "Daily Conversation Companion",
    location: "Kolkata",
    color: "purple"
  },
  {
    id: 8,
    mobile: "+91 9567843210",
    rating: 5,
    text: "My mother doesn’t trust easily, but our assigned Happiness Executive won her heart in the first session. She now waits for their visits like a friend she cherishes.",
    avatar: "👨",
    service: "Senior Emotional Support",
    location: "Delhi",
    color: "blue"
  },
  {
    id: 9,
    mobile: "+91 9348765120",
    rating: 5,
    text: "I was recovering from burnout and needed someone to help me feel grounded. The companion’s presence was soothing and supportive.",
    avatar: "👩",
    service: "Mental Wellness Companion",
    location: "Gurgaon",
    color: "indigo"
  },
  {
    id: 10,
    mobile: "+91 9456123098",
    rating: 5,
    text: "I booked a Happiness Executive for my grandmother’s temple visits. She felt safe, cared for, and accompanied with dignity.",
    avatar: "👨",
    service: "Travel Accompaniment",
    location: "Delhi NCR",
    color: "orange"
  },
  {
    id: 11,
    mobile: "+91 9786541230",
    rating: 5,
    text: "During my corporate conference trip, I felt anxious and alone. The companion provided calm presence and genuine emotional support.",
    avatar: "👩",
    service: "Corporate Travel Companion",
    location: "Noida",
    color: "blue"
  },
  {
    id: 12,
    mobile: "+91 9765432180",
    rating: 5,
    text: "I recently moved to a new city and had no one to talk to. My Happiness Executive made me feel instantly connected.",
    avatar: "👨",
    service: "Relocation Support Companion",
    location: "Kolkata",
    color: "indigo"
  },
  {
    id: 13,
    mobile: "+91 9890234511",
    rating: 5,
    text: "My son, who struggles with social anxiety, felt comfortable opening up to the companion. Their patience made all the difference.",
    avatar: "👩",
    service: "Youth Social Support",
    location: "Delhi",
    color: "blue"
  },
  {
    id: 14,
    mobile: "+91 9087654321",
    rating: 5,
    text: "I booked a session during a very lonely phase. The Happiness Executive spoke with such warmth and presence that I felt lighter instantly.",
    avatar: "👨",
    service: "Emotional Listening Session",
    location: "Gurgaon",
    color: "teal"
  },
  {
    id: 15,
    mobile: "+91 9234509876",
    rating: 5,
    text: "We arranged a companion for my father’s morning walks. He says it’s the best part of his day—someone to talk to and laugh with.",
    avatar: "👩",
    service: "Walking Companion",
    location: "Delhi NCR",
    color: "indigo"
  },
  {
    id: 16,
    mobile: "+91 9876001234",
    rating: 5,
    text: "Evenings used to feel empty after work. The companion helped me build a routine and feel emotionally refreshed.",
    avatar: "👨",
    service: "After-Work Companion",
    location: "Noida",
    color: "emerald"
  },
  {
    id: 17,
    mobile: "+91 9098765432",
    rating: 5,
    text: "The companion supported my mother during hospital follow-ups. Her mindset improved so much with emotional support.",
    avatar: "👩",
    service: "Medical Appointment Companion",
    location: "Delhi",
    color: "blue"
  },
  {
    id: 18,
    mobile: "+91 9123098765",
    rating: 5,
    text: "For months I struggled with long nights alone. A simple conversation with the companion brought comfort and clarity.",
    avatar: "👨",
    service: "Night-Time Emotional Support",
    location: "Kolkata",
    color: "purple"
  },
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

                        {/* UPDATED: ICON BOX WHITE */}
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
                            {testimonial.location} • Verified Customer
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
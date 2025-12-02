// // import { useState } from "react";

// // const faqs = [
// //   {
// //     question: "What is GetCompanion, and what do Happiness Executives do?",
// //     answer:
// //       "GetCompanion is a personal well-being, companionship, and emotional support service. Our trained Happiness Executives provide meaningful engagement, emotional comfort, and positive interactions through in-person visits, chat, audio calls, and video calls. Their goal is to help users feel supported, heard, and mentally refreshed."
// //   },

// //   {
// //     question: "What types of services does GetCompanion offer?",
// //     answer:
// //       "We offer a wide range of engagement and well-being services, including Emotional Support, Arts & Music sessions, Reading & Knowledge Sharing, Sports & Physical Activities, Games & Entertainment, Education & Skill Development, Lifestyle & Practical Help, Social & Cultural Engagement, and Mindfulness & Emotional Wellness."
// //   },

// //   {
// //     question: "What modes of interaction do you support?",
// //     answer:
// //       "You can choose your preferred way to connect with a Happiness Executive: In-Person Visit, Live Chat, Audio Call, or Video Call. This flexibility ensures support is available anytime, anywhere."
// //   },

// //   {
// //     question: "How does an In-Person Visit work?",
// //     answer:
// //       "After booking an in-person session, a Happiness Executive arrives at your chosen location at the scheduled time. They can engage in conversations, activities, reading, walks, games, or simply provide a comforting presence. All executives are verified and trained to ensure safety and professionalism."
// //   },

// //   {
// //     question: "How long are the sessions, and can I customize them?",
// //     answer:
// //       "Yes. Sessions usually range from 20 minutes to 2 hours, depending on the mode (chat, call, or visit). You can also customize the activities you want during your session—conversation, games, learning, meditation, emotional support, etc."
// //   },

// //   {
// //     question: "Is GetCompanion meant for seniors only?",
// //     answer:
// //       "No. GetCompanion is for anyone who needs emotional comfort, positive company, engagement activities, or simply wants someone to talk to. Our users include teenagers, working professionals, elderly individuals, parents, students, and anyone dealing with stress or loneliness."
// //   },

// //   {
// //     question: "Are Happiness Executives trained?",
// //     answer:
// //       "Yes. Every Happiness Executive undergoes training in communication, emotional support, active listening, empathy, mindfulness, basic safety practices, and various engagement activities. We ensure they can provide a safe and positive companionship experience."
// //   },

// //   {
// //     question: "How do I book a session?",
// //     answer:
// //       "You can book directly through our platform by selecting: (1) Your preferred mode—Visit, Chat, Audio, or Video, (2) The service category you want, and (3) The time slot. Once confirmed, your Happiness Executive will reach out or arrive on time."
// //   },

// //   {
// //     question: "Is my privacy protected?",
// //     answer:
// //       "Absolutely. All interactions—chat, calls, or visits—are completely private and confidential. We do NOT share your data with anyone. Your identity, conversations, preferences, and session details remain secure with end-to-end privacy standards."
// //   },

// //   {
// //     question: "Are Happiness Executives safe and verified?",
// //     answer:
// //       "Yes. Every executive undergoes background verification, identity checks, behavioral screening, and training before joining. Safety and trust are our highest priorities."
// //   },

// //   {
// //     question: "What can I talk about during the session?",
// //     answer:
// //       "Anything that brings you comfort—daily life, stress, work, relationships, personal goals, hobbies, emotions, or even simple casual conversations. Happiness Executives are trained to listen without judgment."
// //   },

// //   {
// //     question: "Can I choose a male or female Happiness Executive?",
// //     answer:
// //       "Yes. You may choose the gender you are most comfortable with for calls or visits. Your comfort and safety come first."
// //   },

// //   {
// //     question: "Is GetCompanion a counselling or therapy service?",
// //     answer:
// //       "No. We do not provide medical or psychological therapy. Our service is focused on companionship, emotional comfort, engagement activities, and general well-being support through trained Happiness Executives."
// //   },

// //   {
// //     question: "Can I book regular or recurring sessions?",
// //     answer:
// //       "Yes. Many users schedule daily or weekly sessions with the same Happiness Executive for consistency, comfort, and long-term wellness benefits."
// //   },

// //   {
// //     question: "Can the Happiness Executive accompany me outside?",
// //     answer:
// //       "Yes. During in-person sessions, they can accompany you for walks, cafes, shopping, events, reading outdoors, or social activities—depending on the time, location, and safety guidelines."
// //   }
// // ];


// // export default function FAQ() {
// //   const [openIndex, setOpenIndex] = useState(null);

// //   const toggleFAQ = (index) => {
// //     setOpenIndex(openIndex === index ? null : index);
// //   };

// //   return (
// //     <div className="max-w-5xl mx-auto py-12 px-6">
// //       <h2 className="text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</h2>
// //       <p className="text-center text-gray-600 mt-2">Answers to Common Inquiries About Our Services</p>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-8">
// //         {faqs.map((faq, index) => (
// //           <div key={index} className="border-b border-gray-300">
// //             <button
// //               className="w-full text-left flex justify-between items-center py-4 text-lg font-medium text-gray-800"
// //               onClick={() => toggleFAQ(index)}
// //             >
// //               {faq.question}
// //               <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
// //             </button>
// //             {openIndex === index && (
// //               <p className="text-gray-600 pb-4">{faq.answer}</p>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useState } from "react";
// import { Helmet } from "react-helmet-async";

// const FAQ = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleQuestion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   const faqSections = [
//     {
//       title: "General FAQs",
//       questions: [
//         {
//           q: "What is GetCompanion?",
//           a: "GetCompanion is an emotional companionship platform where users can connect with trained and verified Happiness Executives for meaningful conversations, emotional support, and friendly company — through chat, audio call, video call, or in-person meet-ups."
//         },
//         {
//           q: "Is GetCompanion a dating or escort platform?",
//           a: "No. Absolutely not. We do not offer dating, escorting, intimacy, or sexual services of any kind. Our services are strictly emotional, conversational, and companionship-based."
//         },
//         {
//           q: "Who can use GetCompanion?",
//           a: (
//             <ul className="list-disc list-inside space-y-2">
//               <li>Users 18 years and above can use the platform freely.</li>
//               <li>Users 15–17 years may use it only with parental supervision and approval.</li>
//               <li>Children under 15 years are strictly prohibited.</li>
//               <li>Our services are aimed at addressing loneliness problem in India and the world. Elderly, middle age people or young adults suffering from Loneliness can use our services to find a trusted and reliable companion who is Human and Does not judge the users.</li>
//             </ul>
//           )
//         }
//       ]
//     },
//     {
//       title: "Services & Usage FAQs",
//       questions: [
//         {
//           q: "What services do Happiness Executives provide?",
//           a: (
//             <>
//               <p className="mb-2">They offer:</p>
//               <ul className="list-disc list-inside space-y-1 mb-3">
//                 <li>Conversation</li>
//                 <li>Emotional support</li>
//                 <li>Light activities (shopping, walking, hospital visits, games, music conversations etc.)</li>
//                 <li>Stress relief through talking</li>
//                 <li>Company at public places or at home</li>
//                 <li>Breakup or loneliness support</li>
//               </ul>
//               <p className="font-semibold">They do NOT provide therapy, medical advice, caregiving, or physical assistance.</p>
//             </>
//           )
//         },
//         {
//           q: "What modes of service are available?",
//           a: (
//             <>
//               <p className="mb-2">You can choose from:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Chat</li>
//                 <li>Audio Call</li>
//                 <li>Video Call (user video stays OFF)</li>
//                 <li>In-person companionship (Gurugram only at the moment)</li>
//               </ul>
//             </>
//           )
//         }
//       ]
//     },
//     {
//       title: "Video & Privacy FAQs",
//       questions: [
//         {
//           q: "Can the user turn on their video during a video call?",
//           a: "No. For safety and privacy, user video is always disabled. Only the Happiness Executive's face is visible (if the user pays for video mode)."
//         },
//         {
//           q: "Do Happiness Executives see my phone number?",
//           a: "No. Your number is never shared with them."
//         },
//         {
//           q: "Are calls or chats recorded?",
//           a: (
//             <ul className="list-disc list-inside space-y-1">
//               <li>99% are not recorded.</li>
//               <li>1% are auto-recorded strictly for quality training.</li>
//               <li>These recordings do not reveal personal identity or phone numbers.</li>
//             </ul>
//           )
//         }
//       ]
//     },
//     {
//       title: "Safety & Verification FAQs",
//       questions: [
//         {
//           q: "How do you verify Happiness Executives?",
//           a: (
//             <>
//               <p className="mb-2">Every Happiness Executive must pass:</p>
//               <ul className="space-y-1">
//                 <li>✔ Government ID verification</li>
//                 <li>✔ Police verification</li>
//                 <li>✔ Psychometric assessment</li>
//                 <li>✔ Behavioural interview</li>
//                 <li>✔ Training on emotional support & boundaries</li>
//               </ul>
//             </>
//           )
//         },
//         {
//           q: "Is physical contact allowed?",
//           a: "No. No hugging, touching, or physical intimacy is permitted. Minor assistance like helping someone stand is allowed only if required."
//         },
//         {
//           q: "Where can in-person meetings happen?",
//           a: (
//             <ul className="list-disc list-inside space-y-1">
//               <li>At the customer's residence (with valid address proof)</li>
//               <li>At public places such as malls, cafes, restaurants, parks</li>
//               <li>No isolated or unsafe locations are allowed</li>
//             </ul>
//           )
//         },
//         {
//           q: "What time are in-person meetings allowed?",
//           a: "Between 9:30 AM to 7:00 PM only."
//         },
//         {
//           q: "Does GetCompanion handle crisis or emergency situations?",
//           a: "No. Happiness Executives are not trained for crisis, suicide intervention, or psychiatric emergencies. They may encourage you to seek help, but they cannot intervene professionally."
//         }
//       ]
//     },
//     {
//       title: "Payments, Pricing & Refunds FAQs",
//       questions: [
//         {
//           q: "How do I make payments?",
//           a: (
//             <>
//               <p className="mb-2">You can pay using:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>UPI</li>
//                 <li>Debit/Credit Cards</li>
//                 <li>Net Banking</li>
//                 <li>Wallets</li>
//               </ul>
//               <p className="mt-2">via our payment aggregator Cashfree.</p>
//             </>
//           )
//         },
//         {
//           q: "How does pricing work?",
//           a: (
//             <ul className="list-disc list-inside space-y-2">
//               <li>Chat & Calls: Per-minute pricing</li>
//               <li>In-person sessions: An hourly pricing. An hour is calculated from the time Happiness Executive meet the Customer at the pre-agreed designated location.</li>
//               <li>Customer needs to fund its wallet to use any of the services on the website</li>
//               <li>Users must have at least 5× the per-minute cost in their wallet to start a call/chat.</li>
//             </ul>
//           )
//         },
//         {
//           q: "What is the refund policy?",
//           a: (
//             <>
//               <p className="mb-2">Refunds are given only if:</p>
//               <ul className="list-disc list-inside space-y-2">
//                 <li>A Happiness Executive does not show up for an in-person meeting</li>
//                 <li>Or if a user declines a replacement when the booked executive is unavailable</li>
//                 <li>However, if Customer changes the meeting location then Happiness Executive is within its right to cancel the booking and 50% of the booking amount will be charged to the customer and rest 50% will get refunded.</li>
//                 <li>For cancelled in-person visit session, the money gets refunded to the users wallet or they can opt to get it into the payment mode through which the payment was made.</li>
//               </ul>
//               <p className="mt-2">Unused wallet balance is settled once a year after March.</p>
//             </>
//           )
//         }
//       ]
//     },
//     {
//       title: "Behaviour & Boundaries FAQs",
//       questions: [
//         {
//           q: "Are romantic advances or flirting allowed?",
//           a: "No. Romantic behaviour, sexual talk, flirting, or inappropriate gestures are strictly prohibited."
//         },
//         {
//           q: "What happens if a user behaves inappropriately?",
//           a: (
//             <ul className="list-disc list-inside space-y-1">
//               <li>First warning</li>
//               <li>Second warning</li>
//               <li>Permanent ban through mobile number blocked from the platform</li>
//             </ul>
//           )
//         },
//         {
//           q: "Are Happiness Executives caregivers?",
//           a: (
//             <>
//               <p className="mb-2">No. They are companions, not:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Caretakers</li>
//                 <li>Nurses</li>
//                 <li>Therapists</li>
//                 <li>Psychologists</li>
//               </ul>
//               <p className="mt-2">They do not perform specialised tasks or medical assistance.</p>
//             </>
//           )
//         }
//       ]
//     },
//     {
//       title: "Privacy & Data FAQs",
//       questions: [
//         {
//           q: "Do you share my data with any third party?",
//           a: "No. We do not sell or share your data."
//         },
//         {
//           q: "How long is my data stored?",
//           a: (
//             <ul className="list-disc list-inside space-y-1">
//               <li>Chats can be deleted by the user anytime</li>
//               <li>Training samples (1%) are anonymized</li>
//               <li>All stored data is deleted within 30 days</li>
//             </ul>
//           )
//         },
//         {
//           q: "Do Happiness Executives have access to my personal information?",
//           a: "No. They only see your first name and basic profile details needed for the session."
//         }
//       ]
//     },
//     {
//       title: "Crisis & Mental Health FAQs",
//       questions: [
//         {
//           q: "What if I express suicidal thoughts?",
//           a: (
//             <>
//               <p className="mb-2">Happiness Executives may:</p>
//               <ul className="list-disc list-inside space-y-1 mb-3">
//                 <li>Encourage positivity</li>
//                 <li>Motivate you</li>
//                 <li>Suggest speaking to a licensed therapist</li>
//               </ul>
//               <p className="mb-2">But they cannot:</p>
//               <ul className="list-disc list-inside space-y-1 mb-3">
//                 <li>Provide therapy</li>
//                 <li>Report to authorities</li>
//                 <li>Intervene medically</li>
//               </ul>
//               <p className="font-semibold">GetCompanion is not a crisis-management platform.</p>
//             </>
//           )
//         }
//       ]
//     },
//     {
//       title: "Company & Legal FAQs",
//       questions: [
//         {
//           q: "Who operates GetCompanion?",
//           a: (
//             <>
//               <p className="mb-2">GetCompanion is owned and operated by:</p>
//               <p className="font-semibold">VKSRS Care Pvt Ltd</p>
//               <p>CIN: U87300HR2025PTC137230</p>
//               <p>Customer Support: <a href="mailto:getcompanion@outlook.com" className="text-blue-600 hover:underline">getcompanion@outlook.com</a></p>
//               <p className="mt-2 italic text-sm">(Address withheld for security — legally acceptable.)</p>
//             </>
//           )
//         },
//         {
//           q: "Are Happiness Executives employees of the company?",
//           a: "No. They are independent consultants."
//         },
//         {
//           q: "Is GetCompanion responsible for actions outside the platform?",
//           a: "No. The company is not liable for any actions, meetings, behaviour or incidents that occur outside the platform or against platform rules."
//         }
//       ]
//     },
//     {
//       title: "Child Safety FAQs",
//       questions: [
//         {
//           q: "Are minors allowed?",
//           a: (
//             <ul className="list-disc list-inside space-y-1">
//               <li>Under 15: Not allowed</li>
//               <li>15–17: Allowed only with parent/guardian approval</li>
//             </ul>
//           )
//         }
//       ]
//     },
//     {
//       title: "Discounts & Offers FAQs",
//       questions: [
//         {
//           q: "Do you offer discounts?",
//           a: "Yes, discounts may be offered periodically at the discretion of the company. These offers may change from time to time."
//         }
//       ]
//     },
//     {
//       title: "Technical FAQ",
//       questions: [
//         {
//           q: "Do you use cookies or trackers?",
//           a: "Not currently. If introduced in the future, users will be notified."
//         }
//       ]
//     }
//   ];

//   return (
//     <>
//       <Helmet>
//         <title>Frequently Asked Questions | GetCompanion FAQs</title>
//         <meta name="description" content="Find answers to common questions about GetCompanion services, safety, pricing, and policies" />
//         <meta name="keywords" content="GetCompanion FAQ, companionship services India, emotional support questions, safety guidelines" />
//         <meta property="og:title" content="GetCompanion - Frequently Asked Questions" />
//         <meta property="og:description" content="Get answers to all your questions about our emotional companionship services" />
//         <meta property="og:image" content="/seo-logo.png" />
//       </Helmet>
      
//       <div className="font-sans text-gray-800">
//         {/* Hero Banner */}
//         <div className="relative bg-gray-700 text-white text-center py-20">
//           <div
//             className="absolute inset-0 bg-cover bg-center opacity-40"
//             style={{ backgroundImage: "url('/mnt/data/Intro.png')" }}
//           ></div>

//           <div className="relative">
//             <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
//             <p className="mt-3 text-lg opacity-90">
//               Everything you need to know about GetCompanion
//             </p>
//             <p className="mt-2 text-sm opacity-75">
//               Owned & Managed by VKSRS CARE PRIVATE LIMITED
//             </p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-5xl mx-auto px-6 py-12">
          
//           {/* Introduction */}
//           <div className="mb-12 text-center">
//             <p className="text-lg text-gray-600">
//               Have questions? We've got answers. Browse through our comprehensive FAQ sections below.
//             </p>
//           </div>

//           {/* FAQ Sections */}
//           {faqSections.map((section, sectionIdx) => (
//             <section key={sectionIdx} className="mb-12">
//               <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">
//                 {section.title}
//               </h2>
              
//               <div className="space-y-4">
//                 {section.questions.map((item, qIdx) => {
//                   const globalIndex = `${sectionIdx}-${qIdx}`;
//                   const isOpen = openIndex === globalIndex;
                  
//                   return (
//                     <div
//                       key={qIdx}
//                       className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
//                     >
//                       <button
//                         onClick={() => toggleQuestion(globalIndex)}
//                         className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
//                       >
//                         <span className="font-semibold text-gray-800 pr-4">
//                           {item.q}
//                         </span>
//                         <span className="text-2xl text-gray-600 flex-shrink-0">
//                           {isOpen ? "−" : "+"}
//                         </span>
//                       </button>
                      
//                       {isOpen && (
//                         <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed">
//                           {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           ))}

//           {/* Contact Section */}
//           <section className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Still Have Questions?</h2>
//             <p className="text-gray-700 mb-4">
//               If you couldn't find the answer you were looking for, feel free to reach out to us directly.
//             </p>
            
//             <div className="space-y-2">
//               <p>
//                 <strong>Email:</strong>{" "}
//                 <a href="mailto:getcompanion@outlook.com" className="text-blue-600 hover:underline">
//                   getcompanion@outlook.com
//                 </a>
//               </p>
//               <p>
//                 <strong>Phone:</strong>{" "}
//                 <a href="tel:+917827105511" className="text-blue-600 hover:underline">
//                   +91 7827105511
//                 </a>
//               </p>
//               <p className="mt-4 text-sm text-gray-600">
//                 Our support team is here to help you with any concerns or inquiries.
//               </p>
//             </div>
//           </section>

//           {/* Additional Links */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-600">
//               For more information, please review our{" "}
//               <a 
//                 href="https://www.getcompanion.in/privacy-policy" 
//                 className="text-blue-600 hover:underline font-semibold"
//                 target="_blank" 
//                 rel="noopener noreferrer"
//               >
//                 Privacy Policy
//               </a>
//               {" "}and{" "}
//               <a 
//                 href="https://www.getcompanion.in/terms-and-conditions" 
//                 className="text-blue-600 hover:underline font-semibold"
//                 target="_blank" 
//                 rel="noopener noreferrer"
//               >
//                 Terms of Use
//               </a>
//               .
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FAQ;







import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSections = [
    {
      title: "GENERAL FAQs",
      questions: [
        {
          q: "1. What is GetCompanion?",
          a: "GetCompanion is an emotional companionship platform where users can connect with trained and verified Happiness Executives for meaningful conversations, emotional support, and friendly company — through chat, audio call, video call, or in-person meet-ups."
        },
        {
          q: "2. Is GetCompanion a dating or escort platform?",
          a: (
            <>
              <p className="mb-2">No. Absolutely not.</p>
              <p className="mb-2">We do not offer dating, escorting, intimacy, or sexual services of any kind.</p>
              <p>Our services are strictly emotional, conversational, and companionship-based.</p>
            </>
          )
        },
        {
          q: "3. Who can use GetCompanion?",
          a: (
            <ul className="list-disc list-inside space-y-2">
              <li>Users 18 years and above can use the platform freely.</li>
              <li>Users 15–17 years may use it only with parental supervision and approval.</li>
              <li>Children under 15 years are strictly prohibited.</li>
              <li>Our services are aimed at addressing loneliness problem in India and the world. Elderly, middle age people or young adults suffering from Loneliness can use our services to find a trusted and reliable companion who is Human and Does not judge the users.</li>
            </ul>
          )
        }
      ]
    },
    {
      title: "SERVICES & USAGE FAQs",
      questions: [
        {
          q: "4. What services do Happiness Executives provide?",
          a: (
            <>
              <p className="mb-2">They offer:</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Conversation</li>
                <li>Emotional support</li>
                <li>Light activities (shopping, walking, hospital visits, games, music conversations etc.)</li>
                <li>Stress relief through talking</li>
                <li>Company at public places or at home</li>
                <li>Breakup or loneliness support</li>
              </ul>
              <p className="font-semibold">They do NOT provide therapy, medical advice, caregiving, or physical assistance.</p>
            </>
          )
        },
        {
          q: "5. What modes of service are available?",
          a: (
            <>
              <p className="mb-2">You can choose from:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Chat</li>
                <li>Audio Call</li>
                <li>Video Call (user video stays OFF)</li>
                <li>In-person companionship (Gurugram only at the moment)</li>
              </ul>
            </>
          )
        }
      ]
    },
    {
      title: "VIDEO & PRIVACY FAQs",
      questions: [
        {
          q: "6. Can the user turn on their video during a video call?",
          a: (
            <>
              <p className="mb-2">No.</p>
              <p>For safety and privacy, user video is always disabled.</p>
              <p>Only the Happiness Executive's face is visible (if the user pays for video mode).</p>
            </>
          )
        },
        {
          q: "7. Do Happiness Executives see my phone number?",
          a: "No. Your number is never shared with them."
        },
        {
          q: "8. Are calls or chats recorded?",
          a: (
            <ul className="list-disc list-inside space-y-1">
              <li>99% are not recorded.</li>
              <li>1% are auto-recorded strictly for quality training.</li>
              <li>These recordings do not reveal personal identity or phone numbers.</li>
            </ul>
          )
        }
      ]
    },
    {
      title: "SAFETY & VERIFICATION FAQs",
      questions: [
        {
          q: "9. How do you verify Happiness Executives?",
          a: (
            <>
              <p className="mb-2">Every Happiness Executive must pass:</p>
              <ul className="space-y-1">
                <li>✔ Government ID verification</li>
                <li>✔ Police verification</li>
                <li>✔ Psychometric assessment</li>
                <li>✔ Behavioural interview</li>
                <li>✔ Training on emotional support & boundaries</li>
              </ul>
            </>
          )
        },
        {
          q: "10. Is physical contact allowed?",
          a: (
            <>
              <p className="mb-2">No.</p>
              <p>No hugging, touching, or physical intimacy is permitted.</p>
              <p>Minor assistance like helping someone stand is allowed only if required.</p>
            </>
          )
        },
        {
          q: "11. Where can in-person meetings happen?",
          a: (
            <ul className="list-disc list-inside space-y-1">
              <li>At the customer's residence (with valid address proof)</li>
              <li>At public places such as malls, cafes, restaurants, parks</li>
              <li>No isolated or unsafe locations are allowed</li>
            </ul>
          )
        },
        {
          q: "12. What time are in-person meetings allowed?",
          a: "Between 9:30 AM to 7:00 PM only."
        },
        {
          q: "13. Does GetCompanion handle crisis or emergency situations?",
          a: (
            <>
              <p className="mb-2">No. Happiness Executives are not trained for crisis, suicide intervention, or psychiatric emergencies.</p>
              <p>They may encourage you to seek help, but they cannot intervene professionally.</p>
            </>
          )
        }
      ]
    },
    {
      title: "PAYMENTS, PRICING & REFUNDS FAQs",
      questions: [
        {
          q: "14. How do I make payments?",
          a: (
            <>
              <p className="mb-2">You can pay using:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>UPI</li>
                <li>Debit/Credit Cards</li>
                <li>Net Banking</li>
                <li>Wallets</li>
              </ul>
              <p className="mt-2">via our payment aggregator Cashfree.</p>
            </>
          )
        },
        {
          q: "15. How does pricing work?",
          a: (
            <ul className="list-disc list-inside space-y-2">
              <li>Chat & Calls: Per-minute pricing</li>
              <li>In-person sessions: An hourly pricing. An hour is calculated from the time Happiness Executive meet the Customer at the pre-agreed designated location.</li>
              <li>Customer needs to fund its wallet to use any of the services on the website</li>
              <li>Users must have at least 5× the per-minute cost in their wallet to start a call/chat.</li>
            </ul>
          )
        },
        {
          q: "16. What is the refund policy?",
          a: (
            <>
              <p className="mb-2">Refunds are given only if:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>A Happiness Executive does not show up for an in-person meeting</li>
                <li>Or if a user declines a replacement when the booked executive is unavailable</li>
                <li>However, if Customer changes the meeting location then Happiness Executive is within its right to cancel the booking and 50% of the booking amount will be charged to the customer and rest 50% will get refunded.</li>
                <li>For cancelled in-person visit session, the money gets refunded to the users wallet or they can opt to get it into the payment mode through which the payment was made.</li>
              </ul>
              <p className="mt-2">Unused wallet balance is settled once a year after March.</p>
            </>
          )
        }
      ]
    },
    {
      title: "BEHAVIOUR & BOUNDARIES FAQs",
      questions: [
        {
          q: "17. Are romantic advances or flirting allowed?",
          a: "No. Romantic behaviour, sexual talk, flirting, or inappropriate gestures are strictly prohibited."
        },
        {
          q: "18. What happens if a user behaves inappropriately?",
          a: (
            <ul className="list-disc list-inside space-y-1">
              <li>First warning</li>
              <li>Second warning</li>
              <li>Permanent ban through mobile number blocked from the platform</li>
            </ul>
          )
        },
        {
          q: "19. Are Happiness Executives caregivers?",
          a: (
            <>
              <p className="mb-2">No. They are companions, not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Caretakers</li>
                <li>Nurses</li>
                <li>Therapists</li>
                <li>Psychologists</li>
              </ul>
              <p className="mt-2">They do not perform specialised tasks or medical assistance.</p>
            </>
          )
        }
      ]
    },
    {
      title: "PRIVACY & DATA FAQs",
      questions: [
        {
          q: "20. Do you share my data with any third party?",
          a: "No. We do not sell or share your data."
        },
        {
          q: "21. How long is my data stored?",
          a: (
            <ul className="list-disc list-inside space-y-1">
              <li>Chats can be deleted by the user anytime</li>
              <li>Training samples (1%) are anonymized</li>
              <li>All stored data is deleted within 30 days</li>
            </ul>
          )
        },
        {
          q: "22. Do Happiness Executives have access to my personal information?",
          a: "No. They only see your first name and basic profile details needed for the session."
        }
      ]
    },
    {
      title: "CRISIS & MENTAL HEALTH FAQs",
      questions: [
        {
          q: "23. What if I express suicidal thoughts?",
          a: (
            <>
              <p className="mb-2">Happiness Executives may:</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Encourage positivity</li>
                <li>Motivate you</li>
                <li>Suggest speaking to a licensed therapist</li>
              </ul>
              <p className="mb-2">But they cannot:</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Provide therapy</li>
                <li>Report to authorities</li>
                <li>Intervene medically</li>
              </ul>
              <p className="font-semibold">GetCompanion is not a crisis-management platform.</p>
            </>
          )
        }
      ]
    },
    {
      title: "COMPANY & LEGAL FAQs",
      questions: [
        {
          q: "24. Who operates GetCompanion?",
          a: (
            <>
              <p className="mb-2">GetCompanion is owned and operated by:</p>
              <p className="font-semibold">VKSRS Care Pvt Ltd</p>
              <p>CIN: U87300HR2025PTC137230</p>
              <p>Customer Support: <a href="mailto:getcompanion@outlook.com" className="text-blue-600 hover:underline">getcompanion@outlook.com</a></p>
              <p className="mt-2 italic text-sm">(Address withheld for security — legally acceptable.)</p>
            </>
          )
        },
        {
          q: "25. Are Happiness Executives employees of the company?",
          a: "No. They are independent consultants."
        },
        {
          q: "26. Is GetCompanion responsible for actions outside the platform?",
          a: (
            <>
              <p>No.</p>
              <p>The company is not liable for any actions, meetings, behaviour or incidents that occur outside the platform or against platform rules.</p>
            </>
          )
        }
      ]
    },
    {
      title: "CHILD SAFETY FAQs",
      questions: [
        {
          q: "27. Are minors allowed?",
          a: (
            <ul className="list-disc list-inside space-y-1">
              <li>Under 15: Not allowed</li>
              <li>15–17: Allowed only with parent/guardian approval</li>
            </ul>
          )
        }
      ]
    },
    {
      title: "DISCOUNTS & OFFERS FAQs",
      questions: [
        {
          q: "28. Do you offer discounts?",
          a: (
            <>
              <p>Yes, discounts may be offered periodically at the discretion of the company.</p>
              <p>These offers may change from time to time.</p>
            </>
          )
        }
      ]
    },
    {
      title: "TECHNICAL FAQ",
      questions: [
        {
          q: "30. Do you use cookies or trackers?",
          a: "Not currently. If introduced in the future, users will be notified."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | GetCompanion FAQs</title>
        <meta name="description" content="Find answers to common questions about GetCompanion services, safety, pricing, and policies" />
        <meta name="keywords" content="GetCompanion FAQ, companionship services India, emotional support questions, safety guidelines" />
        <meta property="og:title" content="GetCompanion - Frequently Asked Questions" />
        <meta property="og:description" content="Get answers to all your questions about our emotional companionship services" />
        <meta property="og:image" content="/seo-logo.png" />
      </Helmet>
      
      <div className="font-sans text-gray-800">
        {/* Hero Banner */}
        <div className="relative bg-gray-700 text-white text-center py-20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('/mnt/data/Intro.png')" }}
          ></div>

          <div className="relative">
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
            <p className="mt-3 text-lg opacity-90">
              Everything you need to know about GetCompanion
            </p>
            <p className="mt-2 text-sm opacity-75">
              Owned & Managed by VKSRS CARE PRIVATE LIMITED
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          {/* Introduction */}
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-600">
              Have questions? We've got answers. Browse through our comprehensive FAQ sections below.
            </p>
          </div>

          {/* FAQ Sections */}
          {faqSections.map((section, sectionIdx) => (
            <section key={sectionIdx} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">
                {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.questions.map((item, qIdx) => {
                  const globalIndex = `${sectionIdx}-${qIdx}`;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div
                      key={qIdx}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                      >
                        <span className="font-semibold text-gray-800 pr-4">
                          {item.q}
                        </span>
                        <span className="text-2xl text-gray-600 flex-shrink-0">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed">
                          {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Contact Section */}
          <section className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Still Have Questions?</h2>
            <p className="text-gray-700 mb-4">
              If you couldn't find the answer you were looking for, feel free to reach out to us directly.
            </p>
            
            <div className="space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:getcompanion@outlook.com" className="text-blue-600 hover:underline">
                  getcompanion@outlook.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+917827105511" className="text-blue-600 hover:underline">
                  +91 7827105511
                </a>
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Our support team is here to help you with any concerns or inquiries.
              </p>
            </div>
          </section>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              For more information, please review our{" "}
              <a 
                href="https://www.getcompanion.in/privacy-policy" 
                className="text-blue-600 hover:underline font-semibold"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              {" "}and{" "}
              <a 
                href="https://www.getcompanion.in/terms-and-conditions" 
                className="text-blue-600 hover:underline font-semibold"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
import React, { useState } from "react";
const faqs = [
    {
        question: "What is the importance of financial audits?",
        answer:
            "Financial audits help ensure accuracy in financial statements, compliance with regulations, and build trust with investors and stakeholders.",
    },
    {
        question: "How does taxation planning benefit businesses?",
        answer:
            "Effective tax planning helps businesses minimize liabilities, optimize deductions, and comply with tax laws while maximizing profitability.",
    },
    {
        question: "What is Mergers & Acquisitions (M&A), and how does it work?",
        answer:
            "M&A involves the consolidation of companies through various financial transactions. It helps businesses expand, reduce competition, and achieve operational efficiency.",
    },
    {
        question: "Why is data migration critical in business transformation?",
        answer:
            "Data migration ensures seamless transition from legacy systems to modern platforms, improving efficiency, security, and decision-making capabilities.",
    },
    {
        question: "What are the key challenges in accounting data migration?",
        answer:
            "Key challenges include data integrity, compatibility issues, loss of data, and ensuring compliance with financial regulations.",
    },
    {
        question: "How can businesses prepare for an IRS audit?",
        answer:
            "Businesses should maintain accurate records, ensure compliance with tax laws, and work with tax professionals to address any discrepancies proactively.",
    },
    {
        question: "What are the tax implications of M&A transactions?",
        answer:
            "M&A transactions can have significant tax consequences, including capital gains, deductions, and structuring benefits that need careful planning.",
    },
    {
        question: "How can forensic accounting help detect fraud?",
        answer:
            "Forensic accounting involves detailed analysis of financial records to detect fraud, financial discrepancies, and ensure regulatory compliance.",
    },
    {
        question: "Why is compliance crucial in financial auditing?",
        answer:
            "Compliance ensures adherence to laws, reduces risks, and enhances financial transparency, making businesses more credible and accountable.",
    }
];

const QASection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative bg-black text-white text-center py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/mnt/data/Intro.png')" }}
        ></div>
        <div className="relative">
          <h1 className="text-4xl font-bold">Your Questions Answered</h1>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-white to-pink-100 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl my-12">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-300">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left p-4 font-semibold flex justify-between items-center bg-white hover:bg-gray-100"
                        >
                            {faq.question}
                            <span>{activeIndex === index ? "−" : "+"}</span>
                        </button>
                        {activeIndex === index && (
                            <div className="p-4 bg-gray-100 text-gray-700">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default QASection;

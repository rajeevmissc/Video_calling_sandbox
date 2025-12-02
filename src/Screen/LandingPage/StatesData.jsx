import { Users, Star, ShieldCheck, Clock } from "lucide-react";

const StatsSection = () => {
    const stats = [
        {
            value: "25+",
            label: "Verified Experts",
            icon: <Users className="w-7 h-7 text-purple-600" />,
        },
        {
            value: "98%",
            label: "Satisfaction Rate",
            icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
        },
        {
            value: "4.5★",
            label: "Average Rating",
            icon: <Star className="w-7 h-7 text-amber-500" />,
        },
        {
            value: "24/7",
            label: "Support Availability",
            icon: <Clock className="w-7 h-7 text-blue-600" />,
        },
    ];

    return (
        <section className="py-14 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="backdrop-blur-xl bg-white/60 shadow-lg border border-gray-200 rounded-3xl p-10">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Trusted by Families & Businesses
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                        {stats.map((item, i) => (
                            <div
                                key={i}
                                className="group relative p-4 hover:scale-105 transition-transform duration-300"
                            >
                                <div className="flex justify-center mb-3">{item.icon}</div>

                                <div className="text-4xl font-bold text-gray-900">
                                    {item.value}
                                </div>

                                <div className="text-sm text-gray-600 mt-1">
                                    {item.label}
                                </div>

                                {/* Soft glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-purple-300 blur-3xl transition-all rounded-2xl"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default StatsSection;







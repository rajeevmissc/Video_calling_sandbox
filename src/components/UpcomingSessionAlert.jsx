import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    MessageSquare,
    PhoneCall,
    Video,
    MapPin,
    X,
    ArrowRight,
    BadgeCheck,
    IndianRupee,
    Info,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";

const UpcomingSessionAlert = ({ isProvider = false, currentDateTime }) => {
    const [session, setSession] = useState(null);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [showLivePopup, setShowLivePopup] = useState(false);
    const [dragPos, setDragPos] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("alertDragPos"));
            return saved || { x: 0, y: 0 };
        } catch {
            return { x: 0, y: 0 };
        }
    });

    // Fetch session
 useEffect(() => {
  const fetchUpcoming = async () => {
    try {
      const endpoint = isProvider
        ? `${API_BASE_URL}/bookings/provider/latest`
        : `${API_BASE_URL}/bookings/user/latest`;

      const token = localStorage.getItem("token");

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success && res.data.data) {
        const sessionData = res.data.data;
        setSession(sessionData);

        const now = new Date();
        const baseDate = new Date(sessionData.date); 
        const [hour, minute] = sessionData.timeSlot.split(":").map(Number);
        const sessionStart = new Date(baseDate);
        sessionStart.setUTCHours(hour);
        sessionStart.setUTCMinutes(minute);
        sessionStart.setUTCSeconds(0);

        console.log("Now:", now.toISOString());
        console.log("Session Start:", sessionStart.toISOString());
        setVisible(sessionStart > now);
      }
    } catch (err) {
      console.error("Upcoming session error:", err);
    }
  };

  fetchUpcoming();
}, [isProvider]);



    // Time countdown
    useEffect(() => {
        if (!session?.date || !session?.timeSlot) return;

        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(session.date);
            const [hh, mm] = session.timeSlot.split(":");

            start.setHours(Number(hh));
            start.setMinutes(Number(mm));
            start.setSeconds(0);

            if (start <= now) {
                setTimeLeft("LIVE NOW");
                clearInterval(interval);
                return;
            }

            const diff = start - now;
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            setTimeLeft(`${mins}m ${secs}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [session]);

    // Popup only when session future time > current time (NO AUDIO, NO JOIN)
    useEffect(() => {
        if (!session) return;

        const now = new Date();
        const start = new Date(session.date);
        const [hh, mm] = session.timeSlot.split(":");

        start.setHours(Number(hh));
        start.setMinutes(Number(mm));

        if (start > now) {
            setShowLivePopup(true);
        }
    }, [session]);

    if (!session || !visible) return null;

    const {
        date,
        timeSlot,
        duration,
        status,
        mode,
        price,
        providerName,
        bookingId,
        createdAt,
        userName
    } = session;

    const displayName = isProvider ? userName : providerName;

    const modeIcons = {
        chat: <MessageSquare className="w-6 h-6 text-green-400" />,
        call: <PhoneCall className="w-6 h-6 text-blue-400" />,
        video: <Video className="w-6 h-6 text-purple-400" />,
        visit: <MapPin className="w-6 h-6 text-red-400" />
    };

    const generateGoogleCalendarLink = () => {
        const start = new Date(date);
        const [hh, mm] = timeSlot.split(":");
        start.setHours(Number(hh));
        start.setMinutes(Number(mm));

        const end = new Date(start.getTime() + duration * 60000);

        const formatDate = (d) =>
            d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        const params = new URLSearchParams({
            text: `Session with ${displayName}`,
            dates: `${formatDate(start)}/${formatDate(end)}`,
            details: `Booking ID: ${bookingId}\nMode: ${mode}\nPrice: ₹${price}`
        });

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
    };

    return (
        <>
            {/* MAIN FLOATING ALERT */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        drag
                        dragElastic={0.2}
                        dragMomentum={false}
                        animate={{ x: dragPos.x, y: dragPos.y }}
                        onDragEnd={(e, info) => {
                            const pos = { x: info.point.x, y: info.point.y };
                            setDragPos(pos);
                            localStorage.setItem("alertDragPos", JSON.stringify(pos));
                        }}
                        className="fixed top-[80px] left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[500px]"
                    >
                        <div className="absolute -inset-3 bg-gradient-to-r from-orange-400 to-pink-500 opacity-40 blur-xl rounded-3xl"></div>

                        <div className="relative backdrop-blur-xl bg-white/25 border border-white/40 rounded-3xl p-5 shadow-xl">

                            {/* Close */}
                            <button
                                onClick={() => setVisible(false)}
                                className="absolute top-4 right-4 bg-white/60 p-1.5 rounded-full shadow"
                            >
                                <X size={16} className="text-gray-700" />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/40 rounded-2xl shadow-inner">
                                    {modeIcons[mode]}
                                </div>

                                <div>
                                    <p className="text-[11px] text-white/80 uppercase">Upcoming Session</p>
                                    <h2 className="text-xl text-white font-semibold">{displayName}</h2>

                                    <p className="text-yellow-200 mt-1 text-sm">
                                        {timeLeft === "LIVE NOW"
                                            ? "LIVE NOW"
                                            : `Starts in ${timeLeft}`}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="text-white text-sm grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <Calendar size={15} /> {new Date(date).toDateString()}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock size={15} /> {timeSlot} • {duration} min
                                </div>

                                <div className="flex items-center gap-2 capitalize">
                                    {modeIcons[mode]} {mode}
                                </div>

                                <div className="flex items-center gap-2">
                                    <IndianRupee size={15} /> {price}
                                </div>

                                <div className="flex items-center gap-2 col-span-2">
                                    <BadgeCheck size={15} /> ID: {bookingId}
                                </div>

                                <div className="flex items-center gap-2 col-span-2">
                                    <Info size={15} /> {status.replace(/_/g, " ")}
                                </div>
                            </div>

                            {/* View Details */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModal(true)}
                                className="mt-4 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                            >
                                View Full Details <ArrowRight size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LIVE POPUP (NO JOIN) */}
            <AnimatePresence>
                {showLivePopup && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center"
                        >
                            <h2 className="text-xl font-bold text-red-600">Upcoming Session</h2>
                            <p className="text-gray-700 mt-2">
                                You have a scheduled session with <strong>{displayName}</strong>.
                            </p>

                            <button
                                onClick={() => setShowLivePopup(false)}
                                className="mt-4 w-full bg-gray-800 text-white py-3 rounded-xl"
                            >
                                Okay
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DETAILS MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.85 }}
                            className="bg-white rounded-3xl w-full max-w-md shadow-xl p-6 relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-3 right-3 bg-blue-500 p-2 rounded-full hover:bg-gray-300"
                            >
                                <X size={18} className="text-white" />
                            </button>

                            <h3 className="text-xl font-bold mb-2">Session Details</h3>
                            <p className="text-gray-600 text-sm mb-4">With {displayName}</p>

                            <div className="text-gray-700 text-sm space-y-2">
                                <p><strong>ID:</strong> {bookingId}</p>
                                <p><strong>Status:</strong> {status.replace(/_/g, " ")}</p>
                                <p><strong>Mode:</strong> {mode}</p>
                                <p><strong>Price:</strong> ₹{price}</p>
                                <p><strong>Duration:</strong> {duration} mins</p>
                                <p><strong>Date:</strong> {new Date(date).toDateString()}</p>
                                <p><strong>Time:</strong> {timeSlot}</p>
                                <p><strong>Created:</strong> {new Date(createdAt).toLocaleString()}</p>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => {
                                        const link = generateGoogleCalendarLink();
                                        window.open(link, "_blank");
                                    }}
                                    className="w-full bg-blue-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <Calendar size={18} /> Add to Google Calendar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UpcomingSessionAlert;

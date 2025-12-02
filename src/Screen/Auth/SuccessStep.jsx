import SuccessImage from "../../Logos/auth3.png"; // your uploaded image

const SuccessStep = ({handleMoveToDashboard }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* Card */}
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center 
        animate-[fadeInUp_0.6s_ease-out]"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold">Congratulations</h2>
        <p className="text-gray-600 mt-2">
          We are glad to inform you that you have successfully logged in.
        </p>

        {/* Illustration */}
        <img
          src={SuccessImage}
          alt="Success"
          className="w-40 mx-auto mt-8 animate-[popIn_0.5s_ease-out]"
        />

        {/* Button */}
        <button
          onClick={handleMoveToDashboard}
          className="mt-10 w-full py-3 rounded-xl font-semibold text-white 
          bg-black hover:bg-gray-900 transition shadow-md hover:shadow-lg"
        >
          Move to GetCompanion
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SuccessStep;

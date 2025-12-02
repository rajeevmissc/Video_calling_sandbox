const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
    <div className={`p-3 rounded-xl bg-${color}-100 w-fit mb-3`}>
      <Icon className={`w-6 h-6 text-${color}-600`} />
    </div>
    <h3 className="text-xs sm:text-sm text-slate-600 mb-1">{title}</h3>
    <p className="text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

export default StatsCard;
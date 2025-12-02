import { Star, MapPin, Award, CheckCircle } from 'lucide-react';

export const ProviderSummary = ({ provider, selectedMode }) => {
  if (!provider) return null;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
        }`}
      />
    ));
  };

  const pricing = selectedMode ? provider?.pricing?.[selectedMode] : null;

  return (
    <div className="bg-[#F0F0F0] rounded-xl p-4 border border-blue-200">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 flex items-center justify-center text-white text-xl font-bold">
            {provider.personalInfo.profileImage ? (
          <img
            src={provider.personalInfo.profileImage}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {`${provider.personalInfo.firstName?.[0] || ''}${provider.personalInfo.lastName?.[0] || ''}`}
          </div>
        )}
          </div>
          {provider?.professional?.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">
            {provider?.personalInfo?.fullName || 'Unknown Provider'}
          </h4>
          <p className="text-sm text-slate-600 truncate">
            {provider?.services?.primary || 'General Service'}
          </p>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              {renderStars(provider?.ratings?.overall || 0)}
              <span className="font-semibold ml-1">
                {provider?.ratings?.overall ?? 0}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{provider?.professional?.experience ?? 0}y exp</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
            <MapPin className="w-3 h-3" />
            <span>
              {provider?.address?.city || 'Unknown City'},{' '}
              {provider?.address?.state || 'Unknown State'}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      {pricing ? (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Session Price</span>
            <span className="text-xl font-bold text-blue-600">
              ₹{pricing.basePrice}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {pricing.duration} minutes • {selectedMode} session
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-slate-500">
          Please select a session type to see pricing.
        </div>
      )}
    </div>
  );
};

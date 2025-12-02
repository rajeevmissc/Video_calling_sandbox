import { Bell, Check, Trash2, Clock } from 'lucide-react';

const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
};

const NotificationDropdown = ({
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    notificationRef,
    navigate
}) => {
    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 bg-[#F5F5F5] text-gray-700 rounded-xl border border-[#E5E5E5] hover:bg-[#EDEDED] transition-colors"
                type="button"
            >
                <Bell size={20} />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>


            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {notifications.length > 0 && unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                    type="button"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 px-4 text-center">
                                <Bell size={40} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-indigo-50/30' : ''
                                        }`}
                                >
                                    <div className="px-4 py-3 flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-lg">
                                            {notification.icon}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 pr-2">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-sm font-semibold text-gray-900">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-0.5">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
                                                        <Clock size={12} />
                                                        <span>{formatTimestamp(notification.timestamp)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                                                            title="Mark as read"
                                                            type="button"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                        type="button"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                            <button
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium w-full text-center"
                                type="button"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
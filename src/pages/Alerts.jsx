import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AlertCard from '../components/AlertCard';
import { motion, AnimatePresence } from 'framer-motion';

const Alerts = () => {
  const [filter, setFilter] = useState('All');
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'trial',
      title: 'Canva Pro Trial Ending',
      description: 'Your 30-day free trial ends in 48 hours. Auto-renewal will charge ₹499/mo.',
      timeRemaining: '2 days left',
      isUrgent: true,
      icon: '✨',
      aiSuggestion: 'Cancel — No activity detected since signup.'
    },
    {
      id: 2,
      type: 'price',
      title: 'Netflix Price Increase',
      description: 'The Basic Plan is increasing from ₹149 to ₹199 starting next month.',
      timeRemaining: 'Starts in 12 days',
      isUrgent: false,
      icon: '🎬',
      aiSuggestion: 'Downgrade to Mobile Plan to maintain current cost.'
    },
    {
      id: 3,
      type: 'unused',
      title: 'Zeroify Reminder',
      description: 'You haven\'t logged into Zeroify in 45 days despite being on the Premium Plan.',
      timeRemaining: 'Next billing in 5 days',
      isUrgent: true,
      icon: '🧘',
      aiSuggestion: 'Terminate — Immediate savings potential.'
    },
    {
        id: 4,
        type: 'info',
        title: 'New Family Plan available',
        description: 'Spotify just launched a student family bundle that could save you 40%.',
        timeRemaining: 'Offer valid for 3 days',
        isUrgent: false,
        icon: '🎵',
        aiSuggestion: 'Explore — Your household uses 3 Spotify accounts.'
      }
  ]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'All') return true;
    if (filter === 'Urgent') return alert.isUrgent;
    if (filter === 'Info') return !alert.isUrgent;
    return true;
  });

  const handleDismiss = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleAction = (alert) => {
    alert(`Processing action for: ${alert.title}\nAI path: ${alert.aiSuggestion}`);
    handleDismiss(alert.id);
  };

  return (
    <div className="min-h-screen bg-warmBg pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-textDark">Smart Alerts 🔔</h1>
            <p className="text-gray-500 mt-2">Personalized notifications to protect your wallet.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Urgent', 'Info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-smooth ${filter === f ? 'bg-primary-500 text-white shadow-lg' : 'bg-white text-gray-400 hover:text-textDark'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id}
                alert={alert}
                onAction={handleAction}
                onDismiss={handleDismiss}
              />
            ))}
          </AnimatePresence>

          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-base bg-white/50 border-2 border-dashed border-gray-200 py-20 text-center"
            >
              <div className="text-5xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold text-gray-500">Your Wallet is Secure</h3>
              <p className="text-gray-400 mt-2">No critical alerts or warnings at this time.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;

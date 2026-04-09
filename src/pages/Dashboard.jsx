import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import SubscriptionTable from '../components/SubscriptionTable';
import SummaryCard from '../components/SummaryCard';
import { useSubscriptions } from '../context/SubscriptionContext';
import { motion, AnimatePresence } from 'framer-motion';
import TrimModal from '../components/TrimModal';
import FinancialTrimButton from '../components/FinancialTrimButton';
import SubscriptionDetail from '../components/SubscriptionDetail';

const Dashboard = () => {
  const { subscriptions, stats } = useSubscriptions();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isTrimModalOpen, setIsTrimModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesFilter = filter === 'All' || sub.status === filter;
      const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [subscriptions, filter, search]);

  const handleCancel = (sub) => {
    const subject = `Cancellation of Subscription: ${sub.name}`;
    const body = `Hi ${sub.name} Support,\n\nI would like to cancel my subscription associated with this email.\n\nThank you.`;
    window.location.href = `mailto:support@${sub.name.toLowerCase()}.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDetails = (sub) => {
    setSelectedSubscription(sub);
  };

  return (
    <div className="min-h-screen bg-warmBg pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Top Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-textDark">Subscriptions Insight 📊</h1>
          <p className="text-gray-500 mt-1">Manage and optimize your recurring payments in one place.</p>
        </div>

        {/* Summary Top Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SummaryCard 
            title="Total Subscriptions" 
            value={subscriptions.length} 
            icon="📇" 
            colorClass="text-primary-500"
          />
          <SummaryCard 
            title="Active Zombies" 
            value={subscriptions.filter(s => s.status === 'Zombie').length} 
            icon="🧟" 
            colorClass="text-error"
          />
          <SummaryCard 
            title="Monthly Burn Rate" 
            value={`₹${stats.totalMonthlySpend.toLocaleString()}`} 
            icon="🔥" 
            colorClass="text-accent-500"
          />
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Subscription Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SubscriptionTable 
            subscriptions={filteredSubscriptions} 
            onCancel={handleCancel}
            onDetails={handleDetails}
          />
        </motion.div>

        {/* Financial Trim Section */}
        <FinancialTrimButton onClick={() => setIsTrimModalOpen(true)} />

        <AnimatePresence>
          {isTrimModalOpen && (
            <TrimModal isOpen={isTrimModalOpen} onClose={() => setIsTrimModalOpen(false)} />
          )}
          {selectedSubscription && (
            <SubscriptionDetail 
              subscription={selectedSubscription} 
              onClose={() => setSelectedSubscription(null)}
              onCancel={handleCancel}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;

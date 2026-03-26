// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Loader } from 'lucide-react';

type TimeFilter = '7d' | '30d' | '90d' | 'all';

interface DashboardStats {
  total: number;
  active: number;
  resolved: number;
  avgTime: string;
  trendValue?: number;
}

interface RecentComplaint {
  id: number;
  first_name: string;
  last_name: string;
  description: string;
  type_of_complaint: string;
  status: string;
  location: string;
  time: string;
}

interface DashboardData {
  stats: Record<TimeFilter, DashboardStats>;
  recentComplaints: RecentComplaint[];
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<TimeFilter>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Fetch dashboard data on component mount and when filter changes
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard');

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching dashboard data';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.stats[filter];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 text-emerald-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-950 rounded-3xl border border-red-200 dark:border-red-900">
          <AlertCircle className="h-12 w-12 text-red-600" />
          <p className="text-red-900 dark:text-red-100 text-center">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Campus Network • WiFi • Internet Complaints
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex gap-1 bg-white dark:bg-gray-900 p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mt-6 md:mt-0">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: 'all', label: 'All Time' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as TimeFilter)}
                className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  filter === item.value
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Complaints</p>
                <p className="text-5xl font-semibold text-gray-900 dark:text-white mt-3">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>+{stats.trendValue || 12}% from last period</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Complaints</p>
                <p className="text-5xl font-semibold text-amber-600 dark:text-amber-400 mt-3">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-950 rounded-2xl flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">Awaiting resolution</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                <p className="text-5xl font-semibold text-emerald-600 dark:text-emerald-400 mt-3">{stats.resolved}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">Successfully closed</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Resolution Time</p>
                <p className="text-5xl font-semibold text-gray-900 dark:text-white mt-3">{stats.avgTime}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">This {filter}</p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/complaint"
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium px-10 py-5 rounded-3xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6" />
            Make a New Complaint
          </Link>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
            <Link href="/complaints" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
              View All →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {dashboardData.recentComplaints.length > 0 ? (
              dashboardData.recentComplaints.map((complaint) => (
                <div key={complaint.id} className="px-8 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-6 flex-1">
                    <span className="font-mono text-sm text-gray-400 min-w-12">#NC-{complaint.id}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{complaint.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {complaint.first_name} {complaint.last_name} • {complaint.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {complaint.type_of_complaint}
                    </span>
                    <span
                      className={`px-4 py-1 text-xs font-medium rounded-2xl whitespace-nowrap ${
                        complaint.status === 'Active' || complaint.status === 'Pending' || complaint.status === 'Open'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      }`}
                    >
                      {complaint.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 min-w-24 text-right">{complaint.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-8 py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No complaints found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../app/lib/config';

type TimeFilter = '7d' | '30d' | '90d' | 'all';

interface DashboardStats {
  total: number;
  active: number;
  resolved: number;
  avgTime: string;
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.stats[filter];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData || !stats) {
    return <div className="min-h-screen flex items-center justify-center">No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Campus Complaint Management System
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Complaints</p>
                <p className="text-5xl font-semibold text-gray-900 dark:text-white mt-3">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Complaints</p>
                <p className="text-5xl font-semibold text-amber-600 mt-3">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-950 rounded-2xl flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                <p className="text-5xl font-semibold text-emerald-600 mt-3">{stats.resolved}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Resolution Time</p>
                <p className="text-5xl font-semibold text-gray-900 dark:text-white mt-3">{stats.avgTime}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* New Complaint Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/complaint"
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium px-10 py-5 rounded-3xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <Plus className="h-6 w-6" />
            Make a New Complaint
          </Link>
        </div>

        {/* Recent Complaints */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
            <Link href="/complaints" className="text-emerald-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            {dashboardData.recentComplaints.length > 0 ? (
              dashboardData.recentComplaints.map((complaint) => (
                <div key={complaint.id} className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{complaint.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {complaint.first_name} {complaint.last_name} • {complaint.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {complaint.type_of_complaint}
                      </span>
                      <span className={`px-4 py-1 text-xs font-medium rounded-2xl ${
                        complaint.status.toLowerCase() === 'resolved' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {complaint.status}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[100px] text-right">
                        {complaint.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">No recent complaints</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
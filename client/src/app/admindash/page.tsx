"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../lib/config";

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at?: string;
  username?: string;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/adminlogin");    
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/complaints`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("adminToken");
            router.push("/adminlogin");
            return;
          }
          throw new Error("Failed to fetch complaints");
        }

        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [router]);

  const markAsResolved = async (id: number) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) return;

    setUpdatingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/complaints/${id}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "resolved" } : c))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/adminlogin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">All Complaints</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and resolve user complaints</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-medium text-gray-900 dark:text-white">{complaints.length}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-8">
            {error}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 mx-auto text-gray-400" />
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">No complaints found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {complaint.title}
                      </h3>
                      <span
                        className={`px-4 py-1 text-xs font-medium rounded-full ${
                          complaint.status === "resolved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                        }`}
                      >
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {complaint.description}
                    </p>

                    {complaint.username && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reported by: <span className="font-medium">{complaint.username}</span>
                      </p>
                    )}
                  </div>

                  {complaint.status !== "resolved" && (
                    <button
                      onClick={() => markAsResolved(complaint.id)}
                      disabled={updatingId === complaint.id}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap"
                    >
                      {updatingId === complaint.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Mark as Resolved
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
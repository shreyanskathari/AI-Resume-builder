import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function ApplicationsTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    company: '',
    position: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    salary: '',
    notes: '',
    url: ''
  });

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newApp.company || !newApp.position) return;
    try {
      const created = await api.createApplication(newApp);
      setApplications(prev => [created, ...prev]);
      setShowAddModal(false);
      setNewApp({
        company: '',
        position: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        salary: '',
        notes: '',
        url: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await api.updateApplication(id, { status });
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Offered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Interviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'Applied':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'Rejected':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Job Applications Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep track of all your tech internship and new-grad job applications in one place.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked', count: applications.length, color: 'text-slate-900 dark:text-white' },
          { label: 'Applied', count: applications.filter(a => a.status === 'Applied').length, color: 'text-purple-600' },
          { label: 'Interviewing', count: applications.filter(a => a.status === 'Interviewing').length, color: 'text-blue-600' },
          { label: 'Offers Received', count: applications.filter(a => a.status === 'Offered').length, color: 'text-emerald-600' }
        ].map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</span>
            <div className={`text-2xl font-black ${s.color} mt-1`}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">No applications tracked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {app.position}
                  </h3>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{app.company}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 p-1"
                  title="Delete application"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Status Changer */}
              <div className="flex items-center justify-between pt-1">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${getStatusColor(app.status)}`}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered 🎉</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="h-3 w-3" />
                  <span>{app.appliedDate}</span>
                </div>
              </div>

              {/* Notes */}
              {app.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  {app.notes}
                </p>
              )}

              {/* Salary or URL */}
              {(app.salary || app.url) && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {app.salary ? <span>💰 {app.salary}</span> : <span />}
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      Job Post <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Track New Job Application
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Company</label>
                <input
                  type="text"
                  required
                  value={newApp.company}
                  onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                  placeholder="e.g. Netflix / Microsoft"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Role / Position</label>
                <input
                  type="text"
                  required
                  value={newApp.position}
                  onChange={(e) => setNewApp({ ...newApp, position: e.target.value })}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Status</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Salary (Optional)</label>
                  <input
                    type="text"
                    value={newApp.salary}
                    onChange={(e) => setNewApp({ ...newApp, salary: e.target.value })}
                    placeholder="$110k / yr"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Notes / Follow-ups</label>
                <textarea
                  rows={2}
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Referral contact, recruiter chat date, etc."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold rounded-lg bg-blue-600 text-white"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

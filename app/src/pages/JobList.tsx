import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAppKitAccount } from '@reown/appkit/react';
import { WalletButton } from '../components/WalletButton';

interface Job {
  _id: string;
  title: string;
  description: string;
  price: number;
  skills: string[];
  status: string;
  createdAt: string;
  client: {
    username: string;
    walletAddress: string;
  };
  proposals: any[];
}

const statusColors: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
};

const JobList: React.FC = () => {
  const { isConnected } = useAppKitAccount();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', status: 'open' });

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data.filter((job: Job) => job.status === 'open'));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Unable to load jobs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    let result = jobs;
    if (filters.status !== 'all') result = result.filter(job => job.status === filters.status);
    if (filters.minPrice) result = result.filter(job => job.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) result = result.filter(job => job.price <= parseFloat(filters.maxPrice));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        job =>
          job.title.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          job.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    setFilteredJobs(result);
  }, [jobs, filters, searchTerm]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="h-8 w-48 bg-secondary-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-72 bg-secondary-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100 animate-pulse">
              <div className="h-5 bg-secondary-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-secondary-100 rounded w-full mb-2" />
              <div className="h-3 bg-secondary-100 rounded w-5/6 mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-5 w-16 bg-secondary-200 rounded-full" />
                <div className="h-5 w-20 bg-secondary-200 rounded-full" />
              </div>
              <div className="h-9 bg-primary-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Couldn't load jobs</h2>
        <p className="text-secondary-500 text-sm mb-6 max-w-sm">{error}</p>
        <button
          onClick={fetchJobs}
          className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl btn-glow hover:bg-primary-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">
            Available <span className="gradient-text">Jobs</span>
          </h1>
          <p className="text-secondary-500 text-sm mt-1">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {!isConnected ? (
          <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
            <span className="text-sm text-secondary-600 font-medium">Connect wallet to apply</span>
            <WalletButton />
          </div>
        ) : (
          <Link
            to="/jobs/create"
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl btn-glow hover:bg-primary-700 transition-all inline-flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, skills..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <select
          name="status"
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min SOL"
          value={filters.minPrice}
          onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
          min="0"
          step="0.1"
          className="w-28 px-3 py-2 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max SOL"
          value={filters.maxPrice}
          onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
          min="0"
          step="0.1"
          className="w-28 px-3 py-2 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
        />
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20">
          <div className="h-20 w-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
            <svg className="h-10 w-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">No jobs found</h2>
          <p className="text-secondary-500 text-sm max-w-sm mb-6">
            {jobs.length === 0
              ? 'No jobs have been posted yet. Be the first to post a job!'
              : 'No jobs match your current filters. Try adjusting your search.'}
          </p>
          {jobs.length === 0 && isConnected && (
            <Link
              to="/jobs/create"
              className="px-6 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl btn-glow hover:bg-primary-700 transition-all"
            >
              Post the First Job
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, idx) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100 card-hover flex flex-col fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Title + Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="text-base font-bold text-secondary-900 leading-tight line-clamp-2">{job.title}</h2>
                <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[job.status] || 'bg-secondary-100 text-secondary-600'}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              {/* Description */}
              <p className="text-secondary-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {job.description}
              </p>

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="skill-tag">+{job.skills.length - 4}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-secondary-100 flex items-center justify-between">
                <div>
                  <p className="text-xl font-extrabold text-primary-600">{job.price} <span className="text-sm font-semibold">SOL</span></p>
                  <p className="text-xs text-secondary-400">by {job.client?.username || 'Unknown'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-secondary-400">{job.proposals.length} proposal{job.proposals.length !== 1 ? 's' : ''}</span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="px-4 py-1.5 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FuzzingRun } from '../types';

const ITEMS_PER_PAGE = 10;

export default function RunsPage() {
  const [dataState, setDataState] = useState<'loading' | 'success' | 'error'>('loading');
  const [runs, setRuns] = useState<FuzzingRun[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setDataState('loading');
      try {
        const res = await fetch('/api/runs');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setRuns(data.runs ?? []);
          setDataState('success');
        }
      } catch {
        if (!cancelled) setDataState('error');
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.max(1, Math.ceil(runs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRuns = runs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container-full px-6 py-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-page">Fuzzing Runs</h1>
          <p className="text-meta mt-1">All fuzzing campaigns and their execution results</p>
        </div>
        <div className="flex items-center gap-3">
          {dataState === 'success' && (
            <span className="chip">{runs.length} Total Runs</span>
          )}
          <Link href="/" className="btn-outline text-sm">Dashboard</Link>
        </div>
      </div>

      {dataState === 'loading' && (
        <div className="card card-padding">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-12" />
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      {dataState === 'error' && (
        <div className="card card-padding text-center py-12" style={{ borderLeft: '4px solid #CC1016' }}>
          <span className="text-3xl mb-3 block">⚠</span>
          <p className="font-semibold" style={{ color: '#CC1016' }}>Failed to load fuzzing runs</p>
          <p className="text-meta mt-1 mb-4">Check your connection and try again.</p>
          <button onClick={() => window.location.reload()} className="btn-primary text-sm">
            Retry
          </button>
        </div>
      )}

      {dataState === 'success' && (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Area</th>
                <th>Severity</th>
                <th>Duration</th>
                <th>Seeds</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedRuns.map((run) => (
                <tr key={run.id}>
                  <td className="code-text" style={{ color: '#666666' }}>{run.id}</td>
                  <td><span className={`badge badge-${run.status}`}>{run.status}</span></td>
                  <td>{run.area}</td>
                  <td style={{ color: run.severity === 'critical' ? '#C37D16' : run.severity === 'high' ? '#CC1016' : '#191919' }}>
                    {run.severity}
                  </td>
                  <td className="text-meta">{run.duration.toLocaleString()}ms</td>
                  <td className="text-meta">{run.seedCount.toLocaleString()}</td>
                  <td>
                    <Link href={`/runs/${run.id}`} className="link text-sm">
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dataState === 'success' && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-meta">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-outline text-sm"
              style={{ padding: '0 16px', height: '36px', fontSize: '14px', opacity: currentPage === 1 ? 0.4 : 1 }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-outline text-sm"
              style={{ padding: '0 16px', height: '36px', fontSize: '14px', opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

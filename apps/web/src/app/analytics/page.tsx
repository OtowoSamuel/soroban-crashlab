'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FuzzingRun } from '../types';

export default function AnalyticsPage() {
  const [runs, setRuns] = useState<FuzzingRun[]>([]);
  const [dataState, setDataState] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/runs')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setRuns(data.runs ?? []);
          setDataState('success');
        }
      })
      .catch(() => {
        if (!cancelled) setDataState('error');
      });
    return () => { cancelled = true; };
  }, []);

  const byStatus = runs.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bySeverity = runs.reduce((acc, r) => {
    acc[r.severity] = (acc[r.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byArea = runs.reduce((acc, r) => {
    acc[r.area] = (acc[r.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container-full px-6 py-6 fade-in">
      <div className="mb-6">
        <h1 className="heading-page">Analytics</h1>
        <p className="text-meta mt-1">Failure clustering, heatmaps, trends and run comparisons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { href: '/analytics/clusters', title: 'Failure Clusters', desc: 'View grouped failure signatures and crash patterns', icon: '◈' },
          { href: '/analytics/heatmap', title: 'Performance Heatmap', desc: 'Visualize run duration, CPU and memory usage patterns', icon: '⊟' },
          { href: '/analytics/flaky', title: 'Flaky Test Detection', desc: 'Identify non-deterministic crashes and unstable tests', icon: '⊕' },
          { href: '/trends', title: 'Crash Trends', desc: 'Time series crash trend visualization and analysis', icon: '⊞' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card card-padding card-interactive flex items-start gap-4 text-decoration-none">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#E7F0F9', color: '#0A66C2' }}>
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: '#191919' }}>{item.title}</h3>
              <p className="text-meta mt-1">{item.desc}</p>
            </div>
            <span style={{ color: '#666666' }}>→</span>
          </Link>
        ))}
      </div>

      {dataState === 'loading' && (
        <div className="card card-padding flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0A66C2', borderTopColor: 'transparent' }} />
            <span style={{ color: '#666666' }}>Loading analytics...</span>
          </div>
        </div>
      )}

      {dataState === 'success' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card card-padding">
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#666666' }}>By Status</h3>
            <div className="space-y-2">
              {Object.entries(byStatus).map(([key, count]) => (
                <div key={key} className="flex justify-between items-center py-1">
                  <span style={{ color: '#666666' }}>{key}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-padding">
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#666666' }}>By Severity</h3>
            <div className="space-y-2">
              {Object.entries(bySeverity).map(([key, count]) => (
                <div key={key} className="flex justify-between items-center py-1">
                  <span style={{ color: '#666666' }}>{key}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-padding">
            <h3 className="font-semibold text-sm mb-4" style={{ color: '#666666' }}>By Area</h3>
            <div className="space-y-2">
              {Object.entries(byArea).map(([key, count]) => (
                <div key={key} className="flex justify-between items-center py-1">
                  <span style={{ color: '#666666' }}>{key}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

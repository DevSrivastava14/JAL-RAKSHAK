import React from 'react';

export function StatusBadge({ status, label, pulse = true, size = 'md' }) {
  const normalizedStatus = (status || 'NORMAL').toLowerCase();
  
  let badgeClass = 'normal';
  if (normalizedStatus.includes('crit') || normalizedStatus.includes('danger') || normalizedStatus.includes('severe') || normalizedStatus.includes('breached')) {
    badgeClass = 'critical';
  } else if (normalizedStatus.includes('warn') || normalizedStatus.includes('high') || normalizedStatus.includes('lock') || normalizedStatus.includes('rising')) {
    badgeClass = 'warning';
  } else if (normalizedStatus.includes('adv') || normalizedStatus.includes('mod') || normalizedStatus.includes('watch')) {
    badgeClass = 'advisory';
  } else if (normalizedStatus.includes('safe') || normalizedStatus.includes('norm') || normalizedStatus.includes('ok') || normalizedStatus.includes('fall')) {
    badgeClass = 'safe';
  }

  const displayLabel = label || status?.replace(/_/g, ' ');

  return (
    <span className={`status-badge ${badgeClass} ${size === 'sm' ? 'text-xs py-0.5 px-2' : ''}`}>
      {pulse && <span className="pulse-dot" />}
      <span>{displayLabel}</span>
    </span>
  );
}

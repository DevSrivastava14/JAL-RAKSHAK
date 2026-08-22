import React, { useState } from 'react';
import { X, Send, AlertTriangle, Radio, Shield, CheckCircle2 } from 'lucide-react';

export function AlertModal({ isOpen, onClose, onDispatch, initialWard = "Kurla West" }) {
  const [formData, setFormData] = useState({
    title: `Flash Flood Risk Triggered in ${initialWard}`,
    ward: initialWard,
    severity: "CRITICAL",
    category: "RIVER_OVERFLOW",
    leadTime: "T+15m",
    affectedPopEstimate: 45000,
    description: `Water accumulation has crossed danger mark at ${initialWard}. Inundation expected to reach 1.2m within 30 minutes.`,
    actionItems: [
      "Evacuate ground floor occupants to designated relief camps",
      "Deploy auxiliary high-flow submersible dewatering units",
      "Activate arterial road diversions"
    ],
    channels: ["SMS Broadcast", "Sirens", "NDRF Dispatch", "Traffic Police Feed"]
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onDispatch(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div className="glass-panel animate-slide-down" style={{
        maxWidth: 620,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--color-critical-border)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 51, 75, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 51, 75, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-critical)'
            }}>
              <AlertTriangle size={20} color="var(--color-critical)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Emergency Warning Dispatcher</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Common Alerting Protocol (CAP) v1.2 Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6
            }}
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={56} color="var(--color-safe)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#fff', marginBottom: 8 }}>CAP Alert Broadcasted Successfully!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Disaster Management Control Room, NDRF & SMS gateways notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Alert Severity Tier
                </label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                  className="tactical-input"
                  style={{ background: '#0d1728' }}
                >
                  <option value="CRITICAL">🔴 CRITICAL (Immediate Life Threat)</option>
                  <option value="WARNING">🟠 WARNING (Severe Waterlogging)</option>
                  <option value="ADVISORY">🟡 ADVISORY (Weather Watch)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Target Catchment / Ward
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={e => setFormData({ ...formData, ward: e.target.value })}
                  className="tactical-input"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                Alert Headline / Subject
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="tactical-input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                Public Advisory & Instructions
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="tactical-input"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                Broadcast Channels
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {["SMS Broadcast", "Sirens", "NDRF Dispatch", "Traffic Police Feed", "Civil Defense"].map(channel => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => toggleChannel(channel)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-heading)',
                      border: formData.channels.includes(channel)
                        ? '1px solid var(--color-primary)'
                        : '1px solid var(--border-subtle)',
                      background: formData.channels.includes(channel)
                        ? 'rgba(0, 180, 216, 0.2)'
                        : 'rgba(255, 255, 255, 0.04)',
                      color: formData.channels.includes(channel)
                        ? 'var(--color-primary-light)'
                        : 'var(--text-dim)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Radio size={14} />
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                onClick={onClose}
                className="tactical-btn tactical-btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="tactical-btn tactical-btn-danger"
              >
                <Send size={16} /> Broadcast Emergency Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportBackup, importBackup, clearAll } from '../utils/storageUtils';

export default function BackupRestore() {
  const navigate   = useNavigate();
  const fileRef    = useRef();
  const [msg, setMsg]       = useState('');
  const [msgType, setMsgType] = useState('');
  const [clearing, setClearing] = useState(false);

  const showMsg = (text, type = 'success') => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(''), 5000);
  };

  const handleDownload = () => {
    const data = exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `BalanceBite_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    showMsg('Backup downloaded. Keep it somewhere safe. Email it to yourself or save it to a folder.');
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!data.version || !data.exportedAt) throw new Error('Not a BalanceBite backup');
        importBackup(data);
        showMsg('Backup restored. Redirecting to your dashboard…');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch { showMsg('That file did not look right. Please use a BalanceBite JSON backup.', 'error'); }
    };
    reader.readAsText(file); e.target.value = '';
  };

  const handleClear = () => {
    if (!clearing) {
      setClearing(true);
      showMsg('Click "Clear All Data" again to confirm. This cannot be undone.', 'warning');
      setTimeout(() => setClearing(false), 6000); return;
    }
    clearAll();
    showMsg('All data cleared. Taking you to the welcome screen…');
    setTimeout(() => navigate('/'), 2000);
  };

  const InfoSection = ({ icon, title, desc, children }) => (
    <div className="card" style={{ marginBottom: '1.125rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.125rem' }}>
        <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>{icon}</span>
        <div>
          <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: '#2E2924', fontWeight: 400 }}>{title}</h3>
          {desc && <p style={{ fontSize: '0.8rem', color: '#9A8E84', marginTop: '0.2rem' }}>{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="page-wrapper fade-in">

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">Backup &amp; Restore</h1>
        <p className="page-subtitle">
          Your data lives entirely in this browser. Download a backup weekly. It takes 5 seconds and protects everything you have tracked.
        </p>
      </div>

      {msg && (
        <div style={{
          borderRadius: '1rem', padding: '0.875rem 1rem', marginBottom: '1.25rem',
          fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.55,
          background: msgType === 'error' ? '#FFF5F5' : msgType === 'warning' ? '#FFF9F0' : '#F3F5F0',
          color:      msgType === 'error' ? '#884040' : msgType === 'warning' ? '#8A6020' : '#3F503A',
          border: `1px solid ${msgType === 'error' ? '#F4CCCA' : msgType === 'warning' ? '#F4D9A8' : '#C8D5C0'}`,
        }} className="fade-in">
          {msg}
        </div>
      )}

      <InfoSection icon="⬇️" title="Download Backup" desc="Save all your data as a JSON file.">
        <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.7, marginBottom: '1rem' }}>
          This exports your <strong style={{ color: '#3A3530' }}>profile, all check-in entries, challenge progress, letter to self, badges, and reports</strong>.
          The file is small and easy to email to yourself.
        </p>
        <div style={{ background: '#F3F5F0', border: '1px solid #C8D5C0', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#52664A' }}>
          💡 Recommended: download once a week, and again after completing your 21-day challenge.
        </div>
        <button onClick={handleDownload} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          ⬇️ Download JSON Backup
        </button>
      </InfoSection>

      <InfoSection icon="⬆️" title="Restore from Backup" desc="Upload a previously downloaded file to restore your data.">
        <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.7, marginBottom: '1rem' }}>
          Choose the JSON file you downloaded from BalanceBite.
          Your current data will be <strong style={{ color: '#3A3530' }}>replaced</strong> with what is in the backup.
        </p>
        <div style={{ background: '#FFF9F0', border: '1px solid #F4D9A8', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#8A6020' }}>
          ⚠️ Download a current backup first if you want to keep both sets of data.
        </div>
        <button onClick={() => fileRef.current.click()} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          📂 Upload JSON Backup
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleUpload} />
      </InfoSection>

      <InfoSection icon="📱" title="Use on Another Device" desc="Transfer your tracking data to any browser or device.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            'Download your backup on this device.',
            'Transfer the JSON file (email, cloud storage, USB).',
            'Open BalanceBite on the other device.',
            'Go to Backup & Restore and upload the JSON file.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{
                width: '1.375rem', height: '1.375rem', borderRadius: '50%',
                background: '#E4EAE0', color: '#3F503A', fontSize: '0.7rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</span>
              <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.55 }}>{step}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <div style={{ background: '#EEF4FA', border: '1px solid #B8D0E8', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.125rem' }}>
        <h3 style={{ fontWeight: 700, color: '#3A5570', fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔒 Your Data Privacy
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'All data is saved locally in your browser only.',
            'Nothing is sent to any server or third party.',
            'Clearing your browser data will erase your progress.',
            'Your JSON backup contains your data in plain text. Keep it private.',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#3A5570' }}>
              <span style={{ color: '#52664A', flexShrink: 0 }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ borderColor: '#F4CCCA' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.375rem', flexShrink: 0 }}>🗑️</span>
          <div>
            <h3 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: '#884040', fontWeight: 400 }}>Clear All Data</h3>
            <p style={{ fontSize: '0.8rem', color: '#B07070', marginTop: '0.2rem' }}>Remove everything BalanceBite has saved in this browser</p>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#5C5249', lineHeight: 1.7, marginBottom: '1rem' }}>
          This permanently deletes your profile, all check-in entries, challenge progress, and badges.
          <strong style={{ color: '#884040' }}> This cannot be undone.</strong> Please download a backup first.
        </p>
        <button onClick={handleClear} style={{
          width: '100%', padding: '0.75rem', borderRadius: '100px',
          fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          border: '1.5px solid #F4CCCA', color: '#884040', background: '#FFF5F5',
          transition: 'all 0.18s',
        }}>
          🗑️ {clearing ? 'Click Again to Confirm. Clear All Data.' : 'Clear All Data'}
        </button>
      </div>
    </div>
  );
}

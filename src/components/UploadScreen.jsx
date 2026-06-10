import React, { useRef, useState } from 'react';

export default function UploadScreen({ onFile, loading, error, setError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setError('Format non supporté. Utilisez .xlsx, .xls ou .csv');
      return;
    }
    onFile(file);
  };

  return (
    <div style={styles.screen}>
      {/* Logo */}
      <div style={styles.logoWrap}>
        <div style={styles.logoBox}>
          <span style={{ fontSize: 32 }}>🍸</span>
          <span style={{ fontSize: 14, color: '#c8922a', position: 'absolute', top: 4, right: 6 }}>⭐</span>
        </div>
      </div>

      <h1 style={styles.title}>YNK IP</h1>
      <p style={styles.sub}>Importez votre fichier Excel ou CSV pour commencer</p>

      <div
        style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneActive : {}) }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
      >
        {loading ? (
          <div style={styles.spinner}>⏳ Chargement...</div>
        ) : (
          <>
            <div style={{ fontSize: 40 }}>📂</div>
            <div style={styles.uploadText}>Appuyez pour importer</div>
            <div style={styles.uploadSub}>.xlsx · .xls · .csv</div>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={(e) => handle(e.target.files[0])} />

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
          <button style={styles.errorClose} onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  screen: { minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 14, background: '#f8fafc' },
  logoWrap: { marginBottom: 4 },
  logoBox: { width: 72, height: 72, borderRadius: 18, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  title: { margin: 0, fontSize: 34, fontWeight: 800, color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.5px' },
  sub: { margin: 0, color: '#94a3b8', fontSize: 15, textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  dropzone: { marginTop: 12, width: '100%', maxWidth: 380, minHeight: 150, border: '2px dashed #cbd5e1', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: '#fff', transition: 'all 0.2s' },
  dropzoneActive: { border: '2px dashed #2563eb', background: '#eff6ff' },
  uploadText: { color: '#1e293b', fontWeight: 700, fontSize: 16, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  uploadSub: { color: '#94a3b8', fontSize: 13, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  spinner: { color: '#2563eb', fontSize: 16, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  error: { marginTop: 8, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 16px', color: '#dc2626', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 380, width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  errorClose: { marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', fontSize: 16, cursor: 'pointer', padding: 0 },
};

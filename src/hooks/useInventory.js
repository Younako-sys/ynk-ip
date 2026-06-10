import { useState, useEffect, useCallback, useRef } from 'react';
import { saveInventory, loadInventory, clearInventory } from '../utils/storage';
import { parseFile, detectVinColumn } from '../utils/fileParser';

export function useInventory() {
  const [vehicles, setVehicles] = useState([]);
  const [vinColumn, setVinColumn] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [concessionnaire, setConcessionnaire] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [lieu, setLieu] = useState('Showroom');
  const [lieuxCustom, setLieuxCustom] = useState([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [justValidatedId, setJustValidatedId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const saved = loadInventory();
    if (saved) {
      setVehicles(saved.vehicles || []);
      setVinColumn(saved.vinColumn || null);
      setHeaders(saved.headers || []);
      setConcessionnaire(saved.concessionnaire || '');
      setSessionId(saved.sessionId || Date.now());
      setLieu(saved.lieu || 'Showroom');
      setLieuxCustom(saved.lieuxCustom || []);
    }
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      saveInventory({ vehicles, vinColumn, headers, concessionnaire, sessionId, lieu, lieuxCustom });
    }
  }, [vehicles, vinColumn, headers, concessionnaire, sessionId, lieu, lieuxCustom]);

  const loadFile = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const { rows, headers: hdrs, concessionnaire: conc } = await parseFile(file);
      const vinCol = detectVinColumn(hdrs);
      setHeaders(hdrs);
      setVinColumn(vinCol);
      setConcessionnaire(conc || '');
      const mapped = rows.map((row, i) => ({
        id: i,
        vin: String(row[vinCol] || '').trim().toUpperCase(),
        raw: row,
        found: false,
        foundAt: null,
        lieu: null,
      }));
      setVehicles(mapped);
      setSessionId(Date.now());
      setSearch('');
      setFilter('all');
      setMatchIndex(0);
    } catch (e) {
      setError('Erreur lors de la lecture du fichier. Vérifiez le format.');
    } finally {
      setLoading(false);
    }
  }, []);

  const markFound = useCallback((id) => {
    setVehicles((prev) =>
      prev.map((v) => v.id === id ? { ...v, found: true, foundAt: new Date().toISOString(), lieu } : v)
    );
    setJustValidatedId(id);
    setSearch('');
    setMatchIndex(0);
    setTimeout(() => searchRef.current?.focus(), 100);
  }, [lieu]);

  const unmarkFound = useCallback((id) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, found: false, foundAt: null, lieu: null } : v));
  }, []);

  const resetInventory = useCallback(() => {
    setVehicles((prev) => prev.map((v) => ({ ...v, found: false, foundAt: null, lieu: null })));
  }, []);

  const fullReset = useCallback(() => {
    clearInventory();
    setVehicles([]); setVinColumn(null); setHeaders([]);
    setConcessionnaire(''); setSearch(''); setFilter('all');
    setMatchIndex(0); setSessionId(null);
  }, []);

  // Clear flash when user starts new search
  useEffect(() => { if (search.trim().length >= 4) setJustValidatedId(null); }, [search]);

  const query = search.trim().toUpperCase();
  const matches = query.length >= 4
    ? vehicles.filter((v) => v.vin.endsWith(query) || v.vin.includes(query))
    : [];

  const currentMatch = matches.length > 0 ? matches[matchIndex % matches.length] : null;

  const filteredVehicles = vehicles.filter((v) => {
    if (filter === 'found') return v.found;
    if (filter === 'remaining') return !v.found;
    return true;
  });

  const stats = {
    total: vehicles.length,
    found: vehicles.filter((v) => v.found).length,
    remaining: vehicles.filter((v) => !v.found).length,
    pct: vehicles.length > 0 ? Math.round((vehicles.filter((v) => v.found).length / vehicles.length) * 100) : 0,
  };

  const statsByLieu = vehicles
    .filter((v) => v.found && v.lieu)
    .reduce((acc, v) => { acc[v.lieu] = (acc[v.lieu] || 0) + 1; return acc; }, {});

  return {
    vehicles, filteredVehicles, vinColumn, headers, concessionnaire,
    search, setSearch, filter, setFilter,
    lieu, setLieu, lieuxCustom, setLieuxCustom,
    matchIndex, setMatchIndex, currentMatch,
    loading, error, setError,
    loadFile, markFound, unmarkFound, resetInventory, fullReset,
    matches, stats, statsByLieu, searchRef, justValidatedId,
    hasData: vehicles.length > 0,
  };
}

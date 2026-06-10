import React from 'react';
import { useInventory } from './hooks/useInventory';
import UploadScreen from './components/UploadScreen';
import InventoryScreen from './components/InventoryScreen';

export default function App() {
  const inv = useInventory();

  return inv.hasData ? (
    <InventoryScreen
      vehicles={inv.vehicles}
      filteredVehicles={inv.filteredVehicles}
      vinColumn={inv.vinColumn}
      concessionnaire={inv.concessionnaire}
      search={inv.search}
      setSearch={inv.setSearch}
      filter={inv.filter}
      setFilter={inv.setFilter}
      lieu={inv.lieu}
      setLieu={inv.setLieu}
      lieuxCustom={inv.lieuxCustom}
      setLieuxCustom={inv.setLieuxCustom}
      matchIndex={inv.matchIndex}
      setMatchIndex={inv.setMatchIndex}
      currentMatch={inv.currentMatch}
      stats={inv.stats}
      statsByLieu={inv.statsByLieu}
      matches={inv.matches}
      searchRef={inv.searchRef}
      markFound={inv.markFound}
      unmarkFound={inv.unmarkFound}
      resetInventory={inv.resetInventory}
      fullReset={inv.fullReset}
      onNewFile={inv.fullReset}
      justValidatedId={inv.justValidatedId}
    />
  ) : (
    <UploadScreen
      onFile={inv.loadFile}
      loading={inv.loading}
      error={inv.error}
      setError={inv.setError}
    />
  );
}

import { useState, useEffect } from 'react';
import { clear } from 'idb-keyval';

export function useWorkspaceFiles(_toolId: string) {
  const [files, setFiles] = useState<File[]>([]);

  // Clear any legacy IndexedDB caches that were causing the ghost files bug
  useEffect(() => {
    clear().catch(console.warn);
  }, []);

  return { files, setFiles, isLoaded: true };
}

import { useState, useEffect } from 'react';
import { get, set, del } from 'idb-keyval';

export function useWorkspaceFiles(toolId: string) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    const loadFiles = async () => {
      try {
        const saved = await get(`workspace-files-${toolId}`);
        if (mounted && saved && typeof saved === 'object' && 'timestamp' in saved && 'data' in saved) {
          const now = Date.now();
          const ONE_HOUR = 60 * 60 * 1000;
          if (now - saved.timestamp < ONE_HOUR && Array.isArray(saved.data)) {
            setFiles(saved.data);
          } else {
            // Expired, clear it
            await del(`workspace-files-${toolId}`);
          }
        } else if (mounted && Array.isArray(saved)) {
          // Legacy migration
          setFiles(saved);
        }
      } catch (err) {
        console.warn('Failed to load files from IndexedDB', err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    };
    loadFiles();
    return () => { mounted = false; };
  }, [toolId]);

  // Save to IndexedDB when files change
  useEffect(() => {
    if (!isLoaded) return; // Don't overwrite with initial empty state
    const saveFiles = async () => {
      try {
        if (files.length > 0) {
          await set(`workspace-files-${toolId}`, {
            data: files,
            timestamp: Date.now()
          });
        } else {
          await del(`workspace-files-${toolId}`);
        }
      } catch (err) {
        console.warn('Failed to save files to IndexedDB', err);
      }
    };
    saveFiles();
  }, [files, toolId, isLoaded]);

  return { files, setFiles, isLoaded };
}

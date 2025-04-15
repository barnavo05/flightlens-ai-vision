
import { useEffect } from 'react';

// Define a type for the key combinations
type KeyCombo = string | string[];

// Define a type for the handler function
type ShortcutHandler = (e: KeyboardEvent) => void;

interface KeyboardShortcutOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  targetKey?: KeyCombo;
}

const useKeyboardShortcut = (
  handler: ShortcutHandler,
  options: KeyboardShortcutOptions = {}
) => {
  useEffect(() => {
    const { preventDefault = true, stopPropagation = true, targetKey } = options;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If no targetKey is specified, execute for all keys
      if (!targetKey) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        handler(e);
        return;
      }

      // Handle single key
      if (typeof targetKey === 'string' && e.key === targetKey) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        handler(e);
        return;
      }

      // Handle array of keys
      if (Array.isArray(targetKey) && targetKey.includes(e.key)) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        handler(e);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handler, options]);
};

export default useKeyboardShortcut;

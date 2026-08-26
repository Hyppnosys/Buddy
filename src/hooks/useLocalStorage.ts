import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '../services/storage';

type SetValue<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage<T>(key, initialValue));

  const update = useCallback(
    (next: SetValue<T>) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update] as const;
}

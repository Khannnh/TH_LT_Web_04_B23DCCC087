import { useState, useEffect } from 'react';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper để parse date từ JSON
const parseDates = <T extends BaseEntity>(item: any): T => {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  } as T;
};

export function useBaseModel<T extends BaseEntity>(key: string) {
  const [items, setItems] = useState<T[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved).map((item: any) => parseDates<T>(item)) : [];
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  const add = (item: Omit<T, keyof BaseEntity>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const update = (id: string, item: Partial<Omit<T, keyof BaseEntity>>) => {
    setItems(prev => prev.map(i =>
      i.id === id
        ? { ...i, ...item, updatedAt: new Date() }
        : i
    ));
  };

  const remove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return {
    items,
    add,
    update,
    remove,
  };
}

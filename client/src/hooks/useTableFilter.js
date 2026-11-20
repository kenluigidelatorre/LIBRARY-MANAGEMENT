import { useMemo, useState } from 'react';

export function useTableFilter(items, searchFields = [], initialSortKey = '') {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = items;

    if (q) {
      result = items.filter((item) =>
        searchFields.some((field) =>
          String(item[field] ?? '')
            .toLowerCase()
            .includes(q)
        )
      );
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const valA = String(a[sortKey] ?? '').toLowerCase();
        const valB = String(b[sortKey] ?? '').toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, search, searchFields, sortKey, sortOrder]);

  return {
    search,
    setSearch,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    filteredItems,
  };
}

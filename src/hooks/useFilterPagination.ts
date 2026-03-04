import { useState, useMemo, useEffect } from 'react';

const parsePrice = (price?: string | number) => {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
};

export function useFilterPagination<T>(items: T[], defaultItemsPerPage: string = '20') {
  const [sortBy, setSortBy] = useState('date-desc');
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, itemsPerPage]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    switch (sortBy) {
      case 'price-desc':
        filtered.sort((a: any, b: any) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'price-asc':
        filtered.sort((a: any, b: any) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'alpha-asc':
        filtered.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'alpha-desc':
        filtered.sort((a: any, b: any) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'date-asc':
        filtered.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'date-desc':
      default:
        filtered.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return filtered;
  }, [items, sortBy]);

  const clearFilters = () => {
    setSortBy('date-desc');
    setItemsPerPage(defaultItemsPerPage);
  };

  const hasActiveFilters = sortBy !== 'date-desc' || itemsPerPage !== defaultItemsPerPage;
  
  const currentItemsPerPage = Number(itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / currentItemsPerPage);
  const startIndex = (currentPage - 1) * currentItemsPerPage;
  const displayedItems = filteredItems.slice(startIndex, startIndex + currentItemsPerPage);

  return {
    sortBy,
    setSortBy,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    clearFilters,
    hasActiveFilters,
    filteredItems,
    displayedItems,
    totalPages
  };
}

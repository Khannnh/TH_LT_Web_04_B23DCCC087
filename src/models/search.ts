import { useState } from 'react';
import { useDiplomaModel } from './diploma';
import type { Diploma } from '@/types/diploma';

export interface SearchParams {
  diplomaNumber?: string;
  bookNumber?: number;
  studentId?: string;
  fullName?: string;
  dateOfBirth?: Date;
}

const STORAGE_KEY = 'search-history';

export function useSearchModel() {
  const { items: diplomas } = useDiplomaModel();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Diploma[]>([]);
  const [searchHistory, setSearchHistory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const search = async (params: SearchParams) => {
    setLoading(true);
    try {
      // Lọc kết quả dựa trên các tham số tìm kiếm
      const results = diplomas.filter(diploma => {
        if (params.diplomaNumber && !diploma.diplomaNumber.includes(params.diplomaNumber)) {
          return false;
        }
        if (params.bookNumber && diploma.bookNumber !== params.bookNumber) {
          return false;
        }
        if (params.studentId && !diploma.studentId.includes(params.studentId)) {
          return false;
        }
        if (params.fullName && !diploma.fullName.toLowerCase().includes(params.fullName.toLowerCase())) {
          return false;
        }
        if (params.dateOfBirth) {
          const diplomaDate = new Date(diploma.dateOfBirth);
          const searchDate = new Date(params.dateOfBirth);
          if (diplomaDate.toDateString() !== searchDate.toDateString()) {
            return false;
          }
        }
        return true;
      });

      setSearchResults(results);
      return results;
    } finally {
      setLoading(false);
    }
  };

  const recordSearch = async (graduationDecisionId: string) => {
    const newHistory = {
      ...searchHistory,
      [graduationDecisionId]: (searchHistory[graduationDecisionId] || 0) + 1
    };
    setSearchHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  return {
    searchResults,
    loading,
    search,
    recordSearch,
    searchHistory
  };
}

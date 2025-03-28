import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { DiplomaBook } from './types';
import { diplomaBookService } from '@/services/diploma';

export default function useDiplomaBook() {
  const [books, setBooks] = useState<DiplomaBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<DiplomaBook>();

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = diplomaBookService.getAll();
      setBooks(data);
    } catch (error) {
      message.error('Không thể tải danh sách sổ văn bằng');
    }
    setLoading(false);
  }, []);

  const createBook = useCallback(async (values: Partial<DiplomaBook>) => {
    setLoading(true);
    try {
      const newBook = await diplomaBookService.create(values);
      setBooks(prev => [...prev, newBook]);
      message.success('Tạo sổ văn bằng thành công');
      return newBook;
    } catch (error) {
      message.error('Tạo sổ văn bằng thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBook = useCallback(async (id: string, values: Partial<DiplomaBook>) => {
    setLoading(true);
    try {
      const updatedBook = await diplomaBookService.update(id, values);
      setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
      message.success('Cập nhật sổ văn bằng thành công');
      return updatedBook;
    } catch (error) {
      message.error('Cập nhật sổ văn bằng thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    books,
    loading,
    selectedBook,
    setSelectedBook,
    loadBooks,
    createBook,
    updateBook
  };
}
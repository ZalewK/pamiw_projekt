// viewmodels/BookViewModel.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import BookModel from '../models/BookModel';

const BookViewModel = () => {
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://192.168.0.2:5000/books');
      const bookData = response.data.map(book => new BookModel(book.id, book.title, book.author));
      setBooks(bookData);
    } catch (error) {
      console.error('Błąd podczas pobierania książek', error);
    }
  };

  const addBook = async () => {
    try {
      await axios.post('http://192.168.0.2:5000/books', { title: newBookTitle, author: newBookAuthor });
      fetchBooks();
      setNewBookTitle('');
      setNewBookAuthor('');
    } catch (error) {
      console.error('Błąd podczas dodawania książki', error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete('http://192.168.0.2:5000/books/${bookId}');
      fetchBooks();
    } catch (error) {
      console.error('Błąd podczas usuwania książki', error);
    }
  };

  const editBook = async () => {
    try {
      await axios.put('http://192.168.0.2:5000/books/${editingBook.id}', { title: newBookTitle, author: newBookAuthor });
      fetchBooks();
      setEditingBook(null);
      setNewBookTitle('');
      setNewBookAuthor('');
    } catch (error) {
      console.error('Błąd podczas edycji książki', error);
    }
  };

  return {
    books,
    newBookTitle,
    newBookAuthor,
    setNewBookTitle,
    setNewBookAuthor,
    addBook,
    deleteBook,
    editBook,
    editingBook,
    setEditingBook,
  };
};

export default BookViewModel;

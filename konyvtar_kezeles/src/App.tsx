import React, { useState, useEffect } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  available: boolean;
}

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  const [sort, setSort] = useState<'title' | 'author' | 'year' | 'genre' | 'pages'>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [newBook, setNewBook] = useState<Book>({
    id: 0,
    title: '',
    author: '',
    year: 0,
    genre: '',
    pages: 0,
    available: true,
  });

  const fetchBooks = async () => {
    const response = await fetch(`http://localhost:5000/books?page=${page}&limit=${limit}&sort=${sort}&order=${order}`);
    const data = await response.json();
    setBooks(data.books);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchBooks();
  }, [page, limit, sort, order]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await fetch(`http://localhost:5000/books/${id}`, { method: 'DELETE' });
      fetchBooks();
    }
  };

  const handleAddBook = async () => {
    await fetch('http://localhost:5000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    fetchBooks();
  };

  return (
    <div>
      <h1>Library</h1>
      
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          value={newBook.year}
          onChange={(e) => setNewBook({ ...newBook, year: parseInt(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Pages"
          value={newBook.pages}
          onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) })}
        />
        <input
          type="checkbox"
          checked={newBook.available}
          onChange={(e) => setNewBook({ ...newBook, available: e.target.checked })}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <div>
        {books.map((book) => (
          <div key={book.id}>
            <h2>{book.author} - {book.title}</h2>
            <p>Year: {book.year}</p>
            <p>Genre: {book.genre}</p>
            <p>Pages: {book.pages}</p>
            <p>Available: {book.available ? 'Yes' : 'No'}</p>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>Previous</button>
        <button onClick={() => setPage(page + 1)} disabled={page * limit >= total}>Next</button>
      </div>
    </div>
  );
};

export default App;

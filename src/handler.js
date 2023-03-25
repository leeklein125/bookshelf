const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

        //respon bila gagal
        if (!name){
            const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            })
            .code(400);
            return response;
        }

        if (readPage > pageCount){
            const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
            return response;
        }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook ={ name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    //respon bila berhasil
    if (isSuccess){
        const response = h
        .response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data:{
                bookId: id,
            },
        })
        .code(201);
        return response;
    }

    const response = h
    .response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    })
    .code(500);
    return response;
};


const getAllBooksHandler = (request, h) => {
      const response = h
        .response({
          status: 'success',
          data: {
            books: books.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        })
        .code(200);
  
      return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0]; 
  
    if (book) {
        const response = h
        .response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        })
      .code(404);
      return response;
    }

    const response = h
    .response({
      status: 'success',
      data: {
        books,
      },
    })
    .code(200);
    return response;
  };

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    // bila tidak ada nama dilampirkan
    if (!name) {
      const response = h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
      return response;
    }
  
    // bila readpage lebih besar dari pagecount
    if (readPage > pageCount) {
        const response = h
        .response({
          status: 'fail',
          message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
      return response;
    }
  
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
  
    const index = books.findIndex((note) => note.id === bookId); 
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };
  
      // bila buku berhasil diperbarui
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        })
        .code(200);
      return response;
    }
  
    // bila id tidak ditemukan
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
    return response;
  };

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const index = books.findIndex((note) => note.id === bookId);
  
    if (index !== -1) {
      books.splice(index, 1);
  
      // bila id ditemukan
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
      return response;
    }
  
    // bila id tidak ditemukan
    const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
    return response;
  };

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
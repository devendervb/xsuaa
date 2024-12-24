module.exports = (srv) => {
  const { Books } = srv.entities;

  srv.on('READ', 'Books', async (req) => {
    return SELECT.from(Books);
  });

  srv.on('CREATE', 'Books', async (req) => {
    const data = req.data;
    if (data.stock < 0) {
      req.error(400, 'Stock cannot be negative');

    }

    return INSERT.into(Books).entries(data);
  });

  srv.on('UPDATE', 'Books', async (req) => {
    const data = req.data;
    const { ID } = data;

    if (data.stock < 0) {
      req.error(400, 'Stock cannot be negative');
    }

    return UPDATE(Books).set(data).where({ ID });
  });


  srv.on('DELETE', 'Books', async (req) => {
    const { ID } = req.data;
    return DELETE.from(Books).where({ ID });
  });

  srv.on("IncreaseStock", async (req) => {
    const { bookID, quantity } = req.data;

    // Update the stock for the specified book
    const result = await UPDATE(Books)
      .set({ stock: { '+=': quantity } })
      .where({ ID: bookID });

    if (result === 0) {
      return `Book with ID ${bookID} not found.`;
    }

    return `Stock for book ${bookID} increased by ${quantity}.`;
  });

  srv.on("GetBooksByAuthor", async (req) => {
    const { authorID } = req.data;

    const books = await SELECT.from(Books)
      .columns(['ID', 'title', 'stock'])
      .where({ authorID: authorID });

    return books.map(book => ({
      ...book,
      isInStock: book.stock > 0 ? 'Yes' : 'No'
    }));
  });

  srv.on("DeleteBooks", async (req) => {

    const { bookID } = req.data;

    if (!bookID) {
      req.error(400, 'Book ID is required');
    }

    // checking if book exist
    const existingBook = await SELECT.from("Books").where({ ID: bookID });

    if (!existingBook || existingBook.length === 0) {
      req.error(404, `Book with ID ${bookID} does not exist`);
    }
    const result = await DELETE.from('Books').where({ ID: bookID });

    if (result === 0) {
      return `Not Able to delete ${bookID}`;
    }
    if (result === 1) {
      return `Succesfully delete entry of Book with Book ID  ${bookID}`;
    }
    return null;

  });

  srv.on("RestockBooks", async (req) => {
    const { threshhold, quantity } = req.data;

    if (!threshhold || !quantity) {
      req.error(400, ` ${threshhold} and ${quantity}  are required`);
    }
    if (threshhold > 0) {
      const booksToRestock = await SELECT.from(Books).where(`stock< ${threshhold}`);
    }

    if (booksToRestock.length === 0) {
      return [];
    }
    // Update stock for all selected books
    await Promise.all(
      booksToRestock.map((book) =>
        UPDATE("Books").set({ stock: { "+=": quantity } }).where({ ID: book.ID })
      )
    );

    // Return the updated books
    const updatedBooks = await SELECT.from("Books").where`stock >= ${threshold}`;
    return updatedBooks;
  });
};

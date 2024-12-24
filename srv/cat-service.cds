using my.bookshop as my from '../db/schema';

service CatalogService {
   
    entity Books as projection on my.Books;
    entity Authors as projection on my.Authors;

    // Define an Action to Increase Stock
    action IncreaseStock(bookID: Integer, quantity: Integer) returns String;

    // Define a Function to Get Books by Author
    function GetBooksByAuthor(authorID: Integer) returns array of Books;

    action DeleteBooks(bookID : Integer) returns String;

    action RestockBooks(threshhold: Integer, quantity: Integer) returns array of Books;
}
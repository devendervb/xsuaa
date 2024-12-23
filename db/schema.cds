namespace my.bookshop;

entity Authors{
    key ID : Integer;
    name : String;
    country : String;

    books : Association to many Books on books.authorID = $self.ID;
}

entity Books{
    key ID  : Integer;
    title   : String;
    authorID  : Integer;
    stock   :Integer;
}




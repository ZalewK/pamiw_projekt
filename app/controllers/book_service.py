from app.models.book import Book, BookSchema
from app import db

class BookService:
    book_schema = BookSchema()
    books_schema = BookSchema(many=True)

    @staticmethod
    def get_all_books():
        all_books = Book.query.all()
        return BookService.books_schema.dump(all_books)

    @staticmethod
    def get_book_by_id(book_id):
        book = Book.query.get(book_id)
        if book:
            return BookService.book_schema.dump(book)
        else:
            return None

    @staticmethod
    def add_book(title, author):
        new_book = Book(title=title, author=author)
        db.session.add(new_book)
        db.session.commit()
        return BookService.book_schema.dump(new_book)

    @staticmethod
    def update_book(book_id, title, author):
        book = Book.query.get(book_id)
        if book:
            book.title = title
            book.author = author
            db.session.commit()
            return BookService.book_schema.dump(book)
        else:
            return None

    @staticmethod
    def delete_book(book_id):
        book = Book.query.get(book_id)
        if book:
            db.session.delete(book)
            db.session.commit()
            return BookService.book_schema.dump(book)
        else:
            return None
        
    @staticmethod
    def clear_and_initialize_data():
        db.session.query(Book).delete()

        # Dodanie danych testowych
        book1 = Book(title="Antygona", author="Sofokles")
        book2 = Book(title="Ksiega", author="Karol Zalewski")
        book3 = Book(title="Test", author="Tester Test")

        db.session.add(book1)
        db.session.add(book2)
        db.session.add(book3)

        db.session.commit()

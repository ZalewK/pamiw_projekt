# __init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    from app.controllers.book_service import BookService

    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
    db.init_app(app)

    from app.controllers.book_controller import book_bp
    from app.views.home import home_bp
    app.register_blueprint(book_bp)
    app.register_blueprint(home_bp)

    return app
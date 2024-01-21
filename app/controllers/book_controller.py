from flask import request, jsonify, Blueprint
from flask.helpers import send_from_directory
from app.controllers.book_service import BookService
from app.models.book import BookSchema
from flask_cors import cross_origin
import json

with open('appsettings.json') as config_file:
    app_settings = json.load(config_file)

base_url = app_settings['ApiSettings']['BaseUrl']
resource_endpoint = app_settings['ApiSettings']['ResourceEndpoint']
isProduction = app_settings['ApiSettings']['isProduction']

books_endpoint = f'{resource_endpoint}'
book_withid_endpoint = f'{resource_endpoint}/<int:book_id>'

book_bp = Blueprint('book', __name__)

@book_bp.route('/templates/<path:filename>')
def static_files(filename):
    return send_from_directory('templates', filename)

@book_bp.route(books_endpoint, methods=['GET'])
@cross_origin()
def get_books():
    all_books = BookService.get_all_books()
    if len(all_books) != 0:
        return jsonify(all_books), 200
    else:
        return jsonify({'message': 'Book list is empty'}), 200

@book_bp.route(book_withid_endpoint, methods=['GET'])
@cross_origin()
def get_book(book_id):
    book = BookService.get_book_by_id(book_id)
    if book:
        return jsonify(book)
    else:
        if(isProduction == True):
            return jsonify({'message': 'Book not found'}), 404

@book_bp.route(books_endpoint, methods=['POST'])
@cross_origin()
def create_book():
    data = request.get_json()

    book_schema = BookSchema()

    if(isProduction == True):
        validation_errors = book_schema.validate(data)
        if validation_errors:
            return jsonify({'message': 'Not enough input data!', 'errors': validation_errors}), 400
    
    title = data.get('title')
    author = data.get('author')

    new_book = BookService.add_book(title, author)

    return jsonify(new_book)

@book_bp.route(book_withid_endpoint, methods=['PUT'])
@cross_origin()
def update_book(book_id):
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')

    updated_book = BookService.update_book(book_id, title, author)

    if updated_book:
        return jsonify(updated_book)
    else:
        return jsonify({'message': 'Book not found'}), 404

@book_bp.route(book_withid_endpoint, methods=['DELETE'])
@cross_origin()
def delete_book(book_id):
    deleted_book = BookService.delete_book(book_id)
    if deleted_book:
        return jsonify(deleted_book)
    else:
        return jsonify({'message': 'Book not found'}), 404

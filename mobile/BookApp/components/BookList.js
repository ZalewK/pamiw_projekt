// components/BookList.js
import React from 'react';
import { View, FlatList, Button, TextInput, Modal, StyleSheet } from 'react-native';
import BookListItem from './BookListItem';
import BookViewModel from '../viewmodels/BookViewModel';

const bookViewModel = BookViewModel();

const BookList = () => {
  return (
    <View>
      <FlatList
        data={bookViewModel.books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookListItem
            book={item}
            onDelete={bookViewModel.deleteBook}
            onEdit={() => bookViewModel.setEditingBook(item)}
          />
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Tytuł nowej książki"
        value={bookViewModel.newBookTitle}
        onChangeText={text => bookViewModel.setNewBookTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor nowej książki"
        value={bookViewModel.newBookAuthor}
        onChangeText={text => bookViewModel.setNewBookAuthor(text)}
      />
      <Button title="Dodaj książkę" onPress={bookViewModel.addBook} />

      <Modal visible={!!bookViewModel.editingBook} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nowy tytuł książki"
            value={bookViewModel.newBookTitle}
            onChangeText={text => bookViewModel.setNewBookTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nowy autor książki"
            value={bookViewModel.newBookAuthor}
            onChangeText={text => bookViewModel.setNewBookAuthor(text)}
          />
          <View style={styles.buttonContainer}>
            <Button title="Zapisz zmiany" onPress={bookViewModel.editBook} />
            <Button title="Anuluj" onPress={() => bookViewModel.setEditingBook(null)} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default BookList;

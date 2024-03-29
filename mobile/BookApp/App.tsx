import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Button, TextInput, Modal, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCameraVisible, setCameraVisible] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const takePicture = async () => {
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log(data.uri);
      }
  };

    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://pamiw-web.onrender.com/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania książek', error);
      }
    };

  const addBook = async () => {
    try {
      await axios.post('https://pamiw-web.onrender.com/books', {
        title: newBookTitle,
        author: newBookAuthor,
      });
      setNewBookTitle('');
      setNewBookAuthor('');
      fetchBooks();
    } catch (error) {
      console.error('Błąd podczas dodawania książki', error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`https://pamiw-web.onrender.com/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Błąd podczas usuwania książki', error);
    }
  };

  const editBook = async () => {
    try {
      await axios.put(`https://pamiw-web.onrender.com/books/${editingBook.id}`, {
        title: newBookTitle,
        author: newBookAuthor,
      });
      setEditingBook(null);
      setNewBookTitle('');
      setNewBookAuthor('');
      setModalVisible(false);
      fetchBooks();
    } catch (error) {
      console.error('Błąd podczas edycji książki', error);
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setNewBookTitle(book.title);
    setNewBookAuthor(book.author);
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingBook(null);
    setNewBookTitle('');
    setNewBookAuthor('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista Książek</Text>
      <Button title="Otwórz kamerę" onPress={() => setCameraVisible(true)} />
        <FlatList
          data={books.books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookContainer}>
              <Text style={styles.bookTitle}>Tytuł: {item.title}</Text>
              <Text style={styles.bookAuthor}>Autor: {item.author}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Usuń" onPress={() => deleteBook(item.id)} color="red" />
                <Button title="Edytuj" onPress={() => openEditModal(item)} />
              </View>
            </View>
          )}
        />
      <TextInput
        style={styles.input}
        placeholder="Tytuł nowej książki"
        value={newBookTitle}
        onChangeText={(text) => setNewBookTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor nowej książki"
        value={newBookAuthor}
        onChangeText={(text) => setNewBookAuthor(text)}
      />
      <Button title="Dodaj książkę" onPress={addBook} />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Edytuj Książkę</Text>
          <TextInput
            style={styles.input}
            placeholder="Nowy tytuł książki"
            value={newBookTitle}
            onChangeText={(text) => setNewBookTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nowy autor książki"
            value={newBookAuthor}
            onChangeText={(text) => setNewBookAuthor(text)}
          />
          <View style={styles.buttonContainer}>
            <Button title="Zapisz zmiany" onPress={editBook} />
            <Button title="Anuluj" onPress={closeModal} color="gray" />
          </View>
        </View>
      </Modal>
      <Modal visible={isCameraVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1 }}>
          <RNCamera
            ref={cameraRef}
            style={{ flex: 1 }}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
          />
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <Button title="Zrob zdjecie" onPress={takePicture} />
            <Button title="Zamknij kamerę" onPress={() => setCameraVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'marginTop',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
});

export default App;

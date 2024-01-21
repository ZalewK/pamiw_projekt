// components/BookForm.js
import React from 'react';
import { View, TextInput, Button } from 'react-native';

const BookForm = ({ onAdd }) => {
  return (
    <View>
      <TextInput placeholder="Tytuł nowej książki" />
      <TextInput placeholder="Autor nowej książki" />
      <Button title="Dodaj książkę" onPress={onAdd} />
    </View>
  );
};

export default BookForm;

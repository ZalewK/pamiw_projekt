// components/BookListItem.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const BookListItem = ({ book, onDelete, onEdit }) => {
  return (
    <View>
      <Text>Tytuł: {book.title}</Text>
      <Text>Autor: {book.author}</Text>
      <Button title="Usuń" onPress={() => onDelete(book.id)} color="red" />
      <Button title="Edytuj" onPress={onEdit} />
    </View>
  );
};

export default BookListItem;

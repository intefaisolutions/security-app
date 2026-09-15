import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Icon
        name="search-outline"
        size={22}
        color="#94A3B8"
      />

      <TextInput
        placeholder="Search residents, visitors..."
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 50,
    paddingHorizontal: 16,
    height: 55,
    borderRadius: 15,
    elevation: 3,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },
});
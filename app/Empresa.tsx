import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

interface Company {
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  sitioWeb?: string;
}

const Empresa: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState<Company>({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    sitioWeb: '',
  });

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        'https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/empresas'
      );
      const data = await response.json();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
    const interval = setInterval(fetchCompanies, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredCompanies(
      companies.filter((company) =>
        company.nombre.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleFormSubmit = async () => {
    if (
      !newCompany.nombre ||
      !newCompany.direccion ||
      !newCompany.telefono ||
      !newCompany.correo
    ) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch(
        'https://bazar20241109230927.azurewebsites.net/api/EmpresaCliente/registerempresa',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newCompany,
            sitioWeb: newCompany.sitioWeb || 'N/A',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      Alert.alert('Registro exitoso', 'La empresa se registró correctamente.');
      setShowForm(false);
      setNewCompany({
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        sitioWeb: '',
      });
      fetchCompanies();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error al registrar', 'Hubo un problema al registrar la empresa.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de Empresas</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre de empresa"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <Button title="Agregar Empresa" onPress={() => setShowForm(true)} />

      {showForm ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newCompany.nombre}
            onChangeText={(value) => setNewCompany({ ...newCompany, nombre: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={newCompany.direccion}
            onChangeText={(value) => setNewCompany({ ...newCompany, direccion: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={newCompany.telefono}
            onChangeText={(value) => setNewCompany({ ...newCompany, telefono: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={newCompany.correo}
            onChangeText={(value) => setNewCompany({ ...newCompany, correo: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Sitio Web"
            value={newCompany.sitioWeb}
            onChangeText={(value) => setNewCompany({ ...newCompany, sitioWeb: value })}
          />
          <View style={styles.formButtons}>
            <Button title="Guardar" onPress={handleFormSubmit} />
            <Button title="Cancelar" onPress={() => setShowForm(false)} />
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredCompanies}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{item.nombre}</Text>
              <Text style={styles.tableCell}>{item.direccion}</Text>
              <Text style={styles.tableCell}>{item.telefono}</Text>
              <Text style={styles.tableCell}>{item.correo}</Text>
              <Text style={styles.tableCell}>{item.sitioWeb || 'N/A'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tableRowEven: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 8,
  },
  tableRowOdd: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Empresa;

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';


const Home = ({ route, navigation }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [modal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5432/students");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5432/students/${selectedStudent.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      setModal(false);
      setStudents(prevStudents => prevStudents.filter(student => student.id !== selectedStudent.id));
      Alert.alert("Student Deleted", "The student has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };



  const handleStudentPress = (student) => {
    setSelectedStudent(student);
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }
{
/*  const handleAddStudent = (newStudent) => {
    setStudents(prevStudents => [...prevStudents, newStudent]);
  };
*/}


  const handleUpdateStudent = (updatedStudent) => {
    // Update the student list with the updated student data
    setStudents(prevStudents => prevStudents.map(student => {
      if (student.id === updatedStudent.id) {
        return updatedStudent;
      }
      return student;
    }));
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleStudentPress(item)} style={styles.studentData}>
      <View style={styles.itemContainer}>
        <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
      </View>
    </TouchableOpacity>
  );

  
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstname} ${student.lastname}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.mainView}>

        <FlatList
          data={filteredStudents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />

          <Modal
            animationType='slide'
            transparent={true}
            visible={modal}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>ID: {selectedStudent.idno}</Text>
                <Text>Last Name: {selectedStudent.lastname}</Text>
                <Text>First Name: {selectedStudent.firstname}</Text>
                <Text>Course: {selectedStudent.course}</Text>
                <Text>Level: {selectedStudent.level}</Text>

                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity onPress={() => handleDelete()} style={styles.modalButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                



                  <TouchableOpacity onPress={() => closeModal()} style={[styles.modalButton, styles.cancelButton]}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 100,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', 
    alignSelf: 'center', 
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A2558',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  mainView: {
    marginTop: 10,
    flex: 1,
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A2558',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 15,
    color: 'white',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  studentData: {
    borderColor: "#4A2558",
    width: 350,
    height: 70,
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 10,
  }
});

export default Home;

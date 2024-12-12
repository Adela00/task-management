import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksScreen = () => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasksToStorage = async (tasks) => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem('@tasks', jsonValue);
    } catch (e) {
      console.error('Error saving tasks to storage', e);
    }
  };

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@tasks');
      const loadedTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
      setTasks(loadedTasks);
    } catch (e) {
      console.error('Error loading tasks from storage', e);
    }
  };

  const openModal = (isUpdate = false, task = {}) => {
    setTask(task.text || '');
    setDescription(task.description || '');
    setIsUpdate(isUpdate);
    setCurrentTaskId(task.id || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setTask('');
    setDescription('');
    setModalVisible(false);
  };

  const saveTask = () => {
    if (task.trim()) {
      const updatedTasks = isUpdate && currentTaskId ? 
        tasks.map((t) => (t.id === currentTaskId ? { ...t, text: task, description } : t)) :
        [...tasks, { id: Date.now().toString(), text: task, description }];

      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      closeModal();
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.description}>Manage your tasks here.</Text>

        <TextInput
          style={styles.input}
          placeholder="click add to enter task"
          value={task}
          onChangeText={setTask}
        />
        
        <TouchableOpacity style={styles.button} onPress={() => openModal(false)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => openModal(true, item)}
              >
                <Text style={styles.updateButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => Alert.alert(
                  "Delete Task",
                  "Are you sure you want to delete this task?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => deleteTask(item.id) }
                  ]
                )}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Task"
              value={task}
              onChangeText={setTask}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={saveTask}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffffc',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
  },
  taskDescription: {
    fontSize: 14,
    color: 'gray',
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff0000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default TasksScreen;

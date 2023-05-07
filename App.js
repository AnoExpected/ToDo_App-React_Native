import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ImageBackground,Switch} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';


const App = () => {
  return <AppContainer />;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cfe2f3',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    //alignItems: 'center',
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  datePicker: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  picker: {
    marginLeft: 20,
    marginRight: 20,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  quoteContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  
  taskListContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  
  
});


const TodoListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch("https://type.fit/api/quotes")
      .then(response => response.json())
      .then(data => setQuotes(data));
  }, []);

  const handleAddTask = task => {
    setTasks(prevTasks => [
      ...prevTasks,
      { id: Math.random().toString(), ...task, completed: false },
    ]);
  };

  const handleToggleTask = id => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = id => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TaskDetail', { task: item })}
      onLongPress={() => handleDeleteTask(item.id)}
      style={[
        styles.taskItem,
        { backgroundColor: item.completed ? '#f2f2f2' : 'transparent' },
      ]}
    >
      <Text style={[styles.taskText, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderQuote = () => {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return (
        <View style={styles.quoteContainer}>
          <Text style={styles.heading}>Stay Motivated</Text>
          <View style={styles.quoteCircle}>
            <Text style={styles.quoteText}>{quotes[randomIndex].text}</Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };
  
  

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./background.jpg')}
        style={styles.backgroundImage}
      >
        <Text style={styles.heading}>My Tasks</Text>
        <View style={styles.taskListContainer}>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text>No tasks</Text>}
          />
        </View>
        {renderQuote()}
        <Button
          title="Add Task"
          onPress={() => navigation.navigate('Task', { addTask: handleAddTask })}
        />
      </ImageBackground>
    </View>
  );
};


const TaskScreen = ({ navigation }) => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [taskPriority, setTaskPriority] = useState('Low');
  const [enableReminder, setEnableReminder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // New state for date picker visibility

  const handleSaveTask = () => {
    const task = { name: taskName, dueDate: dueDate.toISOString(), priority: taskPriority };
    navigation.getParam('addTask')(task);
    navigation.navigate('TodoList');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide date picker after selecting date
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name:</Text>
      <TextInput
        style={styles.input}
        value={taskName}
        onChangeText={(text) => setTaskName(text)}
      />
      <Text style={styles.label}>Due Date:</Text>
      <TouchableOpacity onPress={toggleDatePicker}>
        <Text style={styles.input}>{dueDate.toString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          style={styles.datePicker}
          value={dueDate}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text style={styles.label}>Priority:</Text>
      <Picker
        style={styles.picker}
        selectedValue={taskPriority}
        onValueChange={(value) => setTaskPriority(value)}
      >
        <Picker.Item label="Low" value="Low" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="High" value="High" />
      </Picker>
      <View style={styles.reminderContainer}>
        <Text style={styles.label}>Enable Reminder:</Text>
        <Switch
          value={enableReminder}
          onValueChange={(value) => setEnableReminder(value)}
        />
      </View>
      <Button title="Save" onPress={handleSaveTask} />
    </View>
  );
};



const TaskDetailScreen = ({ navigation }) => {
  const task = navigation.getParam('task', {});

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name:</Text>
      <Text style={styles.taskText}>{task.name}</Text>
      <Text style={styles.label}>Due Date:</Text>
      <Text style={styles.taskText}>{task.dueDate.toString()}</Text>
      <Text style={styles.label}>Priority:</Text>
      <Text style={styles.taskText}>{task.priority}</Text>
    </View>
  );
};


const AppNavigator = createStackNavigator(
  {
    TodoList: { screen: TodoListScreen },
    Task: { screen: TaskScreen },
    TaskDetail: { screen: TaskDetailScreen },
  },
  {
    initialRouteName: 'TodoList',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default App;
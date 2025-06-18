import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NotificationService } from '@/utils/notifications';
import { getCurrentDate, getCurrentTime } from '@/utils/dateUtils';

export interface SimpleTask {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Today() {
  const [tasks, setTasks] = useState<SimpleTask[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [time, setTime] = useState(getCurrentTime());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addTask = async () => {
    if (!title) return;
    const newTask = {
      id: generateId(),
      title,
      description: desc,
      date,
      startTime: time,
    };
    setTasks([...tasks, newTask]);
    setModalVisible(false);
    setTitle('');
    setDesc('');
    // Bildirim planla
    await NotificationService.scheduleTaskNotification(newTask);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bugün</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
            <Text style={styles.date}>{item.date} {item.startTime}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>Bugün için hatırlatıcı yok.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Yeni Hatırlatıcı</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Hatırlatıcı</Text>
            <TextInput placeholder="Başlık" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput placeholder="Açıklama (opsiyonel)" value={desc} onChangeText={setDesc} style={styles.input} />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>Tarih: {date}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.input}>Saat: {time}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(date)}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
                }}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={new Date(`${date}T${time}`)}
                mode="time"
                display="default"
                onChange={(_, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime.toTimeString().slice(0,5));
                }}
              />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Button title="İptal" onPress={() => setModalVisible(false)} />
              <Button title="Kaydet" onPress={addTask} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa', padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  desc: { color: '#555', marginBottom: 8 },
  date: { color: '#888', fontSize: 13 },
  addButton: { backgroundColor: '#4285f4', borderRadius: 24, padding: 14, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#f1f1f1', borderRadius: 8, padding: 10, marginBottom: 10 },
}); 
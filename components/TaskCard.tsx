import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@/types';
import { CATEGORIES } from '@/constants/categories';
import { formatTime } from '@/utils/dateUtils';
import { Check } from 'lucide-react-native';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: (taskId: string) => void;
}

export default function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
  const category = CATEGORIES[task.category];

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleCheckboxPress = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCardPress}>
      <View style={[styles.categoryBar, { backgroundColor: category.color }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, task.isCompleted && styles.completedTitle]} numberOfLines={2}>
              {task.title}
            </Text>
            <View style={[styles.priorityBadge, { 
              backgroundColor: task.priority === 'HIGH' ? '#FEE2E2' : 
                              task.priority === 'MEDIUM' ? '#FEF3C7' : '#ECFDF5'
            }]}>
              <Text style={[styles.priorityText, {
                color: task.priority === 'HIGH' ? '#DC2626' :
                       task.priority === 'MEDIUM' ? '#D97706' : '#059669'
              }]}>
                {task.priority}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.checkbox, task.isCompleted && styles.checkedBox]}
            onPress={handleCheckboxPress}
          >
            {task.isCompleted && <Check color="#fff\" size={16} />}
          </TouchableOpacity>
        </View>
        
        {task.description && (
          <Text style={[styles.description, task.isCompleted && styles.completedText]} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.time}>
            {formatTime(task.startTime)} - {formatTime(task.endTime)}
          </Text>
          <View style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  categoryBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  completedText: {
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Play, CircleCheck as CheckCircle } from 'lucide-react-native';

interface TaskStatsCardProps {
  icon: 'todo' | 'progress' | 'done';
  title: string;
  count: number;
  subtitle: string;
  color: string;
  onPress?: () => void;
}

export default function TaskStatsCard({ 
  icon, 
  title, 
  count, 
  subtitle, 
  color, 
  onPress 
}: TaskStatsCardProps) {
  const IconComponent = icon === 'todo' ? Clock : icon === 'progress' ? Play : CheckCircle;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <IconComponent color="#fff" size={24} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.count}>{count}</Text> {subtitle}
        </Text>
      </View>
      
      <View style={styles.progressIndicator}>
        <View style={[styles.progressDot, { backgroundColor: color }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  count: {
    fontWeight: '700',
    color: '#1F2937',
  },
  progressIndicator: {
    width: 8,
    height: 8,
    marginLeft: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
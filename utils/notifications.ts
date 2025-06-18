import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Task } from '@/types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  async scheduleTaskNotification(task: Task): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const taskDateTime = new Date(`${task.date}T${task.startTime}`);
      const now = new Date();
      const seconds = Math.floor((taskDateTime.getTime() - now.getTime()) / 1000);
      if (seconds <= 0) {
        return null; // Geçmişteyse planlama
      }
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Upcoming Task',
          body: `${task.title} başlamak üzere!`,
          data: { taskId: task.id },
        },
        trigger: { type: 'timeInterval', seconds, repeats: false },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },
};
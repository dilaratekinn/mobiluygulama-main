import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Project, User } from '@/types';

const STORAGE_KEYS = {
  TASKS: '@smart_planner_tasks',
  PROJECTS: '@smart_planner_projects',
  USER: '@smart_planner_user',
};

export const StorageService = {
  // Tasks
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  // Projects
  async saveProjects(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const projects = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  },

  // User
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },
};
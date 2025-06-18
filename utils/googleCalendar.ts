import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Task } from '@/types';

// Google Calendar API configuration
// Bu değerleri Google Cloud Console'dan almanız gerekiyor
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Web browser completion for auth session
WebBrowser.maybeCompleteAuthSession();

interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  colorId?: string;
}

export class GoogleCalendarService {
  private static accessToken: string | null = null;
  private static refreshToken: string | null = null;

  // Initialize authentication
  static async authenticate(): Promise<boolean> {
    try {
      // Web platformu için demo mode
      if (Platform.OS === 'web') {
        // Web'de gerçek OAuth yerine demo mode
        this.accessToken = 'demo_token';
        return true;
      }

      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: GOOGLE_SCOPES,
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      });

      const result = await request.promptAsync(GOOGLE_DISCOVERY);

      if (result.type === 'success') {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            code: result.params.code,
            redirectUri,
          },
          GOOGLE_DISCOVERY
        );

        this.accessToken = tokenResult.accessToken;
        this.refreshToken = tokenResult.refreshToken;

        // Store tokens securely
        await SecureStore.setItemAsync('google_access_token', tokenResult.accessToken);
        if (tokenResult.refreshToken) {
          await SecureStore.setItemAsync('google_refresh_token', tokenResult.refreshToken);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Google authentication error:', error);
      return false;
    }
  }

  // Load stored tokens
  static async loadStoredTokens(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web'de localStorage kullan
        const accessToken = localStorage.getItem('google_access_token');
        if (accessToken) {
          this.accessToken = accessToken;
          return true;
        }
        return false;
      }

      const accessToken = await SecureStore.getItemAsync('google_access_token');
      const refreshToken = await SecureStore.getItemAsync('google_refresh_token');

      if (accessToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error loading stored tokens:', error);
      return false;
    }
  }

  // Refresh access token
  static async refreshAccessToken(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web'de demo mode
        return true;
      }

      if (!this.refreshToken) {
        return false;
      }

      const response = await fetch(GOOGLE_DISCOVERY.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        await SecureStore.setItemAsync('google_access_token', data.access_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    if (this.accessToken) {
      return true;
    }

    return await this.loadStoredTokens();
  }

  // Create calendar event from task
  static async createCalendarEvent(task: Task): Promise<boolean> {
    try {
      if (!await this.isAuthenticated()) {
        console.log('User not authenticated with Google Calendar');
        return false;
      }

      // Web'de demo mode
      if (Platform.OS === 'web') {
        console.log('Demo: Calendar event would be created:', {
          title: task.title,
          date: task.date,
          startTime: task.startTime,
          endTime: task.endTime,
        });
        return true;
      }

      const startDateTime = new Date(`${task.date}T${task.startTime}:00`);
      const endDateTime = new Date(`${task.date}T${task.endTime}:00`);

      const event: GoogleCalendarEvent = {
        summary: task.title,
        description: task.description || '',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        colorId: this.getCategoryColorId(task.category),
      };

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the request with new token
          return await this.createCalendarEvent(task);
        }
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return false;
    }
  }

  // Get color ID based on task category
  private static getCategoryColorId(category: string): string {
    const colorMap: { [key: string]: string } = {
      'SPORT_APP': '11', // Red
      'MEDICAL_APP': '7',  // Blue
      'RENT_APP': '9',     // Purple
      'NOTES': '10',       // Green
      'GAMING_PLATFORM_APP': '5', // Yellow
      'PERSONAL': '4',     // Pink
      'WORK': '1',         // Blue
    };

    return colorMap[category] || '1';
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('google_access_token');
        this.accessToken = null;
        return;
      }

      if (this.accessToken) {
        // Revoke token
        await fetch(`${GOOGLE_DISCOVERY.revocationEndpoint}?token=${this.accessToken}`, {
          method: 'POST',
        });
      }

      this.accessToken = null;
      this.refreshToken = null;

      await SecureStore.deleteItemAsync('google_access_token');
      await SecureStore.deleteItemAsync('google_refresh_token');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Get user's calendar list
  static async getCalendarList(): Promise<any[]> {
    try {
      if (!await this.isAuthenticated()) {
        return [];
      }

      if (Platform.OS === 'web') {
        // Web'de demo data
        return [
          { id: 'primary', summary: 'Ana Takvim', primary: true },
          { id: 'work', summary: 'İş Takvimi', primary: false },
        ];
      }

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return await this.getCalendarList();
        }
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching calendar list:', error);
      return [];
    }
  }
}
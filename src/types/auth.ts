
// User-related types for the application
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string | null;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
}

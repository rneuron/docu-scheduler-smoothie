
import { User, Doctor, Patient } from "@/types";
import { users } from "@/data/mockData";

// Simulate authentication functions
export const login = (email: string, password: string): User | null => {
  // In a real app, this would verify credentials against a backend
  // For demo purposes, we'll just look up the user by email
  // and assume the password is correct
  const user = users.find(u => u.email === email);
  
  if (user) {
    // Store user in localStorage to simulate persisted auth
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isDoctor = (user?: User | null): user is Doctor => {
  if (!user) return false;
  return user.userType === "doctor";
};

export const isPatient = (user?: User | null): user is Patient => {
  if (!user) return false;
  return user.userType === "patient";
};

export const register = (userData: Partial<User>, password: string): User => {
  // In a real app, this would create a user in the database
  // For demo purposes, we'll just return the user data with a new ID
  const newUser = {
    ...userData,
    id: Math.random().toString(36).substr(2, 9),
  } as User;
  
  // Store user in localStorage to simulate persisted auth
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  
  return newUser;
};

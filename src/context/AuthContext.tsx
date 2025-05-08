
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Define user roles
export type UserRole = 'user' | 'admin' | 'vendor';

interface UserData {
  role: UserRole;
  services?: string[]; // For vendors
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user data including role from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Default to regular user if no specific role set
            setUserData({ role: 'user' });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({ role: 'user' });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute role-based properties
  const isAdmin = userData?.role === 'admin';
  const isVendor = userData?.role === 'vendor';

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userData, 
      loading, 
      isAdmin,
      isVendor 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

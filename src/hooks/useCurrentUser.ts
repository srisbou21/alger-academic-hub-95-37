
import { useState, useEffect } from 'react';
import { User } from '../types/user';

// Hook pour simuler l'utilisateur actuel
// Dans un vrai système, ceci récupérerait l'utilisateur depuis le contexte d'authentification
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération de l'utilisateur actuel
    const mockUsers: User[] = [
      {
        id: "teacher_1",
        name: "Dr. Ahmed Benali",
        email: "ahmed.benali@university.edu",
        role: "teacher",
        department: "Informatique",
        permissions: [],
        status: "active"
      },
      {
        id: "admin_1",
        name: "Mme. Fatima Zahra",
        email: "fatima.zahra@university.edu",
        role: "dept_head",
        department: "Informatique",
        permissions: [],
        status: "active"
      },
      {
        id: "super_admin_1",
        name: "M. Karim Messaoudi",
        email: "karim.messaoudi@university.edu",
        role: "super_admin",
        department: "Administration",
        permissions: [],
        status: "active"
      }
    ];

    // Simuler différents types d'utilisateurs
    // Changez l'index pour tester différents rôles: 0=teacher, 1=dept_head, 2=super_admin
    const selectedUserIndex = 0;
    
    setTimeout(() => {
      setCurrentUser(mockUsers[selectedUserIndex]);
      setLoading(false);
    }, 1000);
  }, []);

  const switchUser = (userIndex: number) => {
    const mockUsers = [
      {
        id: "teacher_1",
        name: "Dr. Ahmed Benali",
        email: "ahmed.benali@university.edu",
        role: "teacher" as const,
        department: "Informatique",
        permissions: [],
        status: "active" as const
      },
      {
        id: "admin_1",
        name: "Mme. Fatima Zahra",
        email: "fatima.zahra@university.edu",
        role: "dept_head" as const,
        department: "Informatique",
        permissions: [],
        status: "active" as const
      },
      {
        id: "super_admin_1",
        name: "M. Karim Messaoudi",
        email: "karim.messaoudi@university.edu",
        role: "super_admin" as const,
        department: "Administration",
        permissions: [],
        status: "active" as const
      }
    ];

    if (userIndex >= 0 && userIndex < mockUsers.length) {
      setCurrentUser(mockUsers[userIndex]);
    }
  };

  return {
    currentUser,
    loading,
    switchUser
  };
};

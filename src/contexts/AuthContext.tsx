
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  currentUser: User | null; // Ajout de currentUser
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier s'il y a un utilisateur sauvegardé au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('fsecsg_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log("Utilisateur restauré depuis le localStorage:", parsedUser.email);
      } catch (error) {
        console.error("Erreur lors de la restauration de l'utilisateur:", error);
        localStorage.removeItem('fsecsg_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation simple pour la démo
      if (email && password) {
        // Déterminer le rôle en fonction de l'email pour les tests
        let role = "teacher"; // Par défaut
        let name = "Dr. Ahmed Benali";
        
        if (email.includes("admin")) {
          role = "super_admin";
          name = "M. Karim Messaoudi";
        } else if (email.includes("doyen")) {
          role = "admin_faculty";
          name = "Dr. Ahmed Benali";
        } else if (email.includes("chef")) {
          role = "dept_head";
          name = "Mme. Fatima Zahra";
        } else if (email.includes("vice.pedagogie")) {
          role = "vice_dean_pedagogy";
          name = "Dr. Youcef Mammeri";
        } else if (email.includes("vice.etudes")) {
          role = "vice_dean_postgrad";
          name = "Dr. Amina Khelil";
        } else if (email.includes("domaine")) {
          role = "domain_manager";
          name = "Dr. Said Benaissa";
        } else if (email.includes("planning")) {
          role = "planning_service_head";
          name = "M. Omar Belkacem";
        } else if (email.includes("budget")) {
          role = "budget_service_head";
          name = "Mme. Nadia Hamdi";
        } else if (email.includes("secretaire")) {
          role = "secretary_general";
          name = "M. Mohamed Tabet";
        } else if (email.includes("comptable")) {
          role = "accountant";
          name = "Mme. Salima Cherif";
        } else if (email.includes("personnel")) {
          role = "admin_staff";
          name = "M. Ali Bouzid";
        }

        const user: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          role: role
        };
        setUser(user);
        localStorage.setItem('fsecsg_current_user', JSON.stringify(user));
        console.log("Connexion réussie pour:", email, "avec le rôle:", role);
        return true;
      } else {
        console.error("Email ou mot de passe invalide");
        return false;
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Déconnexion en cours...");
      
      // Effacer l'état utilisateur
      setUser(null);
      
      // Nettoyer le localStorage
      localStorage.removeItem('fsecsg_current_user');
      localStorage.removeItem('fsecsg_saved_email');
      localStorage.removeItem('fsecsg_remember_me');
      
      console.log("Déconnexion terminée - utilisateur supprimé");
      
      // Forcer un rafraîchissement de l'état si nécessaire
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  };


  const value: AuthContextType = {
    user,
    currentUser: user, // currentUser est identique à user
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  console.log("AuthContext - user:", user, "isAuthenticated:", !!user);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

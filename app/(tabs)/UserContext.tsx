import React, { createContext, useContext, useState } from 'react';

// Tipo de datos que almacenará el contexto
interface UserContextType {
  userData: any; // Puedes definir más específicamente el tipo de datos aquí
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

// Crea el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Proveedor del contexto
export const UserProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en otras pantallas
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

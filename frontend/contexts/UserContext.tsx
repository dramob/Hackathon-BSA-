import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Increase {
  powerIncrease: number;
  levelIncrease: number;
}

interface UserContextType {
  power: number;
  level: number;
  addPoints: (points: number, levelIncrease: number) => void;
  resetIncrease: () => void;
  increase: Increase | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [power, setPower] = useState(50);
  const [level, setLevel] = useState(1);
  const [increase, setIncrease] = useState<Increase | null>(null);

  const addPoints = (points: number, levelIncrease: number) => {
    setPower((prev) => prev + points);
    setLevel((prev) => prev + levelIncrease);
    setIncrease({ powerIncrease: points, levelIncrease });
  };

  const resetIncrease = () => {
    setIncrease(null);
  };

  return (
    <UserContext.Provider value={{ power, level, addPoints, resetIncrease, increase }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

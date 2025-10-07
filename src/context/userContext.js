import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null); // legacy ID
  const [user, setUser] = useState(null); // full user object

  // Load from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem("user_id");
    const savedUser = localStorage.getItem("user");

    if (savedId) setUserId(savedId);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Whenever userId changes, save it
  useEffect(() => {
    if (userId) localStorage.setItem("user_id", userId);
  }, [userId]);

  // Whenever user object changes, save it
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ userId, setUserId, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to access both userId and user object
export function useUser() {
  return useContext(UserContext);
}

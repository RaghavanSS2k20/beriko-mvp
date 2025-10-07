// context/navbarContext.js
import { createContext, useContext, useState } from "react";

const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [navbarData, setNavbarData] = useState({
    title: "Beriko", // default title
    showFilter: false, // filter button visibility
    avatar: null, // optional avatar
    subtitle: null, // optional subtitle/status
    backRoute: null, // optional back route
  });

  const updateNavbar = (data) => {
    setNavbarData((prev) => ({ ...prev, ...data }));
  };

  const resetNavbar = () => {
    setNavbarData({
      title: "Beriko",
      showFilter: false,
      avatar: null,
      subtitle: null,
      backRoute: null,
    });
  };

  return (
    <NavbarContext.Provider value={{ navbarData, updateNavbar, resetNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
}

export const useNavbar = () => useContext(NavbarContext);

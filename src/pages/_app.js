import "@/styles/globals.css";

import TabBar from "@/components/bottomBar/bottomBarComponent";
import NavBar from "@/components/navbar/navbarComponent";
import { UserProvider } from "@/context/userContext";
import { useRouter } from "next/router";
import { NavbarProvider } from "@/context/NavbarContext";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideTabBar =
    router.pathname === "/" || router.asPath.startsWith("/conversation/"); // hide on landing page
  const hideNavBar = router.pathname === "/"; // 👈 also hide navbar on landing

  return (
    <div className="app-wrapper">
      <div className="mobile-container">
        <UserProvider>
          <NavbarProvider>
            <div className="layout">
              {!hideNavBar && <NavBar />}
              <div className="content">
                <Component {...pageProps} />
              </div>
              {!hideTabBar && <TabBar />}
            </div>
          </NavbarProvider>
        </UserProvider>
      </div>
    </div>
  );
}

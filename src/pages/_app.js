import "@/styles/globals.css";

import TabBar from "@/components/bottomBar/bottomBarComponent";
import NavBar from "@/components/navbar/navbarComponent";
import { UserProvider } from "@/context/userContext";
import { useRouter } from "next/router";
import { NavbarProvider } from "@/context/NavbarContext";
import { Provider } from "@/components/ui/provider";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Theme } from "@chakra-ui/react";
// import theme from "@/theme";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const theme = {
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
  };
  console.log(router.pathname);
  const hideTabBar =
    router.pathname === "/" ||
    router.pathname === "/hi" ||
    router.asPath.startsWith("/conversation/") ||
    router.asPath.startsWith("/about/") ||
    router.asPath.startsWith("/index2"); // hide on landing page
  const hideNavBar = router.pathname === "/" || router.pathname === "/hi";
  return (
    <div className="app-wrapper">
      <Provider>
        <Theme appearance="light">
          <UserProvider>
            <NavbarProvider>
              {Component.noMobileContainer ? (
                // Pages WITHOUT mobile container
                <div className="container">
                  <div className="layout">
                    {!hideNavBar && <NavBar />}
                    <div className="content">
                      <Component {...pageProps} />
                    </div>
                    {!hideTabBar && <TabBar />}
                  </div>
                </div>
              ) : (
                // Default layout WITH mobile container
                <div className="mobile-container">
                  <div className="layout">
                    {!hideNavBar && <NavBar />}
                    <div className="content">
                      <Component {...pageProps} />
                    </div>
                    {!hideTabBar && <TabBar />}
                  </div>
                </div>
              )}
            </NavbarProvider>
          </UserProvider>
        </Theme>
      </Provider>
    </div>
  );
}

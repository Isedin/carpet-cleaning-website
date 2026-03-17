import Navbar from "./Navbar";
import Footer from "./Footer";

function AppShell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default AppShell;
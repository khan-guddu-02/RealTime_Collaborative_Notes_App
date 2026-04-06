import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/socketContext.jsx";


export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Navbar />
        <AppRoutes />
        
      </SocketProvider>
    </AuthProvider>
  );
}
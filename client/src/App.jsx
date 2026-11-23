
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { LibraryProvider } from './context/LibraryContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <AppRoutes />
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

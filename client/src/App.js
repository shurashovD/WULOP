import 'materialize-css';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './components/Footer';
import { NavBar } from './components/Navbar';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';

const App = () => {
  const { login, logout, token, device } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(device);

  const [mainClassName, setMainClassName] = useState(' ');
  const [containerClassName, setContainerClassName] = useState('container');
  const [wrapperClassName, setWrapperClassName] = useState('wrapper');

  useEffect(() => {
    if (device !== 'SCOREBOARD') return;
    setMainClassName('blue');
    setContainerClassName(' ');
    setWrapperClassName(' ');
  }, [device]);

  return (
    <AuthContext.Provider value={{
      token, login, logout, device, isAuthenticated
    }}>
      <BrowserRouter>
        <main className={mainClassName}>
          { isAuthenticated && <NavBar /> }
          <div className={wrapperClassName}>
            <div className={containerClassName}>
              { routes }
            </div>
          </div>
          { isAuthenticated && <Footer /> }
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

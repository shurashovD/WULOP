import { BrowserRouter } from 'react-router-dom';
import { Footer } from './components/Footer';
import { AuthContext } from './context/AuthContext';
import { TasksContext } from './context/TasksContext';
import { ModalState } from './context/modal/ModalState';
import { Modal } from './components/Modal';
import { PhotoState } from './context/photo/photoState';
import { HyhienicalState } from './context/hyhienical/hyhienicalState';
import { RefereeState } from './context/referee/RefereeState';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';
import { useContext } from 'react';

const App = () => {
  const { login, logout, token, device, description, deviceId } = useAuth();
  const tasks = useContext(TasksContext);
  const isAuthenticated = !!token;
  const routes = useRoutes(device);

  return (
    
    <AuthContext.Provider value={{
      token, login, logout, device, isAuthenticated, description, id: deviceId
    }}>
      <TasksContext.Provider value={tasks}>
        <ModalState>
          <PhotoState>
            <HyhienicalState>
              <RefereeState>
                <BrowserRouter>
                  <Modal />
                  <main className="min-vh-100">
                    <div>
                        { routes }
                    </div>
                    { isAuthenticated && <Footer /> }
                  </main>
                </BrowserRouter>
              </RefereeState>
            </HyhienicalState>
          </PhotoState>
        </ModalState>
      </TasksContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

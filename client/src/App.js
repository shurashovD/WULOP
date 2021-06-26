import { BrowserRouter } from 'react-router-dom';
import { Footer } from './components/Footer';
import { AuthContext } from './context/AuthContext';
import { ModalState } from './context/modal/ModalState';
import { Modal } from './components/Modal';
import { PhotoState } from './context/photo/photoState';
import { HyhienicalState } from './context/hyhienical/hyhienicalState';
import { RefereeState } from './context/referee/RefereeState';
import { ScoreboardState } from './context/scoreboard/ScoreboardState';
import { TasksState } from './context/tasks/TasksState';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';
import { DictionaryState } from './context/dictionary/DictionaryState';

const App = () => {
  const { login, logout, token, device, description, deviceId } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(device);

  return (
    
    <AuthContext.Provider value={{
      token, login, logout, device, isAuthenticated, description, id: deviceId
    }}>
      <DictionaryState>
        <TasksState>
          <ModalState>
            <PhotoState>
              <HyhienicalState>
                <RefereeState>
                  <ScoreboardState>
                    <BrowserRouter>
                      <Modal />
                      <main className="min-vh-100">
                        <div>
                            { routes }
                        </div>
                        { isAuthenticated && <Footer /> }
                      </main>
                    </BrowserRouter>
                  </ScoreboardState>
                </RefereeState>
              </HyhienicalState>
            </PhotoState>
          </ModalState>
        </TasksState>
      </DictionaryState>
    </AuthContext.Provider>
  );
}

export default App;

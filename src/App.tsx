import { Outlet } from 'react-router-dom';
import DrawerWithResponsiveAppBar from './components/Drawer';

function App() {
  return (
    <>
        <DrawerWithResponsiveAppBar>
            <Outlet />
        </DrawerWithResponsiveAppBar>

    </>
  );
}

export default App;
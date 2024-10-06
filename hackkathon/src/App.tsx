import { BrowserRouter, Routes,Route} from 'react-router-dom';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import Category from './components/category/category';
import Subcategory from './components/subcategory/subcategory';
import Registration from "./components/registration/registration"
import Privateroutes from "./components/privateroutes/privateroutes"
import './App.css';

function App() {
  

  return (
    
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/registration" element= { <Registration/>}/>
          <Route path="/dashboard" element={<Privateroutes><Dashboard/></Privateroutes>}/>
          <Route path="/category" element= {<Privateroutes>  <Category/></Privateroutes>}/>
          <Route path="/subcategory" element= {<Privateroutes> <Subcategory/> </Privateroutes>}/>



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

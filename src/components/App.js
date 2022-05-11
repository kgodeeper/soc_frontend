import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import components
import Authenticate from './Authenticate';
import CustomerCart from './CustomerCart';
import Home from './Home';
import Order from './Order';
import OrderView from './OrderView';
import Product from './Product';
import Admin from './Admin';
import AdminHome from './AdminHome';
import AdminOrder from './AdminOrder';
import Version from './Version';
import Loader from './Loader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Authenticate/>}></Route>
        <Route exact path="/quan-ly" element={<Admin/>}></Route>
        <Route exact path="/quan-ly/trang-chu" element={<AdminHome/>}></Route>
        <Route exact path="/quan-ly/don-hang" element={<AdminOrder/>}></Route>
        <Route exact path="/quan-ly/phien-ban/:id" element={<Version/>}></Route>
        <Route exact path="/xac-thuc" element={<Authenticate/>}></Route>
        <Route exact path="/trang-chu" element={<Home/>}></Route>
        <Route exact path="/san-pham/:id" element={<Product/>}></Route>
        <Route exact path="/gio-hang" element={<CustomerCart/>}></Route>
        <Route exact path="/dat-hang" element={<Order/>}></Route>
        <Route exact path="/don-hang" element={<OrderView/>}></Route>
        <Route exact path="/loader" element={<Loader/>}></Route>
        <Route path="/*" element={<></>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import '../statics/css/admin_home.css'
import {useState,useRef} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {getCookie, eraseCookie} from './Cookie'
import Loader from './Loader';

function AdminOrder(){
     let [list,setList] = useState([]);
     let [cart_order,setCart_Order] = useState([]);
     let [cart,setCart] = useState([]);
     let [load,setLoad] = useState(<></>);
     let stt = useRef();

     let logout = ()=>{
          eraseCookie('_mntoken');window.location.reload();
     }

     useEffect(()=>{
          let token = getCookie('_mntoken');
          if(token){
          setLoad(Loader);
          axios({
               url:'https://socbe.herokuapp.com/check-permission',
               method: 'GET',
               headers: {
                    Authorization: `Bear ${token}`
               }
          }).then(()=>{
               axios({
                    url:'https://socbe.herokuapp.com/get-all-order',
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               })
               .then((data)=>{
                    setList(data.data.orders);
                    axios({
                         url:'https://socbe.herokuapp.com/get-all-cart',
                         method: 'GET',
                         headers: {
                              Authorization: `Bear ${token}`
                         },
                         data:{
                              order: data.data.orders
                         }
                    })
                    .then((data)=>{
                         setCart(data.data.carts);
                    })
                    .catch(()=>{
     
                    })
                    axios({
                         url:'https://socbe.herokuapp.com/get-all-cartorder',
                         method: 'GET',
                         headers: {
                              Authorization: `Bear ${token}`
                         },
                         data:{
                              order: data.data.orders
                         }
                    })
                    .then((data)=>{
                         setLoad(<></>);
                         setCart_Order(data.data.order_carts);
                    })
                    .catch(()=>{
                    })
               })
               .catch(()=>{
               })
          })
          .catch(()=>{
               window.location.replace('/quan-ly');
          })}else{
               window.location.replace('/quan-ly')
          }
     },[]);

     let change_status = (product)=>{
          setLoad(Loader);
          axios({
               url: 'https://socbe.herokuapp.com/change-status',
               method: 'PATCH',
               headers:{
                    Authorization: `Bear ${getCookie('_mntoken')}`
               },
               data:{
                    product,
                    status: stt.current.value
               }
          }).then(()=>{
               setLoad(<></>);
               window.location.reload();
          }).catch(()=>{
               alert('error')
          })
     }

     let list_orders = list && cart && cart_order ? list.map((item,index)=>{
          return(
               <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.fullname}</td>
                    <td>{item.addr}</td>
                    <td>{item.phone}</td>
                    <td>{item.status == 1 ? <p className="m-0 text-success">Đã thanh toán</p>:"Chưa thanh toán"}</td>
                    <td>{item.order_status == 0 ? "Chờ xác nhận" : 
                         item.order_status == 1 ? "Xác nhận" :
                         item.order_status == 2 ? "Đang giao" :
                         item.order_status == 3 ? "Hoàn thành":null}</td>
                    <td>
                         {item.order_status < 3 ?
                         <select defaultValue={item.order_status} onChange={()=>change_status(item.id)} ref={stt}>
                              <option value={0}>Chờ xác nhận</option>
                              <option value={1}>Xác nhận</option>
                              <option value={2}>Đang giao</option>
                         </select>
                         :"Đã hoàn thành"
                         }
                    </td>
               </tr>
          )
     }):null;

     return(
          <>
          {load}
          <div className="w-100 admin-home">
               <nav className="w-100">
                    <div className="container d-flex justify-content-between align-items-center">
                         <a className="navbar-brand">
                              <h1 className="tm-site-title mb-0">MyShop.Admin</h1>
                         </a>
                         <div>
                              <ul className="d-flex flex-row navbar-nav mx-auto h-100">
                              <li className="nav-item">
                                   <a className="nav-link active">
                                        <i className="fa-regular fa-clipboard"></i>
                                        Đơn hàng
                                   </a>
                              </li>
                              <li className="nav-item" onClick={()=>window.location.replace('/quan-ly/trang-chu')}>
                                   <a className="nav-link">
                                        <i className="fa-solid fa-cart-flatbed-suitcase"></i>
                                        Sản phẩm
                                   </a>
                              </li>

                              <li className="nav-item">
                                   <a className="nav-link">
                                        <i className="fa-regular fa-user"></i>
                                        Tài Khoản
                                   </a>
                              </li>
                              <li className="nav-item dropdown">
                                   <a className="nav-link" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa-solid fa-gear"></i>
                                        <span>
                                             Cài đặt
                                        </span>
                                   </a>
                              </li>
                              </ul>
                         </div>
                         <ul className="navbar-nav">
                              <li className="nav-item" onClick={()=>logout}>
                                   <a className="nav-link d-block">
                                        <b>Đăng xuất</b>
                                   </a>
                              </li>
                         </ul>
                    </div>
               </nav>
               <div className="container mt-3 product d-flex justify-content-between align-items-start">
                    <div className="row w-100">
                         <div className="col text-white table-bound">
                              <table className="table w-100 text-white text-center" style={{backgroundColor:"#435c70 !important"}}>
                                   <thead>
                                        <tr>
                                             <td>Mã đơn hàng</td>
                                             <td>Khách hàng</td>
                                             <td>Địa chỉ</td>
                                             <td>Số điện thoại</td>
                                             <td>Thanh toán</td>
                                             <td>Trạng thái</td>
                                             <td>Cập nhật</td>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {list_orders}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </div>
          </div>
          </>
     )
}

export default AdminOrder
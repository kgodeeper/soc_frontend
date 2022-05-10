import '../statics/css/order.css';
import {useLocation} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {getCookie,eraseCookie} from './Cookie';

function Order(){
     let orders = useLocation().state.orders;
     let carts  = useLocation().state.carts;

     let [addr,setAddr] = useState();
     let [sltAddr,setSltAddr] = useState();

     let addrRef = useRef();
     let payRef = useRef();

     let [showLg,setShowLg]   = useState(false);
     let log_out = ()=>{
          eraseCookie('_token');
          window.location.reload();
     }
     let log_element = showLg ? (
          <div className="position-absolute p-2" style={{width:"200px",background:"#fff",zIndex:"10",border:"1px solid #161616"}}>
               <ul className="auth-list p-0 m-0" style={{listStyle:"none"}}>
                    <li className="auth-item" onClick={()=>log_out()}>
                         Đăng xuất
                    </li>
               </ul>
          </div>) : null;

     useEffect(()=>{
          if(orders == -1){
               window.location.replace('/gio-hang');
          }
          let token = getCookie('_token');
          axios({
               url:'https://socbe.herokuapp.com/check-permission',
               method: 'GET',
               headers: {
                    Authorization: `Bear ${token}`
               }
          }).then(()=>{
               axios({
                    url:'https://socbe.herokuapp.com/get-address',
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               })
               .then((data)=>{
                    setAddr(data.data.addresses);
                    setSltAddr(data.data.addresses[0]);
               })
          }).catch(()=>{
               window.location.replace('/');
          })
     },[]);
     
     let list_order = carts ? carts.filter((item)=>{
          return orders.includes(` ${item.cartid}`);
     }) : null;

     let total = 0;

     let list_order_element = list_order ? list_order.map((item,index)=>{
          total += (Number)(item.cart_quantity * item.price);
          return(
          <div key={index} className="product-info d-flex justify-content-between align-items-center" style={{fontWeight:"normal", textTransform: "none"}}>
               <p className="m-0">{item.name}</p>
               <p className="m-0">x{item.cart_quantity}</p>
               <p className="m-0">x{item.size}</p>
               <p className="m-0">{item.cart_quantity * item.price}</p>
               <p className="order-color m-0" style={{["--color"]:item.color}}/>
          </div>
          )
     }) : null;

     let addresses = addr ? addr.map((item,index)=>{
          return(
               <option key={index} value={item.id}>{item.addr}</option>
          )
     }) : null;

     let change_select = ()=>{
          if(addr){
               let addr_temp = addr.find((item)=>{
                    return item.id == addrRef.current.value;
               })
               setSltAddr(addr_temp);
          }
     }

     let order_request = ()=>{
          let pay = payRef.current.value;
          let token = getCookie('_token');
          let cart = orders.split(' ');
          cart = cart.filter((item)=>{
               return item != -1;
          })
          axios({
               url:'https://socbe.herokuapp.com/order',
               method: 'POST',
               headers: {
                    Authorization: `Bear ${token}`
               },
               data:{
                    cart,
                    payment: payRef.current.value,
                    address: addrRef.current.value
               }
          }).then((data)=>{
               let order = data.data.order;
               if(order > -1){
                    if(pay == 0){
                         axios({
                              url:'https://socbe.herokuapp.com/order-pay',
                              method: 'POST',
                              headers: {
                                   Authorization: `Bear ${token}`
                              },
                              data:{
                                   order,
                                   total
                              }
                         }).then((data)=>{
                              window.location.replace(data.data.pay_link);
                         })
                    }
               }else{
                    alert('Số lượng sản phẩm vượt quá số lượng còn lại');
               }
          }).catch(()=>{
               alert('Đã có lỗi xảy ra ! Vui lòng thử lại sau')
          })
     }

     return(
          <>
          <div className="container position-relative">
               <div className="d-flex w-100 flex-column justify-content-center align-items-center navigation-bar">
                    <div className="row w-100" style={{borderBottom: "2px solid #eee"}}>
                         <div className="col-lg-2 py-3 shop-brand justify-content-center align-items-center">
                              <p className="nom-title m-0">MyShop.</p>
                         </div>
                         <div className="col-lg-8 py-3 d-flex justify-content-center align-items-center">
                              <ul className="d-flex m-0 p-0 w-75 navigation-links justify-content-center align-items-center">
                                   <li className="links" onClick={()=>window.location.replace('/trang-chu')}>trang chủ</li>
                                   <li className="links">nam</li>
                                   <li className="links">nữ</li>
                                   <li className="links">trẻ em</li>
                                   <li className="links">xu hướng</li>
                              </ul>
                              <div className="w-25 align-items-center justify-content-end">
                                   <div className="navigation-search-bound px-2 d-inline-flex align-items-center justify-content-center">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                        <input type="text" className="invisible-bound-inp" placeholder="SEARCH"/>
                                   </div>
                              </div>
                         </div>
                         <div className="user-cart py-3 col-lg-2 d-flex justify-content-center align-items-center">
                              <span className="position-relative">
                                   <i className="fa-regular fa-user mx-3" 
                                   onClick={()=>setShowLg(!showLg)}></i>
                                   {log_element}
                              </span>
                              <i className="fa-brands fa-opencart mx-3" onClick={()=>window.location.replace('/gio-hang')}></i>
                              <i class="fa-regular fa-clipboard mx-3" onClick={()=>window.location.replace('/don-hang')}></i>
                         </div>
                    </div>
                    <div className="order w-100">
                         <h5 className="m-0 py-2">Thanh toán giỏ hàng</h5>
                         <div className="row w-100 order-info">
                              <div className="col-8 px-5">
                                   <div className="address py-2" style={{fontWeight: "500",fontSize:"16px",textTransform: "uppercase"}}>
                                        Địa chỉ thanh toán:<br/>
                                        <select onChange={()=>change_select()} ref={addrRef} className="w-100 my-2 custome-select">
                                             {addresses}
                                        </select>
                                   </div>
                                   <div className="phone py-2" style={{fontWeight: "500",fontSize:"16px",textTransform: "uppercase"}}>
                                        Điện thoại liên hệ:<br/>
                                        <input readOnly defaultValue={sltAddr ? sltAddr.phone : null} type="text" className="custome-input" placeholder="Nhập số điện thoại"/>
                                   </div>
                                   <div className="payment py-2" style={{fontWeight: "500",fontSize:"16px",textTransform: "uppercase"}}>
                                        Phương thức thanh toán:<br/>
                                        <select ref={payRef} defaultValue={1} className="w-100 my-2 custome-select">
                                             <option value={1}>Thanh toán khi nhận hàng</option>
                                             <option value={0}>Thanh toán bằng paypal</option>
                                        </select>
                                   </div>
                                   <div className="order-info py-2" style={{fontWeight: "500",fontSize:"16px",textTransform: "uppercase"}}>
                                        Thông tin đơn hàng:<br/>
                                        {list_order_element}
                                        <hr className="my-2"/>
                                        <div className="product-info d-flex justify-content-between align-items-center" style={{fontWeight:"bold", textTransform: "none"}}>
                                             <p className="m-0">Thành tiền:</p>
                                             <p className="m-0"></p>
                                             <p className="m-0">{total ? total : null}$</p>
                                        </div>
                                   </div>
                              </div>
                              <div className="col-4 order-btn-bound d-flex justify-content-center align-items-start">
                                   <div className="order-btn" onClick={()=>order_request()}><i className="fa-solid fa-cart-shopping mx-2"></i>Đặt hàng</div>
                                   <p className="m-0" style={{fontSize:"14px"}}></p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
          </>
     )
}

export default Order;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../statics/css/cart.css'
import axios from 'axios'
import {getCookie,eraseCookie} from './Cookie';
import Loader from './Loader';

function CustomerCart(){
     const [cart,setCart] = useState();
     const [listSLT, setListSLT] = useState(" -1");
     const [showLg,setShowLg]   = useState(false);
     const [load,setLoad] = useState(<></>);

     useEffect(()=>{
          let token = getCookie('_token');
          if(token){
          setLoad(Loader);
          axios({
               url:'https://socbe.herokuapp.com/check-permission',
               method: 'GET',
               headers: {
                    Authorization: `Bear ${token}`
               }
          }).then(()=>{        
          }).catch(()=>{
               window.location.replace('/');
          })
          axios({
               url:`https://socbe.herokuapp.com/get-carts`,
               method: 'GET',
               headers: {
                    Authorization: `Bear ${token}`
               }
          })
          .then((data)=>{
               setLoad(<></>);
               setCart(data.data.carts);
          })
          .catch(()=>{
               window.location.replace('/');
          })
          }else{
               window.location.replace('/');
          }
     },[]);

     const change_cart = (cart,quantity)=>{
          if(quantity > 0){
               let token = getCookie('_token');
               axios({
                    url:`https://socbe.herokuapp.com/change-quantity`,
                    method: 'PATCH',
                    headers: {
                         Authorization: `Bear ${token}`
                    },
                    data:{
                         cart,
                         quantity
                    }
               })
               .then((data)=>{
                    setCart(data.data.carts);
               })
               .catch(()=>{
                    window.location.replace('/');
               })
          }
     }

     const list_cart = cart ? cart.map((item,index)=>{
          let cls = "fa-solid fa-square-check cart-select";
          if(listSLT && listSLT.includes(` ${item.cartid}`)) cls+=" selected";
          return(
               <tr key={index} className="product-item py-2">
                    <td className="product-check">
                         <div className="d-inline">
                              <i className={cls} onClick={()=>change_select(item.cartid)} style={{color:"#aaa",borderColor:"#f64c10",width:"14px",height:"16px"}}></i>
                         </div>
                    </td>
                    <td className="product-img">
                         <img width="80px" height="60px" src={item.url}/>
                    </td>
                    <td className="product-name" style={{fontWeight:"bold"}}>
                         {item.name}
                    </td>
                    <td className="product-color">
                         <div className="color-bound mx-auto" style={{width:"30px",height:"30px",["--color"]:item.color}}></div>
                    </td>
                    <td className="product-quan ">
                         <div className="d-flex justify-content-center align-items-center">
                              <i className="fa-solid fa-minus" onClick={()=>change_cart(item.cartid,item.cart_quantity-1)}></i>
                                   <p className="m-0 number">{item.cart_quantity}</p>
                              <i className="fa-solid fa-plus"  onClick={()=>change_cart(item.cartid,item.cart_quantity+1)}></i>
                         </div>
                    </td>
                    <td className="product-size">
                         <p className="m-0" style={{fontSize:"14px"}}>{item.size}</p>
                    </td>
                    <td className="product-price">
                         <p className="m-0" style={{fontWeight:"bold"}}>{item.cart_quantity * item.price}</p>
                    </td>
               </tr> 
          )
     }): null;

     const change_select = (id)=>{
          if(listSLT){
               if(listSLT.includes(` ${id}`)){
                    setListSLT(listSLT.split(` ${id}`).join('').trim());
               }else{
                    setListSLT((listSLT + ` ${id}`).trim());
               }
          }
     }

     const log_out = ()=>{
          eraseCookie('_token');
          window.location.reload();
     }

     const log_element = showLg ? (
          <div className="position-absolute p-2" style={{width:"200px",background:"#fff",zIndex:"10",border:"1px solid #161616"}}>
               <ul className="auth-list p-0 m-0" style={{listStyle:"none"}}>
                    <li className="auth-item" onClick={()=>log_out()}>
                         Đăng xuất
                    </li>
               </ul>
          </div>) : null;

     const delete_carts = ()=>{
          if(listSLT){
               let liststr = listSLT.split(' ');
               liststr.splice(0,1);
               let token = getCookie('_token');
               setLoad(Loader);
               axios({
                    url:`https://socbe.herokuapp.com/delete-carts`,
                    method: 'DELETE',
                    headers: {
                         Authorization: `Bear ${token}`
                    },
                    data:{
                         carts: liststr
                    }
               })
               .then((data)=>{
                    setLoad(<></>);
                    setCart(data.data.carts);
               })
               .catch(()=>{
                    window.location.replace('/');
               })
          }
     }

     return(
          <>
          {load}
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
                              <i className="fa-brands fa-opencart mx-3 ic-active"></i>
                              <i className="fa-regular fa-clipboard mx-3" onClick={()=>window.location.replace('/don-hang')}></i>
                         </div>
                    </div>
                    <div className="cart mt-2 w-100">
                         <div className="cart-control d-flex justify-content-between align-items-center my-2 w-100">
                              <h5 className="text-start m-0">Giỏ hàng của bạn</h5>
                              <div className="cart-btn px-3 d-flex justify-content-center align-items-center">
                                   <div className="remove-btn px-3" onClick={()=>delete_carts()}>
                                        <i className="fa-solid fa-trash-can mx-1"></i>
                                        <p className="m-0 d-inline" style={{fontWeight:"bold",fontSize:"13px"}}>Xóa</p>
                                   </div>
                                   <div className="pay-btn px-3">
                                        <i className="fa-solid fa-cash-register mx-1"></i>
                                        <Link to="/dat-hang" state={{orders:listSLT,carts:cart}} className="m-0 d-inline" style={{fontWeight:"bold",fontSize:"13px"}}>Mua hàng</Link>
                                   </div>
                              </div>
                         </div>
                         <hr/>
                         <div className="shopping-cart container">
                              <table className="product-list w-100 text-center">
                                   <thead>
                                   <tr className="product-item py-2" style={{fontWeight:"bold",color:"#aaa",fontSize:"14px"}}>
                                        <td className="product-check d-flex justify-content-center align-items-center ">
                                             Chọn
                                        </td>
                                        <td className="product-img ">
                                             Hình ảnh
                                        </td>
                                        <td className="product-name ">
                                             Tên sản phẩm
                                        </td>
                                        <td className="product-color ">
                                             Màu sắc
                                        </td>
                                        <td className="product-quan ">
                                             Chọn số lượng
                                        </td>
                                        <td className="product-quan ">
                                             Kích cỡ
                                        </td>
                                        <td className="product-price">
                                             Tổng tiền
                                        </td>
                                   </tr>
                                   </thead>
                                   <tbody>
                                        {list_cart}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </div>
          </div>
          </>
     )
}

export default CustomerCart;
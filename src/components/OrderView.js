import '../statics/css/orderviews.css'
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {getCookie,eraseCookie} from './Cookie';

function OrderView(){
     let [list,setList] = useState([]);
     let [cart_order,setCart_Order] = useState([]);
     let [cart,setCart] = useState([]);
     let [vote,setVote] = useState(<></>)
     let [voteForm,setVoteForm] = useState(<></>);
     let vote_msg = useRef();

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
          let token = getCookie('_token');
          axios({
               url:'http://localhost:8080/check-permission',
               method: 'GET',
               headers: {
                    Authorization: `Bear ${token}`
               }
          }).then(()=>{
               axios({
                    url:'http://localhost:8080/get-orders',
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               })
               .then((data)=>{
                    setList(data.data.orders);
                    axios({
                         url:'http://localhost:8080/get-cart',
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
                         url:'http://localhost:8080/get-order-cart',
                         method: 'POST',
                         headers: {
                              Authorization: `Bear ${token}`
                         },
                         data:{
                              order: data.data.orders
                         }
                    })
                    .then((data)=>{
                         setCart_Order(data.data.order_carts);
                    })
                    .catch(()=>{
     
                    })
               })
               .catch(()=>{

               })
          })
          .catch((error)=>{
               window.location.replace('/');
          })
     },[]);

     let send_vote = (rate,product,order)=>{
          if(vote_msg.current.value){
               let token = getCookie('_token');
               axios({
                    url: 'http://localhost:8080/vote',
                    method: 'POST',
                    headers:{
                         Authorization: `Bear ${token}`
                    },
                    data:{
                         product,
                         rate,
                         vote: vote_msg.current.value,
                         order
                    }
               }).then(()=>{
                    window.location.reload();
               }).catch((error)=>{
                    alert(error)
               })
          }else{
               alert('Hãy nhập đánh giá');
          }
     }

     let clear_vote = ()=>{
          vote_msg.current.value = '';
          setVoteForm(<></>);
     }
     
     let change_rt = (i,customer,product,order)=>{
          setVoteForm(show_vote(i,customer,product,order));
     }
     
     let check_ship = (order_status,order)=>{
          if(order_status == 2){
               axios({
                    url: 'http://localhost:8080/change-status',
                    method: 'PATCH',
                    headers:{
                         Authorization: `Bear ${getCookie('_token')}`
                    },
                    data:{
                         product: order,
                         status: 3
                    }
               }).then(()=>{
                    window.location.reload();
               }).catch(()=>{
                    alert('error')
               })
          }
     }

     let show_vote = (rating,customer,products,order)=>{
          let vote_element =  rating == 1 ? (
               <>
               <i className="fa-solid fa-star" onClick={()=>change_rt(1,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(2,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(3,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(4,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(5,customer,products,order)}></i>
               </>
          ) :  rating == 2 ? (
               <>
               <i className="fa-solid fa-star" onClick={()=>change_rt(1,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(2,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(3,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(4,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(5,customer,products,order)}></i>
               </>
          ):  rating == 3 ? (
               <>
               <i className="fa-solid fa-star" onClick={()=>change_rt(1,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(2,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(3,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(4,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(5,customer,products,order)}></i>
               </>
          ):  rating == 4 ? (
               <>
               <i className="fa-solid fa-star" onClick={()=>change_rt(1,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(2,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(3,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(4,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(5,customer,products,order)}></i>
               </>
          ): rating == 5 ? (
               <>
               <i className="fa-solid fa-star" onClick={()=>change_rt(1,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(2,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(3,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(4,customer,products,order)}></i>
               <i className="fa-solid fa-star" onClick={()=>change_rt(5,customer,products,order)}></i>
               </>
          ): (
               <>
               <i className="fa-regular fa-star" onClick={()=>change_rt(1,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(2,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(3,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(4,customer,products,order)}></i>
               <i className="fa-regular fa-star" onClick={()=>change_rt(5,customer,products,order)}></i>
               </>
          );
          return(
               <div className="vote-container d-flex justify-content-center align-items-center position-fixed top-0 start-0" style={{zIndex:"10",userSelect:"none"}}>
                    <div className="bg-white vote p-3">
                         <h6 className="text-center">Cảm ơn bạn đã tin tưởng chúng tôi</h6>
                         <p className="m-0" style={{fontWeight:"bold"}}>Đánh giá của bạn</p>
                         <div className="star-range">
                              {vote_element}
                         </div>
                         <p className="m-0" style={{fontWeight:"bold"}}>Hãy để lại cảm nghĩ của bạn</p>
                         <textarea ref={vote_msg} name="" id="" cols="30" rows="10"></textarea>
                         <div className="custome-btn ok text-center" onClick={()=>send_vote(rating,products,order)}>Gửi đánh giá</div>
                         <div className="custome-btn ok1  mt-2 text-center" onClick={()=>{clear_vote()}}>Đóng</div>
                    </div>
               </div>
          )
     }

     let check_status = (i,customer,products,order)=>{
          if(i == 3) setVoteForm(show_vote(5,customer,products,order));
     }


     let list_orders = list && cart && cart_order ? list.map((item,index)=>{
          let temp_cart = cart_order.filter((it)=>{
              return it.order_item == item.id;
          })
          temp_cart = temp_cart.map((it)=>{
               return cart.find((i)=>{
                    return i.cartid == it.cart;
               })
          })

          let total = 0;
          let products = [];
          
          let items = temp_cart ? temp_cart.map((it1,id1)=>{
               if(it1 != null){
                    total += it1.cart_quantity * it1.price;
                    products.push(it1.product);
                    return(
                         <div key={id1} className="order-products py-2 d-flex justify-content-start align-items-center" style={{fontSize:"14px"}}>
                                   <div className="img">
                                        <img src={it1.url} width="40px" height="24px" alt=""/>
                                   </div>
                                   <div className="name px-3">{it1.name} <strong style={{fontWeight:"bold",color:"#999"}}>( x{it1.cart_quantity} )</strong></div>
                                   <div className="name px-3">Cỡ: {it1.size}</div>
                         </div>
                    )
               }
          }): null;

          products = products ? products.reduce((prev,cur)=>{
               if(prev.indexOf(cur) == -1) prev.push(cur);
               return prev;
          },[]) : null;

          return items ? (
               <div  key={index} className="viewcard py-2 my-2">
                    <div className="order-info w-75 m-auto">
                         <div className="order-id">Mã đơn hàng: <strong>#{item.id}</strong></div>
                         {items}
                         <div className="order-total">Thành tiền: {total}$</div>
                         <div className="payment-status">Trạng thái:</div>
                    </div>
                    <div className="status mt-2">
                         <div className="title-bar m-auto d-flex justify-content-between align-items-center">
                              <p className="m-0" style={{fontWeight:"500",fontSize:"13px"}}>Đặt hàng</p>
                              <p className="m-0" style={{fontWeight:"500",fontSize:"13px"}}>Xác nhận</p>
                              <p className="m-0" style={{fontWeight:"500",fontSize:"13px"}}>Giao hàng</p>
                              <p className="m-0" style={{fontWeight:"500",fontSize:"13px"}}>Đã nhận</p>
                         </div>
                         <div className="status-bar position-relative w-50 m-auto d-flex justify-content-center align-items-center">
                              {item.order_status == 0 ? (
                                   <>
                                        <div className="prg" style={{["--percent"]:"0%"}}></div>
                                        <div className="moc-1 moc position-absolute active">1</div>
                                        <div className="moc-2 moc position-absolute">2</div>
                                        <div className="moc-3 moc position-absolute">3</div>
                                        <div className="moc-4 moc position-absolute">4</div>
                                   </>
                              )
                              :item.order_status == 1 ? (
                                   <>
                                        <div className="prg" style={{["--percent"]:"34%"}}></div>
                                        <div className="moc-1 moc position-absolute active">1</div>
                                        <div className="moc-2 moc position-absolute active">2</div>
                                        <div className="moc-3 moc position-absolute">3</div>
                                        <div className="moc-4 moc position-absolute">4</div>
                                   </>
                              )
                              :item.order_status == 2 ? (
                                   <>
                                        <div className="prg" style={{["--percent"]:"67%"}}></div>
                                        <div className="moc-1 moc position-absolute active">1</div>
                                        <div className="moc-2 moc position-absolute active">2</div>
                                        <div className="moc-3 moc position-absolute active">3</div>
                                        <div className="moc-4 moc position-absolute">4</div>
                                   </>
                              )
                              :(
                                   <>
                                        <div className="prg" style={{["--percent"]:"100%"}}></div>
                                        <div className="moc-1 moc position-absolute active">1</div>
                                        <div className="moc-2 moc position-absolute active">2</div>
                                        <div className="moc-3 moc position-absolute active">3</div>
                                        <div className="moc-4 moc position-absolute active">4</div>
                                   </>
                              )}
                              <div className="bar w-100"></div>
                         </div>
                    </div>
                    <div className="w-50 mt-3 m-auto text-center">
                         {item.voted == 1 ? 
                         <div className="custome-btn success d-inline-block mx-2">Đã đánh giá</div>:
                         <div className={item.order_status == 3 ? "custome-btn d-inline-block mx-2 ok" : "custome-btn d-inline-block mx-2"} onClick={()=>{check_status(item.order_status,item.customer,products,item.id)}}>Đánh giá hàng</div> }
                         <div className={item.order_status == 2 ? "custome-btn d-inline-block mx-2 ok" : "custome-btn d-inline-block mx-2"} onClick={()=>{check_ship(item.order_status,item.id)}}>Đã nhận hàng</div>
                    </div>
               </div>
          ):null;
     }):null;

     return(
          <>
          {voteForm}
          <div className="container">
               <div className="d-flex w-100 flex-column justify-content-center align-items-center navigation-bar">
                    <div className="row w-100" style={{borderBottom: "2px solid #eee"}}>
                         <div className="col-lg-2 py-3 shop-brand d-flex justify-content-center align-items-center">
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
                         <i class="fa-regular fa-clipboard mx-3 ic-active"></i>
                    </div>
                    </div>
                    <div className="orderview w-100">
                         {list_orders}
                    </div>
               </div>
          </div>
          </>
     )
}

export default OrderView;
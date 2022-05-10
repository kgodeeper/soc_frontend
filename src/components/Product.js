import '../statics/css/product.css'
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { getCookie,eraseCookie} from './Cookie';
import axios from 'axios';

function Product(){
     let {id} = useParams();
     
     let [product,setProduct] = useState();
     let [vote,setVote] = useState();
     let [item,setItem] = useState();
     let [itemActive,setItemActive] = useState();
     let [size,setSize] = useState();
     let [sizeActive,setSizeActive] = useState(0);
     let [show,setShow] = useState(true);
     let [quan,setQuan] = useState(1);
     let [colorActive,setColorActive] = useState(0);
     let [showLg,setShowLg]   = useState(false);

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
                    url:`http://localhost:8080/get-product/${id}`,
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               }).then((data)=>{
                    setProduct(()=>data.data.product);
                    axios({
                         url:`http://localhost:8080/get-vote/${id}`,
                         method: 'GET',
                         headers:{
                              Authorization: `Bear ${token}`
                         }
                    }).then((data)=>{
                         setVote(data.data.votes);
                    }).catch(()=>{
                    })
               }).catch(()=>{
               })
               axios({
                    url:`http://localhost:8080/get-all-items/${id}`,
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               }).then((data)=>{
                    setItem(()=>data.data.items);
                    try{
                         setItemActive(data.data.items[0]);
                    }catch{}
                    axios({
                         url:`http://localhost:8080/get-all-sizes/${data.data.items[0].id}`,
                         method: 'GET',
                         headers: {
                              Authorization: `Bear ${token}`
                         }
                    }).then((data)=>{
                         setSize(()=>data.data.sizes);
                         try{
                              let index = 0;
                              while(data.data.sizes[index].quantity == 0 && index < data.data.sizes.length){
                                   index++;
                              }
                              setSizeActive(()=>data.data.sizes[index].id);
                         }catch{}
                    }).catch(()=>{
                    })
                    try{
                         setColorActive(()=>data.data.items[0].id);
                    }catch{}
               }).catch(()=>{
               })
          }).catch(()=>{
               window.location.replace('/xac-thuc');
          })
          
     },[])

     let toggle_desc = ()=>{
          setShow(!show);
          let desc = document.querySelector('.desc');
          if(show){
               desc.classList.remove('d-none');
          }else{
               desc.classList.add('d-none');
          }
     }

     let change_active = (e,i)=>{
          e.preventDefault();
          setColorActive(i);
          if(item){
               setItemActive(item.find((it)=>{return it.id == i}));
               let token = getCookie('_token');
               axios({
                    url:`http://localhost:8080/get-all-sizes/${i}`,
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               }).then((data)=>{
                    setSize(()=>data.data.sizes);
                    try{
                         let index = 0;
                         while(data.data.sizes[index].quantity == 0 && index < data.data.sizes.length){
                              index++;
                         }
                         setSizeActive(()=>data.data.sizes[index].id);
                    }catch{}
               }).catch(()=>{
                    window.location.replace('/');
               })
          }
     }

     let change_size = (e,i)=>{
          e.preventDefault();
          let isize = size.find((it)=>{return it.id == i});
          if(isize.quantity > 0){
               setSizeActive(i);
          }
     }

     let change_quan = (i)=>{
          if(quan + i > 0){
               setQuan(quan+i);
          }
     }

     let colors = item ? item.map((item,index)=>{
          return(
               <li key={index} className={item.id == colorActive ? "color-item mx-1 active" : "color-item mx-1"} 
               style={{["--color"]:item.color}} onClick={(e)=>change_active(e,item.id)}></li>
          )
     }):null;
     
     let sizes = size ? size.map((item,index)=>{
          let isize = size.find((it)=>{return it.id == item.id});
          let cls = "";
          item.id == sizeActive ? cls="size-item active" : cls="size-item";
          isize.quantity == 0 ? cls += " no-select" : cls=cls;
          return(
               <li  key={index} className={cls}
               onClick={(e)=>change_size(e,item.id)}>{item.size}</li>
          )
     }):null;

     let add_cart = ()=>{
          console.log({product,size:sizeActive,color:itemActive.id,quantity:quan})
          axios({
               method: 'POST',
               url:'http://localhost:8080/add-cart',
               headers:{
                    Authorization: `Bear ${getCookie('_token')}`
               },
               data:{
                    product:product.id,
                    size:sizeActive,
                    color:itemActive.id,
                    quantity:quan
               }
          }).then(()=>{
               window.location.replace('/gio-hang');
          }).catch((error)=>{
               alert(error);
          })
     }

     let votes = vote ? vote.map((item,index)=>{
          return(
               <div key={index} className="product-comment my-1">
                    <h6 className="m-0 user">{item.fullname}</h6>
                    <p className="my-0 comment">{item.content}</p>
                    <div className="text-end" style={{fontSize:"14px"}}>
                         <i className="fa-solid fa-star mx-1" style={{color:'#ffce3d',fontSize:"14px"}}></i>
                         {item.rate}
                    </div>
               </div>
          )
     }):null;

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

     return(
          <>
               <div className="container position-relative">
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
                         <i class="fa-regular fa-clipboard mx-3" onClick={()=>window.location.replace('/don-hang')}></i>
                    </div>
               </div>
               <div className="category text-start w-100 py-2" style={{fontWeight: "bold"}}>| Xem sản phẩm</div>
               <div className="w-100 row m-0 p-0 px-2">
                    <div className="col-lg-8 m-0 p-0 product">
                         <div className="product-img position-relative">
                              <img src={itemActive ? itemActive ? itemActive.url : null : null} alt="shoes" width="100%" height="100%"/>
                              <div className="product-name position-absolute">
                                   {product ? product.name : null}
                              </div>
                              <div className="product-desc-btn position-absolute">
                                   <div className="desc-btn my-1 d-flex justify-content-start 
                                   align-items-center px-2 py-2 btn-blur" style={{backgroundColor:"#000",borderRadius: "4px", color:"white"}}>
                                        <i className="fa-solid fa-circle-info mx-1"></i>
                                        <p className="m-0 d-inline" style={{fontSize:"13px",color:"white"}} onClick={()=>toggle_desc()}>Chi tiết sản phẩm</p>
                                   </div>
                                   <div className="desc-btn my-1 d-flex justify-content-start 
                                   align-items-center px-2 py-2 btn-blur" 
                                   onClick={()=>add_cart()}
                                   style={{backgroundColor:"#000",borderRadius: "4px", color:"white"}}>
                                        <i className="fa-solid fa-circle-plus mx-1"></i>
                                        <p className="m-0 d-inline" style={{fontSize:"13px",color:"white"}}>Thêm vào giỏ</p>
                                   </div>
                              </div>
                         </div>
                         <div className="product-type mt-4 d-flex justify-content-center align-items-start">
                              <div className="w-50 color-choose">
                                   <p className="m-0" style={{fontWeight: "bold", fontSize:"14px",textTransform:"uppercase"}}>Chọn màu</p>
                                   <ul className="color-list my-2">
                                        {colors}
                                   </ul>
                              </div>
                              <div className="w-25 style-choose">
                                   <p className="m-0" style={{fontWeight: "bold", fontSize:"14px",textTransform:"uppercase"}}>Chọn số lượng</p>
                                   <div className="my-2 product-quantity d-flex justify-content-start align-items-center">
                                        <i className="fa-solid fa-minus" onClick={()=>change_quan(-1)}></i>
                                        <p className="m-0 number">{quan}</p>
                                        <i className="fa-solid fa-plus" onClick={()=>change_quan(1)}></i>
                                   </div>
                              </div>
                              <div className="w-25 style-choose">
                                   <p className="m-0" style={{fontWeight: "bold", fontSize:"14px",textTransform:"uppercase"}}>Chọn kích cỡ</p>
                                   <div className="my-2 product-size d-flex justify-content-center align-items-center">
                                        <ul className="size-list p-0 m-0">
                                             {sizes}
                                        </ul>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="col-lg-4">
                         <h5>Đánh giá về sản phẩm</h5>
                         {votes}
                    </div>
               </div>
          </div>
     </div>
     <div className="desc d-none position-absolute d-flex justify-content-center align-items-center top-0 start-0">
          <div className="desc-content position-relative">
               <div className="position-absolute desc-close-btn">
                    <i className="fa-regular fa-circle-xmark" onClick={()=>toggle_desc()}></i>
               </div>
               <div className="content px-2 py-2">
                    <div className="content-name">
                         <h5 className="m-0">{product ? product.name : null}</h5>
                    </div>
                    <div className="content-detail" style={{fontSize:"14px"}}>
                         Phái: {product ? product.gender == 1 ? 'Nam' : 'Nữ' : ''}<br/>
                         Hãng: {product ? product.brand : null}<br/>
                         Năm sản xuất: {product ? product.year : null}<br/>
                    </div>
                    <div className="content-desc">
                         <h5 className="m-0">Mô tả sản phẩm</h5>
                         <p className="m-0" style={{fontSize:"14px"}}>{product ? product.descstr: null}</p>
                    </div>
               </div>
          </div>
     </div>
          </>
     )
}

export default Product;
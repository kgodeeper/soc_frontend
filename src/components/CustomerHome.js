import axios from "axios";
import { createFactory, useEffect, useState } from "react";
import { getCookie, eraseCookie} from "./Cookie";
import Loader from './Loader';

function CustomerHome(){
     let [product,setProduct] = useState();
     let [showPrd,setShowPrd] = useState();
     let [page,setPage]       = useState(1);
     let [showLg,setShowLg]   = useState(false);
     let [load,setLoad]       = useState(<></>);

     useEffect(()=>{
          let token = getCookie('_token');
          if(token){
          setLoad(Loader);
          axios({
               method: 'GET',
               url: 'https://socbe.herokuapp.com/get-all-products',
               headers:{
                    Authorization: `Bear ${token}`
               }
          })
          .then((data)=>{
               setLoad(<></>);
               setProduct(()=>data.data.products);
               setShowPrd(()=>data.data.products);
          })
          .catch((error)=>{
               console.log(error);
          })
     }else{
          window.location.replace('/');
     }
     },[]);

     let products = showPrd ? product.map((item,index)=>{
          return(
               <div key={index} onClick={()=>window.location.replace(`/san-pham/${item.id}`)}className="col-md-3 my-2 product-cart position-relative mx-3 p-0 px-2 py-2">
                    <div className="product-cart-img">
                         <img src={item.url}
                         style={{borderRadius:"10px"}}
                         alt="shoes" width="100%" height="150px"/>
                    </div>
                    <div className="product-title py-1 d-flex justify-content-between" style={{fontWeight:"bold"}}>
                         <div className="product-name">
                              {item.name.length > 18 ? item.name.substring(0,17) + "..." : item.name}
                         </div>
                         <div className="product-price">{item.price}$</div>
                    </div>
                    <div className="product-more d-flex justify-content-between">
                         <div className="vote">
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                         </div>
                         <div className="color-numbers" style={{color:"#9a9a9a", fontWeight: "bold", fontZize: "14px",textTransform: "uppercase"}}>
                              3 M??u
                         </div>
                    </div>
               </div>
          )
     }) : <></>;

     let log_out = ()=>{
          eraseCookie('_token');
          window.location.reload();
     }

     let log_element = showLg ? (
          <div className="position-absolute p-2" style={{width:"200px",background:"#fff",zIndex:"10",border:"1px solid #161616"}}>
               <ul className="auth-list p-0 m-0" style={{listStyle:"none"}}>
                    <li className="auth-item" onClick={()=>log_out()}>
                         ????ng xu???t
                    </li>
               </ul>
          </div>) : null;

     return(
          <>
          {load}
          <div className="container">
          <div className="d-flex w-100 flex-column justify-content-center align-items-center navigation-bar">
               <div className="row w-100" style={{borderBottom: "2px solid #eee"}}>
                    <div className="col-lg-2 py-3 shop-brand d-flex justify-content-center align-items-center">
                         <p className="nom-title m-0">MyShop.</p>
                    </div>
                    <div className="col-lg-8 py-3 d-flex justify-content-center align-items-center">
                         <ul className="d-flex m-0 p-0 w-75 navigation-links justify-content-center align-items-center">
                              <li className="links link-active">trang ch???</li>
                              <li className="links">nam</li>
                              <li className="links">n???</li>
                              <li className="links">tr??? em</li>
                              <li className="links">xu h?????ng</li>
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
                         <i className="fa-regular fa-clipboard mx-3" onClick={()=>window.location.replace('/don-hang')}></i>
                    </div>
               </div>
               <div className="row w-100 d-flex justify-content-center align-items-center body-container">
                    <div className="filter ps-2 pe-0 col-lg-3 col-md-3 col-sm-4">
                         <p className="my-4 med-title ps-4" style={{textTransform:"uppercase"}}>B??? l???c t??m ki???m</p>
                         <hr/>
                         <p className="my-2 ps-4" style={{fontWeight:"500",fontZize: "16px",textTransform:"uppercase"}}>Theo danh m???c</p>
                         <ul className="category-filter-list">
                              <li className="category-filter-item">D??nh cho nam <strong>[20]</strong></li>
                              <li className="category-filter-item">D??nh cho n??? <strong>[20]</strong></li>
                              <li className="category-filter-item">D??nh cho tr??? em <strong>[20]</strong></li>
                              <li className="category-filter-item">Gi??y da <strong>[20]</strong></li>
                              <li className="category-filter-item">T??ng chi???u cao <strong>[20]</strong></li>
                              <li className="category-filter-item">Gi??y th??? thao <strong>[20]</strong></li>
                         </ul><hr/>
                         <p className="my-2 ps-4" style={{fontWeight:"500",fontZize: "16px",textTransform:"uppercase"}}>Kho???ng gi??</p>
                         <div className="ps-4">
                              <select className="custome-select" defaultValue={-1}>
                                   <option value="-1">--</option>
                                   <option value="0">0$ - 10$</option>
                                   <option value="1">10$ - 20$</option>
                                   <option value="2">20$ - 50$</option>
                                   <option value="3">Tr??n 50$</option>
                              </select>
                         </div>
                    </div>
                    <div className="page-main-content px-0 d-flex justify-content-start flex-column col-lg-9 col-md-9 col-sm-8">
                         <div className="w-100 d-flex justify-content-between align-items-center py-4"
                         style={{borderBottom: "1px solid #eee"}}>
                              <p className="m-0 med-title ps-4">Hi???n th??? k???t qu??? cho: <strong className="text-danger">Gi??y g???i ??</strong></p>
                              <div className="d-flex justify-content-end align-items-center">
                                   <div className="toggle-filter mx-3">
                                        <p className="m-0 d-inline" style={{fontZize:"15px",fontWeight:"bold"}}>???n b??? l???c</p>
                                        <i className="fa-solid fa-sliders"></i>
                                   </div>
                                   <div className="sort d-flex align-items-center">
                                        <select className="custome-select mx-2">
                                             <option value="-1">S???p x???p</option>
                                             <option value="0">Theo gi??</option>
                                             <option value="2">Theo ????nh gi??</option>
                                        </select>
                                        <i className="fa-solid fa-arrow-up-wide-short"></i>
                                   </div>
                              </div>
                         </div>
                         <div className="page-panigator d-flex justify-content-end align-items-center text-end py-2">
                              <p className="page m-0">Trang {product ? page + "/" + Math.ceil(product.length/6) : null}</p>
                              <div className="page-control px-2">
                                   <i className="fa-solid fa-angle-left m-0"></i>
                                   <i className="fa-solid fa-angle-right m-0"></i>
                              </div>
                         </div>
                         <hr className="m-0"/>
                         <div className="list-products container">
                              <div className="row w-100 d-flex justify-content-start align-items-center m-0 px-4 pt-3 pb-1">
                                   {products}
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
     </>
     )
}

export default CustomerHome;
import '../statics/css/admin_home.css'
import { useParams } from "react-router";
import {useEffect, useRef, useState} from 'react';
import {getCookie,eraseCookie} from './Cookie';
import axios from 'axios';
import Loader from './Loader';

function Version(){
     let {id} = useParams();
     let [item,setItem] = useState();
     let [allitem,setAllItem] = useState();
     let [product,setProduct] = useState([]);
     let [load,setLoad] = useState(Loader);
     
     let color = useRef();
     let url = useRef();
     let iid = useRef();
     let size = useRef();
     let quan = useRef();

     let logout = ()=>{
          eraseCookie('_mntoken');window.location.reload();
     }

     let add_size = ()=>{
          if(iid.current.value && size.current.value && quan.current.value){
               if(quan.current.value > 0 ){
                    setLoad(Loader);
                    axios({
                         url: 'https://socbe.herokuapp.com/add-size',
                         method: 'POST',
                         headers:{
                              Authorization: `Bear ${getCookie('_mntoken')}`
                         },
                         data:{
                              item: iid.current.value,
                              size: size.current.value,
                              quan: quan.current.value
                         }
                    }).then((data)=>{
                         if(data.data.status == true) window.location.reload();
                         else{
                              alert('Phiên bản với kích cỡ này đã tồn tại');
                    }setLoad(<></>);
                    }).catch((error)=>{
                         alert(error);
                    })
               }else{
                    alert('Số lượng tối thiểu là 0');
               }
          }else{
               alert('Vui lòng nhập đầy đủ thông tin')
          }
     }

     let add_item = ()=>{
          if(color.current.value && url.current.value){
               if(color.current.value.match(/^[#]{1}[0-9abcdefABCDEF]{6}/)){
                    setLoad(Loader);
                    axios({
                         url: 'https://socbe.herokuapp.com/add-item',
                         method: 'POST',
                         headers:{
                              Authorization: `Bear ${getCookie('_mntoken')}`
                         },
                         data:{
                              product: id,
                              color: color.current.value,
                              url: url.current.value
                         }
                    }).then(()=>{
                         setLoad(<></>);
                         window.location.reload();
                    }).catch((error)=>{
                         alert(error);
                    })
               }else{
                    alert('Định dạng màu là mã hex');
               }
          }else{
               alert('Vui lòng nhập đủ trường');
          }
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
          }).then((data)=>{
               if(data.data.position == 1){
                    axios({
                         url:`https://socbe.herokuapp.com/get-all-items-product/${id}`,
                         method: 'GET',
                         headers: {
                              Authorization: `Bear ${token}`
                         }
                    }).then((data)=>{
                         setItem(data.data.items);
                         let prdtmp = data.data.items.map((item)=>{
                              return {id:item.id,url:item.url,color:item.color};
                         })
                         prdtmp = prdtmp.reduce((prev,cur)=>{
                              if(!prev.find((it)=>{
                                   return it.id == cur.id
                              })){ prev.push(cur)}
                              return prev;
                         },[])
                         setProduct(prdtmp);
                    }).catch((error)=>{
                         alert(error);
                    })
                    axios({
                         url:`https://socbe.herokuapp.com/get-all-item/${id}`,
                         method: 'GET',
                         headers: {
                              Authorization: `Bear ${token}`
                         }
                    }).then((data)=>{
                         setAllItem(data.data.items);
                    }).catch((error)=>{
                         alert(error);
                    })
               }else{
                    window.location.replace('/quan-ly');
               }
               setLoad(<></>);
          }).catch((error)=>{
               alert(error);
          })
     }else{
          window.location.replace('/quan-ly');
     }
     },[]);

     let list_no_version = allitem && product ? allitem.map((i,idx)=>{
          if(!product.find((it)=>{
               return it.id == i.id;
          })){
               return(
                    <tr key={idx}>
                    <td>{i.id}</td>
                    <td><div className="color" style={{["--color"]:i.color}}></div></td>
                    <td><img width="60px" height="50px" src={i.url}></img></td>
                    <td>
                    <table className="table-bordered w-100 text-white text-center" style={{backgroundColor:"#435c70 !important",padding:"0 !important"}}>
                         <tbody>
                              <tr></tr>
                         </tbody>
                    </table>
                    </td>
                    </tr>
               )
          }
     }):null;

     let list_version = product ? product.map((i,id)=>{
          let items = [];

          for(let k = 0; k < item.length; k++){
               if(item[k].id == i.id){
                    items.push(item[k]);
               }
          }

          let item_list = items ? items.map((it,idx)=>{
               return(
                    <tr key={idx}>
                         <td>{it.size}</td>
                         <td>{it.quantity < 10 ? '0' + it.quantity : it.quantity}</td>
                    </tr>
               )
          }):null;

          return(
               <tr key={id}>
                    <td>{i.id}</td>
                    <td><div className="color" style={{["--color"]:i.color}}></div></td>
                    <td><img width="60px" height="50px" src={i.url}></img></td>
                    <td>
                    <table className="table-bordered w-100 text-white text-center" style={{backgroundColor:"#435c70 !important",padding:"0 !important"}}>
                         <tbody>
                              {item_list}
                         </tbody>
                    </table>
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
                                   <a className="nav-link" onClick={()=>window.location.replace('/quan-ly/don-hang')}>
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
                              <li className="nav-item" onClick={()=>logout()}>
                                   <a className="nav-link d-block">
                                        <b>Đăng xuất</b>
                                   </a>
                              </li>
                         </ul>
                    </div>
               </nav>
               <div className="container mt-3 product d-flex justify-content-between align-items-start">
                    <div className="row w-100">
                         <div className="col-8 text-white table-bound">
                              <table className="table table-bordered w-100 text-white text-center" style={{backgroundColor:"#435c70 !important",padding:"0 !important"}}>
                                   <thead>
                                        <tr>
                                             <td>Mã phiên bản</td>
                                             <td>Màu sắc</td>
                                             <td>Hình ảnh</td>
                                             <td>
                                                  <table className="w-100">
                                                       <tr className="w-100">
                                                            <td>Kích cỡ</td>
                                                            <td>Số lượng</td>
                                                       </tr>
                                                  </table>
                                             </td>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {list_no_version}
                                        {list_version}
                                   </tbody>
                              </table>
                         </div>
                         <div className="col-4">
                              <h6>Thêm phiên bản</h6>
                              <input ref={color} type="text" className="my-input my-1" placeholder='Màu sắc'/>
                              <input ref={url} type="text" className="my-input my-1" placeholder='URL hình ảnh'/>
                              <div className="my-btn-1" onClick={()=>{add_item()}}>Thêm phiên bản</div>
                              <h6>Thêm kích cỡ</h6>
                              <input ref={iid} type="number" className="my-input my-1" placeholder='mã phiên bản'/>
                              <input ref={size} type="number" className="my-input-1 my-1" placeholder='Kích cỡ'/>
                              <input ref={quan} type="number" className="my-input-1 my-1" placeholder='Số lượng'/>
                              <div className="my-btn-1" onClick={()=>add_size()}>Thêm kích cỡ</div>
                         </div>
                    </div>
               </div>
          </div>
          </>
     )
}

export default Version;
import '../statics/css/admin_home.css'
import {useEffect, useState} from 'react';
import { useRef } from 'react';
import React from 'react';
import axios from 'axios';
import { getCookie, eraseCookie } from './Cookie';

function AdminHome(){
     let [type,setType] = useState();
     let [select,setSelect] = useState('-1');
     let [product,setProduct] = useState();
     let [action, setAction] = useState("Thêm sản phẩm");
     let [form,setForm] = useState(<></>);

     let name = useRef();
     let brand = useRef();
     let year = useRef();
     let gender = useRef();
     let price = useRef();
     let url = useRef();
     let desc = useRef();

     let logout = ()=>{
          eraseCookie('_mntoken');window.location.reload();
     }

     useEffect(()=>{
          let token = getCookie('_mntoken');
          if(token){
               axios({
                    url:'https://socbe.herokuapp.com/check-permission',
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               }).then((data)=>{
                    if(data.data.position == 1){
                         axios({
                              url:'https://socbe.herokuapp.com/get-all-products',
                              method: 'GET',
                              headers: {
                                   Authorization: `Bear ${token}`
                              }
                         }).then((data)=>{
                              setProduct(data.data.products);
                         }).catch((error)=>{
                              alert(error);
                         })
                    }else{
                         window.location.replace('/quan-ly');
                    }
               }).catch((error)=>{
                    alert(error);
               })
          }else{
               window.location.replace('/quan-ly')
          }
     },[]);

     let cleanRef = ()=>{
          name.current.value = '';
          brand.current.value = '';
          year.current.value = '';
          gender.current.value = '';
          price.current.value = '';
          url.current.value = '';
          desc.current.value = '';
     }

     let change_select = (id)=>{
          if(select){
               if(select.includes(` ${id}`)){
                    setSelect(select.split(` ${id}`).join('').trim());
               }else{
                    setSelect((select + ` ${id}`).trim());
               }
          }
     }

     let add_product = ()=>{
          let nametxt = name.current.value;
          let brandtxt = brand.current.value;
          let yeartxt = year.current.value;
          let gendertxt = gender.current.value;
          let pricetxt  = price.current.value;
          let urltxt = url.current.value;
          let desctxt = desc.current.value;
          if(nametxt && brandtxt && yeartxt && gendertxt && pricetxt && urltxt && desctxt){
               axios({
                    url:'https://socbe.herokuapp.com/add-product',
                    method:'POST',
                    headers:{
                         Authorization: `Bear ${getCookie('_mntoken')}`
                    },
                    data:{
                         nametxt,brandtxt,yeartxt,gendertxt,pricetxt,urltxt,desctxt
                    }
               }).then(()=>{
                    cleanRef();
                    alert('Thành công');
               }).catch((error)=>{
                    alert(error);
               })
          }else{
               alert('Hãy nhập đủ trường')
          }
     }

     let edit_product = (product)=>{
          setAction("Sửa sản phẩm");
          setForm(
               <>
                    <div className="product-form d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100">
                         <div className="p-form px-3 py-3">
                              <div className="info">
                                   <h3 className="m-0">{action}</h3>
                                   <input ref={name} defaultValue={product.name} className="my-input my-2" type="text" placeholder='Tên sản phẩm'></input>
                                   <input ref={brand} defaultValue={product.brand} className="my-input-1 my-2" type="text" placeholder='Thương hiệu'></input>
                                   <input ref={year} defaultValue={product.year} className="my-input-1 my-2" type="number" placeholder='Năm sản xuất'></input>
                                   <input ref={gender} defaultValue={product.gender} className="my-input-1 my-2" type="text" placeholder='Giới tính'></input>
                                   <input ref={price} defaultValue={product.price} className="my-input-1 my-2" type="number" placeholder='Giá'></input>
                                   <input ref={url} defaultValue={product.url} className="my-input my-2" type="text" placeholder='Hình ảnh hiển thị'></input>
                                   <textarea ref={desc} defaultValue={product.descstr} className="desc" placeholder='Mô tả sản phẩm'>
                                   </textarea>
                              </div>
                              <div>
                                   <div className="my-btn-1 mx-1" onClick={()=>update_product(product.id)}>Đồng ý</div>
                                   <div className="my-btn-1 mx-1" onClick={()=>setForm(<></>)}>Thoát</div>
                              </div>
                         </div>
                    </div>
               </>
          )
     }
     let update_product = (id)=>{
          let nametxt = name.current.value;
          let brandtxt = brand.current.value;
          let yeartxt = year.current.value;
          let gendertxt = gender.current.value;
          let pricetxt  = price.current.value;
          let urltxt = url.current.value;
          let desctxt = desc.current.value;
          if(nametxt && brandtxt && yeartxt && gendertxt && pricetxt && urltxt && desctxt){
               axios({
                    url:'https://socbe.herokuapp.com/update-product',
                    method:'PATCH',
                    headers:{
                         Authorization: `Bear ${getCookie('_mntoken')}`
                    },
                    data:{
                         id,nametxt,brandtxt,yeartxt,gendertxt,pricetxt,urltxt,desctxt
                    }
               }).then(()=>{
                    cleanRef();
                    alert('Thành công');
                    window.location.reload();
               }).catch((error)=>{
                    alert(error);
               })
          }else{
               alert('Hãy nhập đủ trường')
          }
     }

     let remove_product = ()=>{
          if(select.trim() != "-1"){
               let list_rmv = select.split('-1')[1].trim().split(' ');
               axios({
                    url:'https://socbe.herokuapp.com/delete-products',
                    method: 'DELETE',
                    headers:{
                         Authorization: `Bear ${getCookie('_mntoken')}`
                    },
                    data:{
                         products:list_rmv
                    }
               }).then(()=>{
                    window.location.reload();
               }).catch(error=>{
                    alert(error);
               })
          }else{
               alert('Hãy chọn sản phẩm trước');
          }
     }

     let show_form = ()=>{
          setAction("Thêm sản phẩm");
          setForm(
          <>
               <div className="product-form d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100">
                    <div className="p-form px-3 py-3">
                         <div className="info">
                              <h3 className="m-0">{action}</h3>
                              <input ref={name} className="my-input my-2" type="text" placeholder='Tên sản phẩm'></input>
                              <input ref={brand} className="my-input-1 my-2" type="text" placeholder='Thương hiệu'></input>
                              <input ref={year} className="my-input-1 my-2" type="number" placeholder='Năm sản xuất'></input>
                              <input ref={gender} className="my-input-1 my-2" type="text" placeholder='Giới tính'></input>
                              <input ref={price} className="my-input-1 my-2" type="number" placeholder='Giá'></input>
                              <input ref={url} className="my-input my-2" type="text" placeholder='Hình ảnh hiển thị'></input>
                              <textarea ref={desc} className="desc" placeholder='Mô tả sản phẩm'>
                              </textarea>
                         </div>
                         <div>
                              <div className="my-btn-1 mx-1" onClick={()=>add_product()}>Đồng ý</div>
                              <div className="my-btn-1 mx-1" onClick={()=>setForm(<></>)}>Thoát</div>
                         </div>
                    </div>
               </div>
          </>)
     }

     let product_list = product ? product.map((item,index)=>{
          return(
               <tr key={index}>
                    <td><input type="checkbox" onChange={()=>{change_select(item.id)}}></input></td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td><img width={"40px"} height="30px" src={item.url}></img></td>
                    <td>{item.price}$</td>
                    <td>
                         <span className="mx-2 px-2 py-1 border" onClick={()=>{edit_product(item)}}>Sửa</span>
                         <span className="px-2 py-1 border" onClick={()=>window.location.replace(`/quan-ly/phien-ban/${item.id}`)}>Phiên bản</span>
                    </td>
               </tr>
          )
     }) : null;

     return(
          <>
          <div className="w-100 admin-home">
               <nav className="w-100">
                    <div className="container d-flex justify-content-between align-items-center">
                         <a className="navbar-brand">
                              <h1 className="tm-site-title mb-0">MyShop.Admin</h1>
                         </a>
                         <div>
                              <ul className="d-flex flex-row navbar-nav mx-auto h-100">
                              <li className="nav-item" onClick={()=>{window.location.replace('/quan-ly/don-hang')}}>
                                   <a className="nav-link">
                                        <i className="fa-regular fa-clipboard"></i>
                                        Đơn hàng
                                   </a>
                              </li>
                              <li className="nav-item">
                                   <a className="nav-link active">
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
                         <div className="col-8 text-white table-bound">
                              <table className="table w-100 text-white text-center" style={{backgroundColor:"#435c70 !important"}}>
                                   <thead>
                                        <tr>
                                             <td>Chọn</td>
                                             <td>ID</td>
                                             <td>Tên sản phẩm</td>
                                             <td>Hình ảnh</td>
                                             <td>Giá bán</td>
                                             <td>Hoạt động</td>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {product_list}
                                   </tbody>
                              </table>
                         </div>
                         <div className="col-4 px-5">
                              <div className="my-btn w-100" onClick={()=>show_form()}>Thêm sản phẩm</div>
                              <div className="my-btn w-100" onClick={()=>remove_product()}>Xóa sản phẩm</div>
                         </div>
                    </div>
               </div>
               {form}
          </div>
          </>
     )
}

export default AdminHome;
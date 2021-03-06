import '../statics/css/authenticate.css';
import { useRef, useState } from 'react';
import {setCookie} from './Cookie';
import { useEffect } from 'react';
import { getCookie } from './Cookie';
import axios from 'axios';
import Loader from './Loader';

function Authenticate(){
     let [current,setCurrent]   = useState(true);
     let [remember,setRemember] = useState(false);
     let [checked,setChecked]   = useState(<></>);
     let [load,setLoad]         = useState(<></>);

     let usertxt  = useRef();
     let passtxt  = useRef();
     let usertxt1 = useRef();
     let passtxt1 = useRef();
     let passtxt2 = useRef();

     let auth_form = document.querySelector(".auth-form");

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
                    setLoad(<></>);
                    window.location.replace('/trang-chu');
               }).catch(()=>{
                    setLoad(<></>);
                    window.location.replace('/');
               })
          }
     },[]);

     let change_form = ()=>{
          setCurrent(!current);
          if(auth_form){
               if(current){
                    auth_form.classList.remove('register');
                    auth_form.classList.add('login');
               }else{
                    auth_form.classList.remove('login');
                    auth_form.classList.add('register');
               }
          }
     }

     let change_remember = ()=>{
          setRemember(!remember);
          if(remember){
               setChecked(<i className="fa-solid fa-square-check" style={{color:"#5CC928"}}></i>);
          }else{
               setChecked(<></>);
          }
     }

     let sign_in = ()=>{
          let username = usertxt.current.value;
          let password = passtxt.current.value;
          if(username && password){
               setLoad(Loader);
               axios({
                    url:'https://socbe.herokuapp.com/user-login',
                    method:'POST',
                    data:{
                         usertxt:username,
                         passtxt:password
                    }
               })
               .then((data)=>{
                    setLoad(<></>);
                    let response = data.data.response;
                    if(response.logged_in){
                         let day = '';
                         if(remember){
                              day = 30;
                         }
                         setCookie('_token',response.token,day);
                         window.location.replace('/trang-chu');
                    }else{
                         setLoad(<></>);
                         alert('T??n ????ng nh???p ho???c m???t kh???u kh??ng ch??nh x??c');
                    }
               })
          }else{
               setLoad(<></>);
               alert('T??n ????ng nh???p v?? m???t kh???u kh??ng ???????c ????? r???ng');
          }
     }

     let sign_up = ()=>{
          let username = usertxt1.current.value;
          let password = passtxt1.current.value;
          let repass   = passtxt2.current.value;
          if(username && password && repass){
               if(repass === password){
                    axios({
                         url:'https://socbe.herokuapp.com/user-sign',
                         method:'POST',
                         data:{
                              usertxt:username,
                              passtxt:password
                         }
                    })
                    .then((data)=>{
                         let response = data.data.response;
                         if(response.sign){
                              alert('????ng k?? th??nh c??ng');
                              change_form();
                              usertxt.current.value = usertxt1.current.value;
                              passtxt.current.value = passtxt1.current.value;
                              usertxt1.current.value= '';
                              passtxt1.current.value= '';
                              passtxt2.current.value= '';
                         }else{
                              if(response.msg === 'user exist'){
                                   alert('T??i kho???n ???? t???n t???i');
                              }else{
                                   alert('M???t kh???u ph???i ch???a t???i thi???u 8 k?? t???');
                              }
                         }
                    })
               }else{
                    alert('M???t kh???u kh??ng kh???p');
               }
          }else{
               alert('T??n ????ng nh???p v?? m???t kh???u kh??ng ???????c ????? r???ng');
          }
     }

     return (
          <>
          {load}
          <div className="w-100 page-container">
               <div className="auth-container container d-flex justify-content-center align-items-center">
                    <div className="shop-title w-50 justify-content-center align-items-start flex-column d-flex">
                         <div className="big-title">
                              MyShop.
                         </div>
                         <div className="med-title">
                              Shop gi??y uy t??n s??? 1 Vi???t Nam
                         </div>
                         <div className="mb-4">
                              Mang ?????n tr???i nghi???m t???t nh???t cho ????i ch??n c???a b???n
                         </div>
                         <div className="auth-contact-links mt-4">
                              <div className="auth-contact">
                                   <p className="m-0  med-title">+ Gh?? th??m shop c???a ch??ng t??i t???i:</p>
                                   <p className="mx-3 m-0">Km10, Nguy???n Tr??i, H?? ????ng, H?? N???i</p>
                              </div>
                              <div className="auth-contact mt-4">
                                   <p className="m-0 med-title">+ Ho???c li??n h??? th??ng qua:</p>
                                   <div className="w-100 d-flex justify-content-center align-items-center">
                                        <i className="fa-brands med-icon fa-facebook-square" style={{color:"#4267B2"}}></i>
                                        <i className="fab fa-twitter med-icon" style={{color:"#00acee"}}></i>
                                        <i className="fas fa-at med-icon" style={{color:"#ea4335"}}></i>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="auth-form login w-50 position-relative d-flex justify-content-center 
                    align-items-center">
                         <div className="form px-4 py-4 position-relative">

                              {/* <!-- Login --> */}
                              <div className="form-front px-4 py-4 w-100 position-absolute top-0 start-0">
                                   <h2 className="m-0">????ng nh???p</h2>
                                   <p className="mb-3 msg">????? th???c hi???n mua s???m tr??n website, b???n c???n x??c th???c danh t??nh c???a b???n</p>
                                   <input ref={usertxt} type="text" className="csinput" placeholder="T??n ????ng nh???p"/>
                                   <input ref={passtxt} type="password" className="csinput" placeholder="M???t kh???u"/>  
                                   <div className="remember-me my-1 d-flex justify-content-end align-items-center">
                                        <div onClick={()=>change_remember()} className="custome-checkbox d-flex justify-content-center align-items-center">
                                             {checked}
                                        </div>
                                        <p className="m-0 msg">Ghi nh??? t??i !</p>
                                   </div>
                                   <div className="cs-submit-btn" onClick={()=>sign_in()}>????ng nh???p</div>   
                                   <p className="m-0 mt-2 msg" style={{color:"#4267B2"}}>N???u ch??a c?? t??i kho???n, vui l??ng <span style={{color:"inherit"}}><strong onClick={()=>change_form()}  style={{cursor:"pointer"}}>????ng k?? </strong></span></p>     
                              </div>

                              {/* <!-- Register --> */}
                              <div className="form-back px-4 py-4 w-100 position-absolute top-0 start-0">
                                   <h2 className="m-0">????ng k?? t??i kho???n</h2>
                                   <p className="mb-1 msg">H??y ?????t m???t kh???u ????? m???nh ????? ?????m b???o t??i kho???n c???a b???n ???????c an to??n</p>
                                   <input ref={usertxt1} type="text" className="csinput" placeholder="T??n ????ng nh???p"/>
                                   <input ref={passtxt1} type="password" className="csinput" placeholder="M???t kh???u"/> 
                                   <input ref={passtxt2} type="password" className="csinput" placeholder="X??c nh???n m???t kh???u"/> 
                                   <div className="cs-submit-btn" onClick={()=>sign_up()}>????ng k??</div>   
                                   <p className="m-0 mt-2 msg" style={{color:"#4267B2"}}>B???n ???? c?? t??i kho???n ? H??y <span style={{color:"inherit"}}><strong onClick={()=>change_form()} style={{cursor:"pointer"}}>????ng nh???p</strong></span></p>
                              </div>
                         </div>
                         <div className="auth-background position-absolute top-0 right-0 w-100"></div>
                    </div>
               </div>
          </div>
          </>
     )
}

export default Authenticate;
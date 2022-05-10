import '../statics/css/authenticate.css';
import { useRef, useState } from 'react';
import {setCookie} from './Cookie';
import { useEffect } from 'react';
import { getCookie } from './Cookie';
import axios from 'axios';

function Authenticate(){
     let [current,setCurrent]   = useState(true);
     let [remember,setRemember] = useState(false);
     let [checked,setChecked]   = useState(<></>);

     let usertxt  = useRef();
     let passtxt  = useRef();
     let usertxt1 = useRef();
     let passtxt1 = useRef();
     let passtxt2 = useRef();

     let auth_form = document.querySelector(".auth-form");

     useEffect(()=>{
          let token = getCookie('_token');
          if(token){
               axios({
                    url:'https://socbe.herokuapp.com/check-permission',
                    method: 'GET',
                    headers: {
                         Authorization: `Bear ${token}`
                    }
               }).then((data)=>{
                    window.location.replace('/trang-chu');
               }).catch(()=>{
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
               axios({
                    url:'https://socbe.herokuapp.com/user-login',
                    method:'POST',
                    data:{
                         usertxt:username,
                         passtxt:password
                    }
               })
               .then((data)=>{
                    let response = data.data.response;
                    if(response.logged_in){
                         let day = '';
                         if(remember){
                              day = 30;
                         }
                         setCookie('_token',response.token,day);
                         window.location.replace('/trang-chu');
                    }else{
                         alert('Tên đăng nhập hoặc mật khẩu không chính xác');
                    }
               })
          }else{
               alert('Tên đăng nhập và mật khẩu không được để rỗng');
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
                              alert('Đăng ký thành công');
                              change_form();
                              usertxt.current.value = usertxt1.current.value;
                              passtxt.current.value = passtxt1.current.value;
                              usertxt1.current.value= '';
                              passtxt1.current.value= '';
                              passtxt2.current.value= '';
                         }else{
                              if(response.msg === 'user exist'){
                                   alert('Tài khoản đã tồn tại');
                              }else{
                                   alert('Mật khẩu phải chứa tối thiểu 8 kí tự');
                              }
                         }
                    })
               }else{
                    alert('Mật khẩu không khớp');
               }
          }else{
               alert('Tên đăng nhập và mật khẩu không được để rỗng');
          }
     }

     return (
          <>
          <div className="w-100 page-container">
               <div className="auth-container container d-flex justify-content-center align-items-center">
                    <div className="shop-title w-50 justify-content-center align-items-start flex-column d-flex">
                         <div className="big-title">
                              MyShop.
                         </div>
                         <div className="med-title">
                              Shop giày uy tín số 1 Việt Nam
                         </div>
                         <div className="mb-4">
                              Mang đến trải nghiệm tốt nhất cho đôi chân của bạn
                         </div>
                         <div className="auth-contact-links mt-4">
                              <div className="auth-contact">
                                   <p className="m-0  med-title">+ Ghé thăm shop của chúng tôi tại:</p>
                                   <p className="mx-3 m-0">Km10, Nguyễn Trãi, Hà Đông, Hà Nội</p>
                              </div>
                              <div className="auth-contact mt-4">
                                   <p className="m-0 med-title">+ Hoặc liên hệ thông qua:</p>
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
                                   <h2 className="m-0">Đăng nhập</h2>
                                   <p className="mb-3 msg">Để thực hiện mua sắm trên website, bạn cần xác thực danh tính của bạn</p>
                                   <input ref={usertxt} type="text" className="csinput" placeholder="Tên đăng nhập"/>
                                   <input ref={passtxt} type="password" className="csinput" placeholder="Mật khẩu"/>  
                                   <div className="remember-me my-1 d-flex justify-content-end align-items-center">
                                        <div onClick={()=>change_remember()} className="custome-checkbox d-flex justify-content-center align-items-center">
                                             {checked}
                                        </div>
                                        <p className="m-0 msg">Ghi nhớ tôi !</p>
                                   </div>
                                   <div className="cs-submit-btn" onClick={()=>sign_in()}>Đăng nhập</div>   
                                   <p className="m-0 mt-2 msg" style={{color:"#4267B2"}}>Nếu chưa có tài khoản, vui lòng <span style={{color:"inherit"}}><strong onClick={()=>change_form()}  style={{cursor:"pointer"}}>Đăng ký </strong></span></p>     
                              </div>

                              {/* <!-- Register --> */}
                              <div className="form-back px-4 py-4 w-100 position-absolute top-0 start-0">
                                   <h2 className="m-0">Đăng ký tài khoản</h2>
                                   <p className="mb-1 msg">Hãy đặt mật khẩu đủ mạnh để đảm bảo tài khoản của bạn được an toàn</p>
                                   <input ref={usertxt1} type="text" className="csinput" placeholder="Tên đăng nhập"/>
                                   <input ref={passtxt1} type="password" className="csinput" placeholder="Mật khẩu"/> 
                                   <input ref={passtxt2} type="password" className="csinput" placeholder="Xác nhận mật khẩu"/> 
                                   <div className="cs-submit-btn" onClick={()=>sign_up()}>Đăng ký</div>   
                                   <p className="m-0 mt-2 msg" style={{color:"#4267B2"}}>Bạn đã có tài khoản ? Hãy <span style={{color:"inherit"}}><strong onClick={()=>change_form()} style={{cursor:"pointer"}}>Đăng nhập</strong></span></p>
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
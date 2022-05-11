import '../statics/css/admin.css'
import {useRef, useState} from 'react';
import { setCookie } from './Cookie';
import axios from 'axios';
import Loader from './Loader';

function Admin(){
     let usertxt  = useRef();
     let passtxt  = useRef();
     let [load,setLoad] = useState(<></>);

     let login = ()=>{
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
                    let response = data.data.response;
                    if(response.logged_in){
                         if(response.position > 0){
                              console.log({_mntoken:response.token});
                              setCookie('_mntoken',response.token);
                              window.location.replace('/quan-ly/trang-chu');
                         }else{
                              alert('Tài khoản không có quyền truy cập trang này');
                         }
                    }else{
                         alert('Tên đăng nhập hoặc mật khẩu không chính xác');
                    }
                    setLoad(<></>);
               })
          }else{
               setLoad(<></>);
               alert('Tên đăng nhập và mật khẩu không được để rỗng');
          }
     }

     return(
          <>
          {load}
          <div className="container d-flex justify-content-center align-items-center">
			<div className="row justify-content-center align-items-center">
				<div className="w-100">
                         <div className="login-wrap rounded card p-4 my-5">
                              <div className="icon d-flex align-items-center justify-content-center">
                                   <span className="fas fa-user d-flex justify-content-center align-items-center" style={{width:"70px",height:"70px", fontSize:"30px",backgroundColor:"#36B",color:"white",borderRadius:"50%"}}></span>
                              </div>
                              <h3 className="text-center mb-1 mt-4">Đăng nhập tài khoản</h3>
                              <div className="login-form  px-3 py-3">
                                   <div className="form-group">
                                        <input ref={usertxt} type="text" className="form-control rounded-left my-2" placeholder="Tên đăng nhập" required/>
                                   </div>
                                   <div className="form-group d-flex">
                                        <input ref={passtxt} type="password" className="form-control rounded-left my-2" placeholder="Mật khẩu" required/>
                                   </div>
                                   <div className="form-group">
                                        <button type="submit" className="form-control btn btn-primary my-2 rounded submit px-3" onClick={()=>{login()}}>ĐĂNG NHẬP</button>
                                   </div>
                              </div>
                         </div>
		          </div>
			</div>
		</div>
          </>
     )
}

export default Admin;
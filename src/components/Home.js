import '../statics/css/index.css';
import CustomerHome from "./CustomerHome";
import AdminHome from "./AdminHome";
import { useEffect, useState } from "react";
import { getCookie } from "./Cookie";
import axios from "axios";

function Home(){
     let [home,setHome] = useState();

     useEffect(()=>{
          let token = getCookie('_token');
          axios({
               url:'http://localhost:8080/check-permission',
               method: 'GET',
               headers: {
                    Authorization: `Bear ${token}`
               }
          }).then((data)=>{
               if(data.data.position == 0){
                    setHome(()=><CustomerHome/>);
               }
          }).catch(()=>{
               window.location.replace('/');
          })
     },[]);

     return(
          <>
               {home}
          </>
     )
}
export default Home;
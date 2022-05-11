import '../statics/css/loader.css'

function Loader(){
     return(
          <div className="loading-bound d-fixed top-0 start-0">
               <div className="loading">
                    <h5>Đang tải dữ liệu</h5>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
               </div>
          </div>
     )
}

export default Loader
import React, { useEffect } from 'react';

import "../css/toast.scss";

const Toast = ({state, dispatch}) => {


    const handleClick = (id) => {
        dispatch({
            type: "DEL TOAST",
            payload: id
        })
        
    }


    useEffect(() => {

        const delToast = async () => {
            
            await new Promise(r => setTimeout(r, 3000));   
            const el = state.toasts[0];
            const getPb = document.getElementById(`progress-${el.id}`);
            const getToast = document.getElementById(`toast-${el.id}`);
            if (getPb === null || getToast ===  null) {
                return;
            }

            await new Promise(r => setTimeout(r, 3000));   
            getPb.classList.add("progress");
            getToast.classList.add("fade"); 
            
            await new Promise(r => setTimeout(r, 2100));        
            getPb.classList.remove("progress");
            getToast.classList.remove("fade");                   
            dispatch({
                type: "DEL TOAST",
                payload: el.id
            })   ;
        }
        
        if (state.toasts.length > 0) {
            delToast();
        }
                
        
    }, [state.toasts, dispatch]);
    

    return ( 
        <div className="container">
            {
                state.toasts.map(
                    (el, index) => 
                        <div key={index} id={`toast-${el.id}`} className="toast">
                            <div className={el.title === "Error" ? 'toast-container error' : 'toast-container'}>
                                <button onClick={() => handleClick(el.id)}>
                                    <span>X</span>
                                </button>
                                <div>
                                    <div className="toast-img">
                                        <img src={el.title === "Error" ? "error.png" : "checked.png"} alt="success"></img>
                                    </div>                           
                                    <div className="toast-body">
                                        <p className="toast-title">
                                            {el.title}
                                        </p>
                                        <p className="toast-message">
                                            {el.message}
                                        </p>
                                    </div>                   
                                </div>
                            </div>
                            <div className={el.title === "Error" ? "progress-bar error" : "progress-bar"}>
                                <span id={`progress-${el.id}`} className="progress-bar-fill" style={{width: "100%"}}></span>
                            </div>
                        </div>
                )
            }
        </div>
    );
}
 
export default Toast

import React, { useEffect, useRef } from 'react';
import "../css/loader.scss";

const Loader = ({state}) => {

    //const [loader, setLoader] = useState(false);
    const loader = useRef();

    useEffect(() => {
        const handleLoader = async () => {

            if (state === true) {
                loader.current.style.display = "block";
                await new Promise(r => setTimeout(r, 100));
                loader.current.style.opacity = "1"; 

                           
            } else {
                if (loader.current.style.display !== "none") {
                    loader.current.style.opacity = "0";
                    await new Promise(r => setTimeout(r, 2000));
                    loader.current.style.display = "none";    
                }
            }
        }
        handleLoader();
    }, [state]);
    
    return (
        
        <div ref={loader} className="container-loader">
            <div className='sun planet'></div>
            <div className='mercury planet'></div>
            <div className='venus planet'></div>
            <div className='earth planet'></div>         
            <div className='mars planet'></div>         
            <div className='jupiter planet'></div>         
            <div className='saturn planet'></div>         
            <div className='uranus planet'></div>         
            <div className='neptune planet'></div>         
        </div>
     
    );
}
 
export default Loader;
import React, { useState, useRef } from 'react';
import useForm from '../helpers/useForm';
import customFetch from "../helpers/customFetch";
import "../css/tcode.scss";

const initialData = {
    "url": ""
}

function validations(form) {
    let errors = {};
    let err;
    const urlPatterm = /^https?:\/\//;

    if (form.url !== "" && !urlPatterm.test(form.url)) {
        err = "Incorrect pattern";
        errors = {
            ...errors,
            url: err
        }
    }

    if (form.file_main !== undefined) {
        let extSupported = ["csv", "xlsx", "xlsm", "xltx", "xltm"];
        const [name, ext] = form.file_main.name.split(".");

        const exist = extSupported.filter(n => ext.startsWith(n));
        if (exist.length === 0) {
            err = "File not supported!";
            errors = {
                ...errors,
                main: err
            }
        }
    }

    if (form.file_second !== undefined) {
        let extSupported = ["csv", "xlsx", "xlsm", "xltx", "xltm"];
        const [name, ext] = form.file_second.name.split(".");

        const exist = extSupported.filter(n => ext.startsWith(n));
        if (exist.length === 0) {
            err = "File not supported!";
            errors = {
                ...errors,
                second: err
            }
        }
    }

    if (form.file_main === undefined && form.url === "") {
        err = "You need to add a File or a Url to continue!"
        errors = {
            ...errors, 
            empty: err
        }
    }
    
    return errors;
}

const TcodeFilesForm = ({state, dispatch}) => {

    const {
        form, 
        errors, 
        handleChange, 
        setErrors, 
        resetForm
    } = useForm(initialData, validations);
    const { post } = customFetch();

    const [submited, setSubmited] = useState(false);

    const file = useRef(), file_ = useRef();

    const clearForm = async (e) => {
        await new Promise(r => setTimeout(r, 10000));
        e.reset();
        resetForm();
        setSubmited(false);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (Object.keys(validations(form)).length > 0) {
            setErrors(validations(form))
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })
            return;
        }
        dispatch({
            type: "LOADER",
            payload: true
        })
        setSubmited(true);
        clearForm(e.target);

        // development
        // http://172.18.0.3:5000/tcode
        post("/tcode", form).then(async res => {
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })

            if (res.status === "Success") {
                dispatch({
                    type: "SET COLUMNS",
                    payload : Object.keys(res.data_show[0])
                })
                dispatch({
                    type: "SET DATA",
                    payload: res.data
                })
                dispatch({
                    type: "SET DATA SHOW", 
                    payload: res.data_show
                })              
                dispatch({
                    type: "ADD TOAST",
                    payload: {
                        title: res.status, 
                        message: res.message
                    }
                })
            } else {
                dispatch({
                    type: "ADD TOAST",
                    payload: {
                        title: res.status, 
                        message: res.message
                    }
                })
            }
            setErrors({});
        }).catch( async err => {
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })
            dispatch({
                type: "ADD TOAST",
                payload: {
                    title: "Error", 
                    message: "Something went wrong. please try again later."
                }
            })
            setErrors({});
            setSubmited(false);
        })
    }

    return ( 
        <div className={`tcode ${state.theme}`}>
                <form onSubmit={handleSubmit}>
                    <p>
                        <label htmlFor='file-0'>Main file:</label>
                        <input ref={file} className={errors.main ? "shake" : "input-data"} onChange={handleChange} id='file-0' type="file" name="file_main"></input>
                        { errors.main &&
                            <span>{errors.main}</span>
                        }
                    </p>
                    <p>
                        <label htmlFor="file-1">Second File:</label>
                        <input ref={file_} className={errors.second ? "shake" : "input-data"} onChange={handleChange} id='file-1' type="file" name="file_second"></input>
                        { errors.second &&
                            <span>{errors.second}</span>
                        }
                    </p>
                    <p>
                        <span style={{color: "gray", backgroundColor: "transparent"}}>Supported files: csv, (xlsx, xlsm, xltx, xltm)</span>
                    </p>
                    <p>
                        <label htmlFor='by-url'>Get Table from url</label>
                        <input id="by-url" className={errors.url ? "shake" : "input-data"} onChange={handleChange} type="text" name='url' value={form.url}></input>
                        { errors.url &&
                            <span>{errors.url}</span>
                        }
                    </p>
                    <p>
                        { submited ?
                            <button style={{background: "gray"}} disabled>Upload</button>
                            :
                            <button>Upload</button>
                        }
                        { errors.empty &&
                            <span>{errors.empty}</span>
                        }
                    </p>
                    
                </form> 
            </div>
    );
}
 
export default TcodeFilesForm;
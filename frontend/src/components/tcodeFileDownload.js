import React, { useState } from 'react';
import useForm from "../helpers/useForm";
import "../css/tcodeFileDownload.scss";
import customFetch from '../helpers/customFetch';

const initialData = {
    fileName: "",
    ext: "csv"
}

const validations = (form) => {
    let errors = {};

    if (form.fileName === "") {
        let err = "File name cant be empty";
        errors = {
            ...errors,
            fileName: err
        }
    }

    if (form.fileName !== "") {
        const re = /\s/;
        if (re.test(form.fileName)) {
            let err = "File name cant have spaces";
            errors = {
                ...errors,
                fileName: err
            }
        }
    } 

    return errors;
}

const TcodeFileDownload = ({theme, data, dispatch}) => {

    const {
        form,
        errors,
        handleChange,
        resetForm,
        setErrors
    } = useForm(initialData, validations);

    const {post} = customFetch();
    const [submited, setSubmited] = useState(false);

    const clearForm = async () => {
        await new Promise(r => setTimeout(r, 10000));
        setSubmited(false);
        resetForm();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({
            type: "LOADER",
            payload: true
        })
        if (Object.keys(validations(form)).length > 0) {
            setErrors(validations(form))
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })
            return;
        }
        clearForm();
        setSubmited(true);

        // add data to form and del pk
        const addData = {
            ...form,
            data: data.map(el => {
                const {pk, ...rest} = el;
                return rest;
            })
        }
        post("http://172.18.0.3:5000/tcode/download", addData, true).then(async res => {
            await new Promise(r => setTimeout(r, 2000));

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = `${form.fileName}.${form.ext}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            dispatch({
                type: "LOADER",
                payload: false
            })
            dispatch({
                type: "ADD TOAST",
                payload: {
                    title: "Success", 
                    message: "File downloaded successfully"
                }
            })
            setErrors({});
        }).catch(async err => {
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })
            dispatch({
                type: "ADD TOAST",
                payload: {
                    title: "Error", 
                    message: "Something went wrong. plese try again later."
                }
            })
            setErrors({});
            setSubmited(false);
        })
    }

    return ( 
        <div className={`container-download ${theme}`}>
            <div className="download">
                <form onSubmit={handleSubmit}>
                    <p>
                        <label htmlFor="fileName">File Name:</label>
                        <input id="fileName" className={errors.fileName ? "shake" : "input-data"} type="text" name="fileName" value={form.fileName} onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}></input>
                        { errors.fileName &&
                            <span>{errors.fileName}</span>
                        }
                    </p>
                    <p>
                        <label htmlFor="ext">File extension:</label>
                        <select id="ext" value={form.ext} name="ext" onChange={handleChange}>
                            <option value="csv">csv</option>
                            <option value="xlsx">excel</option>
                        </select>
                    </p>
                    <p>
                        { submited ?
                            <button style={{background: "gray"}} disabled>Download</button>
                            :
                            <button>Download</button>
                        }
                    </p>
                </form>
            </div>
        </div>
    );
}
 
export default TcodeFileDownload;
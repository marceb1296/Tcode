import React, { useState } from 'react';
import "../css/tcodeDataForm.scss";
import useForm from "../helpers/useForm";
import tcodeHelper from "../helpers/tcodeHelper";

const initialData = {
    column: "",
    operator: "filter",
    with_value: "",
    del: "",
    conditional: "",
    output: ""
}
const validations = (form, state) => {
    let errors = {};
    let err;

    if (form.column === "" && form.del === "") {
        err = "This field cant be empty";
        errors = {
            ...errors,
            cols: err
        }
    }


    if (form.column !== "") {
        const {columns} = state;
        err = [];
        form.column.split(", ").forEach(e => {
            if (!columns.filter(el => el !== "pk").includes(e)) {
                err = [...err, e];
            }
        });
        if (err.length > 0) {
            errors = {
                ...errors,
                cols: `Cant find "${err.join(", ")}" in table!` 
            }
        }

        if (form.output === "" && form.del === "" && form.operator !== "filter") {
            err = "This field cant be empy"
            errors = {
                ...errors,
                output: err
            }
        }
    }

    if (form.operator === "copy" && form.column.split(", ").length > 1) {
        err = "Cant copy more than one column!";
        errors = {
            ...errors,
            operator: err
        }
    }

    if (form.with_value !== "" && form.operator === "copy") {
        err = "Cant operate with extra value when column will be copied!";
        errors = {
            ...errors,
            extra: err
        }
    }

    if (form.del !== "") {
        const {columns} = state;
        err = [];
        form.del.split(", ").forEach(e => {
            if (!columns.filter(el => el !== "pk").includes(e)) {
                err = [...err, e]
            }
        });
        if (err.length > 0) {
            errors = {
                ...errors,
                del: `Cant delete "${err.join(", ")}", not in table!` 
            }
        }
    }

    if (form.conditional !== "") {
        const conditionalRegex = /^((,\s)?(((>=|<=|<|>)\s[0-9.]+)|(d\s(>=|<=|<|>)\s[^,]+)|((d\s)?(=|!=)\s[^,]+)|pk\s([0-9]+|[0-9]+-[0-9]+)))+?$/;
        ///^((,\s)?(((d\s)?(>=|<=|<|>)\s[0-9.]+)|((d\s)?(=|!=)\s[^,]+)|pk\s([0-9]+|[0-9]+-[0-9]+)))+?$/;
        if (!conditionalRegex.test(form.conditional)) {
            err = "Invalid format!"
            errors = {
                ...errors,
                conditional: err
            }
        }
    }

    return errors;
}

const TcodeDataForm = ({state, dispatch}) => {

    const {
        form, 
        errors,
        filtered,
        active,
        handleChange,
        handleClick,
        handleKeyDown, 
        setErrors, 
        resetForm} = useForm(initialData, validations, state);

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
        if (Object.keys(validations(form, state)).length > 0) {
            setErrors(validations(form, state))
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })
            return;
        }
        setSubmited(true);
        clearForm();
        tcodeHelper(form, state).then(async ([res, err]) => {
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "SET RESULT",
                payload: res
            })
            dispatch({
                type: "SET QUERY",
                payload: Object.values(form)
            })
            if (err.length > 0){
                dispatch({
                    type: "SET ERROR RESULT",
                    payload: err
                })
            } else {
                dispatch({
                    type: "SET ERROR RESULT",
                    payload: []
                })
            }
            dispatch({
                type: "LOADER",
                payload: false
            })
            setErrors({});
        }).catch(async err => {
            await new Promise(r => setTimeout(r, 2000));
            dispatch({
                type: "LOADER",
                payload: false
            })
            setSubmited(false);
            setErrors({});
        })
    }


    return (
        <div className={`container-data ${state.theme}`}>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="column" >Column name to operate:</label>
                    <input className={errors.cols ? "shake" : "input-data"} id="column" name="column" onChange={handleChange} onKeyDown={handleKeyDown} type="text" value={form.column} placeholder="col | col1, col2"></input>
                    { filtered.column && filtered.column.length > 0 && form.column !== "" &&
                        <ul>
                            {filtered.column.map((el, index) => <li className={index === active && "active"} key={index} id="filter-column" onClick={handleClick}>{el}</li>)}
                        </ul>
                    }
                    { errors.cols &&
                        <span className="error">{errors.cols}</span>
                    }
                    <span>If you will operate with only one column, just add the name, otherwise add the columns separated by a comma ",".</span>
                </div>
                
                <div className="field">
                    <label htmlFor="operator">Operation:</label>
                    <select className={errors.operator ? "shake" : "input-data"} id="operator" value={form.operator} onChange={handleChange} name="operator">
                        <option value="filter">Just filter</option>
                        <option value="copy">Copy</option>
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                        <option value="%">%</option>
                    </select>
                    { errors.operator &&
                        <span className="error">{errors.operator}</span>
                    }
                </div>
                <div className="field">
                    <label htmlFor="with_value">Operate with extra value:</label>
                    <input className={errors.extra ? "shake" : "input-data"} type="number" value={form.with_value} name="with_value" id="with_value" onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}></input>
                    { errors.extra &&
                        <span className="error">{errors.extra}</span>
                    }
                </div>
                <div className="field">              
                    <label htmlFor="del">Delete column:</label>
                    <input className={errors.del ? "shake" : "input-data"} id="del" name="del" onChange={handleChange} type="text" value={form.del} onKeyDown={handleKeyDown} placeholder="col | col1, col2"></input>
                    { filtered.del && filtered.del.length > 0 && form.del !== "" &&
                        <ul>
                            {filtered.del.map((el, index) => <li className={index === active && "active"} key={index} id="filter-del" onClick={handleClick}>{el}</li>)}
                        </ul>
                    }
                    { errors.del &&
                        <span className="error">{errors.del}</span>
                    }
                </div>
                <div className="field">
                    <label htmlFor="conditional">Conditional:</label>
                    <input className={errors.conditional ? "shake" : "input-data"} id="conditional" name="conditional" onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} type="text" value={form.conditional} placeholder="< 45, != state, pk 5-50 | d >= date, d < date"></input>
                    { errors.conditional &&
                        <span className="error">{errors.conditional}</span>
                    }
                    <span>{`Filter data by conditional like: < > = >= <= !=.`} <br />By pk: pk 3 | pk 3-46. <br />{`Or by dates: d > 2012-12-12 | d <= 2012-12-12.`}<br />Note: In date the expected format is ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)<br />Others formats may not work across all browsers.</span>
                </div>
                <div className="field">
                    <label htmlFor="output">Output column:</label>
                    <input id="output" name="output" onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} type="text" value={form.output}></input>
                    { errors.output &&
                        <span className="error">{errors.output}</span>
                    }
                    <span>If you want to rename the data of a column, just add the name of it.</span>
                </div>
                <div className='field'>
                    { submited ?
                        <button style={{background: "gray"}} disabled>Upload</button>
                        :
                        <button>Upload</button>
                    }
                </div>
            </form>
        </div>
    );
}
 
export default TcodeDataForm;
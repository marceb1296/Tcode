import { useState } from 'react';

const useForm = (initialData, validations, state) => {

    const [form, setForm] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [filtered, setFiltered] = useState({});
    const [active, setActive] = useState(0);

    const resetForm = () => {
        setForm(initialData);
    }

    const handleChange = (e) => {
        
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]: name.includes("file_") ? e.target.files[0] : value
        })

        if (state !== undefined) {
            const val = value.split(", ");
            setFiltered({
                [name]: state.columns.filter(el => val[val.length - 1].length > 0 && el !== val[val.length - 1] && el.toLowerCase().indexOf(val[val.length - 1].toLowerCase()) > -1 && el !== "pk")
            })
        }
    }

    const handleBlur = (e) => {
        handleChange(e);
        if (state === undefined) {
            setErrors(validations(form))
        } else {
            setErrors(validations(form, state))
        }
    }

    const handleClick = (e) => {
        
        setFiltered([]);
        const {id, innerText} = e.target; 
        const nameInput = id.split("-")[1];

        const element = document.getElementById(nameInput);
        
        const copyValue = element.value.slice();
        const splitValue = copyValue.split(", ");
        
        if (splitValue.length === 1) {
            handleBlur({
                target: {
                    name: nameInput,
                    value: copyValue.replace(splitValue[splitValue.length - 1], innerText)
                }
            })
            element.value = copyValue.replace(splitValue[splitValue.length - 1], innerText);
        } else {
            handleBlur({
                target: {
                    name: nameInput,
                    value: copyValue.replace(`, ${splitValue[splitValue.length - 1]}`, `, ${innerText}`)
                }
            })
        }

        // an intent to disabled errors on sugestion click
        element.focus();
        element.disabled = true;
        element.disabled = false;
        
    }

    const handleKeyDown = (e) => {

        const {name, value} = e.target;
        const val = value.split(", ");

        if (e.key === "Enter") {
            e.preventDefault();

            setActive(0);
            setFiltered([]);
            if (val.length === 1) {
                setForm({
                    ...form,
                    [name]: value.replace(val[val.length - 1], filtered[name][active])
                })
            } else {
                setForm({
                    ...form,
                    [name]: value.replace(`, ${val[val.length - 1]}`, `, ${filtered[name][active]}`)
                })
            }
        } else if (e.key === "ArrowUp") {
            // User pressed the up arrow, decrease the index
            if (active === 0) {
                return
            }
            setActive(v => v - 1);
            
        } else if (e.key === "ArrowDown") {
            // User pressed the down arrow, increment the index
            if (active + 1 > filtered[name].length - 1) {
                return;
            }
            setActive(v => v + 1);
        }
    }


    return {
        form,
        errors,
        filtered,
        active,
        handleChange,
        handleBlur,
        handleClick,
        setErrors,
        handleKeyDown,
        resetForm
    };
}
 
export default useForm;
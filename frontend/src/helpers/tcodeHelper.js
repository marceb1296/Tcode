const tcodeHelper = async (form, state) => {

    const {
        column,
        conditional,
        operator,
        output,
        with_value,
        del
    } = form;

    const {
        data
    } = state;

    let finalResult = [];
    let errorMessage = []

    finalResult = data.map(el => {
        
        let element = {...el};
        
        if (operator === "copy") {
            element = {
                ...element,
                [output]: el[column]
            }
        } else {
            let value = Number(el[column]);

            if (isNaN(value)) {
                let err = `Cant apply the operator "${operator}", expected Number, got String!`;
                if (!errorMessage.includes(err)) {
                    errorMessage = [
                        ...errorMessage,
                        err
                    ]
                }
                return element;
            }
            if (operator === "+") {
                element = {
                    ...element,
                    [output]: (with_value === "" ? value + value : value + Number(with_value)).toFixed(2)
                }
            } else if (operator === "-") {
                element = {
                    ...element,
                    [output]: (with_value === "" ? value - value : value - Number(with_value)).toFixed(2)
                }
            } else if (operator === "*") {
                element = {
                    ...element,
                    [output]: (with_value === "" ? value * value : value * Number(with_value)).toFixed(2)
                }
            } else if (operator === "/") {
                element = {
                    ...element,
                    [output]: (with_value === "" ? value / value : value / Number(with_value)).toFixed(2)
                }
            } else if (operator === "%") {
                element = {
                    ...element,
                    [output]: (with_value === "" ? 100 / (value * value) : 100 / (value * Number(with_value))).toFixed(2)
                }
            }
        }

        return element;
        
    });

    if (del !== "") {
        const del_ = del.split(", ");
        del_.forEach(element => {
            finalResult = finalResult.map(el => {
                const {[element]: remove, ...rest} = el;
                return rest;
            })
        });
    }

    if (conditional !== "") {
        const cond = conditional.split(", ");
        cond.forEach(element => {
            finalResult = finalResult.filter(el => {
                let [type, value, ...date] = element.split(" ");
                let toNum = Number(el[column]);

                if (type === "<") {
                    if (!isNaN(toNum)) {
                        return el[column] < Number(value);
                    } else {
                        let err = `Some values in "${column}" had not Numbers!`;
                        if (!errorMessage.includes(err)) {
                            errorMessage = [
                                ...errorMessage,
                                err
                            ]
                        }
                    }
                } else if (type === ">") {
                    if (!isNaN(toNum)) {
                        return el[column] > Number(value);
                    } else {
                        let err = `Some values in "${column}" had not Numbers!!`;
                        if (!errorMessage.includes(err)) {
                            errorMessage = [
                                ...errorMessage,
                                err
                            ]
                        }
                    }
                } else if (type === "<=") {
                    if (!isNaN(toNum)) {
                        return el[column] <= Number(value);
                    } else {
                        let err = `Some values in "${column}" had not Numbers!`;
                        if (!errorMessage.includes(err)) {
                            errorMessage = [
                                ...errorMessage,
                                err
                            ]
                        }
                    }
                } else if (type === ">=") {
                    if (!isNaN(toNum)) {
                        return el[column] >= Number(value);
                    } else {
                        let err = `Some values in "${column}" had not Numbers!`;
                        if (!errorMessage.includes(err)) {
                            errorMessage = [
                                ...errorMessage,
                                err
                            ]
                        }
                    }
                } else if (type === "=") {
                    return el[column] == value;
                } else if (type === "!=") {
                    return el[column] != value
                } else if (type === "pk") {
                    let [first, second] = value.split("-");
                    if (second === undefined) {
                        return el.pk == Number(first);
                    } else {
                        return el.pk >= Number(first) && el.pk <= Number(second);
                    }                 
                } else if (type === "d") {
                    let joinDate = date.join(" ");
                    let isDate = new Date(el[column])
                    let isDateValue = new Date(joinDate)
                    if (isDate instanceof Date && !isNaN(isDate)) {

                        if (isDateValue instanceof Date && !isNaN(isDateValue)) {
                            if (value === "<") {
                                return el[column] < joinDate;
                            } else if (value === ">") {
                                return el[column] > joinDate;
                            } else if (value === "<=") {
                                return el[column] <= joinDate;
                            } else if (value === ">=") {
                                return el[column] >= joinDate;
                            } else if (value === "=") {
                                return el[column] == joinDate;
                            } else if (value === "!=") {
                                return el[column] != joinDate;
                            }
                        } else {
                            let err = `The input ${date} is an invalid Date!`;
                            if (!errorMessage.includes(err)) {
                                errorMessage = [
                                    ...errorMessage,
                                    err
                                ]
                            }
                        }

                    } else {
                        let err = `Some values in "${column}" had invalid Dates!`;
                        if (!errorMessage.includes(err)) {
                            errorMessage = [
                                ...errorMessage,
                                err
                            ]
                        }
                    }

                }
                return el;
            })
        });
    }    

    return [finalResult, errorMessage];
}
 
export default tcodeHelper;
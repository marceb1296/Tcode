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
    let errorMessage = [];
    let cols = column.split(", ");

    if (operator !== "filter") {
        finalResult = data.map(el => {
            
            let element = {...el};
            
            if (operator === "copy") {
                element = {
                    ...element,
                    [output]: el[column]
                }
            } else {
                if (!cols.every(isN => Number(el[isN]))) {
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
                        [output]: (
                            with_value === "" ? 
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) + Number(el[cols[0]])
                                    : 
                                    cols.reduce((prev, next) => Number(el[prev]) + Number(el[next])))
                                :
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) + Number(with_value)
                                    : 
                                    cols.reduce((prev, next) => (Number(el[prev]) + Number(with_value)) + (Number(el[next]) + Number(with_value)))
                                )

                        ).toFixed(2)
                    }
                } else if (operator === "-") {
                    element = {
                        ...element,
                        [output]: (
                            with_value === "" ? 
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) - Number(el[cols[0]])
                                    : 
                                    cols.reduce((prev, next) => Number(el[prev]) - Number(el[next])))
                                :
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) - Number(with_value)
                                    : 
                                    cols.reduce((prev, next) => (Number(el[prev]) - Number(with_value)) - (Number(el[next]) - Number(with_value)))
                                )

                        ).toFixed(2)
                    }
                } else if (operator === "*") {
                    element = {
                        ...element,
                        [output]: (
                            with_value === "" ? 
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) * Number(el[cols[0]])
                                    : 
                                    cols.reduce((prev, next) => Number(el[prev]) * Number(el[next])))
                                :
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) * Number(with_value)
                                    : 
                                    cols.reduce((prev, next) => (Number(el[prev]) * Number(with_value)) * (Number(el[next]) * Number(with_value)))
                                )

                        ).toFixed(2)
                    }
                } else if (operator === "/") {
                    element = {
                        ...element,
                        [output]: (
                            with_value === "" ? 
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) / Number(el[cols[0]])
                                    : 
                                    cols.reduce((prev, next) => Number(el[prev]) / Number(el[next])))
                                :
                                (cols.length === 1 ? 
                                    Number(el[cols[0]]) / Number(with_value)
                                    : 
                                    cols.reduce((prev, next) => (Number(el[prev]) / Number(with_value)) / (Number(el[next]) / Number(with_value)))
                                )

                        ).toFixed(2)
                    }
                } else if (operator === "%") {
                    element = {
                        ...element,
                        [output]: (
                            with_value === "" ? 
                                (cols.length === 1 ? 
                                    (Number(el[cols[0]]) * Number(el[cols[0]])) / 100
                                    : 
                                    (cols.reduce((prev, next) => Number(el[prev]) + Number(el[next])) * cols.reduce((prev, next) => Number(el[prev]) + Number(el[next]))) / 100
                                )
                                :
                                (cols.length === 1 ? 
                                    (Number(el[cols[0]]) * Number(with_value)) / 100
                                    : 
                                    (cols.reduce((prev, next) => Number(el[prev]) + Number(el[next])) * Number(with_value)) / 100
                                )

                        ).toFixed(2)
                    }
                }
            }

            return element;
            
        });
    } else {
        finalResult = [...data]
    }


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
                let toNum = Number(el[cols[0]]);

                if (type === "<") {
                    if (!isNaN(toNum)) {
                        return el[cols[0]] < Number(value);
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
                        return el[cols[0]] > Number(value);
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
                        return el[cols[0]] <= Number(value);
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
                        return el[cols[0]] >= Number(value);
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
                    return el[cols[0]] == value;
                } else if (type === "!=") {
                    return el[cols[0]] != value
                } else if (type === "pk") {
                    let [first, second] = value.split("-");
                    if (second === undefined) {
                        return el.pk == Number(first);
                    } else {
                        return el.pk >= Number(first) && el.pk <= Number(second);
                    }                 
                } else if (type === "d") {
                    let joinDate = date.join(" ");
                    let isDate = new Date(el[cols[0]])
                    let isDateValue = new Date(joinDate)
                    if (isDate instanceof Date && !isNaN(isDate)) {

                        if (isDateValue instanceof Date && !isNaN(isDateValue)) {
                            if (value === "<") {
                                return el[cols[0]] < joinDate;
                            } else if (value === ">") {
                                return el[cols[0]] > joinDate;
                            } else if (value === "<=") {
                                return el[cols[0]] <= joinDate;
                            } else if (value === ">=") {
                                return el[cols[0]] >= joinDate;
                            } else if (value === "=") {
                                return el[cols[0]] == joinDate;
                            } else if (value === "!=") {
                                return el[cols[0]] != joinDate;
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
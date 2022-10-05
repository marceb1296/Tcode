import React, { useState } from 'react';
import "../css/tcodeTable.scss";

const inialValue = {
    rows: 5
}

const TcodeTable = ({data, columns, theme, query, error, tableNumber, result}) => {

    const [rows, setRows] = useState(inialValue);
    const cols = tableNumber === 0 ? columns : result.length > 0 ? Object.keys(result[0]) : [];
    const [showNaN, setShowNaN] = useState(false);

    const handleChange = (e) => {
        setRows({rows: e.target.value})
    }


    return (       
        <>
            { tableNumber > 0 && query.length > 0 &&
                <div className={`query ${theme}`}>
                    <div className='values'>
                        <label>Query:</label>
                        <br />
                        {Object.values(query).map((el, index) => <label key={index}> {el} |</label> )}              
                    </div>             
                </div>
            }
            { data.length > 0 &&
                <p className={`rows ${theme}`}>
                    <label htmlFor={`rows-${tableNumber}`}>Rows to show:</label>
                    <select id={`rows-${tableNumber}`} value={rows.rows} onChange={handleChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        {tableNumber > 0 &&
                            <option value={data.length}>all</option>
                        }
                    </select>
                </p>
            }
            { tableNumber > 0 && error.length > 0 &&
                <div className='errors'>
                    <div className='values'>
                        <span><b>Warning!</b></span>
                        {error.map((el, index) => <span key={index}>{el}</span>)}
                    </div>
                    
                </div>
            }
            { data.length > 0 &&
                <div className={`nan ${theme}`}>
                    <p>
                        <label>Show NaN as empty value: <input checked={showNaN} onChange={() => setShowNaN(el => !el)} type="checkbox"></input></label>
                    </p>
                </div>
            }
            <div className='container-table'>
                <table className={theme}>
                    <thead>
                        <tr>
                            { cols.length > 0 &&
                                cols.map(
                                    (el, index) => <th key={index}>{el}</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        { data.length > 0 &&
                            data.slice(0, rows.rows).map(
                                (el, index) => <tr key={index}>{
                                    Object.values(el).map(
                                        (item, index) => <td key={index}>{showNaN && item === "NaN" ? "" : item}</td>
                                    )
                                }</tr>
                            )
                        }
                    </tbody>
                </table>  
            </div>
        </>
    );
}
 
export default TcodeTable;
import TcodeTable from './tcodeTable';
import TcodeFilesForm from './tcodeFilesForm';
import TcodeDataForm from './tcodeDataForm';
import TcodeFileDownload from './tcodeFileDownload';



const Tcode = ({state, dispatch}) => {


    return (
        <>
            <TcodeFilesForm state={state} dispatch={dispatch}/>
            <p></p>
            <TcodeTable data={state.dataShow} theme={state.theme} columns={state.columns}/>
            <p></p>
            { state.dataShow.length > 0 && 
                <TcodeDataForm  state={state} dispatch={dispatch}/>
            }
            { state.result.length > 0 &&
                <>
                    <TcodeTable data={state.result} theme={state.theme} query={state.query} error={state.errorResult}/>
                    <TcodeFileDownload theme={state.theme} data={state.result} dispatch={dispatch} />
                </>
            }
            
        </>
     );
}
 
export default Tcode;
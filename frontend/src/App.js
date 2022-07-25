import { useReducer } from "react";
import Loader from "./components/loader";
import Tcode from "./components/tcode";
import Theme from "./components/themes";
import Toast from "./components/toast";


const initialState = {
  theme: localStorage.getItem("theme") || "ligth",
  columns: [],
  dataShow: [],
  data: [],
  result: [],
  toasts: [],
  query: [],
  errorResult: [],
  loader: false
};

function reducer(state, action) {

  const {type, payload} = action;
  const randomID = () => Math.floor((Math.random() * 1000) + 1);
  
  switch (type) {
    case 'SET THEME':
      localStorage.setItem("theme", payload)
      return {
        ...state,
        theme: payload
      };
    case "SET COLUMNS":
      return {
        ...state, 
        columns: payload
      }
    case "SET DATA SHOW":
      return {
        ...state,
        dataShow: payload
      }
    case "SET DATA":
      return {
        ...state,
        data: payload
      }
    case "SET RESULT":
      return {
        ...state,
        result: payload
      }
    case "SET QUERY":
      return {
        ...state,
        query: payload
      }
    case "SET ERROR RESULT":
      return {
        ...state,
        errorResult: payload
      }
    case "ADD TOAST":
      return {
        ...state,
        toasts: [...state.toasts, {...payload, id: randomID()}]
      }
    case "DEL TOAST":
      return {
        ...state,
        toasts: state.toasts.filter(el => el.id !== payload)
      }
    case "LOADER":
      return {
        ...state,
        loader: payload
      }
    default:
      throw new Error();
  }

}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="App">

      <Theme ligthColor="#fbf7f7" darkColor="#13232f" dispatch={dispatch}/>
      <Toast state={state} dispatch={dispatch}/>
      <Loader state={state.loader}/>
      <Tcode state={state} dispatch={dispatch} />
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route, useNavigate, Navigate} from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import Task_Managment from './Components/Task_Managment';
import ShowTasks from './Components/Show_tasks';
import ManageUsers from './Components/Admin/Manage_users';
import { useSelector,useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setisLogged } from './Redux-Toolkit/Slices/permissonSlice';
import Navbar from './Small_components/Navbar';
import EditTask from './Components/Edit_task';
import EditUser from './Components/Edit_user';


function App() {
  const {isLogged} = useSelector((state) => state.permission);
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!isLogged){
      checkAuth()
    }
  },[])
  
const checkAuth = () =>{
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    localStorage.setItem("accessToken",user.accessToken)
    localStorage.setItem("uid",uid)
    dispatch(setisLogged(!isLogged))
    
  } 

});
}

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            
          {
            isLogged ?
            <>
            
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/tasks' element={<Task_Managment/>}/>
            <Route path='/manageUser' element={<ManageUsers/>}/>
            <Route path='/showtasks' element={<ShowTasks/>}/>
            <Route path='/edittask/:taskid' element={<EditTask/>}/>
            <Route path='/edituser/:userid' element={<EditUser/>}/>
            
            </>
            :null
          }
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

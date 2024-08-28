import { createSlice } from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../Firebase/Config';
const initialState = {
    isLogged:false,
    managerPer:['task_readonly','task_write','userdata_readonly'],
    adminPer:['task_readonly','task_write','userdata_readonly','userdata_write'],
    userPer:['task_readonly','userdata_readonly'],
    userData:{}
  };

const permissionSlice = createSlice({
name: 'permission',
initialState,
reducers: {
    setisLogged: (state, action) => {
    state.isLogged=action.payload;
    },
    setuserData: (state, action) => {
    state.userData=action.payload;
    },
},
});

export const { setisLogged,setuserData } = permissionSlice.actions;
export default permissionSlice.reducer; 

export const fetchData =  () => async (dispatch)=> {
    const uid = localStorage.getItem("uid")
    const q = query(collection(db, "register"), where("uid", "==",uid ));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dispatch(setuserData(doc.data()))
    });
  }
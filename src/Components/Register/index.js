import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../Firebase/Config';
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux';
import { setisLogged } from '../../Redux-Toolkit/Slices/permissonSlice';

const MySwal = withReactContent(Swal);


const auth = getAuth();

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['admin', 'manager', 'user'], 'Invalid role').required('Role is required'),
});

function Register() {

  const {isLogged,managerPer,userPer} = useSelector((state) => state.permission);
  const dispatch = useDispatch()
  const Navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: '', 
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values)
      registerAuth(values)
    },
  });


  const storeUserData = async (values,uid) =>{
      try {
        const docRef = await addDoc(collection(db, "register"), {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
          uid:uid,
          permission:values.role == "manager"?  managerPer:userPer
        });
        // console.log("Document written with ID: ", docRef.id);
        // Show a popup on successful registration
      MySwal.fire({
        title: 'Registration Successful!',
        text: 'You have successfully registered. You can now log in.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
        Navigate('/showtasks')
        
    
      } catch (e) {
        console.error("Error adding document: ", e);
        
      }
    
  }

  const registerAuth = (value) => {
    createUserWithEmailAndPassword(auth, value.email, value.password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user)
    // set to localstorage
    storeUserData(value,user.uid)
    localStorage.setItem("accessToken",user.accessToken)
    localStorage.setItem("uid",user.uid)
    dispatch(setisLogged(!isLogged))
   
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    MySwal.fire({
      title: 'Registration Faild!',
      text: 'Already this Email was Use.',
      icon: 'failed',
      confirmButtonText: 'OK',
    });
  
  });
  formik.resetForm()
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`mt-1 w-full px-4 py-2 border ${
                formik.touched.username && formik.errors.username
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
            ) : null}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`mt-1 w-full px-4 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            ) : null}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`mt-1 w-full px-4 py-2 border ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            ) : null}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              className={`mt-1 w-full px-4 py-2 border ${
                formik.touched.role && formik.errors.role
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
            >
              <option value="selectone">Select One</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            {formik.touched.role && formik.errors.role ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

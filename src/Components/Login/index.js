import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { setisLogged } from '../../Redux-Toolkit/Slices/permissonSlice';

const MySwal = withReactContent(Swal);

const validationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});



function Login() {

  const {isLogged} = useSelector((state) => state.permission);
  const dispatch = useDispatch()

  
  const Navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      loginAuth(values)
      
    },
  });

  const auth = getAuth();
  const loginAuth = async(value) =>{
    await signInWithEmailAndPassword(auth, value.email, value.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
  
    localStorage.setItem("accessToken",user.accessToken)
    localStorage.setItem("uid",user.uid)
    
    // Show a popup on successful login
    MySwal.fire({
      title: 'Login Successful!',
      text: 'You have successfully Login.',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    dispatch(setisLogged(!isLogged))
    Navigate('/showtasks')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    // Show a popup on failed login
    MySwal.fire({
      title: 'Login Faild!',
      text: 'Pls Fill Correct Email And Password .',
      icon: 'failed',
      confirmButtonText: 'OK',
    });
  });
  formik.resetForm()
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit}>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            New user?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


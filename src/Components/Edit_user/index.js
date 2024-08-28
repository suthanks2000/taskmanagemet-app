import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../Firebase/Config'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Navbar from '../../Small_components/Navbar';
import { useFormik } from 'formik';
import * as yup from 'yup';


const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  role: yup.string().oneOf(['manager', 'user'], 'Invalid role').required('Role is required'),
  
});

const roleOptions = ['manager', 'user'];
const permissionOptions = [
  'task_readonly',
  'task_write',
  'userdata_readonly',
  'userdata_write'
];

const EditUser = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: '',
      
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const userDoc = doc(db, 'register', userid);
      await updateDoc(userDoc, {
        ...values,
        permission: selectedPermissions 
      });
      alert('User updated successfully');
      navigate('/manageUser');
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = doc(db, 'register', userid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        formik.setValues({
          username: data.username || '',
          email: data.email || '',
          password: data.password || '',
          role: data.role || '',
        });
        setSelectedPermissions(data.permission || []);
      }
    };

    fetchUser();
  }, [userid]);

  const handleSelect = (event) => {
    const value = event.target.value;
    if (value && !selectedPermissions.includes(value)) {
      setSelectedPermissions([...selectedPermissions, value]);
      formik.setFieldValue('permission', ''); 
    }
  };

  const handleRemove = (permission) => {
    setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Edit User</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full px-4 py-2 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formik.touched.username && formik.errors.username ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
              ) : null}
            </div>

           
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full px-4 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="text"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full px-4 py-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full px-4 py-2 border ${formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {formik.touched.role && formik.errors.role ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label htmlFor="permission" className="block text-gray-700">Permission</label>
              <select
                id="permission"
                name="permission"
                value={formik.values.permission}
                onChange={handleSelect}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full px-4 py-2 border ${formik.touched.permission && formik.errors.permission ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Permission</option>
                {permissionOptions.map((permission) => (
                  <option key={permission} value={permission}>{permission}</option>
                ))}
              </select>
              {formik.touched.permission && formik.errors.permission ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.permission}</p>
              ) : null}
            </div>
            <div className="mb-4">
              {selectedPermissions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPermissions.map(permission => (
                    <div key={permission} className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                      <span>{permission}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(permission)}
                        className="ml-2 text-blue-800 hover:text-blue-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={() => navigate('/manageUser')}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUser;

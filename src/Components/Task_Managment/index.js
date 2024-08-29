import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Small_components/Navbar';
import { db } from '../../Firebase/Config';
import { collection, addDoc, getDocs, where, query } from "firebase/firestore"; 

// Validation schema
const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  status: yup.string().oneOf(['To_Do', 'In_Progress', 'Completed'], 'Invalid status').required('Status is required'),
  assignedUser: yup.string(),
});

const TaskManagement = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]); 
  useEffect(()=>{
    fetchUsers()
  },[])

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "register"), where("role", "!=","admin" ));

      const usersSnap = await getDocs(q); 
      const usersList = usersSnap.docs.map((doc) => doc.data()); 
      setAllUsers(usersList);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: '', 
      assignedUser: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const selectedUser = allUsers.find(user => user.username === values.assignedUser);
        const assignedUid = selectedUser ? selectedUser.uid : null;

        
        await addDoc(collection(db, 'tasks'), {
          title: values.title,
          description: values.description,
          status: values.status,
          assignedUser: values.assignedUser,
          uid: assignedUid
        });

        alert('Task added successfully!');
        navigate('/showtasks');
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    },
  });

  const handleClear = () => {
    formik.resetForm();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Task Management</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={`mt-1 w-full px-4 py-2 border ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">Status</label>
                <select
                  id="status"
                  name="status"
                  className={`mt-1 w-full px-4 py-2 border ${formik.touched.status && formik.errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.status}
                >
                  <option value="">Select One</option>
                  <option value="To_Do">To Do</option>
                  <option value="In_Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.status}</p>
                ) : null}
              </div>
              <div className="mb-4">
              <label htmlFor="assigned_user" className="block text-gray-700">Assigned User</label>
              <select
                id="assigned_user"
                name="assignedUser"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.assignedUser}
              >
                <option value="">Select User</option>
                {allUsers.map((user, index) => (
                  <option key={index} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
              {formik.touched.assignedUser && formik.errors.assignedUser ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.assignedUser}</p>
              ) : null}
            </div>

             
              <div className="flex justify-between">
                
                <button
                  type="submit"
                  className=" bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Add Task
                </button>

                <button
                  type="button" 
                  onClick={handleClear}
                  className=" bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Clear
                </button>
                <button
                  type="button" 
                  onClick={()=>navigate('/showtasks')}
                  className=" bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskManagement;

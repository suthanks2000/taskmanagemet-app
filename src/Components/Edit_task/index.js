import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc,collection,getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Config'; 
import Navbar from '../../Small_components/Navbar';


const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  status: yup.string().oneOf(['To_Do', 'In_Progress', 'Completed'], 'Invalid status').required('Status is required'),
  assigned_user: yup.string().required('Assigned user is required'),
});

const EditTask = () => {
  const [allUsers, setAllUsers] = useState([]); 
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    status: 'To_Do',
    assigned_user: '',
  });
  const { taskid } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {

    const fetchTaskData = async () => {
      try {
        const taskRef = doc(db, 'tasks', taskid); 
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) {
          setInitialValues(taskSnap.data());
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'register')); 
        const usersList = usersSnap.docs.map((doc) => doc.data()); 
        setAllUsers(usersList);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchTaskData();
    fetchUsers();
  }, [taskid]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const selectedUser = allUsers.find(user => user.username === values.assigned_user);
        const assignedUid = selectedUser ? selectedUser.uid : null;
        const taskRef = doc(db, 'tasks', taskid); 
        await updateDoc(taskRef, {...values,uid:assignedUid});
        navigate('/showtasks'); 
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

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
                <option value="">Select User</option>
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
                name="assigned_user"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.assigned_user}
              >
                <option value="">Select User</option>
                {allUsers.map((user, index) => (
                  <option key={index} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
              {formik.touched.assigned_user && formik.errors.assigned_user ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.assigned_user}</p>
              ) : null}
            </div>

            
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Update Task
              </button>
              <button
                type="button"
                onClick={() => navigate('/showtasks')} 
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

export default EditTask;

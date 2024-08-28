import React, { useState, useEffect } from 'react';
import Navbar from '../../Small_components/Navbar';
import { db } from '../../Firebase/Config'; 
import { doc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore"; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShowTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.permission);

  const fetchTasks = async () => {
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const tasksData = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(tasksData);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    const taskDocRef = doc(db, 'tasks', id);
    await deleteDoc(taskDocRef);
    fetchTasks();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center p-4">
        <div className="w-full max-w-4xl p-6 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Task Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Assigned User</th>
                  {userData.permission && userData.permission.includes("task_write") && (
                    <>
                      <th className="border p-2">Edit</th>
                      <th className="border p-2">Delete</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="bg-gray-50 hover:bg-gray-100">
                    <td className="border p-2">{task.title}</td>
                    <td className="border p-2">{task.description}</td>
                    <td className="border p-2">{task.status}</td>
                    <td className="border p-2">{task.assigned_user}</td>
                    {userData.permission && userData.permission.includes("task_write") && (
                      <>
                        <td className='border p-2'>
                          <button
                            onClick={() => navigate(`/edittask/${task.id}`)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                          >
                            Edit
                          </button>
                        </td>
                        <td className='border p-2'>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowTasks;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../../Firebase/Config';
import Navbar from '../../../Small_components/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const { userData } = useSelector((state) => state.permission);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "register"));
    const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userData);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "register", id));
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                
                {userData.permission && userData.permission.includes("userdata_write") && (
                  <>
                    <th className="border px-4 py-2">Permission</th>
                    <th className="border px-4 py-2">Edit</th>
                    <th className="border px-4 py-2">Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  
                  {userData.permission && userData.permission.includes("userdata_write") && (
                    <>
                    <td className="border px-4 py-2">
                    {user.permission? 
                    <ul className="list-disc pl-5">
                    {user.permission.map((perm, index) => (
                      <li key={index}>{perm}</li>
                    ))}
                  </ul>:null}
                  </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => navigate(`/edituser/${user.id}`)}
                          className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
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
    </>
  );
};

export default ManageUsers;

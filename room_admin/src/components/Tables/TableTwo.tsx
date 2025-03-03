import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const TableTwo = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://backend-roomfinder-api.onrender.com/admin/getrenters",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (id: string) => {
    console.log(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete user with ID: ${id}`);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await fetch(
        `https://backend-roomfinder-api.onrender.com/admin/users/block/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
    }
  };


  console.log(users);
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Users
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Name</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Gender</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Age</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Contact</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Status</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      {users?.map((user, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {user.full_name}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{user.gender}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{user.age}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black">{user.phone}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <button
              onClick={() => toggleStatus(user.u_id, user.status)}
              className={`px-3 py-1 rounded-lg text-white text-sm ${
                user.status
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {user.status ? "Active" : "Inactive"}
            </button>
          </div>
          <div className="col-span-1 flex items-center space-x-4">
            <button
              onClick={() => handleEdit(user.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;

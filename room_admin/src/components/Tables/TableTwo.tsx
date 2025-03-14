import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const TableTwo = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
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
      } finally {
        setLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Users
        </h4>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">Name</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Gender</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Contact</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Email</p>
            </div>
          </div>

          {users?.map((user, key) => (
            <div
              className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5"
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
                <p className="text-sm text-black">{user.phone}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black">{user.email}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TableTwo;

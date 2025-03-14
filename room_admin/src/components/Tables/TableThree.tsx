import { useState, useEffect } from "react";

const TableThree = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://backend-roomfinder-api.onrender.com/admin/gethomeOwners",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching owners:", error);
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
          House Owners
        </h4>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">Name</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Gender</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Email</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Contact</p>
            </div>
          </div>

          {user?.map((owner, key) => (
            <div
              className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
              key={key}
            >
              <div className="col-span-1 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {owner.full_name}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">{owner.gender}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">{owner.email}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black">{owner.phone}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TableThree;

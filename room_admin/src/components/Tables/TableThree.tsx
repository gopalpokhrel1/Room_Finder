import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TableThree = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          'https://backend-roomfinder-api.onrender.com/admin/gethomeOwners',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5YThhYjAxLWRmZGMtNDE4OS04MDFiLWYzMGVmOWEyNDNhMiIsImVtYWlsIjoiZGluZXNoQGdtYWlsLmNvbSIsInBob25lIjoiOTYzMDI1ODc0MSIsImlhdCI6MTc0MDg5MDcyMSwiZXhwIjoxNzQwOTc3MTIxfQ.YFyo7C4XYlB9k5EfuuebGDFjy_8ExWAS0W3OgXTpvx8`
            }
          }
        );

        const data = await res.json();
        console.log(data);
        setUser(data.data);
      } catch {}
    };
    fetchUsers();
  }, []);

  const handleEdit = (id: string) => {
    console.log(`Edit owner with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete owner with ID: ${id}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          House Owners
        </h4>
      </div>

      <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
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
          <p className="font-medium">Action</p>
        </div>
      </div>

      {user?.map((owner, key) => (
        <div
          className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">{owner.full_name}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{owner.gender}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{owner.age}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black">{owner.phone}</p>
          </div>
          <div className="col-span-1 flex items-center space-x-4">
            <button onClick={() => handleEdit(owner.id)} className="text-blue-500 hover:text-blue-700">
              <Edit size={20} />
            </button>
            <button onClick={() => handleDelete(owner.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableThree;

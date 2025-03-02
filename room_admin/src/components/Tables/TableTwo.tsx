import { useEffect, useState } from "react";




const TableTwo = () => {

  const [user, setUser] = useState([]);

  useEffect(()=>{
    const fetchUsers = async ()=>{
      try{
        const res = await fetch("https://backend-roomfinder-api.onrender.com/admin/getallusers", {
          method:"GET",
          headers:{
            Authorization :`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5YThhYjAxLWRmZGMtNDE4OS04MDFiLWYzMGVmOWEyNDNhMiIsImVtYWlsIjoiZGluZXNoQGdtYWlsLmNvbSIsInBob25lIjoiOTYzMDI1ODc0MSIsImlhdCI6MTc0MDg5MDcyMSwiZXhwIjoxNzQwOTc3MTIxfQ.YFyo7C4XYlB9k5EfuuebGDFjy_8ExWAS0W3OgXTpvx8`
          }
        })

        const data = await res.json();
        console.log(data);
       setUser(data.data);
      }
      catch{}
      finally{}
    }
    fetchUsers()
  }, [])
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Users
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
      </div>

      {user?.map((product, key) => (
        <div
          className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.full_name}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {product.gender}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{product.age}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black">{product.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;

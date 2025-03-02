import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import { IoPersonOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { MdOutlineBedroomParent } from "react-icons/md";

const ECommerce: React.FC = () => {
  const [data, setData] = useState();
  const [flats, setFlats] = useState();

  useEffect(()=>{
    const fetchStatus = async() =>{
      try{
        const res = await fetch("https://backend-roomfinder-api.onrender.com/admin/users/stats", {
          method:"GET",
          headers:{
            Authorization :`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5YThhYjAxLWRmZGMtNDE4OS04MDFiLWYzMGVmOWEyNDNhMiIsImVtYWlsIjoiZGluZXNoQGdtYWlsLmNvbSIsInBob25lIjoiOTYzMDI1ODc0MSIsImlhdCI6MTc0MDg5MDcyMSwiZXhwIjoxNzQwOTc3MTIxfQ.YFyo7C4XYlB9k5EfuuebGDFjy_8ExWAS0W3OgXTpvx8`
          }
        })
        const data = await res.json();
        setData(data);
      }

      
      catch{}
      finally{}
    }
    fetchStatus()
  }, [])

  useEffect(()=>{
    const fetchStatus = async() =>{
      try{
        const res = await fetch("https://backend-roomfinder-api.onrender.com/admin/roomkpis", {
          method:"GET",
          headers:{
            Authorization :`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5YThhYjAxLWRmZGMtNDE4OS04MDFiLWYzMGVmOWEyNDNhMiIsImVtYWlsIjoiZGluZXNoQGdtYWlsLmNvbSIsInBob25lIjoiOTYzMDI1ODc0MSIsImlhdCI6MTc0MDg5MDcyMSwiZXhwIjoxNzQwOTc3MTIxfQ.YFyo7C4XYlB9k5EfuuebGDFjy_8ExWAS0W3OgXTpvx8`
          }
        })
        const data = await res.json();
        console.log(data);
        setFlats(data);
      }

      
      catch{}
      finally{}
    }
    fetchStatus()
  }, [])


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Owners" total={data?.totalHomeOwners}>
  <IoPersonOutline size={20} color="blue"/>

        </CardDataStats>
        <CardDataStats title="Total Users" total={data?.totalUsers} >
      <FiUsers size={20} color='blue'/>
        </CardDataStats>
        <CardDataStats title="Total Flats" total={flats?.totalFlats}>
        <BiBuildings size={20} color='blue'/>

        </CardDataStats>
        <CardDataStats title="Total Rooms" total={flats?.totalRooms}>
      <MdOutlineBedroomParent size={20} color='blue'/>
        </CardDataStats>
      </div>

    </>
  );
};

export default ECommerce;

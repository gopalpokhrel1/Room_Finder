import React, { useEffect, useState } from "react";
import CardDataStats from "../../components/CardDataStats";
import { IoPersonOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { MdOutlineBedroomParent } from "react-icons/md";

const ECommerce: React.FC = () => {
  const [data, setData] = useState(null);
  const [flats, setFlats] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          "https://backend-roomfinder-api.onrender.com/admin/users/stats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await fetch(
          "https://backend-roomfinder-api.onrender.com/admin/roomkpis",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setFlats(data);
      } catch (error) {
        console.error("Error fetching room stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlats();
  }, []);

  console.log(data);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats title="Total Owners" total={data?.totalHomeOwners}>
            <IoPersonOutline size={20} color="blue" />
          </CardDataStats>
          <CardDataStats title="Total Renters" total={data?.totalRenters}>
            <FiUsers size={20} color="blue" />
          </CardDataStats>
          <CardDataStats title="Total Flats" total={flats?.totalFlats}>
            <BiBuildings size={20} color="blue" />
          </CardDataStats>
          <CardDataStats title="Total Rooms" total={flats?.totalRooms}>
            <MdOutlineBedroomParent size={20} color="blue" />
          </CardDataStats>
        </div>
      )}
    </>
  );
};

export default ECommerce;

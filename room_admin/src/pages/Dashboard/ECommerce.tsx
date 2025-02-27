import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChatCard from '../../components/Chat/ChatCard';
import TableOne from '../../components/Tables/TableOne';
import { IoPersonOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineBedroomParent } from "react-icons/md";

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Owners" total="3">
  <IoPersonOutline size={20} color="blue"/>

        </CardDataStats>
        <CardDataStats title="Total Users" total="4" >
      <FiUsers size={20} color='blue'/>
        </CardDataStats>
        <CardDataStats title="Total Flats" total="3">
        <BiBuildings size={20} color='blue'/>

        </CardDataStats>
        <CardDataStats title="Total Rooms" total="3">
      <MdOutlineBedroomParent size={20} color='blue'/>
        </CardDataStats>
      </div>

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div> */}
    </>
  );
};

export default ECommerce;

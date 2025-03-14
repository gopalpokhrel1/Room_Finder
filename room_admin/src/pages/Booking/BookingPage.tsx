import { useEffect, useState } from "react";

export default function BookingPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "https://backend-roomfinder-api.onrender.com/admin/all-bookings",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);


  console.log(data);

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 font-medium">Room Details</th>
              <th className="p-4 font-medium">Home Owner</th>
              <th className="p-4 font-medium">Requested By</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => {


              return (
                <tr key={booking.booking_id} className="border-t">
                  {/* Room Details */}
                  <td className="p-4 align-top">
                    <div className="text-lg font-medium mb-2">
                      {booking.roomDetails.title}
                    </div>
                    <table className="text-sm w-full">
                      <tbody>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Type:</td>
                          <td className="py-1 capitalize">
                            {booking.roomDetails.room_type}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Price:</td>
                          <td className="py-1">
                            NPR {booking.roomDetails.price}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Size:</td>
                          <td className="py-1">
                            {booking.roomDetails.areaSize}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Rooms:</td>
                          <td className="py-1">
                            {booking.roomDetails.no_of_room}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Address:</td>
                          <td className="py-1">
                            {booking.roomDetails.address}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>


                

                  {/* Home Owner */}
                  <td className="p-4 align-top">
                    <table className="text-sm w-full">
                      <tbody>
                     
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Name:</td>
                          <td className="py-1">{booking.roomOwner.full_name}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Email:</td>
                          <td className="py-1">{booking.roomOwner.email}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Phone:</td>
                          <td className="py-1">{booking.roomOwner.phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Requested By */}
                  <td className="p-4 align-top">
                    <table className="text-sm w-full">
                      <tbody>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Name:</td>
                          <td className="py-1">
                            {booking.requestedBy.full_name}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Email:</td>
                          <td className="py-1">{booking.requestedBy.email}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Phone:</td>
                          <td className="py-1">{booking.requestedBy.phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Status */}
                  <td className="p-4 align-top">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        booking.bookingInfo.booking_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.bookingInfo.booking_status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.bookingInfo.booking_status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

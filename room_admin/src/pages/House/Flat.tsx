import { useState, useEffect } from "react";
import { Edit, Trash } from "lucide-react";

export default function Flat() {
  const [activeTab, setActiveTab] = useState("Approved");
  const [flats, setFlats] = useState([]);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await fetch(
          "https://backend-roomfinder-api.onrender.com/admin/filter-flats",
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5YThhYjAxLWRmZGMtNDE4OS04MDFiLWYzMGVmOWEyNDNhMiIsImVtYWlsIjoiZGluZXNoQGdtYWlsLmNvbSIsInBob25lIjoiOTYzMDI1ODc0MSIsImlhdCI6MTc0MDg5MjQ0NCwiZXhwIjoxNzQwOTc4ODQ0fQ.Lye65wI8YlchgONtl4NYyfupEDU0paVMzi2AXWH_aVM",
            },
          }
        );
        const data = await res.json();
        setFlats(data.data);
      } catch (error) {
        console.error("Error fetching flats:", error);
      }
    };
    fetchFlats();
  }, []);

  const handleDelete = (id) => {
    console.log("Delete flat with ID:", id);
    // Implement delete API call here
  };

  const handleEdit = (id) => {
    console.log("Edit flat with ID:", id);
    // Implement edit functionality
  };

  const handleApprove = (id) => {
    console.log("Approve flat with ID:", id);
    // Implement approve API call here
  };

  const handleDecline = (id) => {
    console.log("Decline flat with ID:", id);
    // Implement decline API call here
  };

  // Filtering flats based on active tab
  const filteredHouses =
    activeTab === "Approved"
      ? flats.filter((flat) => flat.room_status === "available")
      : flats.filter(
          (flat) =>
            flat.room_status === "approved" || flat.room_status === "pending"
        );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Flat Lists</h2>
        <div className="flex gap-4">
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "Approved"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("Approved")}
          >
            Approved
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "Pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("Pending")}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredHouses.map((house) => (
          <div
            key={house.r_id}
            className="border rounded-lg p-4 shadow-md bg-white flex flex-col sm:flex-row gap-6 relative"
          >
            <img
              src={house.room_image_url[0]}
              alt={house.title}
              className="w-full sm:w-1/3 h-48 rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{house.title}</h3>
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> {house.address}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Price:</strong> Rs. {house.price}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Description:</strong> {house.description}
              </p>

              {activeTab === "Pending" && (
                <div className="flex gap-4">
                  <button
                    className="py-2 px-4 bg-green-500 text-white rounded"
                    onClick={() => handleApprove(house.r_id)}
                  >
                    Approve
                  </button>
                  <button
                    className="py-2 px-4 bg-red-500 text-white rounded"
                    onClick={() => handleDecline(house.r_id)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>

            {/* Edit and Delete Icons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => handleEdit(house.r_id)}>
                <Edit className="text-blue-500 w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(house.r_id)}>
                <Trash className="text-red-500 w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

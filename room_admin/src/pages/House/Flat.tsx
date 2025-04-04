import { useState, useEffect } from "react";

export default function Flat() {
  const [activeTab, setActiveTab] = useState("Approved");
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFlats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "api-end-point/admin/filter-flats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setFlats(data.data);
      } catch (error) {
        console.error("Error fetching flats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlats();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `api-end-point/admin/approve-room/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Approval Response:", data);
    } catch (error) {
      console.error("Error approving flat:", error);
    }
  };

  const handleDecline = async (id: any) => {
    try {
      const res = await fetch(
        `api-end-point/admin/reject-room/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Decline Response:", data);
    } catch (error) {
      console.error("Error declining room:", error);
    }
  };

  // Filtering flats based on active tab
  const filteredHouses =
    activeTab === "Approved"
      ? flats.filter((flat) => flat.admin_approval === true)
      : flats.filter((flat) => flat.admin_approval === false);

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

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

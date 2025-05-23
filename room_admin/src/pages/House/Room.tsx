import { useState, useEffect } from "react";
import { Eye, Trash } from "lucide-react";

export default function Room() {
  const [activeTab, setActiveTab] = useState("Approved");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "api-end-point/admin/filter-rooms",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setRooms(data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
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
      console.error("Error approving room:", error);
    }
  };

  const handleDeclineClick = async (id) => {
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

  const closeDetailPopup = () => {
    setShowDetailPopup(false);
    setCurrentRoom(null);
  };

  const filteredRooms =
    activeTab === "Approved"
      ? rooms.filter((room) => room.admin_approval === true)
      : rooms.filter((room) => room.admin_approval === false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Lists</h2>
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
          {filteredRooms.map((room) => (
            <div
              key={room.r_id}
              className="border rounded-lg p-4 shadow-md bg-white flex flex-col sm:flex-row gap-6 relative"
            >
              <img
                src={room.room_image_url[0]}
                alt={room.title}
                className="w-full sm:w-1/3 h-48 rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Location:</strong> {room.address}
                </p>
                <p className="text-gray-600 mb-2">
                  <p className="text-gray-600 mb-4">
                    <strong>Description:</strong>{" "}
                    {room.description.length > 200
                      ? `${room.description.slice(0, 200)}...`
                      : room.description}
                  </p>
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Price:</strong> Rs. {room.price}
                </p>

                {activeTab === "Pending" && (
                  <div className="flex gap-4">
                    <button
                      className="py-2 px-4 bg-blue-500 text-white rounded"
                      onClick={() => handleApprove(room.r_id)}
                    >
                      Approve
                    </button>
                    <button
                      className="py-2 px-4 bg-red-500 text-white rounded"
                      onClick={() => handleDeclineClick(room.r_id)}
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

      {/* Room Details Popup */}
      {showDetailPopup && currentRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg min-w-[35rem] min-h-[35rem]">
            <h3 className="text-xl font-semibold mb-4">{currentRoom.title}</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {currentRoom.room_image_url.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Room Image ${index + 1}`}
                  className="w-full h-48 rounded-md object-cover"
                />
              ))}
            </div>

            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {currentRoom.address}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Price:</strong> Rs. {currentRoom.price}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {currentRoom.description}
            </p>
            <div className="flex justify-end">
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded"
                onClick={closeDetailPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

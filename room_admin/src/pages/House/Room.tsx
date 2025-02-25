import { useState } from 'react';

// Sample data for house details
const houseData = [
  {
    id: 1,
    image: 'https://keyvendors.com/blogs/wp-content/uploads/2023/06/interior-design-company-1-1024x602.jpg',
    name: 'Luxury Villa',
    location: 'Beverly Hills, CA',
    price: '$1,200,000',
    description:
      'A luxurious villa with 5 bedrooms, a private pool, and stunning city views.',
    status: 'Booked',
  },
  {
    id: 2,
    image: 'https://keyvendors.com/blogs/wp-content/uploads/2023/06/interior-design-company-1-1024x602.jpg',
    name: 'Modern Apartment',
    location: 'New York, NY',
    price: '$450,000',
    description:
      'A stylish apartment located in the heart of the city, with 2 bedrooms and modern amenities.',
    status: 'Unbooked', // Options: Booked, Unbooked
  },
];

export default function Room() {
  const [activeTab, setActiveTab] = useState('Approved');
  const [showPopup, setShowPopup] = useState(false);
  const [declineMessage, setDeclineMessage] = useState('');
  const [currentHouse, setCurrentHouse] = useState(null);

  const handleDeclineClick = (house) => {
    setCurrentHouse(house);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setDeclineMessage('');
    setCurrentHouse(null);
  };

  const handleDeclineSubmit = () => {
    console.log('Decline message:', declineMessage);
    console.log('Declined house:', currentHouse);
    handlePopupClose();
  };

  const filteredHouses =
    activeTab === 'Approved'
      ? houseData.filter((house) => house.status)
      : houseData; 

  return (
    <div className="p-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Lists</h2>
        <div className="flex gap-4">
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'Approved'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('Approved')}
          >
            Approved
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === 'Pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('Pending')}
          >
            Pending
          </button>
        </div>
      </div>

      {/* House Details */}
      <div className="grid grid-cols-1 gap-6">
        {filteredHouses.map((house) => (
          <div
            key={house.id}
            className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 flex flex-col sm:flex-row gap-6"
          >
            <img
              src={house.image}
              alt={house.name}
              className="w-full sm:w-1/3 h-auto rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{house.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Location:</strong> {house.location}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Price:</strong> {house.price}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Description:</strong> {house.description}
              </p>
              {activeTab === 'Approved' ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      house.status === 'Booked'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {house.status}
                  </span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button className="py-2 px-4 bg-green-500 text-white rounded">
                    Approve
                  </button>
                  <button
                    className="py-2 px-4 bg-red-500 text-white rounded"
                    onClick={() => handleDeclineClick(house)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Decline Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Decline Message</h3>
            <textarea
              value={declineMessage}
              onChange={(e) => setDeclineMessage(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
              rows={4}
              placeholder="Enter your reason for declining"
            />
            <div className="flex justify-end gap-4">
              <button
                className="py-2 px-4 bg-gray-300 rounded"
                onClick={handlePopupClose}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-red-500 text-white rounded"
                onClick={handleDeclineSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

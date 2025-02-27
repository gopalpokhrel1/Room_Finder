

const personData = [
  {
    image: 'https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwYm95fGVufDB8fDB8fHww', // Replace with actual image URL
    imageName: 'PersonOne.jpg',
    name: 'John Doe',
    gender: 'Male',
    age: 28,
    contact: '123-456-7890',
    category: 'Software Engineer',
    price: 75000, // Salary or earnings
    sold: 0, // Not applicable, can be removed or replaced
    profit: 0, // Not applicable, can be removed or replaced
  },
  {
    image: 'https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwYm95fGVufDB8fDB8fHww',
    imageName: 'PersonTwo.jpg',
    name: 'Jane Smith',
    gender: 'Female',
    age: 32,
    contact: '987-654-3210',
    category: 'Doctor',
    price: 95000,
    sold: 0,
    profit: 0,
  },
  {
    image: 'https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwYm95fGVufDB8fDB8fHww',
    imageName: 'PersonThree.jpg',
    name: 'Michael Johnson',
    gender: 'Male',
    age: 40,
    contact: '456-789-1234',
    category: 'Entrepreneur',
    price: 120000,
    sold: 0,
    profit: 0,
  },
  {
    image: 'https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwYm95fGVufDB8fDB8fHww',
    imageName: 'PersonFour.jpg',
    name: 'Emily Davis',
    gender: 'Female',
    age: 27,
    contact: '321-654-9870',
    category: 'Graphic Designer',
    price: 68000,
    sold: 0,
    profit: 0,
  },
];


const TableTwo = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Users
        </h4>
      </div>

      <div className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Image</p>
        </div>
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

      {personData.map((product, key) => (
        <div
          className="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <img src={product.image} alt="Product" />
              </div>
             
            </div>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.name}
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
            <p className="text-sm text-black">{product.contact}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;

import React from 'react';

const CreateListing = () => {
  const preventInvalidInput = (e) => {
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
      e.preventDefault();
    }
  };

  const preventInvalidName = (e) => {
    const inputValue = e.target.value;
    const firstChar = inputValue.length === 0 ? '' : inputValue[0];
  
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.' || 
        (/[0-9]/.test(e.key) && firstChar === '')) {
      e.preventDefault();
    }
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Create a Listing</h1>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            className="w-full p-3 border rounded-lg" 
            onKeyDown={preventInvalidName} 
          />
          <textarea placeholder="Description" className="w-full p-3 border rounded-lg"></textarea>
          <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg" />

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" /> Sell
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" defaultChecked /> Rent
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" /> Parking spot
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" /> Furnished
            </label>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-blue-600" defaultChecked /> Offer
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Beds</label>
              <input 
                type="number" 
                min="0" 
                className="w-full p-2 border rounded-lg" 
                defaultValue={1} 
                onKeyDown={preventInvalidInput} 
              />
            </div>
            <div>
              <label className="block mb-1">Baths</label>
              <input 
                type="number" 
                min="0" 
                className="w-full p-2 border rounded-lg" 
                defaultValue={1} 
                onKeyDown={preventInvalidInput} 
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Regular price <span className="text-gray-500">($ / Month)</span></label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border rounded-lg" 
              defaultValue={0} 
              onKeyDown={preventInvalidInput} 
            />
          </div>

          <div>
            <label className="block mb-1">Discounted price <span className="text-gray-500">($ / Month)</span></label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border rounded-lg" 
              defaultValue={0} 
              onKeyDown={preventInvalidInput} 
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4">
          <p className="text-lg font-medium">
            Images: <span className="text-sm font-normal text-gray-600">The first image will be the cover (max 6)</span>
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="border p-3 rounded-lg"
          />
          <button
            type="button"
            className="w-fit px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition hover:cursor-pointer"
          >
            Upload
          </button>

          <button
            type="button"
            className="mt-2 bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-600 transition hover:cursor-pointer" onClick={handleCreateListing}
          >
            CREATE LISTING
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
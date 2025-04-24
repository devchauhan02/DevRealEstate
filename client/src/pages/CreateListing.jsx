import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: '',
    description: '',
    address: '',
    type: 'rent',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 50,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const uploaders = [...files].map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        return data.secure_url;
      });

      try {
        const urls = await Promise.all(uploaders);
        setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
        setUploading(false);
      } catch (err) {
        setImageUploadError('Image upload failed (2 MB max per image)');
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const preventInvalidInput = (e) => {
    if (["-", "+", "e", "E", "."].includes(e.key)) e.preventDefault();
  };

  const validateTextInput = (e) => {
    const isValid = /^[a-zA-Z][a-zA-Z0-9\s]{2,}$/.test(e.target.value);
    if (e.target.id !== "address" && !isValid && e.target.value.length > 0) {
      e.target.setCustomValidity("Minimum 3 characters, must start with a letter");
    } else {
      e.target.setCustomValidity("");
    }
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData((prev) => ({ ...prev, type: e.target.checked ? e.target.id : 'rent' }));
    } else if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
    } else if (e.target.id === 'images') {
      setFiles(e.target.files);
    } else {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageUploadError(false);
    setUploading(false);
    setLoading(true);
    setSuccessMessage('');
    const formDataCopy = { ...formData };

    if (
      Number(formDataCopy.offer) && // only check if offer is enabled
      Number(formDataCopy.discountedPrice) >= Number(formDataCopy.regularPrice)
    ) {
      setImageUploadError('Discounted price must be less than regular price');
      setLoading(false);
      return;
    }
    if (formDataCopy.imageUrls.length < 1) {
      setImageUploadError('Please upload at least one image');
      setLoading(false);
      return;
    }

    try {
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formDataCopy,
          userRef: currentUser.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Listing created!');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='title'
            required
            onInput={validateTextInput}
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onInput={validateTextInput}
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onInput={validateTextInput}
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((item) => (
              <div className='flex gap-2' key={item}>
                <input
                  type='checkbox'
                  id={item}
                  className='w-5'
                  onChange={handleChange}
                  checked={
                    item === 'sale' || item === 'rent'
                      ? formData.type === item
                      : formData[item]
                  }
                />
                <span className='capitalize'>{item}</span>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap gap-6'>
            {[
              { id: 'bedrooms', label: 'Beds' },
              { id: 'bathrooms', label: 'Baths' },
              { id: 'regularPrice', label: 'Regular price ($ / month)' },
              { id: 'discountedPrice', label: 'Discounted price ($ / month)' },
            ].map(({ id, label }) => (
              <div className='flex items-center gap-2' key={id}>
                <input
                  type='number'
                  id={id}
                  min='1'
                  max='100000'
                  required
                  onKeyDown={preventInvalidInput}
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData[id]}
                />
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full hover:cursor-pointer'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 hover:cursor-pointer'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className='flex justify-between p-3 border items-center'>
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75 cursor-pointer'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 hover:cursor-pointer'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {successMessage && <p className='text-green-700 text-lg font-semibold text-center mt-2'>{successMessage}</p>}
          {error && <p className='text-red-700 text-sm mt-2'>{error}</p>}
        </div>
      </form>
    </main>
  );
}

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const navigate = useNavigate();
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
    discountedPrice: 0,
  });

  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleImageSubmit = async () => {
    if (files.length === 0) return;

    if (formData.imageUrls.length + files.length > 6) {
      setImageUploadError('You can only upload 6 images per listing');
      return;
    }

    setUploading(true);
    setImageUploadError('');

    try {
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

      const urls = await Promise.all(uploaders);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch {
      setImageUploadError('Image upload failed (2 MB max per image)');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const preventInvalidInput = (e) => {
    if (['-', '+', 'e', 'E', '.'].includes(e.key)) e.preventDefault();
  };

  const validateTextInput = (e) => {
    const { id, value } = e.target;
    const isValid = /^[a-zA-Z][a-zA-Z0-9\s]{2,}$/.test(value);
    if (id !== 'address' && !isValid && value.length > 0) {
      e.target.setCustomValidity('Minimum 3 characters, must start with a letter');
    } else {
      e.target.setCustomValidity('');
    }
  };

  const handleChange = (e) => {
    setSuccessMessage('');
    const { id, value, checked, files } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({
        ...prev,
        type: checked ? id : 'rent',
      }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else if (id === 'images') {
      setFiles(files);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageUploadError('');
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { offer, regularPrice, discountedPrice, imageUrls } = formData;

    if (offer && Number(discountedPrice) >= Number(regularPrice)) {
      setImageUploadError('Discounted price must be less than regular price');
      setLoading(false);
      return;
    }

    if (imageUrls.length === 0) {
      setImageUploadError('Please upload at least one image');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      if (res.status === 201) {
        navigate(`/category/${data._id}`);
      } else {
        setError(data.message || 'Something went wrong');
      }
      setSuccessMessage('Listing created!');
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
          {['title', 'description', 'address'].map((field) => (
            <input
              key={field}
              type={field === 'description' ? 'textarea' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className='border p-3 rounded-lg'
              id={field}
              required
              value={formData[field]}
              onChange={handleChange}
              onInput={validateTextInput}
            />
          ))}

          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((item) => (
              <label key={item} className='flex gap-2 items-center'>
                <input
                  type='checkbox'
                  id={item}
                  className='w-5'
                  onChange={handleChange}
                  checked={item === 'sale' || item === 'rent' ? formData.type === item : formData[item]}
                />
                <span className='capitalize'>{item}</span>
              </label>
            ))}
          </div>

          <div className='flex flex-wrap gap-6'>
            {[
              { id: 'bedrooms', label: 'Beds' },
              { id: 'bathrooms', label: 'Baths' },
              { id: 'regularPrice', label: 'Regular price ($ / month)' },
            ]
              .concat(formData.offer ? [{ id: 'discountedPrice', label: 'Discounted price ($ / month)' }] : [])
              .map(({ id, label }) => (
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
              disabled={formData.imageUrls.length >= 6}
            />
            <button
              type='button'
              disabled={uploading || formData.imageUrls.length >= 6}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 hover:cursor-pointer'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}

          {formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border items-center'>
              <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
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

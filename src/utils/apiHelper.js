import { toast } from 'react-toastify';

export const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Server error');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    toast(`Error: ${err.message}`);
    throw err;
  }
};

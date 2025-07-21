import { useState, useEffect } from 'react';
import axios from 'axios';

const useRecommendedProducts = (productId) => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`http://localhost:5000/api/products/recommended/${productId}`);
        
        if (response.data.success) {
          setRecommended(response.data.data);
        } else {
          setRecommended([]);
        }
      } catch (err) {
        console.error('Error fetching recommended products:', err);
        setError(err.response?.data?.message || err.message || 'Error fetching recommendations');
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [productId]);

  return { recommended, loading, error };
};

export default useRecommendedProducts;
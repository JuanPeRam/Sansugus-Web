import { useState, useEffect } from 'react';

const useFetch = (url:string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]:any = useState();
  const [result, setResult]:any = useState(null);

  useEffect(() => {
    const fetchData = async () => {
    setLoading(true)
      try {
        const response = await fetch(url);
        const data = await response.json();
        setResult(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { loading, error, result };
};

export default useFetch;
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Fetch error:', err));
  }, [url]);

  return { data };
}
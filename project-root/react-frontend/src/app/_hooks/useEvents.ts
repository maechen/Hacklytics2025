import React, { useState, useEffect, useMemo } from "react";

const useEvents = (timestamp: number) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(loading);
  useEffect(() => {
    const fetchData = async () => {
      console.log("trying bitch");
      try {
        const response = await fetch("http://localhost:4000/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timestamp }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchData();
    }
  }, [loading]);

  const value = useMemo(
    () => ({
      loading,
      error,
      events: data,
      reFetchEvents: () => setLoading(true),
    }),
    [data, error, loading]
  );

  return value;
};

export { useEvents };

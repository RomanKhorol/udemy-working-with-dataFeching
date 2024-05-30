import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [avaliblePlaces, setAvaliblePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true);
      try {
        const placesData = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const sortedPlaces = sortPlacesByDistance(
              placesData,
              position.coords.latitude,
              position.coords.longitude
            );
            setAvaliblePlaces(sortedPlaces);
            setIsLoading(false);
          },
          () => {
            console.log("geolocation error");
            setIsLoading(false);
          },
          undefined,
          { enableHighAccuracy: true }
        );
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        setIsLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    console.log(error);
    return <Error title={"An error occureed!"} message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={avaliblePlaces}
      isLoading={isLoading}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}

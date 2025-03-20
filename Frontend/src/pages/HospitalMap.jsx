import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
// Fix for Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const HospitalMap = () => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [hospitalMarkers, setHospitalMarkers] = useState([]);
  const [location, setLocation] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [hospitalLimit, setHospitalLimit] = useState(5); // Default limit to 5 hospitals
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("map").setView([18.5197, 73.854], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);
      setMap(mapInstance);
    }
  }, [map]);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setUserLocation(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          setError("Could not access your location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  };

  const setUserLocation = (lat, lon) => {
    if (!map) return;
    if (userMarker) map.removeLayer(userMarker);
    const marker = L.marker([lat, lon]).addTo(map).bindPopup("Your Location").openPopup();
    setUserMarker(marker);
    map.setView([lat, lon], 13);
    fetchHospitals(lat, lon);
  };

  const fetchHospitals = (lat, lon) => {
    if (!lat || !lon) {
      setError("Enter a location or use your location.");
      return;
    }

    setLoading(true);
    setError(null);

    let url = `https://overpass-api.de/api/interpreter?data=[out:json];node[%22amenity%22=%22hospital%22](around:25000,${lat},${lon});out;`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Remove existing hospital markers
        hospitalMarkers.forEach((marker) => map.removeLayer(marker));

        // Calculate distances and sort hospitals by distance
        const hospitalsWithDistance = data.elements.map((hospital) => {
          const distance = calculateDistance(lat, lon, hospital.lat, hospital.lon);
          return { ...hospital, distance };
        });

        const sortedHospitals = hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

        // Limit hospitals based on user preference
        const limitedHospitals = sortedHospitals.slice(0, hospitalLimit);

        // Add markers for the limited hospitals
        const newMarkers = limitedHospitals.map((hospital) => {
          return L.marker([hospital.lat, hospital.lon])
            .addTo(map)
            .bindPopup(hospital.tags.name || "Unknown Hospital");
        });

        setHospitalMarkers(newMarkers);
        setHospitals(limitedHospitals);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hospitals:", err);
        setError("Failed to fetch hospitals. Please try again.");
        setLoading(false);
      });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in kilometers
  };

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
    if (e.target.value.length < 3) return;

    setLoading(true);
    setError(null);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${e.target.value}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUserLocation(data[0].lat, data[0].lon);
        } else {
          setError("No results found for the entered location.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching location suggestions:", err);
        setError("Failed to search location. Please try again.");
        setLoading(false);
      });
  };

  const searchHospitals = () => {
    if (userMarker) {
      const { lat, lng } = userMarker.getLatLng();
      fetchHospitals(lat, lng);
    } else {
      setError("Please set a location first.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-2xl font-bold text-blue-700">
              <span className="text-3xl">🏥</span> Hospital Finder
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Nearest Hospitals</h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center"
              onClick={getUserLocation}
              disabled={loading}
            >
              <span className="mr-2">📍</span> Use My Location
            </button>

            <input
              type="text"
              value={location}
              onChange={handleLocationInput}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search a location"
              disabled={loading}
            />

            <select
              value={hospitalLimit}
              onChange={(e) => setHospitalLimit(Number(e.target.value))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={loading}
            >
              <option value={3}>Show 3 Hospitals</option>
              <option value={5}>Show 5 Hospitals</option>
              <option value={7}>Show 7 Hospitals</option>
              <option value={10}>Show 10 Hospitals</option>
            </select>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center"
              onClick={searchHospitals}
              disabled={loading}
            >
              <span className="mr-2">🔍</span> Search Hospitals
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div id="map" className="w-full h-[500px] md:h-[600px]"></div>
            </div>
          </div>

          {/* Hospital List Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 h-[500px] md:h-[600px] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏥</span> Hospitals Nearby
              </h3>

              {hospitals.length > 0 ? (
                <ul className="space-y-4">
                  {hospitals.map((hospital, index) => (
                    <li
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50"
                    >
                      <h4 className="text-lg font-bold text-blue-700">
                        {hospital.tags.name || "Unknown Hospital"}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {hospital.tags["addr:full"] ||
                          hospital.tags["addr:street"] ||
                          "Address not available"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-green-600 font-medium">
                          <span className="mr-1">📏</span> {hospital.distance} km
                        </p>
                        <button className="text-blue-600 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-5xl mb-4">🔍</span>
                  <p className="text-gray-600">No hospitals found. Try searching a different location.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;
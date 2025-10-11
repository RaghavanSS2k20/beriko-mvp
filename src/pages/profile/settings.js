import styles from "../../styles/settings.module.css";
import { useEffect, useState } from "react";
import { useNavbar } from "@/context/NavbarContext";
import { autocompleteDataFetch } from "@/services/geoApiService";
import { getUserByUserId } from "@/services/userService";
import { useUser } from "@/context/userContext";
import { updateUserProfile } from "@/services/userService";

export default function ProfileSetupPage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    preferredGender: "",
    age: "",
    city: "",
    state: "",
    country_code: "",
    latitude: null,
    longitude: null,
  });

  const { updateNavbar } = useNavbar();
  const { userId } = useUser();

  // 🔹 Navbar setup
  useEffect(() => {
    updateNavbar({
      title: "Settings",
      subtitle: "Online",
      avatar: false,
      backRoute: "/profile",
    });
  }, []);

  // 🔹 Fetch and prefill user data
  useEffect(() => {
    async function getUser() {
      try {
        if (userId) {
          const response = await getUserByUserId(userId, false);
          console.log(response);
          if (!response?.ok) console.log("ERRORRRR");

          const json = await response?.json();
          const user = json?.data;

          if (user) {
            // 🧩 Set form values
            setFormData({
              name: user.name || "",
              gender: user.gender || "",
              preferredGender: user.preferred_gender || "",
              age: user.age || "",
              location: user.location?.city || "",
            });
            console.log(user);

            // 📍 Handle location (so dropdown & input both match)
            if (user.location?.city) {
              const formatted = `${user.location.city || ""}${
                user.location.state ? `, ${user.location.state}` : ""
              }${
                user.location.country_code
                  ? `, ${user.location.country_code}`
                  : ""
              }`;

              setSelectedLocation({
                display_name: formatted,
                city: user.location.city || "",
                state: user.location.state || "",
                country_code: user.location.country_code || "",
                latitude: user.location.lat || null,
                longitude: user.location.lon || null,
              });
              console.log("Formatted", formatted);
              setLocationQuery(formatted); // shows in input box
            }
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    }

    getUser();
  }, [userId]);

  // 🔹 Autocomplete search (same as index)
  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocationQuery(query);

    if (query.length < 2) {
      setLocationResults([]);
      return;
    }

    try {
      const res = await autocompleteDataFetch(query);
      if (!res.ok) return;

      const data = await res.json();
      const results = data.features.map((f) => ({
        display_name: f.properties.formatted,
        city: f.properties.city || f.properties.county || "",
        state: f.properties.state || "",
        country_code: f.properties.country_code?.toUpperCase() || "",
        latitude: f.properties.lat,
        longitude: f.properties.lon,
      }));

      setLocationResults(results);
    } catch (err) {
      console.error("Location fetch error:", err);
    }
  };

  // 🔹 When user selects a location
  const handleLocationSelect = (loc) => {
    setSelectedLocation({
      city: loc.city,
      state: loc.state,
      country_code: loc.country_code,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
    });

    setLocationQuery(loc.display_name);
    setLocationResults([]);

    // ✅ Update formData with structured location
    setFormData((prev) => ({
      ...prev,
      city: loc.city,
      state: loc.state,
      country_code: loc.country_code,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
    }));
  };

  // 🔹 Handle basic form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: userId,
      name: formData.name,
      gender: formData.gender,
      preferred_gender: formData.preferredGender,
      age: parseInt(formData.age, 10),

      city: formData.city,
      state: formData.state,
      country_code: formData.country_code,
      lat: formData.latitude,
      lon: formData.longitude,
    };

    console.log("📦 Sending updated user profile:", payload);

    const res = await updateUserProfile(payload);
    if (res.ok) {
      console.log("success");
      console.log(res);
    }
    // TODO: Add PUT/POST API call here
    // Example:
    // await fetch(`${environment.apiUrl}/user/${userId}/`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Name */}
        <div className={styles.item}>
          <label htmlFor="name">Name</label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        {/* Location */}
        <div className={styles.item}>
          <label htmlFor="location">Location</label>
          <div className={styles.locationWrapper}>
            <input
              type="text"
              name="location"
              value={locationQuery}
              className={styles.input}
              placeholder="City"
              onChange={handleLocationChange}
            />
            <span className={styles.locationIcon}>📍</span>
            {locationResults.length > 0 && (
              <ul className={styles.locationDropdown}>
                {locationResults.map((loc, i) => (
                  <li key={i} onClick={() => handleLocationSelect(loc)}>
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className={styles.item}>
          <label htmlFor="gender">Gender</label>
          <select
            className={styles.input}
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Preferred Gender */}
        <div className={styles.item}>
          <label htmlFor="preferredGender">Preferred Gender</label>
          <select
            className={styles.input}
            id="preferredGender"
            name="preferredGender"
            value={formData.preferredGender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Any</option>
          </select>
        </div>

        {/* Age */}
        <div className={styles.item}>
          <label htmlFor="age">Age</label>
          <input
            className={styles.input}
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            min="18"
            max="99"
          />
        </div>

        <button type="submit" className={styles.submit}>
          Save Details
        </button>
      </form>
    </div>
  );
}

import { useRouter } from "next/router";
import { useUser } from "@/context/userContext";
import styles from "@/styles/Home.module.css";
import { environment } from "@/environment";
import { useState } from "react";
import { autocompleteDataFetch } from "@/services/geoApiService";

export default function Home() {
  const { userId, setUserId } = useUser();
  const router = useRouter();
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocationQuery(query);
    if (query.length < 2) return;

    try {
      const res = await autocompleteDataFetch(query);
      if (!res.ok) return;

      const data = await res.json();
      // Geoapify structure: features array
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const name = isExistingUser ? null : form.name.value.trim();

    if (!username || (!isExistingUser && !name)) return;

    try {
      if (isExistingUser) {
        // ✅ Existing user: just check if user exists
        const check = await fetch(`${environment.apiUrl}/user/${username}`);
        if (!check.ok) alert("User Fetching error");

        setUserId(username);
        router.push("/matches");
      } else {
        // 🆕 New user: register
        const age = parseInt(form.age.value.trim(), 10);

        const payload = {
          user_id: username,
          name,
          age,
          ...(selectedLocation && {
            city: selectedLocation.city,
            state: selectedLocation.state,
            country_code: selectedLocation.country_code,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }),
        };

        console.log("📦 Sending new user payload:", payload);

        const res = await fetch(`${environment.apiUrl}/user/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) alert("User creation failed!");

        setUserId(username);
        router.push("/matches");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert(
        isExistingUser ? "User not found!" : "Something went wrong, try again!"
      );
    }
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation({
      city: loc.city,
      state: loc.state,
      country_code: loc.country_code,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
    });
    console.log("Location qUERY : ", {
      city: loc.city,
      state: loc.state,
      country_code: loc.country_code,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
    });
    setLocationQuery(loc.city);

    setLocationResults([]);
  };

  // If already logged in, skip landing
  if (userId) {
    router.push("/matches");
    return null;
  }

  return (
    <div className={styles.landing}>
      <div className={styles.heroText}>
        <h1>Say Bye To Endless Swipes With Beriko</h1>
        <p>Get meaningful connections that last longer</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input type="text" name="username" placeholder="Username" />
        {!isExistingUser && (
          <>
            <input type="text" name="name" placeholder="Name" />
            <input
              type="number"
              name="age"
              placeholder="Age"
              className={styles.shortInput}
            />
            <select name="gender" className={styles.shortInput}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="gay">Gay</option>
            </select>

            {/* Location autocomplete */}
            <div className={styles.locationWrapper}>
              <input
                type="text"
                name="location"
                value={locationQuery}
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
          </>
        )}
        <button type="submit">{isExistingUser ? "Login" : "Register"}</button>
      </form>

      <div className={styles.toggleLink}>
        {isExistingUser ? (
          <p>
            New here?{" "}
            <span onClick={() => setIsExistingUser(false)}>Create account</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsExistingUser(true)}>Login</span>
          </p>
        )}
      </div>
    </div>
  );
}

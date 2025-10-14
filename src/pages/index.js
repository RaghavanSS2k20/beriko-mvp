import styles from "../styles/index.module.css";
import { environment } from "@/environment";
import { useState } from "react";
import { autocompleteDataFetch } from "@/services/geoApiService";
import { useRouter } from "next/router";
import { useUser } from "@/context/userContext";
import { MessageCircle, Sparkles, Heart } from "lucide-react";

export default function HomeScreen() {
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
        if (!check.ok) {
          console.log(check);
          if (check.status === 404) {
            alert("User id not found");
          } else {
            alert("User Fetching error");
          }
          return;
        }

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

        if (!res.ok) {
          console.log(res);
          if (res.status === 400) {
            alert("Username! Already exists!");
          } else {
            alert("User creation failed!");
          }
          return;
        }

        setUserId(username);
        router.push("/index");
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
  //   if (userId) {
  //     router.push("/matches");
  //     return null;
  //   }
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.headingContainer}>
          <h1>Beriko</h1>
          <div className={styles.icon}>
            <img src="/icons/index/beriko.svg"></img>
          </div>
        </div>

        <p> Dating Made Personal</p>
      </div>

      <div className={styles.strengths}>
        <div className={styles.strength}>
          <div className={styles.icon}>
            <MessageCircle color="#09CC7F" />
          </div>
          <div className={styles.content}>
            <div className={styles.heading}>AI Profile Builder</div>
            <div className={styles.sub}>
              Chat with AI to create your perfect profile
            </div>
          </div>
        </div>
        <div className={styles.strength}>
          <div className={styles.icon}>
            <Sparkles color="#09CC7F" />
          </div>
          <div className={styles.content}>
            <div className={styles.heading}>Smart Matching</div>
            <div className={styles.sub}>
              Find your ideal matches with AI precision
            </div>
          </div>
        </div>
        <div className={styles.strength}>
          <div className={styles.icon}>
            <Heart color="#09CC7F" />
          </div>
          <div className={styles.content}>
            <div className={styles.heading}>Authentic Connections</div>
            <div className={styles.sub}>
              Build meaningful relationships that last
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formItem}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Choose a username"
          />
        </div>

        {!isExistingUser && (
          <>
            <div className={styles.formItem}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formItem}>
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" placeholder="Age" />
              </div>

              <div className={styles.formItem}>
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="gay">Gay</option>
                </select>
              </div>
            </div>

            <div className={styles.formItem}>
              <label htmlFor="location">Location</label>
              <div className={styles.locationWrapper}>
                <input
                  type="text"
                  id="location"
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
            </div>
          </>
        )}

        <button type="submit">{isExistingUser ? "Login" : "Register"}</button>

        <div className={styles.toggleLink}>
          {isExistingUser ? (
            <p>
              New here?{" "}
              <span onClick={() => setIsExistingUser(false)}>
                Create account
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsExistingUser(true)}>Login</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

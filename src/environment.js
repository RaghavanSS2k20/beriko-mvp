// export const environment = {
//   apiUrl: "http://localhost:4020",
//   engineUrl: "http://127.0.0.1:5000",
//   geoApifyAutocompleteApi: "https://api.geoapify.com/v1/geocode/autocomplete",
//   geoApifyToken: "1123b82363cd47c7a74edde9be525aa3",
// };

// Helper to read env variables
export function getEnv(key) {
  console.log("key here : ", key);
  // console.log(process.env["NEXT_PUBLIC_API_URL"]);
  const value = process.env[key];
  console.log("VALUE HERE  : ", value);
  if (!value) {
    console.warn(`Environment variable ${key} is not set!`);
  }
  return value ?? "";
}

// Environment object using getEnv
export const environment = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  engineUrl: process.env.NEXT_PUBLIC_ENGINE_URL,
  geoApifyAutocompleteApi: process.env.NEXT_PUBLIC_GEO_API,
  geoApifyToken: process.env.NEXT_PUBLIC_GEO_TOKEN,
};

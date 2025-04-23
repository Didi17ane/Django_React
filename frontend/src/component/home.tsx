// Import the react JS packages
import { useEffect, useState } from "react";
import axios from "axios";
// Define the Login function.
export const Home = () => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          const tok=localStorage.getItem("access_token");
          axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
          const { data } = await axios.get("http://localhost:8000/home/", {
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log(data)
          setMessage(data.message);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.log("not auth");
          console.log(e);
        }
      })();
    }
  }, []);
  return (
    <div className="form-signin mt-5 text-center">
      <h3>Hi {message}</h3>
    </div>
  );
};

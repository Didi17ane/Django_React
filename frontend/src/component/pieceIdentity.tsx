import axios from "axios";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
// import imageToBase64 from "image-to-base64"
// import { Buffer } from 'buffer'

const Ident = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirth] = useState("");
  const [image, setImage] = useState<File>();

  const onNext = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // alert(URL.createObjectURL(image));
  }; // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setImage();
    image= setImage();
  };
  const handleIdent = async () => {
    // if (!Ident){
    //   console.log("not info")
    //   toast("Information not completed!");
    // }
    // else {
    if (image) {
      try {
        console.log({
          name,
          lastname,
          email,
          birth_date,
          image: image,
        });

        const data = await axios.post(
          "http://localhost:8000/piece_id/",
          {
            name,
            lastname,
            email,
            birth_date,
            image,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            responseType: "json",
          }
        );
        console.log("piece id is callled");
        console.log(data);

        window.location.href = "/";
      } catch (e) {
        console.log("not Ident");
        console.log(e);
      }
      // }
    }
  };

  return (
    <div>
      <h3 className="Auth-form-title">Identity Infos</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />
      <input
        placeholder="Lastname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <br />
      <br />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <input
        placeholder="Date of Birthday"
        type="date"
        value={birth_date}
        onChange={(e) => setBirth(e.target.value)}
      />
      <br />
      <br />
      <div className="row">
        <form onSubmit={onNext} className="form-inline">
          <div className="form-group">
            <label>Choose File to Upload: </label>
            <input
              type="file"
              id="file-upload"
              name="file-upload"
              className="form-control"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
              accept="image/*"
            />
          </div>{" "}
          <br />
          <button type="submit" className="btn btn-success">
            Upload File
          </button>

          {image && (
            <div style={styles.preview}>
              <img
                src={URL.createObjectURL(image)}
                style={styles.image}
                alt="Thumb"
              />
              <button onClick={removeSelectedImage} style={styles.delete}>
                Remove This Image
              </button>
              <button onClick={handleIdent}  className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
      {/* <div className="col-span-full">
        <label className="block text-sm/6 font-medium text-gray-900">
          Cover photo
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <svg
              className="mx-auto size-12 text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                fill-rule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                clip-rule="evenodd"
              />
            </svg>
            <div className="mt-4 flex text-sm/6 text-gray-600">
              <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  // value={image}
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage(e.target.files[0]);
                    }
                  }}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs/5 text-gray-600">PNG, JPG</p>
          </div>
        </div>
      </div> */}
      {/* <button onClick={onNext}>Next</button> */}

      <ToastContainer />
    </div>
  );
};

export default Ident;


// Just some styles
const styles = {
  preview: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
  },
  image: { maxWidth: "100%", maxHeight: 320 },
  delete: {
    cursor: "pointer",
    padding: 15,
    background: "red",
    color: "white",
    border: "none",
  },
};
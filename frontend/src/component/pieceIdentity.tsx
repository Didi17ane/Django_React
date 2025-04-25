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
      <br />
      <br />
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
            <label>Insert your Piece Identity: </label>
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
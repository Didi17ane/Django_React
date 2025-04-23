import axios from "axios";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    
    const handleRegister = async () => {

      if (password !== confirmpassword){ 
        console.log("Passwords not found")
        toast("Passwords do not match !");
      }
      else {
        try{
          const { data } = await axios.post('http://localhost:8000/register/', {
            username,
            email,
            password,
          });

          console.log('register is callled')
          console.log(data)
          localStorage.clear();
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data["access"]}`;
          window.location.href = "/";
        } catch (e) {
          console.log("not register");
          console.log(e);
        }
      }
      
    };
  
  // const handleRegister = async (ev: {
  //   preventDefault: () => void;
  //   target: {
  //     username: { value: any };
  //     email: { value: any };
  //     password: { value: any };
  //     confirmpassword: { value: any };
  //   };
  // }) => {
  //   ev.preventDefault();
  //   const username = ev.target.username.value;
  //   const email = ev.target.email.value;
  //   const password = ev.target.password.value;
  //   const confirmpassword = ev.target.confirmpassword.value;
  //   if (password !== confirmpassword) toast.error("Passwords do not match !");
  //   else {
  //     const formData = {
  //       username: username,
  //       email: email,
  //       password: password,
  //     };
  //     try {
  //       const res = await axios.post("http://localhost:8000/register/", formData, {
  //         headers: { "Content-Type": "application/json" },
  //       });
  //       const data = res.data;
  //       if (data.success === true) {
  //         toast.success(data.message);
  //         setIsLoggedIn(true);
  //         setUsername(username);
  //         setEmail(email);

  //         // Initialize the access & refresh token in localstorage.
  //         localStorage.clear();
  //         localStorage.setItem("access_token", data.access);
  //         localStorage.setItem("refresh_token", data.refresh);
  //         axios.defaults.headers.common[
  //           "Authorization"
  //         ] = `Bearer ${data["access"]}`;
  //         window.location.href = "/";
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } catch (err) {
  //       console.log("Some error occured", err);
  //     }
  //   }
  // };

  return (
    <div>
    <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <input type="password" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setconfirmPassword(e.target.value)} />
    <button onClick={handleRegister}>Register</button>
    <ToastContainer />
  </div>
  );
};

export default Register;

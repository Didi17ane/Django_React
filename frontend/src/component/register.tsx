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
          // console.log(data)
          localStorage.clear();
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data["access"]}`;
          window.location.href = "login/";
        } catch (e) {
          console.log("not register");
          console.log(e);
        }
      }
      
    };
  
  return (
    <div><br/><br/>
    <h3 className="Auth-form-title">Sign On</h3><br/><br/>
    <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br/><br/>
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/><br/>
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/><br/>
    <input type="password" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setconfirmPassword(e.target.value)} /><br/><br/>
    <button onClick={handleRegister}>Register</button>
    <ToastContainer />
  </div>
  );
};

export default Register;

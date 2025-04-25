import axios from "axios";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// ToastContainer
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    
    const handleRegister = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      if (password != confirmpassword){ 
        console.log("Passwords not found")
        toast("Passwords do not match !");
      }
      else {
          console.log('registeeeeeeeeee');
          try{
          console.log('23232');

          const { data } = await axios.post('http://localhost:8000/register/', {
            username,
            email,
            password,
          });
          window.location.href = "/login";

          console.log('register is callled');
          console.log(data);
          
        } catch (e) {
          console.log("not register");
          console.log(e);
        }
      }
      
    };
  
  return (
  //   <div><br/><br/>

  //   <h3 className="Auth-form-title">Sign On</h3><br/><br/>
  //   <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br/><br/>
  //   <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/><br/>
  //   <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/><br/>
  //   <input type="password" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setconfirmPassword(e.target.value)} /><br/><br/>
  //   <button onClick={handleRegister}>Register</button>
  //   <ToastContainer />
  // </div>

   <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleRegister}>
        <div className="Auth-form-content"><br/><br/>
          <h3 className="Auth-form-title">Sign On</h3><br/><br/>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name="username"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div><br/>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              className="form-control mt-1"
              placeholder="Email"
              name="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div><br/>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div><br/><br/>
          <div className="form-group mt-3">
            <label>Confirm Password</label>
            <input
              name="confirmpassword"
              type="password"
              className="form-control mt-1"
              placeholder="Confirm Password"
              value={confirmpassword}
              required
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </div><br/><br/>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
            Register
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;

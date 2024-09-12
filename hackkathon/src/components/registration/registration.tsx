import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter Email and Password');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:2030/register', {email,password,});

      console.log('Registration successful:', response.data);
      if (response.status === 200) {
        setIsRegistered(true);
        alert('Registration successful');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during registration');
      }
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-[url('https://res.cloudinary.com/djexsyuur/image/upload/v1726039195/image_5_d3dvjj.png')] flex items-center h-screen justify-center p-5">
      <div className="border-2 border-solid rounded-md border-green-800 w-[500px] h-fit flex flex-col justify-evenly gap-9 pt-16 pb-16 pl-16 pr-16 items-center p-4 max-sm:w-full">
        <h1 className="flex text-3xl items-center gap-2 font-bold">
          <img src="https://s3-prod-tablesprint.s3.amazonaws.com/file-content/pmxdvnvlok/images/988ec983-8b9a-4c69-9ec4-a9d31f597504.png" loading="lazy" alt="TableSprint logo" />
          TableSprint
        </h1>
        <p className="text-silver h-6">Register for TableSprint Admin</p>

        <form className="flex flex-col w-full gap-6" onSubmit={handleRegister}>
          
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="example@example.com" className="w-full rounded-full" />

          <div className="flex flex-col gap-1 w-full">
            <TextField
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {error && <div className="text-red-800">{error}</div>}

          <button type="submit" className="w-full h-12 rounded-lg bg-green-800 text-white p-2 mt-4">
            Register
          </button>

          {/* Conditionally render the Back to Login button */}
          {isRegistered && (<Link to="/" className="w-full text-center block mt-4 text-blue-500"> Back To Login</Link>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;

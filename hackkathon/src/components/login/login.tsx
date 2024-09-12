import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const response = await axios.post('http://localhost:2030/login', { email, password });
      console.log(response.data.token);

      if (response.status === 200) {
        Cookies.set('token', response.data.token);
        navigate('/');

        onLogin(email, password);
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const token = Cookies.get('token');

  if (token !== undefined) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex items-center h-screen justify-center p-5 bg-[url('https://res.cloudinary.com/djexsyuur/image/upload/v1726039195/image_5_d3dvjj.png')]">
      <div className="border-2 border-solid rounded-md border-green-800 w-[500px] h-fit flex flex-col justify-evenly gap-9 pt-16 pb-16 pl-16 pr-16 items-center p-4 max-sm:w-full">
        <h1 className="flex text-3xl items-center gap-2 font-bold">
          <img src="https://s3-prod-tablesprint.s3.amazonaws.com/file-content/pmxdvnvlok/images/988ec983-8b9a-4c69-9ec4-a9d31f597504.png" loading="lazy" alt="TableSprint logo" />
          TableSprint
        </h1>

        <p className="text-silver h-6">Welcome to TableSprint Admin</p>

        <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
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
            <p className="self-end text-purple-900">
              <a href="#" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">
                Forgot Password?
              </a>
            </p>
          </div>

          {error && <div className="text-red-800">{error}</div>}

          <button type="submit" className="w-530 h-58 top-803 gap-0 rounded-lg bg-violet-800 text-white p-2">
            Log In
          </button>
          <Link to="registration"> New user?Register </Link>
        </form>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="forgotPasswordModal" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-purple-700 font-bold" id="forgotPasswordModalLabel">
                Did you forget your email?
              </h5>
            </div>
            <div className="modal-body d-flex flex-col row-gap-3 w-auto">
              <p>Enter your email address and we'll send you a link to restore password.</p>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input type="email" className="form-control" id="email" placeholder="example@example.com" />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Request Reset Link
                </button>
              </form>
            </div>
            <div className="modal-footer flex items-center justify-center underline">
              <a href="#" className="text-muted" data-bs-dismiss="modal" aria-label="Close">
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;































































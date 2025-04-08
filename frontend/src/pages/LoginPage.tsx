import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';
import '@fortawesome/fontawesome-free/css/all.css';
import CookieConsent from '../components/CookieConsent';

function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);

  // state variable for error messages
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // handle change events for input fields, with logging
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      console.log(`[Input Change] Checkbox "${name}" changed to: ${checked}`);
      setRememberme(checked);
    } else if (name === 'email') {
      console.log(`[Input Change] Email input changed to: ${value}`);
      setEmail(value);
    } else if (name === 'password') {
      console.log(`[Input Change] Password input changed.`);
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    console.log(`[Navigation] Navigating to the register page.`);
    navigate('/register');
  };

  // handle submit event for the form, with detailed logging
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`[Form Submit] Login form submitted.`);
    setError(''); // clear any previous errors

    // Validate inputs
    if (!email || !password) {
      console.log(`[Validation Error] Missing email or password.`);
      setError('Please fill in all fields.');
      return;
    }
    
    // Determine login URL based on rememberme flag
    const loginUrl = rememberme
      ? 'https://intexii-team2-12-b9b2h9ead7cwd9ax.eastus-01.azurewebsites.net/login?useCookies=true'
      : 'https://intexii-team2-12-b9b2h9ead7cwd9ax.eastus-01.azurewebsites.net/login?useSessionCookies=true';
    console.log(`[Login Request] URL: ${loginUrl}`);
    console.log(`[Login Request] Attempting login with email: ${email}`);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include', // ensures cookies are sent & received
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log(`[Login Response] HTTP status: ${response.status}`);
      console.log(`[Login Response] Full response:`, response);

      // Only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get('content-length');
      console.log(`[Login Response] Content-Length header: ${contentLength}`);
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
        console.log(`[Login Response] Parsed JSON data:`, data);
      } else {
        console.log(`[Login Response] No JSON content to parse.`);
      }
      
      if (!response.ok) {
        console.error(`[Login Error] Response error: ${data?.message || 'Invalid email or password.'}`);
        throw new Error(data?.message || 'Invalid email or password.');
      }
      
      console.log(`[Login Success] Login successful. Navigating to /competition...`);
      navigate('/competition');
    } catch (error: any) {
      console.error(`[Fetch Error] Login attempt failed:`, error);
      setError(error.message || 'Error logging in.');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="card border-0 shadow rounded-3">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">
              Sign In
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-check mb-3">
              {localStorage.getItem('cookieConsent') === 'true' && (
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="rememberme"
                  name="rememberme"
                  checked={rememberme}
                  onChange={handleChange}
                />
                )}
                <label className="form-check-label" htmlFor="rememberme">
                  Remember password
                </label>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              </div>
              <hr className="my-4" />
              <div className="d-grid mb-2">
                <button
                  className="btn btn-google btn-login text-uppercase fw-bold"
                  type="button"
                >
                  <i className="fa-brands fa-google me-2"></i> Sign in with Google
                </button>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-facebook btn-login text-uppercase fw-bold"
                  type="button"
                >
                  <i className="fa-brands fa-facebook-f me-2"></i> Sign in with Facebook
                </button>
              </div>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </div>
      <CookieConsent />
    </div>
  );
}

export default LoginPage;


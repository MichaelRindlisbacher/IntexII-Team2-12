import { useNavigate } from 'react-router-dom';
// ---- ADD IMPORTS if using Context or State Management ----
// Example: import { useAuth } from './AuthContext'; // If using Auth Context
// Example: import { useDispatch } from 'react-redux'; // If using Redux
// Example: import { useAuthStore } from './authStore'; // If using Zustand

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  // ---- GET DISPATCH/SETTER FUNCTIONS if needed ----
  // Example: const { clearAuthData } = useAuth(); // Get function from context
  // Example: const dispatch = useDispatch(); // Get Redux dispatch function
  // Example: const clearUser = useAuthStore(state => state.clearUser); // Get Zustand action

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('https://intexii-team2-12-b9b2h9ead7cwd9ax.eastus-01.azurewebsites.net/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies (like the one backend wants to clear) are sent
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // --- START: !! IMPORTANT: Clear Client-Side State !! ---

        // **Choose ONE OR MORE of the following based on how your app stores login state:**

        // Option 1: Clear localStorage
        // Replace 'authToken', 'userData' with the actual keys you use.
        console.log('Clearing localStorage items...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Add any other relevant keys you store

        // Option 2: Clear sessionStorage
        // Replace 'authToken', 'userData' with the actual keys you use.
        // console.log('Clearing sessionStorage items...');
        // sessionStorage.removeItem('authToken');
        // sessionStorage.removeItem('userData');
        // Add any other relevant keys you store

        // Option 3: Clear state via Context API
        // Replace clearAuthData with your actual context function
        // console.log('Clearing auth context...');
        // if (clearAuthData) {
        //   clearAuthData();
        // }

        // Option 4: Clear state via Redux
        // Replace 'auth/logout' with your actual action type or action creator
        // console.log('Dispatching Redux logout action...');
        // dispatch({ type: 'auth/logout' });
        // or dispatch(logoutActionCreator());

        // Option 5: Clear state via Zustand
        // Replace clearUser with your actual store action
        // console.log('Clearing Zustand auth store...');
        // if (clearUser) {
        //   clearUser();
        // }

        // --- END: Clear Client-Side State ---

        console.log('Logout successful on backend, client state cleared, navigating to login.');
        // Navigate AFTER clearing state
        navigate('/login');

      } else {
        // Log backend error details if possible
        const errorText = await response.text();
        console.error('Logout failed on backend:', response.status, errorText);
        // Optionally: Inform the user that logout failed
        // alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout network error or client-side clearing error:', error);
      // Optionally: Inform the user about the error
      // alert('An error occurred during logout. Please check your connection and try again.');
    }
  };

  return (
    <a className="logout" href="#" onClick={handleLogout}>
      {props.children}
    </a>
  );
}

export default Logout;
import { useEffect } from 'react';
import { generateEphemeralKeyAndNonce } from './utils/auth';
import { decodeJwt } from './utils/jwt';

const Login = () => {
  const handleLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('id_token');

    if (jwt) {
      const decodedJwt = decodeJwt(jwt);
      console.log("Decoded JWT:", decodedJwt);

      // Proceed with zkLogin flow using decodedJwt
      // e.g., derive zkLogin address, fetch ZK proof, etc.
    } else {
      const { nonce } = await generateEphemeralKeyAndNonce();
      const CLIENT_ID = 'your-client-id';
      const REDIRECT_URL = 'your-redirect-url';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URL}&scope=openid&nonce=${nonce}`;

      // Redirect user to authUrl
      window.location.href = authUrl;
    }
  };

  useEffect(() => {
    // Check if there's a JWT in the URL when the component mounts
    handleLogin();
  }, []);

  return <button onClick={handleLogin}>Login with Google</button>;
};

export default Login;

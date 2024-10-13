import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { generateEphemeralKeyAndNonce, EphemeralData } from '../utils/auth';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { generateNonce, jwtToAddress } from '@mysten/zklogin';
import { getExtendedEphemeralPublicKey, generateRandomness } from '@mysten/zklogin';
import axios from 'axios';
import { useCurrentAccount, useSuiClientQuery, useSuiClient, useCurrentWallet, useSignAndExecuteTransaction, useSignTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { getFullnodeUrl, SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui/faucet';
import { SUI_DEVNET_CHAIN, Wallet } from '@mysten/wallet-standard';

function ConnectedAccount() {
	const account = useCurrentAccount();

	if (!account) {
		return null;
	}

	return (
		<div>
			<div>Connected to {account.address}</div>;
			<OwnedObjects address={account.address} />
		</div>
	);
}

function OwnedObjects({ address }: { address: string }) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
	});
	if (!data) {
		return null;
	}

	return (
		<ul>
			{data.data.map((object) => (
				<li key={object.data?.objectId}>
					<a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
						{object.data?.objectId}
					</a>
				</li>
			))}
		</ul>
	);
}

//dotenv.config();
const CLIENT_ID="125965881454-6aq0vmm7k3i00rigq71h1af5mik0h4mc.apps.googleusercontent.com";
const REDIRECT_URI="http://localhost:5173/";

/*const clientId = process.env.CLIENT_ID;
const redirectUri = process.env.REDIRECT_URI;*/

/*console.log('Client ID:', clientId);
console.log('Redirect URI:', redirectUri);*/

const Home = () => {
  const [ephemeralData, setEphemeralData] = useState<EphemeralData | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userSalt, setUserSalt] = useState<string | null>(null);
  const [result, setTxResult] = useState<SuiTransactionBlockResponse | null>(null);

  const randomness = generateRandomness();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const wallet = useCurrentWallet();
  const signE = useSignAndExecuteTransaction();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const [signature2, setSignature] = useState('');

  const packageId = "0x76fd1fcc8139c7678988d4a466ae4a1e84e118ae8f995bbfe5333e005df37681";
  const moduleId = "Hydra";
  const functionId = "mint_avatar";
  const args = "";
  //const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
 
  // use getFullnodeUrl to define Devnet RPC location
  const rpcUrl = getFullnodeUrl('devnet');
 
  // create a client connected to devnet
  const client = new SuiClient({ url: rpcUrl });

  useEffect(() => {
    async function fetchEphemeralData() {
      try {
        const data = await generateEphemeralKeyAndNonce();
        const nonce = generateNonce(
          data.ephemeralKeyPair.getPublicKey(),
          data.maxEpoch,
          randomness
        );
        setEphemeralData(data);
        setNonce(nonce);
      } catch (error) {
        console.error('Error fetching ephemeral data:', error);
      }
    }

    fetchEphemeralData();

    // Check for authentication response in the URL
    const hash = window.location.hash;
    if (hash.includes('id_token')) {
      const params = new URLSearchParams(hash.slice(1));
      const idToken = params.get('id_token');
      console.log(idToken); //fetched token
      if (idToken) {
        const jwtPayload = jwtDecode(idToken);
        console.log("Decoded JWT:", jwtPayload);
        // Register user and get salt
        registerUser((jwtPayload as any).email ?? '', idToken).then(salt => {
          if (salt) {
            setUserSalt(salt);
            const zkLoginUserAddress = jwtToAddress(idToken, salt);
            console.log("zkLoginUserAddress:", zkLoginUserAddress);
            if (ephemeralData) {
              const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralData.ephemeralKeyPair.getPublicKey());
              console.log("Extended Ephemeral Public Key:", extendedEphemeralPublicKey);
            } else {
              console.error("Ephemeral data is not available");
            }
          }
        });
        setIdToken(idToken);
      }
      setIsAuthenticated(true);
    }
  }, []); // Removed ephemeralData from the dependency array

  const registerUser = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://b825-192-33-197-199.ngrok-free.app/register', {
        "username": username,
        "password": password
      });
      return response.data.salt;
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  };

  const handleGoogleLogin = () => {
    if (!ephemeralData || !nonce) {
      console.error('Ephemeral data is not ready');
      return;
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'id_token',
      scope: 'openid',
      nonce: nonce,
    });

    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    window.location.href = loginURL;
  };

  const PROVER_URL = 'https://prover-dev.mystenlabs.com/v1'; // Replace with your actual prover URL

  const postToProver = async (jwt: string, extendedEphemeralPublicKey: string, maxEpoch: string, jwtRandomness: string, salt: string, keyClaimName: string) => {
    try {
      const response = await axios.post(PROVER_URL, {
        jwt,
        extendedEphemeralPublicKey,
        maxEpoch,
        jwtRandomness,
        salt,
        keyClaimName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Prover response:', response.data);
      
    } catch (error) {
      console.error('Error posting to prover:', error);
    }
  };

  // Example usage after successful authentication
  useEffect(() => {
    if (isAuthenticated && ephemeralData && idToken && userSalt) {
      const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralData.ephemeralKeyPair.getPublicKey());
      const jwtRandomness = randomness; // Replace with actual randomness
      const salt = userSalt; // Ensure salt is available
      const keyClaimName = 'sub';

      postToProver(idToken, extendedEphemeralPublicKey, ephemeralData.maxEpoch.toString(), jwtRandomness, salt, keyClaimName);
    }
  }, [isAuthenticated, ephemeralData, idToken, userSalt]); // Add dependencies


  /*const handleExecuteTransaction = async () => {
    try {
      console.log(packageId);
      console.log(moduleId);
      const txx = new Transaction();
      const tx = await suiClient.executeTransactionBlock({
        transactionBlock: {
          kind: 'moveCall',
          target: `${packageId}::${moduleId}::${functionId}`,
          arguments: [txx.pure(args)],
        },
        requestType: 'WaitForLocalExecution',
        options: {
          showEffects: true,
        },
            typeArguments: [],
            arguments: [JSON.parse(args)],
          },
        sender: account?.address,
      });
      if (setResult) {
        setResult(tx);
      }
    } catch (error) {
      if (setError) {
        setError(error);
      }
    }
  };*/
  
  async function mintAvatar(url: string) {
    const transaction = new Transaction();
    
    // Define the Move function call
    transaction.moveCall({
      target: `${packageId}::${moduleId}::${functionId}`,
      arguments: [transaction.pure.string(url)], // Pass the URL as an argument
    });

     const signer = account?.address//ephemeralData?.ephemeralKeyPair.getPublicKey();

    if (signer) {
    transaction.setSender(signer);
    /*const res = await requestSuiFromFaucetV0({
      // connect to Devnet
      host: getFaucetHost('devnet'),
      recipient: signer.toSuiPublicKey(),
    });*/
    } else {
      console.log("Error getting currentAccount")
    }

    transaction.setGasPrice(1);
    transaction.setGasBudget(100000000000);

    console.log(transaction.gas);
    console.log(account?.address);
    /*const tx =  await transaction.build({client: client}); // binary
   // const sig = await suiClient.

    const signature = await ephemeralData?.ephemeralKeyPair.signTransaction(tx);
    
    
    const { bytes, reportTransactionEffects } = await signTransaction({
      transaction: transaction,
      chain: 'sui:devnet',
    });

    if (signature) {
      const result = await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature: signature2,
        requestType: 'WaitForLocalExecution',
        options: {
          showEffects: true,
        },
      });*/

    const t = await signAndExecuteTransaction(
      {
        transaction: transaction,
        chain: 'sui:devnet',
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          //setDigest(result.digest);
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
          // You can add additional error handling here, such as displaying an error message to the user
        },
      },
    );
    
    

    setTxResult(result);
    //console.log('Mint Avatar Response:', result);
  }
  
    
  
  
  // Example usage
  //mintAvatar('https://ibb.co/PTtS4V9');


  return (
    <div className="flex justify-center items-center bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 mt-20">
        <section className="bg-base-100 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Ephemeral Key and Nonce</h2>
          {ephemeralData ? (
            <div className="text-center">
              <p><strong>Ephemeral Key:</strong> {ephemeralData.ephemeralKeyPair.getPublicKey().toBase64()}</p>
              <p><strong>Nonce:</strong> {ephemeralData.nonce}</p>
              <p><strong>Max Epoch:</strong> {ephemeralData.maxEpoch}</p>
            </div>
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </section>

        <section className="bg-base-100 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Connect with Google</h2>
          <div className="text-center">
            {isAuthenticated ? (
              <>
                <p className="text-green-500 font-bold">Successfully connected with Google!</p>
                <ConnectedAccount />
              </>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Connect with Google
              </button>
            )}
          </div>
        </section>

        <section className="bg-base-100 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Mint an avatar</h2>
          <div className="text-center">
            {result ? (
              <>
                <p className="text-green-500 font-bold">Successfully minted an Avatar!</p>
              </>
            ) : (
              <button
                onClick={() => mintAvatar('https://ibb.co/PTtS4V9g')}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Mint Avatar
              </button>
            )}
          </div>
        </section>

        <section className="bg-base-100 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Mint an avatar</h2>
          <div className="text-center">
        <button
							onClick={() => {
								signAndExecuteTransaction(
									{
										transaction: new Transaction(),
										chain: 'sui:devnet',
									},
									{
										onSuccess: (result) => {
											console.log('executed transaction', result);
											//setDigest(result.digest);
										},
									},
								);
							}}
						>
							Sign and execute transaction
						</button>
            </div>
            </section>

      </main>
    </div>
  );
};

export default Home;

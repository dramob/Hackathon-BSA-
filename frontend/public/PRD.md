Project Overview
The project is a SUI blockchain-based NFT game where users can claim and evolve a Hydra NFT avatar. The evolution of the avatar is based on the eco-impactful actions performed by users, which they will document and upload to the platform. The game aims to incentivize users to engage in sustainable activities by rewarding them with visual and functional upgrades to their NFT avatars.

The platform will be built using NextJS 14, SUI blockchain, and TailwindCSS for a modern, scalable, and user-friendly experience.

Core Functionalities
1. User Authentication & Wallet Connection
SUI Wallet Integration: Users will connect their SUI wallet to access the platform.
Upon successful connection, users can claim a unique Hydra NFT Avatar with a base level of 0 and a power score of 0.
2. NFT Avatar Claim & Display
Avatar Creation: After connecting their wallet, users can claim their base Hydra NFT.
The initial avatar starts at Level 0 with Power 0.
The avatar will evolve visually and in power as the user completes eco-impactful actions.
3. User Account & Profile Dashboard
Upon logging in, users are directed to their dashboard, which includes the following sections:

Profile Section
Avatar Overview: Users can view their avatar's current level, power, and any accessories or skins they have purchased.
Shop: Users can access a marketplace where they can buy skins and accessories to personalize their avatar.
Achievements: A log of all the eco-actions completed by the user will be available here, showcasing milestones and rewards earned.
Gifts: Users can receive gifts or bonuses based on their eco-actions or for participating in special events.
Action Section
Add Eco-Action: Users can log eco-friendly actions, such as recycling, using reusable materials, or volunteering.
Proof Submission: Users will upload proof (images or videos) of the action.
Impact Calculation: Based on the action submitted, the system calculates an impact score, which will contribute to leveling up the avatar's power and overall evolution.
Eco-actions need to be verified, either by the platform’s AI verification or through community validators.
Challenge Section
Challenge Participation: Users can join challenges that promote eco-actions (e.g., 'Plant a Tree Challenge' or 'Zero Waste Week').
Each challenge comes with specific tasks and requirements.
Proof Submission: Similar to eco-actions, users will upload proof to validate their participation and completion.
Verification: Once verified, users earn additional points that contribute to leveling up their avatars.
4. Avatar Evolution System
Dynamic Evolution: As users complete eco-actions and challenges, their avatar evolves in both appearance and power level.
Visual changes in the avatar (e.g., color shifts, accessories unlocked) reflect the user’s progression.
Leveling: A combination of eco-actions and challenge completions increases the user's level.
Power: A score system based on eco-impact determines the power of the avatar, giving users a tangible representation of their efforts.
Technical Architecture
The app will be organized as follows:

arduino
Copy code
 ----app/
 │    ├── login/
 │    │    └── wallet-connect.tsx
 │    │    └── claim-nft.tsx
 │    └── pages/
 │         └── profile.tsx
 │         └── action.tsx
 │         └── challenge.tsx
 ├── components/
 │    └── navbar.tsx
 │    └── nftLogic.tsx
 ├── constants.ts
 ├── networkConfig.ts
 ├── styles/
 ├── tailwind.config.js
Key Components:
login/wallet-connect.tsx: Handles wallet connection to the SUI blockchain.
login/claim-nft.tsx: Allows users to claim their base-level Hydra NFT after connecting their wallet.
pages/profile.tsx: Displays the user’s profile, showing their avatar, achievements, and access to the shop and gifts.
pages/action.tsx: Contains the form for users to log eco-actions and upload proof for verification.
pages/challenge.tsx: Allows users to browse and join challenges, upload proof, and earn rewards.
Key Features & Flow
User Flow:
Login & Wallet Connection: Users connect their SUI wallet.
NFT Claim: Users claim their Hydra avatar (Level 0, Power 0).
Dashboard Access:
Profile: View avatar stats, access shop and achievements.
Action: Submit eco-actions with proof for validation.
Challenge: Join challenges, complete tasks, and earn points for evolution.
Avatar Evolution Logic:
Level Up: Users level up by completing eco-actions and challenges.
Power Up: The power score increases based on the environmental impact of the actions.
Visual Changes: Avatar evolves visually to represent eco-impact progression.
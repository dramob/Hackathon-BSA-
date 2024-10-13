#!/bin/bash

# Install Homebrew
echo "Installing Homebrew..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

# Install SUI via Homebrew
echo "Installing SUI..."
brew install sui

# Add SUI to PATH in .bashrc
echo 'export PATH=$PATH:/home/linuxbrew/.linuxbrew/bin' >> ~/.bashrc
source ~/.bashrc

# Verify installation
echo "Verifying SUI installation..."
sui --version
#!/bin/bash

# Add Sui to the PATH
echo "Adding Sui to PATH..."
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

echo "Initializing Sui environment..."
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443

# Switch to the desired Sui network (e.g., devnet)
echo "Switching to Devnet..."
sui client switch --env devnet

# Optionally switch to another environment (e.g., testnet)
# echo "Switching to Testnet..."
# sui client switch --env testnet

# Initialize Sui environment with your wallet

# Get test SUI tokens from the faucet
echo "Requesting Sui tokens from faucet..."
sui client faucet

# Check the balance of your account
echo "Checking Sui balance..."
sui client gas
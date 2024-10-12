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

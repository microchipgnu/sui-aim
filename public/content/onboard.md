# Onboarding

This is an onboarding flow for the Sui Blockchain on devnet

First lets create a random account.

{% flow path="accounts/create-random-account.md" /%}

Now lets fund the account with the faucet.

{% flow path="accounts/fund-account-faucet.md" /%}

Now lets get the account details.

{% ai #accountDetails tools="*" /%}

{% $accountDetails.result %}

Now lets mint an NFT to the account.

{% flow path="nfts/mint-nft.md" /%}

# Summary

Create a summary of the onboarding process. Show the user the account details and the transaction link for their NFT mint.

{% ai model="openai/gpt-4o-mini" /%}
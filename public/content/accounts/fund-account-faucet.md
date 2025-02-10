---
title: Fund Account Faucet
description: Fund an account with the faucet
input:
  - type: string
    name: address 
    description: The address to fund
---

Let's fund an account with the faucet. Here's the address: {% $frontmatter.input.address %}

Show the txn link if there is any. It goes like https://suiscan.xyz/devnet/tx/<digest>?network=devnet

{% ai #fundAccountFaucet model="openai/gpt-4o-mini" tools="*" /%}

{% $fundAccountFaucet.result %}
---
title: Fund Account Faucet
description: Fund an account with the faucet
input:
  - type: string
    name: address 
    description: The address to fund
---

let's fund an account with the faucet

{% ai #fundAccountFaucet model="openai/gpt-4o-mini" tools="*" /%}

{% $fundAccountFaucet.result %}
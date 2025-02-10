---
title: Mint NFT
input:
  - name: address
    description: The address to mint the NFT to
    type: string
  - name: context
    description: The context of the NFT
    type: string
---

Lets create an NFT and come up with all the values on my behalf. Here's the address: {% $frontmatter.input.address %}

You should use the following context to generate the NFT metadata: {% $frontmatter.input.context %}. Make it fun and creative!

Generate the transaction to mint the NFT. Do not submit it just yet. Only output the transaction.

{% ai #mintNFT model="openai/gpt-4o-mini" tools="*" /%}

Now lets submit the transaction to the network.

{% ai #submitTransaction model="openai/gpt-4o-mini" tools="*" /%}
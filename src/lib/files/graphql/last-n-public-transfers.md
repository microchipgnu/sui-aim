---
title: Last N Public Transfers
description: Get the last N public transfers on the Sui blockchain
input:
  - type: number
    name: limit
    description: The number of public transfers to get
  - type: string
    name: network
    description: The network to get the public transfers for
---

Lets get public transfers on the Sui blockchain for {% $frontmatter.input.network %} network. Give me the last {% $frontmatter.input.limit %}

{% ai #getPublicTransfers model="openai/gpt-4o-mini" tools="*" /%}

{% $getPublicTransfers.result %}

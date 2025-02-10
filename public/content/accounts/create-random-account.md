Create a random account and output the address and private key

{% ai #createRandomAccount model="openai/gpt-4o-mini" tools="*" structuredOutputs="{address: string, privateKey: string}" /%}

Here's the address:
{% $createRandomAccount.structuredOutputs.address %}

Here's the private key:
{% $createRandomAccount.structuredOutputs.privateKey %}
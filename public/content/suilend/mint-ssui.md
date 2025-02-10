{% flow path="accounts/get-account-details.md" /%}

Lets get the transaction to mint 1 sSUI by staking SUI. Show the transaction details.

{% ai #mint-ssui tools="*" /%}

{% debug($mint-ssui) /%}

Lets now submit the transaction to the network.

{% ai #submit-transaction tools="*" /%}

{% debug($submit-transaction) /%}


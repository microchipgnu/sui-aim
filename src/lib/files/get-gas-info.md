Lets get the gas info 

{% ai #getGasInfo model="openai/gpt-4o-mini" tools="*" /%}

{% $getGasInfo.result %}
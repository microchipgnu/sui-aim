# Coding Exercise

We are executing code in three different languages: JavaScript, Python, and Bash.

Let's start with the JavaScript code:

```js {% #codeInJS %}

const a = 1;
const b = 2;
const c = a + b;

console.log(c);

```

Let's now look at the Python code:

```python {% #codeInPython %}

a = 1
b = 2
c = a + b

print(c)

```

Let's now look at the Bash code:

```bash {% #codeInBash %}

a=1
b=2
c=$((a + b))
echo $c

```


Python Result: {% debug($codeInPython) %}

JS Result: {% debug($codeInJS) %}

Bash Result: {% debug($codeInBash) %}

What's the result of the code for each language?

{% ai #results model="openai/gpt-4o-mini" structuredOutputs="{results: [{language: string, result: just a result or logs}]}" /%}

{% debug($results.structuredOutputs) %}
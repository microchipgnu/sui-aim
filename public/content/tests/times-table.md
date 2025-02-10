---
title: Loop
description: Use loops to repeat a block of code multiple times.
input:
    - name: count
      type: number
      description: The number of times to repeat the block
---

Let's do the {% $frontmatter.input.count %} times table. Output just the next number.

{% loop #loop count=$frontmatter.input.count %}

    {% $loop.count %} x {% $frontmatter.input.count %} = {% ai model="openai/gpt-4o" /%}

{% /loop %}
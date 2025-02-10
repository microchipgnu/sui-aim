---
title: Hot News
input: 
  - name: interests
    type: string
    description: The interests of the user
---

# Hot News

Lets find out what is trending on Reddit accross several crypto subreddits. The user is interested in the following topics: {% $frontmatter.input.interests %}

{% ai #news model="openai/gpt-4o-mini:online@openrouter" /%}
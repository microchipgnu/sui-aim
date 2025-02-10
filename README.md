# Suiiii

A web-based development environment for building, testing, and deploying Sui agentic workflows. 

This project uses [AIM](https://aim.microchipgnu.pt) to run Markdown-based agentic workflows. 

The juice is in the [content folder](/public/content). You can read all the workflows created and even edit and run on your own project. Or just visit the [live demo](https://sui-aim.vercel.app)

![Captura de ecrã 2025-02-10, às 22 09 02](https://github.com/user-attachments/assets/82786b27-5169-43d0-97a8-6f5eb1e25729)


## AIM

AIM is another project I'm building, [see more here](https://aim.microchipgnu.pt)

You can use to write agentic workflows using Markdown.

### AIM config

AIM is configured in [src/lib/aim.ts](./src/lib/aim.ts) and you can see all the tools it is running in its runtime.

## Sui Ecosystem Tools

### Sui 
- Account management, generate, submit transactions, etc
- [Sui implementation](https://github.com/microchipgnu/sui-aim/tree/main/src/lib/sui)
- [AI tools](https://github.com/microchipgnu/sui-aim/blob/main/src/lib/aim.ts)

### NAVI
- API wrapper and protocol interaction
- [Implementation](https://github.com/microchipgnu/sui-aim/tree/main/src/lib/navi)
- [AI tools](https://github.com/microchipgnu/sui-aim/blob/main/src/lib/aim.ts)

### Bluefin
- Dex integration tools and querying state
- [Implementation](https://github.com/microchipgnu/sui-aim/tree/main/src/lib/bluefin)
- [AI tools](https://github.com/microchipgnu/sui-aim/blob/main/src/lib/aim.ts)

### Suilend
- Minting and redeeming sSUI tools
- [Implementation](https://github.com/microchipgnu/sui-aim/tree/main/src/lib/suilend)
- [AI tools](https://github.com/microchipgnu/sui-aim/blob/main/src/lib/aim.ts)

### Atoma
- Decentralized inference
- [Implementation](https://github.com/microchipgnu/sui-aim/tree/main/src/lib/atoma)
- [AI tools](https://github.com/microchipgnu/sui-aim/blob/main/src/lib/aim.ts)

## 🚀 Getting Started

1. Clone the repository
2. Install with `bun install`
3. Set .env vars based on [.env.example](./.env.example)
4. Run the dev server `bun dev`

That's it. You can then deploy wherever you'd like or implement `aim` in any other project.

# Kids Math Game

A fun and interactive math game built with React and TypeScript, designed to help children practice their math skills!

## About the Game

This educational game helps children learn and practice mathematics in an engaging way. Built with modern web technologies to ensure a smooth and responsive experience.

## Tech Stack

- [React](https://reactjs.org/) - For building the user interface
- [TypeScript](https://www.typescriptlang.org/) - For type safety and better code quality
- [Vite](https://vitejs.dev/) - For fast development and building

## Getting Started

1. Clone the repository
2. Install the dependencies:

```bash
npm install
```

3. Start the game in development mode:

```bash
npm run dev
```

## Features

- Interactive math exercises
- Kid-friendly interface
- Instant feedback on answers
- Progressive difficulty levels

## Development

### Running the Game Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview  # To preview the production build
```

### ESLint Configuration

The project uses ESLint with TypeScript for code quality. To enable stricter type checking:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

## Contributing

Contributions are welcome! Whether it's adding new math problems, improving the UI, or fixing bugs, feel free to:

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License

MIT

---

Made with ❤️ for young mathematicians

## Deployment

This game is automatically deployed to GitHub Pages when changes are pushed to the main branch. You can view the live version at:
https://your-username.github.io/your-repo-name/

### Manual Deployment

You can also trigger a manual deployment from the GitHub Actions tab in the repository.

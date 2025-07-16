# Data Structures and Algorithms Visualizer

This project is a Data Structures and Algorithms Visualizer built with React and Vite. It provides an interactive platform for users to engage with various algorithms in real-time, allowing them to visualize the execution of algorithms and understand their mechanics.

# Demo Link - https://dsalgovisualize-sohamchafale.netlify.app/

## Features

- **Algorithm Visualizer**: Users can select different algorithms to visualize their execution step-by-step.
- **Algorithm Race Mode**: A competitive feature that allows users to run multiple algorithms side-by-side and compare their performance in real-time.
- **Dynamic Leaderboard**: Tracks the execution speed of algorithms during the race mode and displays a leaderboard for users to see the fastest algorithms.
- **User-Friendly Interface**: A clean and intuitive interface that makes it easy for users to navigate between different features.

## Project Structure

```
ds-algo-visualizer
├── public
│   ├── index.html          # Main HTML entry point
│   └── vite.svg           # Vite logo
├── src
│   ├── App.css            # Styles for the main application
│   ├── App.jsx            # Main React component
│   ├── assets
│   │   └── react.svg      # React logo
│   ├── components
│   │   ├── AlgorithmRaceMode.jsx  # Component for race mode
│   │   ├── AlgorithmVisualizer.jsx # Component for visualizing algorithms
│   │   └── Navbar.jsx     # Navigation bar component
│   ├── index.css          # Global styles with Tailwind CSS
│   ├── main.jsx           # Entry point for the React application
│   └── utils
│       └── algorithms.js   # Functions implementing various algorithms
├── .gitignore              # Files and directories to ignore by Git
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ds-algo-visualizer
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

- Select an algorithm from the Algorithm Visualizer to see how it works.
- Use the Algorithm Race Mode to compare the performance of different algorithms.
- Explore the dynamic leaderboard to see which algorithms perform the best.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

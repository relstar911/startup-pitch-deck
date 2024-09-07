# Startup Pitch Deck Generator

This project is a React-based application that generates professional startup pitch deck slides using AI. It's built with Vite, React, TypeScript, and integrates with the OpenAI API.

## Features

- Interactive form to input startup information
- AI-powered slide content generation
- Animated slide presentation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-actual-username/startup-pitch-deck.git
   cd startup-pitch-deck
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   Note: A `.env.example` file is provided as a template.

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Fill out the startup information form on the home page.
2. Click "Generate Slide" to create your AI-powered pitch deck slide.
3. View and interact with your generated slide presentation.

## Technologies Used

- React
- TypeScript
- Vite
- OpenAI API
- Framer Motion
- Tailwind CSS
- shadcn/ui
- jsPDF (for PDF export)
- react-router-dom (for routing)
- uuid (for generating unique IDs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm start`: Alias for `npm run dev`.

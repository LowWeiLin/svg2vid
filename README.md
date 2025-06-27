# SVG2Vid - Convert Animated SVGs to Video

A privacy-focused web application that converts animated SVG files to video formats entirely in your browser. No uploads, no server processing - everything runs client-side.

## Features

- 🔒 **Privacy-First**: All processing happens in your browser
- ⚡ **Fast Conversion**: Client-side processing for instant results
- 📄 **Multiple Formats**: Supports all video formats your browser can handle
- 🎨 **Customizable**: Adjust dimensions, duration, framerate, and background
- 📱 **Responsive**: Works on desktop and mobile devices

## Perfect for Draw.io Users

Convert your animated Draw.io diagrams to videos for presentations, documentation, or sharing!

## Development

### Prerequisites
- Node.js 20 or higher
- npm

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup GitHub Pages Deployment

1. Push your code to a GitHub repository
2. Go to your repository's **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment will trigger automatically on every push to the `main` branch

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Build the project using Vite
- Deploy the built files to GitHub Pages
- Make your app available at `https://yourusername.github.io/svg2vid/`

### Manual Deployment

If you prefer manual deployment, you can build the project and deploy the `dist` folder to any static hosting service.

## How It Works

1. **Upload**: Select an animated SVG file
2. **Configure**: Set video dimensions, duration, framerate, and background color
3. **Convert**: The app creates a video by capturing frames of the animated SVG
4. **Download**: Save the resulting video file

## Browser Compatibility

- Modern browsers with Canvas and MediaRecorder API support
- Chrome, Firefox, Safari, Edge (latest versions)

## Technical Stack

- **Svelte 5**: Reactive UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework

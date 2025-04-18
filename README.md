# AIdeas

AIdeas is a web application that helps aspiring founders generate, validate, and refine AI startup ideas using GPT-4 analysis and real-time market trends.

## Features

- Generate and evaluate AI startup ideas
- Get detailed analysis including market size, business model, monetization strategies, and competitors
- Browse trending AI products and ideas
- Filter products by categories

## Tech Stack

- Next.js 13+ (App Router)
- Tailwind CSS
- shadcn/ui
- Lucide icons
- OpenAI GPT-4 API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
aideas/
├── app/                          # App Router (Next.js 13+)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── evaluate/                # /evaluate route
│   │   └── page.tsx            # Result page
│   └── api/
│       └── evaluate/route.ts   # API route for ChatGPT
├── components/                  # Reusable UI components
├── lib/                         # Utilities and API calls
├── styles/                     # Global styles
└── public/                     # Static files
```

## Contributing

Feel free to submit issues and enhancement requests! 
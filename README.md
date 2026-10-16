# BaseCalc2 — Base Calculator & Number Systems Converter

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-E34F26)](https://developer.mozilla.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern web application for converting between Binary, Octal, Decimal, and Hexadecimal and performing chained multi-operand arithmetic calculations across mixed numbering systems.

## Features

- **Multi-Base Conversions:** Convert values between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16).
- **Chained Arithmetic Operations:** Perform multi-operand calculations with customizable operators (`+`, `-`, `*`, `/`) and independent input bases.
- **Simultaneous All-Base Output:** View every result in all four supported bases.
- **Exact Integer Arithmetic:** Uses JavaScript `BigInt` internally, so large integer conversions and calculations do not lose precision.
- **Step-by-Step Solution Breakdown:** Displays detailed mathematical steps for verification and learning.
- **Session History:** Keeps a log of past calculations with one-click history clearing.

## Tech Stack

- **Frontend:** Semantic HTML, modern CSS, and vanilla JavaScript
- **Deployment:** Vercel static hosting
- **Arithmetic:** Native JavaScript `BigInt` for exact integer results

## Getting Started

### Running Locally

1. Clone or download this repository.
2. Open `index.html` in a browser, or serve the folder with any static HTTP server.

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Repository Structure

```text
BaseCalc2/
├── index.html                           # Web application entry point
├── style.css                            # Glassmorphism UI styles
├── app.js                               # Converter, calculator, audio, and animation logic
├── assets/                              # Innovation University branding
├── vercel.json                          # Vercel deployment configuration
├── .gitignore                           # Git ignore rules
├── LICENSE                              # MIT License
└── README.md                            # Documentation
```

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file.

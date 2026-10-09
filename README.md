# Base Calculator & Number Systems Converter

[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows&logoColor=white)](https://microsoft.com)
[![Runtime](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Framework](https://img.shields.io/badge/Framework-WPF-blue)](https://docs.microsoft.com/dotnet/desktop/wpf/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern Windows desktop application for converting between numerical bases (Binary, Octal, Decimal, Hexadecimal) and performing chained multi-operand arithmetic calculations across mixed numbering systems.

---

## Features

- **Multi-Base Conversions:** Seamlessly convert values between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16).
- **Chained Arithmetic Operations:** Support for multi-operand calculations with customizable operators (`+`, `-`, `*`, `/`) and independent input base selection.
- **Simultaneous All-Base Output:** Instantly visualizes computed results in all 4 primary numerical bases.
- **Step-by-Step Solution Breakdown:** Displays detailed mathematical calculation steps for verification and learning.
- **Session History:** Keeps a log of past calculations with a one-click history clearing option.
- **Included Video Demo:** Pre-packaged video demonstration showcasing the user interface and functionality.

---

## Tech Stack

- **Language:** C#
- **UI Framework:** WPF (Windows Presentation Foundation)
- **Target Runtime:** .NET 9.0 Desktop Runtime (`Microsoft.WindowsDesktop.App`)
- **OS Support:** Windows 10 / Windows 11

---

## Getting Started

### Prerequisites

Ensure you have the [.NET 9.0 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/9.0) installed on your Windows machine.

### Running the Application

1. Clone or download this repository.
2. Launch `WpfApp2.exe` directly from the project directory.

```powershell
.\WpfApp2.exe
```

---

## Repository Structure

```text
BaseCalc2/
├── WpfApp2.exe                          # Application executable launcher
├── WpfApp2.dll                          # Main compiled WPF application assembly
├── WpfApp2.runtimeconfig.json           # .NET 9.0 runtime configuration
├── WpfApp2.deps.json                    # Dependency mapping
├── WpfApp2.pdb                          # Debug symbol database
├── Whisk_aznihtojbzmxugmw0co2mwytazyhrtl5uwmw0sm.mp4  # Application video preview
├── .gitignore                           # Git ignore rules
├── LICENSE                              # MIT License
└── README.md                            # Documentation
```

---

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

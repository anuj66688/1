/* ==========================================================================
   CODEATLAS — CENTRALIZED KNOWLEDGE DATASET & DEMO STORE (js/data.js)
   ========================================================================== */

window.CODEATLAS_DEFAULT_LANGUAGES = [
  {
    id: "c",
    name: "C",
    mark: "C",
    year: 1972,
    category: "Systems",
    paradigm: "Procedural, Imperative, Structured",
    typing: "Static, Weak, Manifest",
    execution: "Ahead-of-Time Compiled (Native Machine Code)",
    uses: ["Operating System Kernels", "Embedded Firmware", "Compilers & Runtimes", "High-Frequency Systems"],
    creator: "Dennis Ritchie (Bell Labs)",
    description: "The foundational systems programming language that shaped UNIX, modern operating systems, and syntax conventions for generations of languages.",
    ecosystem: ["GCC / Clang", "Make / CMake", "glibc", "Linux Kernel API", "POSIX"],
    learningConsiderations: "Unmatched for understanding raw memory pointers, stack vs. heap allocation, and hardware-level execution without abstraction overhead.",
    syntax: `#include <stdio.h>\n\nint main(void) {\n    const char *node = "CodeAtlas::C";\n    printf("Telemetry online: %s\\n", node);\n    return 0;\n}`,
    related: ["cpp", "rust", "go", "csharp", "java"],
    featured: true,
    coords: { x: -180, y: -60, z: 40 }
  },
  {
    id: "cpp",
    name: "C++",
    mark: "C++",
    year: 1985,
    category: "Systems",
    paradigm: "Multi-paradigm: Object-Oriented, Generic, Procedural",
    typing: "Static, Strong, Nominative",
    execution: "Ahead-of-Time Compiled (Zero-Cost Abstractions)",
    uses: ["AAA Game Engines", "Real-Time Rendering", "Financial Trading Engines", "Browser Engines (V8/Blink)"],
    creator: "Bjarne Stroustrup",
    description: "Extends C with zero-overhead abstractions, deterministic resource management (RAII), templates, and high-performance object-oriented capabilities.",
    ecosystem: ["STL", "Unreal Engine", "Boost", "CMake", "Vulkan / DirectX"],
    learningConsiderations: "Steep mastery curve with deep rewards; essential for graphics programming, game engines, and latency-critical computing.",
    syntax: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> epochs = {1972, 1985, 2026};\n    for (auto yr : epochs) std::cout << yr << " ";\n}`,
    related: ["c", "rust", "csharp", "java"],
    featured: true,
    coords: { x: -240, y: 50, z: -20 }
  },
  {
    id: "csharp",
    name: "C#",
    mark: "C#",
    year: 2000,
    category: "Enterprise",
    paradigm: "Object-Oriented, Functional, Component-Oriented",
    typing: "Static, Strong, Dynamic-opt-in",
    execution: "CLR Managed JIT & Native AOT",
    uses: ["Enterprise Cloud Microservices", "Unity Game Development", "Desktop Architecture", "Cross-Platform APIs"],
    creator: "Anders Hejlsberg (Microsoft)",
    description: "A refined, modern multi-paradigm language powering the .NET ecosystem, enterprise backends, and the Unity real-time 3D engine.",
    ecosystem: [".NET 9", "ASP.NET Core", "Entity Framework", "Unity Engine", "LINQ"],
    learningConsiderations: "Offers an ergonomic balance of strong static typing, LINQ functional queries, and world-class tooling.",
    syntax: `using System;\nusing System.Linq;\n\nvar langs = new[] { "C#", "F#", "TypeScript" };\nConsole.WriteLine($"Active nodes: {langs.Count()}");`,
    related: ["java", "cpp", "typescript", "kotlin"],
    featured: false,
    coords: { x: -70, y: 160, z: 50 }
  },
  {
    id: "java",
    name: "Java",
    mark: "JV",
    year: 1995,
    category: "Enterprise",
    paradigm: "Object-Oriented, Class-Based, Concurrent",
    typing: "Static, Strong, Manifest",
    execution: "JVM Bytecode with Adaptive JIT Compilation",
    uses: ["Global Banking & FinTech", "Distributed Cloud Systems", "Android Heritage", "High-Throughput Data Buses"],
    creator: "James Gosling (Sun Microsystems)",
    description: "Engineered for portable 'Write Once, Run Anywhere' reliability, Java underpins the world's largest distributed enterprise and cloud data infrastructures.",
    ecosystem: ["Spring Boot", "Apache Kafka", "Maven / Gradle", "GraalVM", "Hibernate"],
    learningConsiderations: "Teaches disciplined object-oriented architecture, interface contracts, and enterprise concurrency with Virtual Threads.",
    syntax: `public class AtlasNode {\n    public static void main(String[] args) {\n        System.out.println("JVM Runtime Telemetry: ACTIVE");\n    }\n}`,
    related: ["kotlin", "csharp", "cpp", "javascript"],
    featured: false,
    coords: { x: 20, y: 190, z: -40 }
  },
  {
    id: "javascript",
    name: "JavaScript",
    mark: "JS",
    year: 1995,
    category: "Web",
    paradigm: "Event-Driven, Functional, Prototype-Based",
    typing: "Dynamic, Weak, Duck Typing",
    execution: "JIT-Compiled V8 / SpiderMonkey / JavaScriptCore Engines",
    uses: ["Interactive Web Applications", "Full-Stack Server Runtimes", "Browser 3D & WebGL", "Edge Serverless Functions"],
    creator: "Brendan Eich (Netscape)",
    description: "The ubiquitous runtime language of the programmable web, orchestrating client-side interfaces, asynchronous event loops, and cloud edge compute.",
    ecosystem: ["Node.js / Bun", "React / Vue / Svelte", "Three.js", "Vite", "NPM"],
    learningConsiderations: "Immediate visual feedback in any browser; asynchronous promises and dynamic coercion require deliberate architectural discipline.",
    syntax: `const atlasNodes = ["JS", "TS", "Wasm"];\nconst status = atlasNodes.map(n => \`[\${n}:ONLINE]\`).join(" ");\nconsole.log(status);`,
    related: ["typescript", "python", "dart", "php"],
    featured: true,
    coords: { x: 190, y: -40, z: 60 }
  },
  {
    id: "typescript",
    name: "TypeScript",
    mark: "TS",
    year: 2012,
    category: "Web",
    paradigm: "Structural Typed, Functional, Object-Oriented",
    typing: "Static, Structural, Gradual",
    execution: "Transpiled to JavaScript / Type-Checked at Compile Time",
    uses: ["Large-Scale Frontend Systems", "Full-Stack Type-Safe APIs", "Design Systems", "SDK & Developer Tooling"],
    creator: "Anders Hejlsberg (Microsoft)",
    description: "A strict syntactical superset of JavaScript adding powerful structural type inference, generics, and compile-time verification for planetary-scale web apps.",
    ecosystem: ["Next.js", "Deno / Bun", "tRPC", "Prisma", "Zod"],
    learningConsiderations: "The industry standard for modern web engineering; builds directly upon JavaScript fundamentals while preventing runtime type defects.",
    syntax: `interface LanguageNode {\n  readonly id: string;\n  year: number;\n}\nconst ts: LanguageNode = { id: "typescript", year: 2012 };`,
    related: ["javascript", "csharp", "dart", "kotlin"],
    featured: false,
    coords: { x: 270, y: 50, z: 30 }
  },
  {
    id: "python",
    name: "Python",
    mark: "PY",
    year: 1991,
    category: "AI & Data",
    paradigm: "Multi-paradigm: Object-Oriented, Imperative, Functional",
    typing: "Dynamic, Strong, Gradual Type Hints",
    execution: "Bytecode Interpreted (CPython) & C-Extension Accelerated",
    uses: ["Deep Learning & LLMs", "Data Science & Analytics", "Backend APIs & Automation", "Scientific Computing"],
    creator: "Guido van Rossum",
    description: "Celebrated for expressive readability and the richest scientific ecosystem on Earth, serving as the command language for modern AI and data engineering.",
    ecosystem: ["PyTorch / TensorFlow", "NumPy & Pandas", "FastAPI / Django", "Jupyter", "scikit-learn"],
    learningConsiderations: "Cleanest syntactic onboarding in computing, backed by high-performance C/CUDA extensions for heavy tensor workloads.",
    syntax: `import math\n\ndef compute_entropy(signals: list[float]) -> float:\n    return -sum(p * math.log2(p) for p in signals if p > 0)\n\nprint(f"Signal H: {compute_entropy([0.5, 0.5]):.2f}")`,
    related: ["r", "javascript", "ruby", "cpp", "sql"],
    featured: true,
    coords: { x: 90, y: -160, z: 20 }
  },
  {
    id: "go",
    name: "Go",
    mark: "GO",
    year: 2009,
    category: "Systems",
    paradigm: "Concurrent (CSP), Imperative, Structured",
    typing: "Static, Strong, Structural Interfaces",
    execution: "Fast Ahead-of-Time Compiled Static Binary",
    uses: ["Cloud-Native Infrastructure", "Kubernetes & Containers", "High-Concurrency Microservices", "Network Proxies & CLIs"],
    creator: "Robert Griesemer, Rob Pike, Ken Thompson (Google)",
    description: "Designed at Google for cloud-scale simplicity, instantaneous compilation, lightweight goroutine concurrency, and rock-solid networked services.",
    ecosystem: ["Docker", "Kubernetes", "Terraform", "Gin / Fiber", "gRPC"],
    learningConsiderations: "Minimalist specification with only 25 keywords; teaches pragmatic concurrency via channels and composable interfaces.",
    syntax: `package main\nimport "fmt"\n\nfunc main() {\n    ch := make(chan string, 1)\n    ch <- "Go Goroutine Active"\n    fmt.Println(<-ch)\n}`,
    related: ["c", "rust", "python", "java"],
    featured: false,
    coords: { x: -110, y: -170, z: -50 }
  },
  {
    id: "rust",
    name: "Rust",
    mark: "RS",
    year: 2010,
    category: "Systems",
    paradigm: "Concurrent, Functional, Imperative, Generic",
    typing: "Static, Strong, Affine / Ownership-Based",
    execution: "Ahead-of-Time Compiled via LLVM (Zero Garbage Collector)",
    uses: ["Memory-Safe Systems & Kernels", "WebAssembly Engines", "Cryptographic Protocols", "High-Speed Developer Tooling"],
    creator: "Graydon Hoare (Mozilla Research)",
    description: "Guarantees memory safety and thread safety at compile time through its ownership and borrow-checking type system without needing a garbage collector.",
    ecosystem: ["Cargo", "Tokio", "WebAssembly (wasm-bindgen)", "Actix / Axum", "Tauri"],
    learningConsiderations: "The borrow checker enforces strict discipline upfront, eliminating entire classes of null-pointer and data-race vulnerabilities.",
    syntax: `fn main() {\n    let nodes = vec!["Rust", "Wasm", "Kernel"];\n    for item in &nodes {\n        println!("Verified borrow: {}", item);\n    }\n}`,
    related: ["cpp", "c", "go", "swift", "kotlin"],
    featured: false,
    coords: { x: -250, y: -150, z: 10 }
  },
  {
    id: "php",
    name: "PHP",
    mark: "PHP",
    year: 1995,
    category: "Web",
    paradigm: "Imperative, Object-Oriented, Functional",
    typing: "Dynamic with Strict Typed Declarations (PHP 8+)",
    execution: "Zend Engine Bytecode + JIT Compilation",
    uses: ["Server-Side Web Publishing", "E-Commerce Platforms", "Content Management Systems", "RESTful Web Backends"],
    creator: "Rasmus Lerdorf",
    description: "Powers a vast majority of server-rendered web properties worldwide, evolved in PHP 8+ with JIT compilation, union types, and artisan frameworks.",
    ecosystem: ["Laravel", "Symfony", "Composer", "WordPress", "Octane"],
    learningConsiderations: "Frictionless deployment model and mature full-stack batteries-included frameworks like Laravel.",
    syntax: `<?php\ndeclare(strict_types=1);\n$sector = "Web Architecture";\necho "Atlas Sector: {$sector}\\n";`,
    related: ["javascript", "sql", "ruby", "python"],
    featured: false,
    coords: { x: 240, y: -140, z: -60 }
  },
  {
    id: "ruby",
    name: "Ruby",
    mark: "RB",
    year: 1995,
    category: "Web",
    paradigm: "Pure Object-Oriented, Functional, Reflective",
    typing: "Dynamic, Strong, Duck Typing",
    execution: "YARV Bytecode VM with YJIT Compiler",
    uses: ["Rapid Web Application Engineering", "Developer DSLs", "SaaS Product Backends", "DevOps Automation"],
    creator: "Yukihiro 'Matz' Matsumoto",
    description: "Optimized explicitly for programmer happiness and expressive elegance, pioneering modern convention-over-configuration web development.",
    ecosystem: ["Ruby on Rails", "Bundler", "RSpec", "Sidekiq", "Homebrew"],
    learningConsiderations: "Everything is an object; showcases how human-centric syntax and metaprogramming accelerate product iteration.",
    syntax: `["Ruby", "Rails", "YJIT"].each_with_index do |gem, idx|\n  puts "#{idx + 1}. #{gem.upcase} ready"\nend`,
    related: ["python", "javascript", "php", "swift"],
    featured: false,
    coords: { x: 160, y: -210, z: -20 }
  },
  {
    id: "kotlin",
    name: "Kotlin",
    mark: "KT",
    year: 2011,
    category: "Mobile",
    paradigm: "Object-Oriented, Functional, Concurrent (Coroutines)",
    typing: "Static, Strong, Null-Safe Inference",
    execution: "JVM Bytecode, Kotlin/Native LLVM & JS/Wasm Targets",
    uses: ["Android Flagship Applications", "Kotlin Multiplatform (KMP)", "Spring & Ktor Microservices", "Declarative Compose UIs"],
    creator: "JetBrains",
    description: "A concise, null-safe modern language interoperable with Java and engineered for Android, server-side coroutines, and cross-platform UI.",
    ecosystem: ["Jetpack Compose", "Kotlin Coroutines", "Ktor", "Kotlin Multiplatform", "Gradle DSL"],
    learningConsiderations: "Eliminates Java boilerplate while retaining 100% access to the JVM ecosystem and modern structured concurrency.",
    syntax: `fun main() {\n    val sdk: String? = "Kotlin Multiplatform"\n    println("Target verified: \${sdk?.uppercase()}")\n}`,
    related: ["java", "swift", "dart", "csharp", "typescript"],
    featured: false,
    coords: { x: 110, y: 210, z: 40 }
  },
  {
    id: "swift",
    name: "Swift",
    mark: "SW",
    year: 2014,
    category: "Mobile",
    paradigm: "Protocol-Oriented, Object-Oriented, Functional",
    typing: "Static, Strong, Value-Semantic Safe",
    execution: "Ahead-of-Time Compiled via LLVM (ARC Memory Management)",
    uses: ["iOS, macOS & visionOS Apps", "Spatial Computing Interfaces", "On-Device ML (CoreML)", "High-Performance Systems"],
    creator: "Chris Lattner & Apple Inc.",
    description: "Built on LLVM to combine expressive protocol-oriented ergonomics with native C-level performance and strict concurrency safety.",
    ecosystem: ["SwiftUI", "Swift Concurrency", "Xcode", "Vapor", "Metal Shaders"],
    learningConsiderations: "Pioneered protocol-oriented programming and value-type safety; essential for Apple ecosystem and spatial computing.",
    syntax: `struct Coordinate {\n    let sector: String\n    var active: Bool = true\n}\nlet node = Coordinate(sector: "visionOS")\nprint("Node: \\(node.sector)")`,
    related: ["kotlin", "rust", "cpp", "dart"],
    featured: false,
    coords: { x: 210, y: 160, z: -30 }
  },
  {
    id: "r",
    name: "R",
    mark: "R",
    year: 1993,
    category: "AI & Data",
    paradigm: "Array/Vectorized, Functional, Object-Oriented",
    typing: "Dynamic, Vector-Typed",
    execution: "Interpreted with Bytecode JIT & C/Fortran Kernels",
    uses: ["Bioinformatics & Genomics", "Econometrics & Quantitative Finance", "Academic Statistical Modeling", "Publication-Grade Data Viz"],
    creator: "Ross Ihaka & Robert Gentleman",
    description: "A specialized computing environment crafted by statisticians for vector mathematics, hypothesis testing, and grammar-of-graphics visualization.",
    ecosystem: ["Tidyverse (dplyr, ggplot2)", "Shiny", "Bioconductor", "Quarto", "RStudio / Positron"],
    learningConsiderations: "Unrivaled for statistical inference and expressive data plotting via ggplot2 and vectorized data frames.",
    syntax: `metrics <- c(98.4, 99.1, 97.8, 99.6)\ncat("Mean Precision:", mean(metrics), "%\\n")`,
    related: ["python", "sql", "c"],
    featured: false,
    coords: { x: 10, y: -230, z: 50 }
  },
  {
    id: "dart",
    name: "Dart",
    mark: "DT",
    year: 2011,
    category: "Mobile",
    paradigm: "Object-Oriented, Isolate-Concurrent, Functional",
    typing: "Static, Sound Null-Safe",
    execution: "JIT (Sub-second Hot Reload) & AOT Native Machine Code",
    uses: ["Multi-Platform Flutter Apps", "60/120fps Custom GPU UI", "Desktop & Embedded Dashboards", "Web Canvas Applications"],
    creator: "Lars Bak & Kasper Lund (Google)",
    description: "Uniquely capable of both instant JIT hot-reload during development and AOT native ARM/x64 compilation for pixel-perfect cross-platform UIs.",
    ecosystem: ["Flutter Engine (Impeller)", "Pub.dev", "Riverpod / Bloc", "Dart Frog", "Flame Engine"],
    learningConsiderations: "Familiar syntax for Java/TS developers, purpose-built to power declarative widget trees across 6 platforms from one codebase.",
    syntax: `void main() {\n  final targets = ['iOS', 'Android', 'Web', 'Desktop'];\n  print('Impeller GPU active on \${targets.length} targets');\n}`,
    related: ["kotlin", "swift", "typescript", "javascript"],
    featured: false,
    coords: { x: 260, y: 120, z: 60 }
  },
  {
    id: "sql",
    name: "SQL",
    mark: "SQL",
    year: 1974,
    category: "Data",
    paradigm: "Declarative, Set-Based, Relational Algebra",
    typing: "Static Schema-Enforced Column Types",
    execution: "Cost-Based Query Planner & Vectorized Execution Engine",
    uses: ["Relational Database Systems", "Analytical Data Warehouses", "OLTP Financial Ledgers", "Stream & Lakehouse Queries"],
    creator: "Donald D. Chamberlin & Raymond F. Boyce (IBM)",
    description: "The enduring declarative language of relational algebra, allowing engineers to specify what data transformations are needed while optimizers plan execution.",
    ecosystem: ["PostgreSQL", "DuckDB", "Snowflake / BigQuery", "SQLite", "dbt"],
    learningConsiderations: "Thinking in relational sets and window functions rather than imperative loops is a superpower across every software discipline.",
    syntax: `SELECT category, COUNT(*) AS language_count\nFROM code_atlas_nodes\nWHERE year >= 1970\nGROUP BY category\nORDER BY language_count DESC;`,
    related: ["python", "r", "php", "java", "csharp"],
    featured: false,
    coords: { x: -40, y: -110, z: -70 }
  }
];

/* 15 Historical Programming Timeline Milestones */
window.CODEATLAS_TIMELINE = [
  { year: 1957, language: "Fortran", langId: "c", context: "IBM introduces the first high-level optimizing compiler for scientific and numerical computation, proving machines could translate algebraic formulas into fast machine code." },
  { year: 1959, language: "COBOL", langId: "sql", context: "Grace Hopper's work inspires a portable business data processing language that standardized enterprise record structures across mainframe architectures." },
  { year: 1972, language: "C", langId: "c", context: "Dennis Ritchie creates C at Bell Labs to rewrite the UNIX kernel, establishing portable low-level systems engineering and curly-brace syntax." },
  { year: 1974, language: "SQL", langId: "sql", context: "Chamberlin and Boyce formalize Structured Query Language at IBM based on Edgar F. Codd's relational algebra model." },
  { year: 1985, language: "C++", langId: "cpp", context: "Bjarne Stroustrup releases C++ with classes, deterministic destructors, and zero-cost abstractions for large-scale simulation and systems software." },
  { year: 1991, language: "Python", langId: "python", context: "Guido van Rossum unveils Python, prioritizing human readability, significant whitespace, and extensible C interoperability." },
  { year: 1993, language: "R", langId: "r", context: "Ihaka and Gentleman introduce R as an open-source statistical laboratory with first-class vector operations and data visualization." },
  { year: 1995, language: "Java", langId: "java", context: "James Gosling and Sun Microsystems launch Java and the JVM, bringing managed memory, threads, and portable bytecode to the enterprise." },
  { year: 1995, language: "JavaScript", langId: "javascript", context: "Brendan Eich prototypes JavaScript in 10 days for Netscape Navigator, igniting programmable client-side interactivity across the World Wide Web." },
  { year: 2000, language: "C#", langId: "csharp", context: "Anders Hejlsberg architects C# and the Common Language Runtime (.NET), unifying component-oriented enterprise and game tooling." },
  { year: 2009, language: "Go", langId: "go", context: "Google engineers Pike, Thompson, and Griesemer release Go to solve multicore concurrency and massive cluster compilation speeds." },
  { year: 2010, language: "Rust", langId: "rust", context: "Mozilla incubates Rust, proving that affine ownership types and borrow checking can guarantee memory safety without garbage collection." },
  { year: 2011, language: "Kotlin / Dart", langId: "kotlin", context: "JetBrains announces Kotlin for null-safe JVM/Android development alongside Google's Dart for high-frame-rate multi-platform UI." },
  { year: 2012, language: "TypeScript", langId: "typescript", context: "Microsoft introduces TypeScript, bringing structural static typing and IDE intelligence to large-scale JavaScript applications." },
  { year: 2014, language: "Swift", langId: "swift", context: "Apple debuts Swift, built atop LLVM with protocol-oriented design and value semantics for modern mobile and spatial devices." }
];

/* 6 Curated Domain Learning Paths */
window.CODEATLAS_PATHS = [
  {
    id: "ai-ml",
    title: "AI / ML",
    subtitle: "Neural Architectures & Tensor Systems",
    badge: "AI & Data",
    primaryLang: "python",
    summary: "Master the mathematical foundations, vectorized data pipelines, and GPU tensor frameworks powering modern generative AI.",
    steps: [
      { step: "01", tech: "Python", purpose: "Core language syntax, type annotations, generators, and scientific environment orchestration." },
      { step: "02", tech: "NumPy", purpose: "N-dimensional contiguous C-array buffers, linear algebra broadcasting, and vectorized math." },
      { step: "03", tech: "Pandas", purpose: "Structured tabular data cleaning, time-series indexing, and feature engineering." },
      { step: "04", tech: "scikit-learn", purpose: "Classical machine learning algorithms, cross-validation, gradient boosting, and evaluation metrics." },
      { step: "05", tech: "PyTorch", purpose: "Dynamic computation graphs, CUDA automatic differentiation, and Transformer neural architectures." }
    ]
  },
  {
    id: "web-dev",
    title: "Web Development",
    subtitle: "Full-Stack Distributed Web Systems",
    badge: "Web",
    primaryLang: "typescript",
    summary: "Progress from browser DOM mechanics and asynchronous JavaScript to end-to-end type-safe cloud applications.",
    steps: [
      { step: "01", tech: "JavaScript (ES2026)", purpose: "Closures, asynchronous event loop, Fetch API, DOM trees, and Web APIs." },
      { step: "02", tech: "TypeScript", purpose: "Structural interfaces, generics, discriminated unions, and compile-time contract safety." },
      { step: "03", tech: "Modern UI Architecture", purpose: "Declarative state synchronization, component composition, and WebGL/Canvas rendering." },
      { step: "04", tech: "Node.js / Edge Runtimes", purpose: "Streaming HTTP servers, authentication middleware, caching, and serverless workers." },
      { step: "05", tech: "PostgreSQL & SQL", purpose: "Relational schema design, ACID transactions, indexing strategies, and query optimization." }
    ]
  },
  {
    id: "game-dev",
    title: "Game Development",
    subtitle: "Real-Time Rendering & Simulation Engines",
    badge: "Systems",
    primaryLang: "cpp",
    summary: "Build low-latency interactive worlds, custom shaders, physics simulations, and entity-component architectures.",
    steps: [
      { step: "01", tech: "C++ & Memory Layout", purpose: "Deterministic RAII, cache-friendly contiguous data structures, and SIMD math." },
      { step: "02", tech: "3D Linear Algebra", purpose: "Transformation matrices, quaternions, raycasting, and camera projection spaces." },
      { step: "03", tech: "C# & Unity / Unreal C++", purpose: "Entity-Component-System (ECS) patterns, scene graphs, and gameplay state machines." },
      { step: "04", tech: "GPU Shaders (HLSL/GLSL)", purpose: "Vertex & fragment pipelines, physically-based rendering (PBR), and post-processing." },
      { step: "05", tech: "Frame Telemetry & Netcode", purpose: "Sub-8ms frame budgeting, client-side prediction, and deterministic physics lockstep." }
    ]
  },
  {
    id: "mobile",
    title: "Mobile",
    subtitle: "Native & Cross-Platform Device Engineering",
    badge: "Mobile",
    primaryLang: "swift",
    summary: "Architect fluid 120Hz touch interfaces, reactive local persistence, and on-device hardware integrations.",
    steps: [
      { step: "01", tech: "Swift / Kotlin Foundations", purpose: "Null safety, value types vs. reference types, and protocol/interface composition." },
      { step: "02", tech: "SwiftUI & Jetpack Compose", purpose: "Declarative reactive UI trees, animations, and adaptive layout geometry." },
      { step: "03", tech: "Structured Concurrency", purpose: "Async/Await actors, background isolates, and main-thread frame preservation." },
      { step: "04", tech: "Dart & Flutter Engine", purpose: "Single-codebase multi-platform rendering via the Impeller GPU pipeline." },
      { step: "05", tech: "On-Device Persistence & CoreML", purpose: "Encrypted SQLite local stores, biometric security, and edge neural inference." }
    ]
  },
  {
    id: "systems",
    title: "Systems",
    subtitle: "Kernels, Compilers & Cloud Infrastructure",
    badge: "Systems",
    primaryLang: "rust",
    summary: "Command bare-metal execution, operating system syscalls, memory safety guarantees, and distributed consensus.",
    steps: [
      { step: "01", tech: "C & POSIX Architecture", purpose: "Virtual memory pages, pointers, file descriptors, and OS process scheduling." },
      { step: "02", tech: "Rust Ownership & Lifetimes", purpose: "Zero-cost memory safety, affine types, fearless concurrency, and trait generics." },
      { step: "03", tech: "Async I/O & Tokio", purpose: "Non-blocking epoll/kqueue event reactors and high-throughput network sockets." },
      { step: "04", tech: "Go Distributed Services", purpose: "Goroutines, gRPC protobuf protocols, Raft consensus, and container orchestration." },
      { step: "05", tech: "LLVM & WebAssembly", purpose: "Compiler intermediate representations, sandboxing, and portable native execution." }
    ]
  },
  {
    id: "data-science",
    title: "Data Science",
    subtitle: "Statistical Inference & Analytical Engineering",
    badge: "Data",
    primaryLang: "sql",
    summary: "Transform raw petabyte telemetry into verified statistical models, causal insights, and interactive visual intelligence.",
    steps: [
      { step: "01", tech: "Advanced SQL & DuckDB", purpose: "Window functions, common table expressions (CTEs), OLAP cubes, and columnar Parquet scans." },
      { step: "02", tech: "R & Statistical Modeling", purpose: "Hypothesis testing, Bayesian inference, Tidyverse pipelines, and ggplot2 cartography." },
      { step: "03", tech: "Python & Polars / Arrow", purpose: "Zero-copy in-memory data frames and high-speed ETL transformations." },
      { step: "04", tech: "Experimentation & Causal Inference", purpose: "A/B variance reduction, propensity scoring, and time-series forecasting." },
      { step: "05", tech: "Interactive Telemetry Dashboards", purpose: "Publishing reproducible Quarto notebooks and real-time spatial visualizations." }
    ]
  }
];

/* Interactive Quiz Questions Bank */
window.CODEATLAS_DEFAULT_QUIZ = [
  {
    id: "q1",
    question: "Which programming language introduced the concept of compile-time ownership and borrow checking to guarantee memory safety without a garbage collector?",
    options: ["Go", "Rust", "C++", "Swift"],
    correctIndex: 1,
    explanation: "Rust (2010) enforces strict ownership, borrowing, and lifetime rules at compile time via its borrow checker, preventing data races and dangling pointers without runtime garbage collection."
  },
  {
    id: "q2",
    question: "Created by Dennis Ritchie at Bell Labs in 1972, which language was designed to rewrite the UNIX operating system kernel?",
    options: ["Fortran", "C", "COBOL", "SQL"],
    correctIndex: 1,
    explanation: "C was developed by Dennis Ritchie in 1972 at Bell Labs to build portable systems software for UNIX, becoming the syntactic ancestor to C++, Java, C#, JavaScript, and Go."
  },
  {
    id: "q3",
    question: "What typing discipline best characterizes TypeScript's type system?",
    options: ["Dynamic Duck Typing", "Structural Static Typing", "Nominal Hardware Typing", "Untyped Assembly"],
    correctIndex: 1,
    explanation: "TypeScript uses a structural static type system where compatibility is determined by the shape and properties of types rather than explicit class inheritance hierarchies."
  },
  {
    id: "q4",
    question: "Why can Dart power both instant sub-second stateful hot reload during development and high-speed native startup in production?",
    options: [
      "It runs exclusively inside a Python interpreter",
      "It combines a JIT (Just-In-Time) VM for dev with an AOT (Ahead-Of-Time) native compiler for release",
      "It converts all code into SQL stored procedures",
      "It disables type checking in production"
    ],
    correctIndex: 1,
    explanation: "Dart uniquely pairs an incremental JIT compiler for instant developer iteration with an AOT machine-code compiler for ARM/x64 production releases."
  },
  {
    id: "q5",
    question: "Which language operates on declarative relational algebra sets rather than imperative step-by-step control flow loops?",
    options: ["SQL", "C#", "Ruby", "Kotlin"],
    correctIndex: 0,
    explanation: "SQL (Structured Query Language, 1974) is declarative: you describe the relational result set you want, and the database engine's cost-based query planner determines the physical execution path."
  }
];

/* ==========================================================================
   PRODUCTION & SERVER-CONNECTED PERSISTENCE MANAGER (CodeAtlasStore)
   Connects to /api/* backend powered by Supabase PostgreSQL, Auth & RBAC
   ========================================================================== */
window.CodeAtlasStore = {
  KEYS: {
    USER_SESSION: "codeatlas_user_session_v1",
    USER_PROFILE: "codeatlas_user_profile_v1",
    AUTH_TOKEN: "codeatlas_auth_token_v1",
    ADMIN_LANGS: "codeatlas_admin_langs_v1",
    ADMIN_QUIZ: "codeatlas_admin_quiz_v1",
    ADMIN_ACTIVITY: "codeatlas_admin_activity_v1",
    ADMIN_SETTINGS: "codeatlas_admin_settings_v1"
  },

  _initialized: false,
  _languagesCache: null,
  _quizCache: null,

  async init() {
    if (this._initialized) return;
    this._initialized = true;

    // Initialize local caches
    if (!localStorage.getItem(this.KEYS.USER_PROFILE)) {
      const seedProfile = {
        exploredIds: ["python", "rust", "typescript", "c"],
        quizAttempts: 1,
        bestScore: "5 / 5 (100%)",
        lastActivity: "Explored Python in Spatial Atlas",
        selectedPath: "AI / ML (Python → PyTorch)"
      };
      localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(seedProfile));
    }

    // Attempt background sync with /api
    this.syncWithBackend().catch(() => {});
  },

  getToken() {
    return localStorage.getItem(this.KEYS.AUTH_TOKEN) || null;
  },

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  },

  async syncWithBackend() {
    try {
      // Check auth status
      const token = this.getToken();
      if (token) {
        const meRes = await fetch("/api/auth/me", { headers: this.getAuthHeaders() });
        if (meRes.ok) {
          const { user, profile } = await meRes.json();
          if (user) {
            const session = {
              id: user.id,
              email: user.email,
              role: user.role === "admin" ? "Administrator" : "Explorer",
              rawRole: user.role,
              fullName: user.fullName || user.email.split("@")[0]
            };
            localStorage.setItem(this.KEYS.USER_SESSION, JSON.stringify(session));
            if (profile) {
              localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify({
                exploredIds: profile.explored_ids || ["python"],
                quizAttempts: profile.quiz_attempts || 0,
                bestScore: profile.best_score || "—",
                lastActivity: profile.last_activity || "Active",
                selectedPath: profile.selected_path || "AI / ML"
              }));
            }
          }
        } else if (meRes.status === 401) {
          // Token expired
          localStorage.removeItem(this.KEYS.AUTH_TOKEN);
          localStorage.removeItem(this.KEYS.USER_SESSION);
        }
      }

      // Fetch languages from backend
      const langRes = await fetch("/api/languages");
      if (langRes.ok) {
        const data = await langRes.json();
        if (data.languages && data.languages.length > 0) {
          this._languagesCache = data.languages;
          localStorage.setItem(this.KEYS.ADMIN_LANGS, JSON.stringify(data.languages));
        }
      }

      // Fetch quiz questions
      const quizRes = await fetch("/api/quiz");
      if (quizRes.ok) {
        const qData = await quizRes.json();
        if (qData.questions && qData.questions.length > 0) {
          this._quizCache = qData.questions;
          localStorage.setItem(this.KEYS.ADMIN_QUIZ, JSON.stringify(qData.questions));
        }
      }
    } catch (e) {
      console.warn("[CodeAtlasStore] Offline / local mode active:", e.message);
    }
  },

  /* Languages Accessor */
  getLanguages() {
    if (this._languagesCache) return this._languagesCache;
    try {
      const custom = localStorage.getItem(this.KEYS.ADMIN_LANGS);
      if (custom) {
        this._languagesCache = JSON.parse(custom);
        return this._languagesCache;
      }
    } catch (e) {}
    return [...window.CODEATLAS_DEFAULT_LANGUAGES];
  },

  async fetchLanguages(category, search) {
    try {
      const url = new URL("/api/languages", window.location.origin);
      if (category && category !== "All") url.searchParams.set("category", category);
      if (search) url.searchParams.set("search", search);
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        this._languagesCache = data.languages;
        localStorage.setItem(this.KEYS.ADMIN_LANGS, JSON.stringify(data.languages));
        return data.languages;
      }
    } catch (e) {}
    return this.getLanguages();
  },

  async getLanguageById(id) {
    if (!id) return null;
    const norm = String(id).toLowerCase().trim();
    // Check cache first
    const cached = this.getLanguages().find(l => l.id.toLowerCase() === norm || l.name.toLowerCase() === norm);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/languages/${encodeURIComponent(norm)}`);
      if (res.ok) {
        const data = await res.json();
        return data.language;
      }
    } catch (e) {}
    return null;
  },

  async createLanguage(langData) {
    const res = await fetch("/api/languages", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(langData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create language");
    }
    const data = await res.json();
    await this.fetchLanguages();
    return data.language;
  },

  async updateLanguage(id, updates) {
    const res = await fetch(`/api/languages/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update language");
    }
    const data = await res.json();
    await this.fetchLanguages();
    return data.language;
  },

  async deleteLanguage(id) {
    const res = await fetch(`/api/languages/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete language");
    }
    await this.fetchLanguages();
    return true;
  },

  /* Quiz Accessor */
  getQuizQuestions() {
    if (this._quizCache) return this._quizCache;
    try {
      const custom = localStorage.getItem(this.KEYS.ADMIN_QUIZ);
      if (custom) {
        this._quizCache = JSON.parse(custom);
        return this._quizCache;
      }
    } catch (e) {}
    return [...window.CODEATLAS_DEFAULT_QUIZ];
  },

  async fetchQuizQuestions() {
    try {
      const res = await fetch("/api/quiz");
      if (res.ok) {
        const data = await res.json();
        this._quizCache = data.questions;
        localStorage.setItem(this.KEYS.ADMIN_QUIZ, JSON.stringify(data.questions));
        return data.questions;
      }
    } catch (e) {}
    return this.getQuizQuestions();
  },

  async createQuizQuestion(questionData) {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(questionData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add quiz question");
    }
    const data = await res.json();
    await this.fetchQuizQuestions();
    return data.question;
  },

  async deleteQuizQuestion(id) {
    const res = await fetch(`/api/quiz/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete quiz question");
    }
    await this.fetchQuizQuestions();
    return true;
  },

  /* Session & Real Auth Integration */
  getSession() {
    try {
      const raw = localStorage.getItem(this.KEYS.USER_SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  isAdmin() {
    const s = this.getSession();
    return s && (s.rawRole === "admin" || s.role === "Administrator" || (s.email && s.email.toLowerCase().includes("admin")));
  },

  async login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Authentication failed. Please verify credentials.");
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem(this.KEYS.AUTH_TOKEN, data.token);
    }
    const session = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role === "admin" ? "Administrator" : "Explorer",
      rawRole: data.user.role,
      fullName: data.user.fullName || data.user.email.split("@")[0]
    };
    localStorage.setItem(this.KEYS.USER_SESSION, JSON.stringify(session));

    if (data.profile) {
      localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify({
        exploredIds: data.profile.explored_ids || ["python"],
        quizAttempts: data.profile.quiz_attempts || 0,
        bestScore: data.profile.best_score || "—",
        lastActivity: data.profile.last_activity || "Just signed in",
        selectedPath: data.profile.selected_path || "AI / ML"
      }));
    }

    return session;
  },

  async register({ email, password, fullName, phone }) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password, fullName, phone })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Registration failed. Please try again.");
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem(this.KEYS.AUTH_TOKEN, data.token);
    }
    const session = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role === "admin" ? "Administrator" : "Explorer",
      rawRole: data.user.role,
      fullName: data.user.fullName || data.user.email.split("@")[0]
    };
    localStorage.setItem(this.KEYS.USER_SESSION, JSON.stringify(session));
    return session;
  },

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", headers: this.getAuthHeaders() });
    } catch (e) {}
    localStorage.removeItem(this.KEYS.AUTH_TOKEN);
    localStorage.removeItem(this.KEYS.USER_SESSION);
  },

  async resetPassword(email) {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to dispatch password recovery.");
    }
    return await res.json();
  },

  /* User Profile Telemetry & Sync */
  getProfileData() {
    try {
      const raw = localStorage.getItem(this.KEYS.USER_PROFILE);
      return raw ? JSON.parse(raw) : { exploredIds: ["python"], quizAttempts: 0, bestScore: "—", lastActivity: "Just joined", selectedPath: "AI / ML" };
    } catch (e) {
      return { exploredIds: ["python"], quizAttempts: 0, bestScore: "—", lastActivity: "Just joined", selectedPath: "AI / ML" };
    }
  },

  async recordLanguageExplored(langId, langName) {
    const profile = this.getProfileData();
    if (!profile.exploredIds.includes(langId)) {
      profile.exploredIds.push(langId);
    }
    profile.lastActivity = `Explored ${langName}`;
    localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));

    try {
      await fetch("/api/profile/explore", {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ langId, langName })
      });
    } catch (e) {}
  },

  async recordLearningPath(pathTitle) {
    const profile = this.getProfileData();
    profile.selectedPath = pathTitle;
    profile.lastActivity = `Selected ${pathTitle} Path`;
    localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));

    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ selected_path: pathTitle, last_activity: profile.lastActivity })
      });
    } catch (e) {}
  },

  async recordQuizAttempt(score, total) {
    const profile = this.getProfileData();
    profile.quizAttempts = (profile.quizAttempts || 0) + 1;
    profile.bestScore = `${score} / ${total} (${Math.round((score / total) * 100)}%)`;
    profile.lastActivity = `Completed Quiz (${score}/${total})`;
    localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));

    try {
      await fetch("/api/profile/quiz-result", {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ score, total })
      });
    } catch (e) {}
  },

  /* Activity Stream */
  getActivities() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.ADMIN_ACTIVITY)) || [];
    } catch (e) {
      return [];
    }
  },

  async fetchActivities() {
    try {
      const res = await fetch("/api/activity", { headers: this.getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.activities;
      }
    } catch (e) {}
    return this.getActivities();
  },

  async logActivity(user, action, type = "System") {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userEmail: user, action, type })
      });
    } catch (e) {}
  },

  /* Admin Dashboard Telemetry */
  async fetchAdminStats() {
    const res = await fetch("/api/admin/stats", { headers: this.getAuthHeaders() });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to load admin statistics");
    }
    return await res.json();
  },

  async fetchAdminUsers() {
    const res = await fetch("/api/admin/users", { headers: this.getAuthHeaders() });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to load user directory");
    }
    const data = await res.json();
    return data.users;
  },

  async updateUserRole(userId, role) {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update role");
    }
    return await res.json();
  },

  async deleteUser(userId) {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete user");
    }
    return true;
  },

  /* Settings */
  getSettings() {
    try {
      const s = localStorage.getItem(this.KEYS.ADMIN_SETTINGS);
      return s ? JSON.parse(s) : { siteTitle: "CodeAtlas — Interactive Programming Language Universe" };
    } catch (e) {
      return { siteTitle: "CodeAtlas" };
    }
  },

  async saveSettings(settings) {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(this.KEYS.ADMIN_SETTINGS, JSON.stringify(data.settings));
        return data.settings;
      }
    } catch (e) {}
    localStorage.setItem(this.KEYS.ADMIN_SETTINGS, JSON.stringify(settings));
    return settings;
  },

  async resetDefaultDataset() {
    const res = await fetch("/api/admin/reset-dataset", {
      method: "POST",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to reset dataset");
    }
    this._languagesCache = null;
    this._quizCache = null;
    localStorage.removeItem(this.KEYS.ADMIN_LANGS);
    localStorage.removeItem(this.KEYS.ADMIN_QUIZ);
    await this.fetchLanguages();
    await this.fetchQuizQuestions();
    return true;
  },

  async resetDemoState() {
    return await this.resetDefaultDataset();
  }
};

window.CodeAtlasStore.init();

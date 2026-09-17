import { createClient } from '@supabase/supabase-js';

// Centralized Database & Supabase Integration Module
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseClient = null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseClient;
}

// In-Memory Database Store (Initialized with real seed data matching supabase-schema.sql)
// Used when Supabase credentials have not yet been provided in environment settings.
const initialLanguages = [
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
    learning_considerations: "Unmatched for understanding raw memory pointers, stack vs. heap allocation, and hardware-level execution without abstraction overhead.",
    syntax: `#include <stdio.h>\n\nint main(void) {\n    const char *node = "CodeAtlas::C";\n    printf("Telemetry online: %s\\n", node);\n    return 0;\n}`,
    related: ["cpp", "rust", "go", "csharp", "java"],
    featured: true,
    coords: { x: -180, y: -60, z: 40 },
    created_at: new Date().toISOString()
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
    learning_considerations: "Steep mastery curve with deep rewards; essential for graphics programming, game engines, and latency-critical computing.",
    syntax: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> epochs = {1972, 1985, 2026};\n    for (auto yr : epochs) std::cout << yr << " ";\n}`,
    related: ["c", "rust", "csharp", "java"],
    featured: true,
    coords: { x: -240, y: 50, z: -20 },
    created_at: new Date().toISOString()
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
    learning_considerations: "Offers an ergonomic balance of strong static typing, LINQ functional queries, and world-class tooling.",
    syntax: `using System;\nusing System.Linq;\n\nvar langs = new[] { "C#", "F#", "TypeScript" };\nConsole.WriteLine($"Active nodes: {langs.Count()}");`,
    related: ["java", "cpp", "typescript", "kotlin"],
    featured: false,
    coords: { x: 100, y: -120, z: 60 },
    created_at: new Date().toISOString()
  },
  {
    id: "java",
    name: "Java",
    mark: "Java",
    year: 1995,
    category: "Enterprise",
    paradigm: "Object-Oriented, Class-Based, Concurrent",
    typing: "Static, Strong, Safe",
    execution: "JVM Bytecode JIT + GraalVM AOT",
    uses: ["Global Banking Systems", "Big Data (Hadoop/Spark)", "Enterprise Backends", "Android Platform Core"],
    creator: "James Gosling (Sun Microsystems)",
    description: "Architected around 'Write Once, Run Anywhere', Java serves as the bedrock for global enterprise infrastructure, massive distributed systems, and JVM runtimes.",
    ecosystem: ["Spring Boot", "Maven / Gradle", "Hibernate", "Apache Kafka", "GraalVM"],
    learning_considerations: "Disciplined design patterns, garbage-collection tuning, and thread concurrency architectures with industry-standard stability.",
    syntax: `import java.util.List;\n\npublic class CodeAtlas {\n    public static void main(String[] args) {\n        var nodes = List.of("Java", "Kotlin", "Scala");\n        nodes.forEach(System.out::println);\n    }\n}`,
    related: ["csharp", "kotlin", "c", "cpp"],
    featured: false,
    coords: { x: 70, y: -60, z: 90 },
    created_at: new Date().toISOString()
  },
  {
    id: "python",
    name: "Python",
    mark: "Py",
    year: 1991,
    category: "AI & Data",
    paradigm: "Multi-paradigm: Object-Oriented, Imperative, Functional",
    typing: "Dynamic, Strong",
    execution: "Interpreted Bytecode (CPython) & JIT (PyPy)",
    uses: ["Artificial Intelligence & LLMs", "Data Science & Analytics", "Scientific Research", "Rapid Backend APIs"],
    creator: "Guido van Rossum",
    description: "Emphasizes readability through elegant syntax and whitespace discipline; the undisputed lingua franca for modern artificial intelligence, neural architectures, and scientific computing.",
    ecosystem: ["PyTorch", "TensorFlow", "NumPy / Pandas", "FastAPI / Django", "Hugging Face"],
    learning_considerations: "Fastest ramp from idea to working software; high-level abstractions encourage focus on domain logic before performance optimization.",
    syntax: `def telemetry_stream(nodes: list[str]) -> dict:\n    return {node: len(node) for node in nodes}\n\nprint(telemetry_stream(["Python", "Rust", "TypeScript"]))`,
    related: ["javascript", "r", "ruby", "c"],
    featured: true,
    coords: { x: -70, y: 140, z: 120 },
    created_at: new Date().toISOString()
  },
  {
    id: "javascript",
    name: "JavaScript",
    mark: "JS",
    year: 1995,
    category: "Web",
    paradigm: "Multi-paradigm: Event-Driven, Functional, Prototype-Based",
    typing: "Dynamic, Weak",
    execution: "V8 / SpiderMonkey JIT Compilation",
    uses: ["Interactive Browser Web Apps", "Full-Stack Node.js Backends", "Hybrid Mobile (React Native)", "Edge Runtime Functions"],
    creator: "Brendan Eich (Netscape)",
    description: "The foundational programmable execution engine of the World Wide Web; runs ubiquitously on billions of browser clients, servers, and edge runtimes.",
    ecosystem: ["React / Next.js", "Node.js / Express", "Vue / Nuxt", "npm Registry", "Vite"],
    learning_considerations: "Asynchronous event loop, closures, and prototypical inheritance; indispensable for universal web software engineering.",
    syntax: `const nodes = ["HTML", "CSS", "JavaScript"];\nconst render = (items) => items.map(i => \`[\${i.toUpperCase()}]\`).join(" -> ");\nconsole.log(render(nodes));`,
    related: ["typescript", "python", "php"],
    featured: true,
    coords: { x: 130, y: 90, z: -70 },
    created_at: new Date().toISOString()
  },
  {
    id: "typescript",
    name: "TypeScript",
    mark: "TS",
    year: 2012,
    category: "Web",
    paradigm: "Typed Superset of JavaScript: Object-Oriented, Functional",
    typing: "Static, Gradual, Structural (Duck-Typed)",
    execution: "Transpiled to ECMAScript Native",
    uses: ["Enterprise Full-Stack Platforms", "Scalable Design Systems", "High-Reliability Web APIs", "Developer Tooling"],
    creator: "Anders Hejlsberg (Microsoft)",
    description: "Supercharges JavaScript with compile-time structural type systems, advanced generics, and intelligent editor telemetry, turning web development into an enterprise-grade discipline.",
    ecosystem: ["React / Next.js", "Angular", "NestJS", "tsc Compiler", "tRPC / Zod"],
    learning_considerations: "Exceptional balance of dynamic flexibility and compile-time safety; standard for modern web and application development.",
    syntax: `interface LangNode {\n  id: string;\n  year: number;\n  active: boolean;\n}\n\nconst ts: LangNode = { id: "typescript", year: 2012, active: true };\nconsole.log(ts);`,
    related: ["javascript", "csharp", "kotlin"],
    featured: true,
    coords: { x: 180, y: 130, z: -20 },
    created_at: new Date().toISOString()
  },
  {
    id: "rust",
    name: "Rust",
    mark: "Rs",
    year: 2015,
    category: "Systems",
    paradigm: "Multi-paradigm: Systems, Functional, Imperative, Concurrent",
    typing: "Static, Strong, Affine (Linear Memory)",
    execution: "Ahead-of-Time LLVM Compiled Native Machine Code",
    uses: ["Memory-Safe OS Kernels", "WebAssembly High-Perf Modules", "Cloud Infrastructure (Tokio)", "Cryptographic Engineering"],
    creator: "Graydon Hoare (Mozilla Research)",
    description: "Combines bare-metal C++ performance with compile-time guaranteed memory safety and data-race prevention via its groundbreaking borrow checker and ownership model.",
    ecosystem: ["Cargo & Crates.io", "Tokio Async Engine", "WebAssembly (wasm-pack)", "Actix Web", "Tauri"],
    learning_considerations: "Steep learning curve around lifetimes and borrow rules, rewarded with deterministic zero-overhead reliability without a garbage collector.",
    syntax: `fn main() {\n    let nodes = vec!["Rust", "C", "Go"];\n    for node in &nodes {\n        println!("Memory-safe telemetry: {}", node);\n    }\n}`,
    related: ["c", "cpp", "go", "swift"],
    featured: true,
    coords: { x: -210, y: -110, z: -90 },
    created_at: new Date().toISOString()
  },
  {
    id: "go",
    name: "Go",
    mark: "Go",
    year: 2009,
    category: "Cloud & Systems",
    paradigm: "Concurrent, Imperative, Procedural",
    typing: "Static, Strong, Structural",
    execution: "Ahead-of-Time Compiled Native Machine Code",
    uses: ["Cloud Native Infrastructure (Kubernetes/Docker)", "Microservices Architecture", "Network Proxies & Load Balancers", "High-Throughput APIs"],
    creator: "Robert Griesemer, Rob Pike, Ken Thompson (Google)",
    description: "Engineered for simplicity and scale; features ultra-fast compile times, built-in concurrency primitives (goroutines and channels), and seamless production deployments.",
    ecosystem: ["Kubernetes", "Docker", "gRPC", "Gin / Echo", "Go Modules"],
    learning_considerations: "Intentionally minimal feature set enables developers to master the syntax in days and reason about large concurrent systems easily.",
    syntax: `package main\n\nimport "fmt"\n\nfunc main() {\n    messages := make(chan string)\n    go func() { messages <- "Go concurrency online" }()\n    fmt.Println(<-messages)\n}`,
    related: ["c", "rust", "python"],
    featured: true,
    coords: { x: -90, y: -140, z: -30 },
    created_at: new Date().toISOString()
  },
  {
    id: "kotlin",
    name: "Kotlin",
    mark: "Kt",
    year: 2011,
    category: "Mobile",
    paradigm: "Multi-paradigm: Object-Oriented, Functional, Pragmatic",
    typing: "Static, Strong, Safe (Null-Safe)",
    execution: "JVM Bytecode, JavaScript Transpiled, Native AOT",
    uses: ["Modern Android Development (Jetpack Compose)", "Cross-Platform Mobile (KMP)", "Spring Boot Enterprise APIs", "Desktop Architecture"],
    creator: "JetBrains",
    description: "A concise, pragmatic, and 100% Java-interoperable language chosen by Google as the premier language for Android app development.",
    ecosystem: ["Jetpack Compose", "Android SDK", "Kotlin Multiplatform (KMP)", "Coroutines", "Ktor"],
    learning_considerations: "Eliminates NullPointerExceptions with first-class nullable types; provides seamless migration path from legacy Java codebases.",
    syntax: `fun main() {\n    val languages = listOf("Kotlin", "Java", "Swift")\n    languages.forEach { println("Verified: $it") }\n}`,
    related: ["java", "swift", "typescript", "csharp"],
    featured: false,
    coords: { x: 120, y: -30, z: 140 },
    created_at: new Date().toISOString()
  },
  {
    id: "swift",
    name: "Swift",
    mark: "Sw",
    year: 2014,
    category: "Mobile",
    paradigm: "Multi-paradigm: Protocol-Oriented, Functional, Object-Oriented",
    typing: "Static, Strong, Inferred",
    execution: "LLVM Ahead-of-Time Compiled Native",
    uses: ["Apple Ecosystem Apps (iOS, macOS, watchOS, visionOS)", "Declarative UI (SwiftUI)", "High-Performance Client Software", "Embedded Systems"],
    creator: "Chris Lattner & Apple",
    description: "Apple flagship language designed to replace Objective-C; merges safety, speed, and expressive modern ergonomics with declarative UI frameworks.",
    ecosystem: ["SwiftUI", "Combine", "Xcode", "Apple SDKs", "Swift Package Manager"],
    learning_considerations: "Protocols as first-class architectural blueprints, value types (structs) preferred over reference types, and memory management through ARC.",
    syntax: `import Foundation\n\nlet devices = ["iPhone", "MacBook", "Vision Pro"]\nfor device in devices {\n    print("Telemetry active on \\(device)")\n}`,
    related: ["kotlin", "rust", "cpp"],
    featured: false,
    coords: { x: 160, y: 20, z: 110 },
    created_at: new Date().toISOString()
  },
  {
    id: "ruby",
    name: "Ruby",
    mark: "Rb",
    year: 1995,
    category: "Web",
    paradigm: "Object-Oriented, Dynamic, Reflective",
    typing: "Dynamic, Strong",
    execution: "Interpreted (YARV Bytecode VM)",
    uses: ["Rapid Web Application Startups (Rails)", "Prototyping & MVPs", "Automation Scripting", "DevOps Tooling (Homebrew)"],
    creator: "Yukihiro Matsumoto (Matz)",
    description: "Designed for developer happiness and human ergonomics; popularized convention-over-configuration web development via Ruby on Rails.",
    ecosystem: ["Ruby on Rails", "Bundler & RubyGems", "RSpec", "Sidekiq", "Sinatra"],
    learning_considerations: "Pure object-oriented architecture where everything is an object; meta-programming flexibility accelerates prototype delivery.",
    syntax: `langs = ["Ruby", "Python", "JavaScript"]\nlangs.each { |name| puts "Developer happiness in #{name}" }`,
    related: ["python", "javascript", "php"],
    featured: false,
    coords: { x: -40, y: 90, z: -110 },
    created_at: new Date().toISOString()
  },
  {
    id: "php",
    name: "PHP",
    mark: "PHP",
    year: 1995,
    category: "Web",
    paradigm: "Imperative, Object-Oriented, Procedural",
    typing: "Dynamic, Weak to Progressive Strong Typing",
    execution: "Zend Engine Bytecode + OPcache JIT",
    uses: ["Content Management Platforms (WordPress, Drupal)", "Modern Web Backends (Laravel)", "E-Commerce Engines", "RESTful APIs"],
    creator: "Rasmus Lerdorf",
    description: "The resilient backbone of the content web powering roughly 75% of server-rendered websites worldwide, modernized with PHP 8+ and Laravel.",
    ecosystem: ["Laravel", "Composer", "WordPress Ecosystem", "Symfony", "PHPStan"],
    learning_considerations: "Extremely fast deploy cycles and vast hosting availability; modern PHP 8 incorporates strict typing, attributes, and JIT compilation.",
    syntax: `<?php\n$frameworks = ["Laravel", "Symfony", "Livewire"];\nforeach ($frameworks as $fw) {\n    echo "Serving modern web: $fw\\n";\n}`,
    related: ["javascript", "python", "ruby"],
    featured: false,
    coords: { x: 50, y: 60, z: -140 },
    created_at: new Date().toISOString()
  },
  {
    id: "haskell",
    name: "Haskell",
    mark: "Hs",
    year: 1990,
    category: "Functional",
    paradigm: "Pure Functional, Lazy Evaluation, Declarative",
    typing: "Static, Strong, Inferred (Hindley-Milner)",
    execution: "GHC Native Machine Code Compilation",
    uses: ["Financial Modeling & Quantitative Risk", "Compiler Design & Verification", "Cryptographic Protocol Proofs", "High-Assurance Systems"],
    creator: "Committee (Peyton Jones, Hughes, Wadler, et al.)",
    description: "The definitive pure functional language; enforces immutability, mathematical purity, monads for side effects, and non-strict lazy evaluation.",
    ecosystem: ["GHC (Glasgow Haskell Compiler)", "Cabal / Stack", "Hackage", "QuickCheck", "Lens"],
    learning_considerations: "Deep conceptual leap requiring developers to think in pure mathematical transformations and category theory rather than state mutations.",
    syntax: `quicksort :: (Ord a) => [a] -> [a]\nquicksort [] = []\nquicksort (x:xs) = quicksort [a | a <- xs, a <= x] ++ [x] ++ quicksort [a | a <- xs, a > x]`,
    related: ["clojure", "rust", "python"],
    featured: false,
    coords: { x: -150, y: -30, z: 150 },
    created_at: new Date().toISOString()
  },
  {
    id: "r",
    name: "R",
    mark: "R",
    year: 1993,
    category: "AI & Data",
    paradigm: "Array, Functional, Multi-paradigm",
    typing: "Dynamic, Vector-Oriented",
    execution: "Interpreted Array Engine",
    uses: ["Statistical Modeling & Biostatistics", "Data Visualization & Publishing", "Econometrics & Academic Research", "Genomics"],
    creator: "Ross Ihaka & Robert Gentleman",
    description: "Tailor-engineered for data analysis and graphics; unmatched depth in statistical hypothesis testing and publication-ready charting.",
    ecosystem: ["CRAN Registry", "ggplot2", "Tidyverse", "RStudio / Posit", "Shiny"],
    learning_considerations: "Vectorized arithmetic by default; essential for data researchers, biomedical scientists, and quantitative statisticians.",
    syntax: `epochs <- c(1972, 1995, 2012, 2026)\nmean_epoch <- mean(epochs)\ncat("Central epoch coordinate:", mean_epoch, "\\n")`,
    related: ["python", "c"],
    featured: false,
    coords: { x: -90, y: 180, z: 50 },
    created_at: new Date().toISOString()
  },
  {
    id: "clojure",
    name: "Clojure",
    mark: "Clj",
    year: 2007,
    category: "Functional",
    paradigm: "Functional Lisp, Concurrent, Hosted",
    typing: "Dynamic, Strong",
    execution: "JVM Bytecode & JavaScript (ClojureScript)",
    uses: ["Complex Event Processing", "Financial Transaction Engines", "Distributed Systems", "Full-Stack Dataflow Apps"],
    creator: "Rich Hickey",
    description: "A modern, dynamic Lisp hosted on the JVM; centers on persistent immutable data structures and explicit concurrency management.",
    ecosystem: ["Leiningen / Clojure CLI", "ClojureScript", "Ring / Compojure", "core.async", "Datomic"],
    learning_considerations: "Code-as-data (homoiconicity) with powerful macros; simplifies concurrent programming by separating identity from state.",
    syntax: `(defn telemetry-pulse [node]\n  (str "CodeAtlas node acknowledged: " node))\n\n(println (telemetry-pulse "Clojure"))`,
    related: ["haskell", "java", "python"],
    featured: false,
    coords: { x: -30, y: -80, z: 160 },
    created_at: new Date().toISOString()
  }
];

const initialQuiz = [
  {
    id: "q1",
    question: "Which programming language pioneer is credited with designing C at Bell Labs in 1972?",
    options: ["Dennis Ritchie", "Bjarne Stroustrup", "Ken Thompson", "Alan Kay"],
    correct_index: 0,
    explanation: "Dennis Ritchie created C at Bell Telephone Laboratories between 1969 and 1973 to rewrite the UNIX operating system.",
    created_at: new Date().toISOString()
  },
  {
    id: "q2",
    question: "Which compile-time memory model distinguishes Rust from languages like C++ and Java?",
    options: ["Affine ownership & borrow checker", "Stop-the-world tracing garbage collection", "Manual free() pointer allocation", "Automatic reference counting with runtime cycles"],
    correct_index: 0,
    explanation: "Rust enforces single-ownership semantics, lifetimes, and borrow checking at compile-time to guarantee memory safety without a garbage collector.",
    created_at: new Date().toISOString()
  },
  {
    id: "q3",
    question: "Which paradigm characterizes Haskell's core design philosophy?",
    options: ["Pure functional programming with non-strict lazy evaluation", "Prototype-based object orientation", "Procedural unstructured machine routines", "Component-oriented imperative scripting"],
    correct_index: 0,
    explanation: "Haskell is mathematically pure and lazily evaluated; functions cannot produce side effects without explicitly utilizing monadic types.",
    created_at: new Date().toISOString()
  },
  {
    id: "q4",
    question: "What is the primary execution strategy used by the modern Java Virtual Machine (JVM)?",
    options: ["JIT compilation from bytecode to native machine code with Tiered Profiling", "Direct AST line-by-line interpretation only", "Pure Ahead-of-Time C transpilation without bytecode", "Uncached runtime string evaluation"],
    correct_index: 0,
    explanation: "The HotSpot JVM interprets bytecode initially, profiles hot code paths, and JIT-compiles them to optimized machine code using the C1 and C2 compilers.",
    created_at: new Date().toISOString()
  },
  {
    id: "q5",
    question: "Anders Hejlsberg was the principal architect behind which pair of modern languages?",
    options: ["C# and TypeScript", "Java and Kotlin", "Python and Go", "Swift and Rust"],
    correct_index: 0,
    explanation: "Anders Hejlsberg led the design of Turbo Pascal and Delphi before architecting C# at Microsoft and subsequently co-designing TypeScript.",
    created_at: new Date().toISOString()
  }
];

const initialTimeline = [
  { id: "tm-1957", year: 1957, lang_id: "fortran", lang_name: "Fortran", event_title: "High-Level Mathematical Computation", era: "Pioneering Era (1950–1979)", description: "John Backus and IBM release the first commercial high-level compiled language, reducing human machine code translation by 90%.", significance: "Invented compiler optimization theory and demonstrated high-level code could match assembly performance." },
  { id: "tm-1958", year: 1958, lang_id: "lisp", lang_name: "Lisp", event_title: "Symbolic & Functional Foundations", era: "Pioneering Era (1950–1979)", description: "John McCarthy conceives Lisp at MIT, pioneering dynamic typing, recursion, garbage collection, and code-as-data tree homoiconicity.", significance: "Founded functional programming and artificial intelligence symbolic research." },
  { id: "tm-1959", year: 1959, lang_id: "cobol", lang_name: "COBOL", event_title: "Business Data Processing Standard", era: "Pioneering Era (1950–1979)", description: "Grace Hopper and the CODASYL committee engineer an English-like syntax for financial transactions and corporate ledger databases.", significance: "Still processes trillions in daily ATM and banking mainframe transactions globally." },
  { id: "tm-1970", year: 1970, lang_id: "pascal", lang_name: "Pascal", event_title: "Structured Programming Discipline", era: "Pioneering Era (1950–1979)", description: "Niklaus Wirth publishes Pascal to teach disciplined structured programming and strong static type enforcement.", significance: "Direct ancestor of Turbo Pascal, Delphi, and influenced Java and Ada." },
  { id: "tm-1972", year: 1972, lang_id: "c", lang_name: "C", event_title: "The Mother of Modern Systems", era: "Pioneering Era (1950–1979)", description: "Dennis Ritchie invents C at Bell Labs to rewrite UNIX, establishing curly-brace syntax and pointer abstractions that define computing.", significance: "The foundation of operating system kernels, compilers, and hardware device drivers." },
  { id: "tm-1983", year: 1983, lang_id: "objective-c", lang_name: "Objective-C", event_title: "Smalltalk Message Passing on C", era: "Ecosystem Expansion (1980–1999)", description: "Brad Cox and Tom Love marry Smalltalk dynamic message sending with C performance; later adopted by Steve Jobs at NeXT and Apple.", significance: "Powered the original NeXTSTEP OS, macOS, and the original App Store iOS revolution." },
  { id: "tm-1985", year: 1985, lang_id: "cpp", lang_name: "C++", event_title: "Object-Oriented Zero-Cost Abstractions", era: "Ecosystem Expansion (1980–1999)", description: "Bjarne Stroustrup releases 'C with Classes', introducing RAII, operator overloading, templates, and high-performance polymorphism.", significance: "Powers AAA game engines (Unreal), browser rendering engines, and high-frequency finance." },
  { id: "tm-1990", year: 1990, lang_id: "haskell", lang_name: "Haskell", event_title: "Pure Functional Purity & Monads", era: "Ecosystem Expansion (1980–1999)", description: "An international academic committee formalizes pure lazy functional programming, Hindley-Milner type inference, and monads.", significance: "The benchmark for mathematical rigor, type system innovation, and compiler architecture." },
  { id: "tm-1991", year: 1991, lang_id: "python", lang_name: "Python", event_title: "Readability as a Core Virtue", era: "Ecosystem Expansion (1980–1999)", description: "Guido van Rossum conceives Python as an ABC successor, emphasizing clean syntax, whitespace indentation, and developer productivity.", significance: "Evolved into the premier language for artificial intelligence, machine learning, and scientific computing." },
  { id: "tm-1995a", year: 1995, lang_id: "java", lang_name: "Java", event_title: "Write Once, Run Anywhere", era: "Ecosystem Expansion (1980–1999)", description: "James Gosling and Sun Microsystems introduce the JVM bytecode platform, sandbox security, and enterprise garbage collection.", significance: "Bedrock of global enterprise backends, Android operating system, and big data infrastructure." },
  { id: "tm-1995b", year: 1995, lang_id: "javascript", lang_name: "JavaScript", event_title: "The Universal Web Runtime", era: "Ecosystem Expansion (1980–1999)", description: "Brendan Eich crafts Mocha / LiveScript in 10 days at Netscape, embedding Scheme functional ideas in a Java-like syntax for web browsers.", significance: "The most widely deployed language runtime in human history, powering modern web applications." },
  { id: "tm-2009", year: 2009, lang_id: "go", lang_name: "Go", event_title: "Cloud-Native Concurrency at Scale", era: "Cloud & Safety Renaissance (2000–2015)", description: "Google engineers Rob Pike, Ken Thompson, and Robert Griesemer launch Go to conquer multicore networked cloud scale with CSP goroutines.", significance: "Built Docker, Kubernetes, Terraform, and modern cloud microservices infrastructure." },
  { id: "tm-2012", year: 2012, lang_id: "typescript", lang_name: "TypeScript", event_title: "Gradual Static Typing for the Web", era: "Cloud & Safety Renaissance (2000–2015)", description: "Anders Hejlsberg and Microsoft introduce structural static typing and IDE telemetry that transpiles to clean JavaScript.", significance: "Transformed frontend web development into an enterprise-grade engineering discipline." },
  { id: "tm-2014", year: 2014, lang_id: "swift", lang_name: "Swift", event_title: "Modern Protocol-Oriented Safety", era: "Cloud & Safety Renaissance (2000–2015)", description: "Apple and Chris Lattner unveil Swift to replace Objective-C with value types, type inference, protocol extensions, and memory safety.", significance: "Drives Apple's software ecosystem with declarative SwiftUI and ARC memory management." },
  { id: "tm-2015", year: 2015, lang_id: "rust", lang_name: "Rust", event_title: "Compile-Time Memory Safety without GC", era: "Cloud & Safety Renaissance (2000–2015)", description: "Mozilla and Graydon Hoare release Rust 1.0 with its groundbreaking affine borrow checker and ownership model.", significance: "First language to challenge C/C++ in operating system kernels (Linux kernel, Windows) with proven safety." }
];

const initialPaths = [
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    domain: "Machine Intelligence & Scientific Compute",
    estimatedWeeks: "16-24 Weeks",
    description: "Master the modern neural architecture stack from linear algebra primitives and tensor calculus to deep learning and LLM agent orchestration.",
    prerequisites: ["Calculus & Linear Algebra Foundations", "Basic algorithmic reasoning"],
    recommendedLanguages: ["Python", "R", "C++", "Rust"],
    steps: [
      { step: "01", title: "Foundations in Python & Vector Algebra", focus: "Python 3.12+, NumPy vectorized operations, Pandas dataframes, memory efficiency." },
      { step: "02", title: "Classical Statistical Learning & Regression", focus: "Scikit-Learn estimators, cross-validation, gradient descent, feature engineering." },
      { step: "03", title: "Deep Neural Networks with PyTorch", focus: "Autograd backpropagation, convolutional layers, CUDA GPU acceleration, loss functions." },
      { step: "04", title: "Transformers, Attention & Foundation Models", focus: "Self-attention mechanics, Hugging Face ecosystem, parameter-efficient fine-tuning (LoRA)." },
      { step: "05", title: "Low-Latency High-Throughput Inference", focus: "Model quantization (GGUF), vLLM engines, C++ tensor execution, ONNX exports." }
    ]
  },
  {
    id: "systems-perf",
    title: "Systems & High Performance",
    domain: "Operating Systems, Compilers & Kernels",
    estimatedWeeks: "20-28 Weeks",
    description: "Direct bare-metal hardware mastery. Understand raw pointers, memory caches, OS syscalls, assembly compilation, and zero-cost safety models.",
    prerequisites: ["Computer architecture basics", "Boolean logic & CPU registers"],
    recommendedLanguages: ["C", "C++", "Rust", "Go"],
    steps: [
      { step: "01", title: "Direct Memory & Pointer Arithmetic in C", focus: "Manual heap allocation (malloc/free), stack frames, pointers, segmentation faults." },
      { step: "02", title: "POSIX Syscalls & UNIX Kernel Architecture", focus: "Process forks, signals, file descriptors, memory-mapped I/O (mmap), sockets." },
      { step: "03", title: "Deterministic Resource Safety with Modern C++", focus: "RAII, smart pointers, templates, move semantics, Vulkan/DirectX graphics pipelines." },
      { step: "04", title: "Compile-Time Memory Safety with Rust", focus: "Borrow checker, lifetimes, ownership semantics, zero-cost abstractions, Cargo." },
      { step: "05", title: "High-Throughput Concurrency & WebAssembly", focus: "Atomics, lock-free queues, Tokio async runtime, SIMD vectorization, wasm compilation." }
    ]
  },
  {
    id: "fullstack-web",
    title: "Full-Stack Web Engineering",
    domain: "Distributed Web Apps & Interactive UI",
    estimatedWeeks: "14-20 Weeks",
    description: "End-to-end web software engineering across asynchronous event loops, component rendering trees, typed API contracts, and edge databases.",
    prerequisites: ["Semantic HTML & CSS fundamentals"],
    recommendedLanguages: ["JavaScript", "TypeScript", "Python", "Go"],
    steps: [
      { step: "01", title: "JavaScript Core & Asynchronous Runtime", focus: "Event loop, Promises, closures, prototype chain, DOM events, modern ESNext." },
      { step: "02", title: "Static Type Discipline with TypeScript", focus: "Interfaces, generics, union discriminants, structural typing, strict compiler flags." },
      { step: "03", title: "Declarative UI Frameworks & State Machines", focus: "React 19, server components, virtual DOM diffing, component lifecycle, Next.js." },
      { step: "04", title: "High-Performance Backend Services", focus: "RESTful architecture, tRPC type-safe contracts, Node.js, Express/FastAPI, JWT." },
      { step: "05", title: "Relational Persistence & Edge Runtimes", focus: "PostgreSQL, connection pooling, indexing, migrations, Redis caching, edge workers." }
    ]
  },
  {
    id: "cloud-microservices",
    title: "Cloud Native & Microservices",
    domain: "Distributed Systems & Infrastructure",
    estimatedWeeks: "16-22 Weeks",
    description: "Architect horizontally scalable distributed systems, containerized cloud services, asynchronous message brokers, and automated CI/CD pipelines.",
    prerequisites: ["Networking fundamentals (TCP/IP, HTTP/2, DNS)"],
    recommendedLanguages: ["Go", "Java", "Rust", "Python"],
    steps: [
      { step: "01", title: "Concurrent Network Services with Go", focus: "Goroutines, channels, sync primitives, HTTP middleware, standard library mastery." },
      { step: "02", title: "Containerization & Image Optimization", focus: "Multi-stage Docker builds, Linux cgroups, namespaces, minimal scratch images." },
      { step: "03", title: "Container Orchestration with Kubernetes", focus: "Pods, Deployments, Services, Ingress controllers, Helm charts, ConfigMaps." },
      { step: "04", title: "Inter-Service Communication & gRPC", focus: "Protocol Buffers, streaming RPCs, service discovery, distributed tracing (OpenTelemetry)." },
      { step: "05", title: "Event Streaming & Distributed Data Stores", focus: "Apache Kafka event logs, consumer groups, partition keys, CQRS architecture." }
    ]
  },
  {
    id: "mobile-apps",
    title: "Mobile Architecture",
    domain: "Native Client Applications",
    estimatedWeeks: "16-24 Weeks",
    description: "Design fluid, battery-efficient mobile applications with reactive declarative UI, offline synchronization, and hardware sensor integration.",
    prerequisites: ["Object-oriented programming basics"],
    recommendedLanguages: ["Kotlin", "Swift", "TypeScript"],
    steps: [
      { step: "01", title: "Modern Kotlin & Declarative Android UI", focus: "Jetpack Compose, coroutines, Flow streams, MVVM architecture, Material Design 3." },
      { step: "02", title: "Swift & Declarative iOS Architecture", focus: "SwiftUI, Combine reactive pipelines, protocols, Swift Concurrency (async/await), ARC." },
      { step: "03", title: "Cross-Platform Ecosystems (KMP & React Native)", focus: "Shared business logic, native bridging, memory profiling, platform channels." },
      { step: "04", title: "Local Persistence & Offline Synchronization", focus: "Room DB / CoreData, SQLite, background workers, delta sync algorithms." },
      { step: "05", title: "App Store Packaging, Signing & Telemetry", focus: "Signing certificates, ProGuard shrinking, Crashlytics, store compliance." }
    ]
  },
  {
    id: "functional-systems",
    title: "Functional & Concurrent Systems",
    domain: "High-Assurance Distributed Computing",
    estimatedWeeks: "18-26 Weeks",
    description: "Embrace mathematical rigor, algebraic data types, immutable state, and actor concurrency models for mission-critical fault tolerance.",
    prerequisites: ["Discrete mathematics & recursive programming"],
    recommendedLanguages: ["Haskell", "Clojure", "Rust", "Java"],
    steps: [
      { step: "01", title: "Pure Functions & Immutability in Haskell", focus: "Hindley-Milner type inference, currying, higher-order functions, lazy evaluation." },
      { step: "02", title: "Algebraic Data Types & Pattern Matching", focus: "Sum types, product types, generalized ADTs, exhaustiveness checking." },
      { step: "03", title: "Monads, Functors & Pure Side Effects", focus: "IO monad, Maybe/Either error pipelines, Monad Transformers, Category Theory." },
      { step: "04", title: "Lisp Homoiconicity with Clojure on the JVM", focus: "Persistent data structures, software transactional memory (STM), macros, core.async." },
      { step: "05", title: "Fault-Tolerant Actor Models & High Assurance", focus: "Supervision trees, message passing, quantitative finance modeling, formal verification." }
    ]
  }
];

// In-Memory Database Store instance
export const memoryDb = {
  languages: [...initialLanguages],
  quiz: [...initialQuiz],
  timeline: [...initialTimeline],
  paths: [...initialPaths],
  profiles: [
    {
      id: "usr-admin-default",
      email: "admin@codeatlas.dev",
      full_name: "Lead System Architect",
      role: "admin",
      explored_ids: ["c", "cpp", "rust", "python", "javascript", "typescript", "go"],
      selected_path: "AI & Machine Learning",
      quiz_attempts: 12,
      best_score: "5 / 5 (100%)",
      last_activity: "Admin Console System Audit",
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "usr-student-default",
      email: "student@example.com",
      full_name: "Explorer Alex",
      role: "user",
      explored_ids: ["python", "javascript", "typescript"],
      selected_path: "AI & Machine Learning",
      quiz_attempts: 3,
      best_score: "4 / 5 (80%)",
      last_activity: "Completed Architecture Quiz",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  activities: [
    { id: "act-1", user_email: "admin@codeatlas.dev", action: "Initialized CodeAtlas production database schema", activity_type: "System", created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
    { id: "act-2", user_email: "student@example.com", action: "Explored Python Language Dossier", activity_type: "Language", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "act-3", user_email: "student@example.com", action: "Enrolled in AI & Machine Learning Blueprint", activity_type: "Learning", created_at: new Date(Date.now() - 3600000 * 1).toISOString() }
  ],
  settings: {
    siteTitle: "CodeAtlas — Explore the Programming Language Universe",
    themePreference: "Obsidian Telemetry Dark (#05070D)",
    datasetVersion: "v2026.4-stable"
  }
};

// -----------------------------------------------------------------------------
// Database Service Interface (Unified Adapter for Supabase & Local DB)
// -----------------------------------------------------------------------------

export const dbService = {
  // --- LANGUAGES ---
  async getLanguages(category, search) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('languages').select('*').order('year', { ascending: true });
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        if (search) {
          query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('[Supabase] Languages fetch fallback:', e.message);
      }
    }
    // Memory store fallback
    let list = [...memoryDb.languages];
    if (category && category !== 'All') {
      list = list.filter(l => l.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.category.toLowerCase().includes(q));
    }
    return list;
  },

  async getLanguageById(id) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('languages').select('*').eq('id', id.toLowerCase()).single();
        if (!error && data) return data;
      } catch (e) {}
    }
    return memoryDb.languages.find(l => l.id.toLowerCase() === id.toLowerCase() || l.name.toLowerCase() === id.toLowerCase()) || null;
  },

  async createLanguage(langData) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('languages').insert([langData]).select().single();
        if (error) throw error;
        return data;
      } catch (e) {
        console.warn('[Supabase] createLanguage error:', e.message);
      }
    }
    const existingIdx = memoryDb.languages.findIndex(l => l.id === langData.id);
    if (existingIdx >= 0) {
      memoryDb.languages[existingIdx] = { ...memoryDb.languages[existingIdx], ...langData, updated_at: new Date().toISOString() };
      return memoryDb.languages[existingIdx];
    }
    const record = { ...langData, created_at: new Date().toISOString() };
    memoryDb.languages.push(record);
    return record;
  },

  async updateLanguage(id, updates) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('languages').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } catch (e) {
        console.warn('[Supabase] updateLanguage error:', e.message);
      }
    }
    const idx = memoryDb.languages.findIndex(l => l.id === id);
    if (idx >= 0) {
      memoryDb.languages[idx] = { ...memoryDb.languages[idx], ...updates, updated_at: new Date().toISOString() };
      return memoryDb.languages[idx];
    }
    return null;
  },

  async deleteLanguage(id) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('languages').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (e) {
        console.warn('[Supabase] deleteLanguage error:', e.message);
      }
    }
    const initialLen = memoryDb.languages.length;
    memoryDb.languages = memoryDb.languages.filter(l => l.id !== id);
    return memoryDb.languages.length < initialLen;
  },

  // --- QUIZ QUESTIONS ---
  async getQuizQuestions() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('quiz_questions').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryDb.quiz;
  },

  async createQuizQuestion(questionData) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('quiz_questions').insert([questionData]).select().single();
        if (error) throw error;
        return data;
      } catch (e) {
        console.warn('[Supabase] createQuizQuestion error:', e.message);
      }
    }
    const record = { ...questionData, created_at: new Date().toISOString() };
    memoryDb.quiz.push(record);
    return record;
  },

  async deleteQuizQuestion(id) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (e) {
        console.warn('[Supabase] deleteQuizQuestion error:', e.message);
      }
    }
    const initialLen = memoryDb.quiz.length;
    memoryDb.quiz = memoryDb.quiz.filter(q => q.id !== id);
    return memoryDb.quiz.length < initialLen;
  },

  // --- TIMELINE & PATHS ---
  async getTimeline() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('timeline_events').select('*').order('year', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryDb.timeline;
  },

  async getLearningPaths() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('learning_paths').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryDb.paths;
  },

  // --- PROFILES & AUTH RBAC ---
  async getProfileByEmail(email) {
    if (!email) return null;
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email.trim().toLowerCase()).single();
        if (!error && data) return data;
      } catch (e) {}
    }
    return memoryDb.profiles.find(p => p.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  async getProfileById(userId) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (!error && data) return data;
      } catch (e) {}
    }
    return memoryDb.profiles.find(p => p.id === userId) || null;
  },

  async saveProfile(profileData) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').upsert([profileData]).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }
    const idx = memoryDb.profiles.findIndex(p => p.id === profileData.id || p.email.toLowerCase() === profileData.email.toLowerCase());
    if (idx >= 0) {
      memoryDb.profiles[idx] = { ...memoryDb.profiles[idx], ...profileData, updated_at: new Date().toISOString() };
      return memoryDb.profiles[idx];
    }
    const newRecord = { ...profileData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    memoryDb.profiles.push(newRecord);
    return newRecord;
  },

  async getAllProfiles() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryDb.profiles;
  },

  async updateUserRole(userId, newRole) {
    if (!['user', 'admin'].includes(newRole)) throw new Error('Invalid role');
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').update({ role: newRole, updated_at: new Date().toISOString() }).eq('id', userId).select().single();
        if (error) throw error;
        return data;
      } catch (e) {}
    }
    const p = memoryDb.profiles.find(x => x.id === userId);
    if (p) {
      p.role = newRole;
      p.updated_at = new Date().toISOString();
      return p;
    }
    return null;
  },

  async deleteUserProfile(userId) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').delete().eq('id', userId);
      } catch (e) {}
    }
    memoryDb.profiles = memoryDb.profiles.filter(p => p.id !== userId);
    return true;
  },

  // --- ACTIVITY LOGS ---
  async logActivity(userEmail, action, activityType = 'System') {
    const entry = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      user_email: userEmail || 'guest@codeatlas.dev',
      action,
      activity_type: activityType,
      created_at: new Date().toISOString()
    };
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('activity_logs').insert([entry]);
      } catch (e) {}
    }
    memoryDb.activities.unshift(entry);
    if (memoryDb.activities.length > 100) memoryDb.activities.pop();
    return entry;
  },

  async getActivities(limit = 30) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit);
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryDb.activities.slice(0, limit);
  },

  // --- STATS ---
  async getAdminStats() {
    const langs = await this.getLanguages();
    const quiz = await this.getQuizQuestions();
    const timeline = await this.getTimeline();
    const profiles = await this.getAllProfiles();
    const activities = await this.getActivities(10);

    return {
      languagesCount: langs.length,
      timelineCount: timeline.length,
      quizCount: quiz.length,
      usersCount: profiles.length,
      activityCount: memoryDb.activities.length,
      recentActivity: activities,
      databaseType: isSupabaseConfigured() ? 'Supabase PostgreSQL (Live Connected)' : 'PostgreSQL Schema Ready (Awaiting SUPABASE_URL & ANON_KEY in Settings)'
    };
  },

  // --- SETTINGS ---
  async getSettings() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('system_settings').select('*').eq('key', 'general').single();
        if (!error && data && data.value) return data.value;
      } catch (e) {}
    }
    return memoryDb.settings;
  },

  async saveSettings(settings) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('system_settings').upsert([{ key: 'general', value: settings, updated_at: new Date().toISOString() }]);
      } catch (e) {}
    }
    memoryDb.settings = { ...memoryDb.settings, ...settings };
    return memoryDb.settings;
  },

  // --- RESET DEFAULT DATASET ---
  async resetDefaultDataset() {
    memoryDb.languages = [...initialLanguages];
    memoryDb.quiz = [...initialQuiz];
    memoryDb.timeline = [...initialTimeline];
    memoryDb.paths = [...initialPaths];
    await this.logActivity('admin@codeatlas.dev', 'Reset system dataset to factory defaults', 'Admin');
    return true;
  }
};

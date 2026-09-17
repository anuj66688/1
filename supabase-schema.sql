-- =============================================================================
-- CODEATLAS — COMPLETE SUPABASE POSTGRESQL SCHEMA WITH RLS & SEED DATA
-- =============================================================================

-- Enable pgcrypto extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. TABLE: profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  explored_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  selected_path TEXT DEFAULT 'AI & Machine Learning',
  quiz_attempts INTEGER DEFAULT 0,
  best_score TEXT DEFAULT '—',
  last_activity TEXT DEFAULT 'Joined CodeAtlas',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- -----------------------------------------------------------------------------
-- 2. TABLE: languages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.languages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mark TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  paradigm TEXT NOT NULL,
  typing TEXT NOT NULL,
  execution TEXT NOT NULL,
  uses JSONB NOT NULL DEFAULT '[]'::JSONB,
  creator TEXT NOT NULL,
  description TEXT NOT NULL,
  ecosystem JSONB NOT NULL DEFAULT '[]'::JSONB,
  learning_considerations TEXT NOT NULL,
  syntax TEXT NOT NULL,
  related JSONB NOT NULL DEFAULT '[]'::JSONB,
  featured BOOLEAN NOT NULL DEFAULT false,
  coords JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_languages_category ON public.languages(category);
CREATE INDEX IF NOT EXISTS idx_languages_year ON public.languages(year);

-- -----------------------------------------------------------------------------
-- 3. TABLE: timeline_events
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  lang_id TEXT REFERENCES public.languages(id) ON DELETE SET NULL,
  lang_name TEXT NOT NULL,
  event_title TEXT NOT NULL,
  era TEXT NOT NULL,
  description TEXT NOT NULL,
  significance TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_events_year ON public.timeline_events(year);
CREATE INDEX IF NOT EXISTS idx_timeline_events_era ON public.timeline_events(era);

-- -----------------------------------------------------------------------------
-- 4. TABLE: learning_paths
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  estimated_weeks TEXT NOT NULL,
  description TEXT NOT NULL,
  prerequisites JSONB NOT NULL DEFAULT '[]'::JSONB,
  recommended_languages JSONB NOT NULL DEFAULT '[]'::JSONB,
  steps JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_domain ON public.learning_paths(domain);

-- -----------------------------------------------------------------------------
-- 5. TABLE: quiz_questions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 6. TABLE: activity_logs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'System',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- -----------------------------------------------------------------------------
-- 7. TABLE: system_settings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES POLICIES ---
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- --- LANGUAGES POLICIES ---
DROP POLICY IF EXISTS "Languages are readable by everyone" ON public.languages;
CREATE POLICY "Languages are readable by everyone"
  ON public.languages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert languages" ON public.languages;
CREATE POLICY "Admins can insert languages"
  ON public.languages FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update languages" ON public.languages;
CREATE POLICY "Admins can update languages"
  ON public.languages FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete languages" ON public.languages;
CREATE POLICY "Admins can delete languages"
  ON public.languages FOR DELETE
  USING (public.is_admin());

-- --- TIMELINE EVENTS POLICIES ---
DROP POLICY IF EXISTS "Timeline readable by everyone" ON public.timeline_events;
CREATE POLICY "Timeline readable by everyone"
  ON public.timeline_events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage timeline" ON public.timeline_events;
CREATE POLICY "Admins can manage timeline"
  ON public.timeline_events FOR ALL
  USING (public.is_admin());

-- --- LEARNING PATHS POLICIES ---
DROP POLICY IF EXISTS "Learning paths readable by everyone" ON public.learning_paths;
CREATE POLICY "Learning paths readable by everyone"
  ON public.learning_paths FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage learning paths" ON public.learning_paths;
CREATE POLICY "Admins can manage learning paths"
  ON public.learning_paths FOR ALL
  USING (public.is_admin());

-- --- QUIZ QUESTIONS POLICIES ---
DROP POLICY IF EXISTS "Quiz readable by everyone" ON public.quiz_questions;
CREATE POLICY "Quiz readable by everyone"
  ON public.quiz_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can insert quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can update quiz questions"
  ON public.quiz_questions FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can delete quiz questions"
  ON public.quiz_questions FOR DELETE
  USING (public.is_admin());

-- --- ACTIVITY LOGS POLICIES ---
DROP POLICY IF EXISTS "Anyone can insert activity" ON public.activity_logs;
CREATE POLICY "Anyone can insert activity"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read activity logs" ON public.activity_logs;
CREATE POLICY "Admins can read activity logs"
  ON public.activity_logs FOR SELECT
  USING (public.is_admin());

-- --- SYSTEM SETTINGS POLICIES ---
DROP POLICY IF EXISTS "Settings readable by everyone" ON public.system_settings;
CREATE POLICY "Settings readable by everyone"
  ON public.system_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update settings" ON public.system_settings;
CREATE POLICY "Admins can update settings"
  ON public.system_settings FOR ALL
  USING (public.is_admin());

-- =============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER FOR SUPABASE AUTH
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  user_count INTEGER;
BEGIN
  SELECT count(*) INTO user_count FROM public.profiles;
  -- First registered user or admin email automatically becomes admin
  IF user_count = 0 OR new.email ILIKE '%admin%' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'user';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Seed System Settings
INSERT INTO public.system_settings (key, value)
VALUES
  ('general', '{"siteTitle": "CodeAtlas — Explore the Programming Language Universe", "themePreference": "Obsidian Telemetry Dark (#05070D)", "datasetVersion": "v2026.4-stable"}'::JSONB)
ON CONFLICT (key) DO NOTHING;

-- Seed Default Languages (16 Languages)
INSERT INTO public.languages (id, name, mark, year, category, paradigm, typing, execution, uses, creator, description, ecosystem, learning_considerations, syntax, related, featured, coords)
VALUES
  ('c', 'C', 'C', 1972, 'Systems', 'Procedural, Imperative, Structured', 'Static, Weak, Manifest', 'Ahead-of-Time Compiled (Native Machine Code)', '["Operating System Kernels", "Embedded Firmware", "Compilers & Runtimes", "High-Frequency Systems"]'::JSONB, 'Dennis Ritchie (Bell Labs)', 'The foundational systems programming language that shaped UNIX, modern operating systems, and syntax conventions for generations of languages.', '["GCC / Clang", "Make / CMake", "glibc", "Linux Kernel API", "POSIX"]'::JSONB, 'Unmatched for understanding raw memory pointers, stack vs. heap allocation, and hardware-level execution without abstraction overhead.', '#include <stdio.h>\n\nint main(void) {\n    const char *node = "CodeAtlas::C";\n    printf("Telemetry online: %s\\n", node);\n    return 0;\n}', '["cpp", "rust", "go", "csharp", "java"]'::JSONB, true, '{"x": -180, "y": -60, "z": 40}'::JSONB),
  ('cpp', 'C++', 'C++', 1985, 'Systems', 'Multi-paradigm: Object-Oriented, Generic, Procedural', 'Static, Strong, Nominative', 'Ahead-of-Time Compiled (Zero-Cost Abstractions)', '["AAA Game Engines", "Real-Time Rendering", "Financial Trading Engines", "Browser Engines (V8/Blink)"]'::JSONB, 'Bjarne Stroustrup', 'Extends C with zero-overhead abstractions, deterministic resource management (RAII), templates, and high-performance object-oriented capabilities.', '["STL", "Unreal Engine", "Boost", "CMake", "Vulkan / DirectX"]'::JSONB, 'Steep mastery curve with deep rewards; essential for graphics programming, game engines, and latency-critical computing.', '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> epochs = {1972, 1985, 2026};\n    for (auto yr : epochs) std::cout << yr << " ";\n}', '["c", "rust", "csharp", "java"]'::JSONB, true, '{"x": -240, "y": 50, "z": -20}'::JSONB),
  ('csharp', 'C#', 'C#', 2000, 'Enterprise', 'Object-Oriented, Functional, Component-Oriented', 'Static, Strong, Dynamic-opt-in', 'CLR Managed JIT & Native AOT', '["Enterprise Cloud Microservices", "Unity Game Development", "Desktop Architecture", "Cross-Platform APIs"]'::JSONB, 'Anders Hejlsberg (Microsoft)', 'A refined, modern multi-paradigm language powering the .NET ecosystem, enterprise backends, and the Unity real-time 3D engine.', '["NET 9", "ASP.NET Core", "Entity Framework", "Unity Engine", "LINQ"]'::JSONB, 'Offers an ergonomic balance of strong static typing, LINQ functional queries, and world-class tooling.', 'using System;\nusing System.Linq;\n\nvar langs = new[] { "C#", "F#", "TypeScript" };\nConsole.WriteLine($"Active nodes: {langs.Count()}");', '["java", "cpp", "typescript", "kotlin"]'::JSONB, false, '{"x": 100, "y": -120, "z": 60}'::JSONB),
  ('java', 'Java', 'Java', 1995, 'Enterprise', 'Object-Oriented, Class-Based, Concurrent', 'Static, Strong, Safe', 'JVM Bytecode JIT + GraalVM AOT', '["Global Banking Systems", "Big Data (Hadoop/Spark)", "Enterprise Backends", "Android Platform Core"]'::JSONB, 'James Gosling (Sun Microsystems)', 'Architected around "Write Once, Run Anywhere", Java serves as the bedrock for global enterprise infrastructure, massive distributed systems, and JVM runtimes.', '["Spring Boot", "Maven / Gradle", "Hibernate", "Apache Kafka", "GraalVM"]'::JSONB, 'Disciplined design patterns, garbage-collection tuning, and thread concurrency architectures with industry-standard stability.', 'import java.util.List;\n\npublic class CodeAtlas {\n    public static void main(String[] args) {\n        var nodes = List.of("Java", "Kotlin", "Scala");\n        nodes.forEach(System.out::println);\n    }\n}', '["csharp", "kotlin", "c", "cpp"]'::JSONB, false, '{"x": 70, "y": -60, "z": 90}'::JSONB),
  ('python', 'Python', 'Py', 1991, 'AI & Data', 'Multi-paradigm: Object-Oriented, Imperative, Functional', 'Dynamic, Strong', 'Interpreted Bytecode (CPython) & JIT (PyPy)', '["Artificial Intelligence & LLMs", "Data Science & Analytics", "Scientific Research", "Rapid Backend APIs"]'::JSONB, 'Guido van Rossum', 'Emphasizes readability through elegant syntax and whitespace discipline; the undisputed lingua franca for modern artificial intelligence, neural architectures, and scientific computing.', '["PyTorch", "TensorFlow", "NumPy / Pandas", "FastAPI / Django", "Hugging Face"]'::JSONB, 'Fastest ramp from idea to working software; high-level abstractions encourage focus on domain logic before performance optimization.', 'def telemetry_stream(nodes: list[str]) -> dict:\n    return {node: len(node) for node in nodes}\n\nprint(telemetry_stream(["Python", "Rust", "TypeScript"]))', '["javascript", "r", "ruby", "c"]'::JSONB, true, '{"x": -70, "y": 140, "z": 120}'::JSONB),
  ('javascript', 'JavaScript', 'JS', 1995, 'Web', 'Multi-paradigm: Event-Driven, Functional, Prototype-Based', 'Dynamic, Weak', 'V8 / SpiderMonkey JIT Compilation', '["Interactive Browser Web Apps", "Full-Stack Node.js Backends", "Hybrid Mobile (React Native)", "Edge Runtime Functions"]'::JSONB, 'Brendan Eich (Netscape)', 'The foundational programmable execution engine of the World Wide Web; runs ubiquitously on billions of browser clients, servers, and edge runtimes.', '["React / Next.js", "Node.js / Express", "Vue / Nuxt", "npm Registry", "Vite"]'::JSONB, 'Asynchronous event loop, closures, and prototypical inheritance; indispensable for universal web software engineering.', 'const nodes = ["HTML", "CSS", "JavaScript"];\nconst render = (items) => items.map(i => `[${i.toUpperCase()}]`).join(" -> ");\nconsole.log(render(nodes));', '["typescript", "python", "php"]'::JSONB, true, '{"x": 130, "y": 90, "z": -70}'::JSONB),
  ('typescript', 'TypeScript', 'TS', 2012, 'Web', 'Typed Superset of JavaScript: Object-Oriented, Functional', 'Static, Gradual, Structural (Duck-Typed)', 'Transpiled to ECMAScript Native', '["Enterprise Full-Stack Platforms", "Scalable Design Systems", "High-Reliability Web APIs", "Developer Tooling"]'::JSONB, 'Anders Hejlsberg (Microsoft)', 'Supercharges JavaScript with compile-time structural type systems, advanced generics, and intelligent editor telemetry, turning web development into an enterprise-grade discipline.', '["React / Next.js", "Angular", "NestJS", "tsc Compiler", "tRPC / Zod"]'::JSONB, 'Exceptional balance of dynamic flexibility and compile-time safety; standard for modern web and application development.', 'interface LangNode {\n  id: string;\n  year: number;\n  active: boolean;\n}\n\nconst ts: LangNode = { id: "typescript", year: 2012, active: true };\nconsole.log(ts);', '["javascript", "csharp", "kotlin"]'::JSONB, true, '{"x": 180, "y": 130, "z": -20}'::JSONB),
  ('rust', 'Rust', 'Rs', 2015, 'Systems', 'Multi-paradigm: Systems, Functional, Imperative, Concurrent', 'Static, Strong, Affine (Linear Memory)', 'Ahead-of-Time LLVM Compiled Native Machine Code', '["Memory-Safe OS Kernels", "WebAssembly High-Perf Modules", "Cloud Infrastructure (Tokio)", "Cryptographic Engineering"]'::JSONB, 'Graydon Hoare (Mozilla Research)', 'Combines bare-metal C++ performance with compile-time guaranteed memory safety and data-race prevention via its groundbreaking borrow checker and ownership model.', '["Cargo & Crates.io", "Tokio Async Engine", "WebAssembly (wasm-pack)", "Actix Web", "Tauri"]'::JSONB, 'Steep learning curve around lifetimes and borrow rules, rewarded with deterministic zero-overhead reliability without a garbage collector.', 'fn main() {\n    let nodes = vec!["Rust", "C", "Go"];\n    for node in &nodes {\n        println!("Memory-safe telemetry: {}", node);\n    }\n}', '["c", "cpp", "go", "swift"]'::JSONB, true, '{"x": -210, "y": -110, "z": -90}'::JSONB),
  ('go', 'Go', 'Go', 2009, 'Cloud & Systems', 'Concurrent, Imperative, Procedural', 'Static, Strong, Structural', 'Ahead-of-Time Compiled Native Machine Code', '["Cloud Native Infrastructure (Kubernetes/Docker)", "Microservices Architecture", "Network Proxies & Load Balancers", "High-Throughput APIs"]'::JSONB, 'Robert Griesemer, Rob Pike, Ken Thompson (Google)', 'Engineered for simplicity and scale; features ultra-fast compile times, built-in concurrency primitives (goroutines and channels), and seamless production deployments.', '["Kubernetes", "Docker", "gRPC", "Gin / Echo", "Go Modules"]'::JSONB, 'Intentionally minimal feature set enables developers to master the syntax in days and reason about large concurrent systems easily.', 'package main\n\nimport "fmt"\n\nfunc main() {\n    messages := make(chan string)\n    go func() { messages <- "Go concurrency online" }()\n    fmt.Println(<-messages)\n}', '["c", "rust", "python"]'::JSONB, true, '{"x": -90, "y": -140, "z": -30}'::JSONB),
  ('kotlin', 'Kotlin', 'Kt', 2011, 'Mobile', 'Multi-paradigm: Object-Oriented, Functional, Pragmatic', 'Static, Strong, Safe (Null-Safe)', 'JVM Bytecode, JavaScript Transpiled, Native AOT', '["Modern Android Development (Jetpack Compose)", "Cross-Platform Mobile (KMP)", "Spring Boot Enterprise APIs", "Desktop Architecture"]'::JSONB, 'JetBrains', 'A concise, pragmatic, and 100% Java-interoperable language chosen by Google as the premier language for Android app development.', '["Jetpack Compose", "Android SDK", "Kotlin Multiplatform (KMP)", "Coroutines", "Ktor"]'::JSONB, 'Eliminates NullPointerExceptions with first-class nullable types; provides seamless migration path from legacy Java codebases.', 'fun main() {\n    val languages = listOf("Kotlin", "Java", "Swift")\n    languages.forEach { println("Verified: $it") }\n}', '["java", "swift", "typescript", "csharp"]'::JSONB, false, '{"x": 120, "y": -30, "z": 140}'::JSONB),
  ('swift', 'Swift', 'Sw', 2014, 'Mobile', 'Multi-paradigm: Protocol-Oriented, Functional, Object-Oriented', 'Static, Strong, Inferred', 'LLVM Ahead-of-Time Compiled Native', '["Apple Ecosystem Apps (iOS, macOS, watchOS, visionOS)", "Declarative UI (SwiftUI)", "High-Performance Client Software", "Embedded Systems"]'::JSONB, 'Chris Lattner & Apple', 'Apple flagship language designed to replace Objective-C; merges safety, speed, and expressive modern ergonomics with declarative UI frameworks.', '["SwiftUI", "Combine", "Xcode", "Apple SDKs", "Swift Package Manager"]'::JSONB, 'Protocols as first-class architectural blueprints, value types (structs) preferred over reference types, and memory management through ARC.', 'import Foundation\n\nlet devices = ["iPhone", "MacBook", "Vision Pro"]\nfor device in devices {\n    print("Telemetry active on \\(device)")\n}', '["kotlin", "rust", "cpp"]'::JSONB, false, '{"x": 160, "y": 20, "z": 110}'::JSONB),
  ('ruby', 'Ruby', 'Rb', 1995, 'Web', 'Object-Oriented, Dynamic, Reflective', 'Dynamic, Strong', 'Interpreted (YARV Bytecode VM)', '["Rapid Web Application Startups (Rails)", "Prototyping & MVPs", "Automation Scripting", "DevOps Tooling (Homebrew)"]'::JSONB, 'Yukihiro Matsumoto (Matz)', 'Designed for developer happiness and human ergonomics; popularized convention-over-configuration web development via Ruby on Rails.', '["Ruby on Rails", "Bundler & RubyGems", "RSpec", "Sidekiq", "Sinatra"]'::JSONB, 'Pure object-oriented architecture where everything is an object; meta-programming flexibility accelerates prototype delivery.', 'langs = ["Ruby", "Python", "JavaScript"]\nlangs.each { |name| puts "Developer happiness in #{name}" }', '["python", "javascript", "php"]'::JSONB, false, '{"x": -40, "y": 90, "z": -110}'::JSONB),
  ('php', 'PHP', 'PHP', 1995, 'Web', 'Imperative, Object-Oriented, Procedural', 'Dynamic, Weak to Progressive Strong Typing', 'Zend Engine Bytecode + OPcache JIT', '["Content Management Platforms (WordPress, Drupal)", "Modern Web Backends (Laravel)", "E-Commerce Engines", "RESTful APIs"]'::JSONB, 'Rasmus Lerdorf', 'The resilient backbone of the content web powering roughly 75% of server-rendered websites worldwide, modernized with PHP 8+ and Laravel.', '["Laravel", "Composer", "WordPress Ecosystem", "Symfony", "PHPStan"]'::JSONB, 'Extremely fast deploy cycles and vast hosting availability; modern PHP 8 incorporates strict typing, attributes, and JIT compilation.', '<?php\n$frameworks = ["Laravel", "Symfony", "Livewire"];\nforeach ($frameworks as $fw) {\n    echo "Serving modern web: $fw\\n";\n}', '["javascript", "python", "ruby"]'::JSONB, false, '{"x": 50, "y": 60, "z": -140}'::JSONB),
  ('haskell', 'Haskell', 'Hs', 1990, 'Functional', 'Pure Functional, Lazy Evaluation, Declarative', 'Static, Strong, Inferred (Hindley-Milner)', 'GHC Native Machine Code Compilation', '["Financial Modeling & Quantitative Risk", "Compiler Design & Verification", "Cryptographic Protocol Proofs", "High-Assurance Systems"]'::JSONB, 'Committee (Peyton Jones, Hughes, Wadler, et al.)', 'The definitive pure functional language; enforces immutability, mathematical purity, monads for side effects, and non-strict lazy evaluation.', '["GHC (Glasgow Haskell Compiler)", "Cabal / Stack", "Hackage", "QuickCheck", "Lens"]'::JSONB, 'Deep conceptual leap requiring developers to think in pure mathematical transformations and category theory rather than state mutations.', 'quicksort :: (Ord a) => [a] -> [a]\nquicksort [] = []\nquicksort (x:xs) = quicksort [a | a <- xs, a <= x] ++ [x] ++ quicksort [a | a <- xs, a > x]', '["clojure", "rust", "python"]'::JSONB, false, '{"x": -150, "y": -30, "z": 150}'::JSONB),
  ('r', 'R', 'R', 1993, 'AI & Data', 'Array, Functional, Multi-paradigm', 'Dynamic, Vector-Oriented', 'Interpreted Array Engine', '["Statistical Modeling & Biostatistics", "Data Visualization & Publishing", "Econometrics & Academic Research", "Genomics"]'::JSONB, 'Ross Ihaka & Robert Gentleman', 'Tailor-engineered for data analysis and graphics; unmatched depth in statistical hypothesis testing and publication-ready charting.', '["CRAN Registry", "ggplot2", "Tidyverse", "RStudio / Posit", "Shiny"]'::JSONB, 'Vectorized arithmetic by default; essential for data researchers, biomedical scientists, and quantitative statisticians.', 'epochs <- c(1972, 1995, 2012, 2026)\nmean_epoch <- mean(epochs)\ncat("Central epoch coordinate:", mean_epoch, "\\n")', '["python", "c"]'::JSONB, false, '{"x": -90, "y": 180, "z": 50}'::JSONB),
  ('clojure', 'Clojure', 'Clj', 2007, 'Functional', 'Functional Lisp, Concurrent, Hosted', 'Dynamic, Strong', 'JVM Bytecode & JavaScript (ClojureScript)', '["Complex Event Processing", "Financial Transaction Engines", "Distributed Systems", "Full-Stack Dataflow Apps"]'::JSONB, 'Rich Hickey', 'A modern, dynamic Lisp hosted on the JVM; centers on persistent immutable data structures and explicit concurrency management.', '["Leiningen / Clojure CLI", "ClojureScript", "Ring / Compojure", "core.async", "Datomic"]'::JSONB, 'Code-as-data (homoiconicity) with powerful macros; simplifies concurrent programming by separating identity from state.', '(defn telemetry-pulse [node]\n  (str "CodeAtlas node acknowledged: " node))\n\n(println (telemetry-pulse "Clojure"))', '["haskell", "java", "python"]'::JSONB, false, '{"x": -30, "y": -80, "z": 160}'::JSONB)
ON CONFLICT (id) DO NOTHING;

-- Seed Default Quiz Questions (5 Questions)
INSERT INTO public.quiz_questions (id, question, options, correct_index, explanation)
VALUES
  ('q1', 'Which programming language pioneer is credited with designing C at Bell Labs in 1972?', '["Dennis Ritchie", "Bjarne Stroustrup", "Ken Thompson", "Alan Kay"]'::JSONB, 0, 'Dennis Ritchie created C at Bell Telephone Laboratories between 1969 and 1973 to rewrite the UNIX operating system.'),
  ('q2', 'Which compile-time memory model distinguishes Rust from languages like C++ and Java?', '["Affine ownership & borrow checker", "Stop-the-world tracing garbage collection", "Manual free() pointer allocation", "Automatic reference counting with runtime cycles"]'::JSONB, 0, 'Rust enforces single-ownership semantics, lifetimes, and borrow checking at compile-time to guarantee memory safety without a garbage collector.'),
  ('q3', 'Which paradigm characterizes Haskell core design philosophy?', '["Pure functional programming with non-strict lazy evaluation", "Prototype-based object orientation", "Procedural unstructured machine routines", "Component-oriented imperative scripting"]'::JSONB, 0, 'Haskell is mathematically pure and lazily evaluated; functions cannot produce side effects without explicitly utilizing monadic types.'),
  ('q4', 'What is the primary execution strategy used by the modern Java Virtual Machine (JVM)?', '["JIT compilation from bytecode to native machine code with Tiered Profiling", "Direct AST line-by-line interpretation only", "Pure Ahead-of-Time C transpilation without bytecode", "Uncached runtime string evaluation"]'::JSONB, 0, 'The HotSpot JVM interprets bytecode initially, profiles hot code paths, and JIT-compiles them to optimized machine code using the C1 and C2 compilers.'),
  ('q5', 'Anders Hejlsberg was the principal architect behind which pair of modern languages?', '["C# and TypeScript", "Java and Kotlin", "Python and Go", "Swift and Rust"]'::JSONB, 0, 'Anders Hejlsberg led the design of Turbo Pascal and Delphi before architecting C# at Microsoft and subsequently co-designing TypeScript.')
ON CONFLICT (id) DO NOTHING;

// src/lib/api/mockData.ts
import { HeroArticle } from "@/components/features/home/HeroSection";
import { Article } from "@/components/features/articles/ArticleCard";
import { Comment } from "@/hooks/useArticleComments";
import { DocumentNode, print } from 'graphql';
import { User } from "@/hooks/useUserProfile";
// Update User type to include verification status
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isEmailVerified?: boolean; // Added for verification
}
import { UserPreferences } from "@/hooks/useUserPreferences";

interface CategoryDetails {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  availableTags?: string[]; // Added for category details query
}

// --- Mock Author Details (with Bio) ---
interface Author {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

const mockAuthors: Record<string, Author> = {
  "sarah-johnson": { id: "sarah-johnson", name: "Sarah Johnson", role: "AI Research Lead", avatar: "/images/authors/sarah-johnson.jpg", bio: "Sarah is a leading researcher in AI ethics and applications, focusing on the societal impact of machine learning." },
  "michael-chen": { id: "michael-chen", name: "Michael Chen", avatar: "/images/authors/michael-chen.jpg", bio: "Michael is a full-stack developer with a passion for decentralized technologies and building the future of the web." },
  "priya-sharma": { id: "priya-sharma", name: "Priya Sharma", avatar: "/images/authors/priya-sharma.jpg", bio: "Priya explores the intersection of quantum physics and computer science, seeking practical applications for complex theories." },
  "james-wilson": { id: "james-wilson", name: "James Wilson", avatar: "/images/authors/james-wilson.jpg", bio: "James is a cybersecurity expert with over 15 years of experience protecting organizations from digital threats." },
  "alex-rodriguez": { id: "alex-rodriguez", name: "Alex Rodriguez", avatar: "/images/authors/alex-rodriguez.jpg", bio: "Alex is a frontend architect specializing in React and Next.js, dedicated to building performant and scalable web applications." },
  "emma-thompson": { id: "emma-thompson", name: "Emma Thompson", avatar: "/images/authors/emma-thompson.jpg", bio: "Emma focuses on design systems and CSS architecture, helping teams create maintainable and beautiful user interfaces." },
  "david-kim": { id: "david-kim", name: "David Kim", avatar: "/images/authors/david-kim.jpg", bio: "David is an advocate for web accessibility, ensuring digital experiences are inclusive for everyone." },
  "sophia-martinez": { id: "sophia-martinez", name: "Sophia Martinez", avatar: "/images/authors/sophia-martinez.jpg", bio: "Sophia designs and builds robust APIs, focusing on developer experience and system scalability." },
  "thomas-anderson": { id: "thomas-anderson", name: "Thomas Anderson", avatar: "/images/authors/thomas-anderson.jpg", bio: "Thomas works on the edge, literally. He specializes in IoT and edge computing solutions." },
  "olivia-wang": { id: "olivia-wang", name: "Olivia Wang", avatar: "/images/authors/olivia-wang.jpg", bio: "Olivia applies machine learning techniques to solve real-world industrial problems, particularly in predictive maintenance." },
  "robert-johnson": { id: "robert-johnson", name: "Robert Johnson", avatar: "/images/authors/robert-johnson.jpg", bio: "Robert investigates the potential of blockchain technology beyond finance, exploring its use in logistics and healthcare." },
  "natalie-brown": { id: "natalie-brown", name: "Natalie Brown", avatar: "/images/authors/natalie-brown.jpg", bio: "Natalie combines psychology and design to create user experiences that are both effective and delightful." },
  "daniel-lee": { id: "daniel-lee", name: "Daniel Lee", avatar: "/images/authors/daniel-lee.jpg", bio: "Daniel is a cloud architect specializing in serverless technologies and optimizing cloud infrastructure." },
  "current-user": { id: "current-user", name: "Mock User", avatar: "/images/authors/default-avatar.png", bio: "This is the currently logged-in mock user." }, // Mock current user
};

// --- Mock User Profile and Preferences --- //
// Mutable objects to allow updates
let mockUserProfile: User = {
  id: "user-1",
  name: "Mock User",
  email: "user@example.com",
  avatar: "/images/authors/default-avatar.png",
  bio: "This is the currently logged-in mock user.",
  isEmailVerified: false // Start as unverified
};

let mockUserPreferences: UserPreferences = {
  id: "pref-1",
  userId: "user-1",
  darkMode: false,
  emailNotificationsEnabled: true,
  favoriteCategories: ["web-development", "ai-ml"],
  preferredLevel: "intermediate",
  preferredFormats: ["article", "tutorial"]
};

// --- Mock Newsletter Subscribers --- //
// Use a Set for efficient checking of existing emails
const mockNewsletterSubscribers = new Set<string>();

// --- Mock Password Reset Tokens --- //
// Simple map to store email -> token association
const mockPasswordResetTokens = new Map<string, string>();

// --- Mock Email Verification Tokens --- //
interface VerificationTokenInfo {
  token: string;
  userId: string;
  expiresAt: number;
}
const mockEmailVerificationTokens = new Map<string, VerificationTokenInfo>(); // Map token -> info

// --- Mock Article Content --- //
const mockArticleContent: Record<string, string> = {
  "future-of-ai-2025": `
## The AI Revolution is Here

Artificial Intelligence (AI) is no longer a futuristic concept; it's actively reshaping industries today. From personalized medicine to automated financial trading, AI's influence is pervasive and growing exponentially.

### Key Areas of Transformation

*   **Healthcare:** AI algorithms analyze medical images with remarkable accuracy, assist in drug discovery, and personalize treatment plans.
*   **Finance:** Algorithmic trading, fraud detection, and personalized financial advice are becoming standard practice.
*   **Retail:** AI powers recommendation engines, optimizes supply chains, and enhances customer service through chatbots.

> AI is not just about automating tasks; it's about augmenting human capabilities and unlocking new possibilities.

### Challenges and Considerations

Despite the immense potential, ethical considerations, data privacy concerns, and the need for robust regulation remain critical challenges that must be addressed as AI continues to evolve.

*   Bias in algorithms
*   Job displacement
*   Security vulnerabilities

*Stay tuned for more insights into the evolving world of AI.*
`,
  "web3-development-guide": `
## Entering the Decentralized Web

Web3 represents a paradigm shift towards a more decentralized, user-centric internet. Building on blockchain technology, it promises greater transparency, security, and user control over data.

### Core Technologies

*   **Blockchain:** Distributed ledger technology (e.g., Ethereum, Solana).
*   **Smart Contracts:** Self-executing contracts with predefined rules.
*   **Cryptocurrencies/Tokens:** Native digital assets for transactions and governance.
*   **Decentralized Storage:** Systems like IPFS for storing data off-chain.

### Getting Started

1.  **Learn Solidity:** The primary language for Ethereum smart contracts.
2.  **Choose a Framework:** Hardhat or Truffle for development and testing.
3.  **Connect to the Blockchain:** Use libraries like Ethers.js or Web3.js.
4.  **Build a Frontend:** Use React, Vue, or Angular with libraries like RainbowKit or Wagmi for wallet integration.

Building in Web3 requires a different mindset, focusing on trustlessness and community governance. It's a challenging but rewarding field with the potential to reshape digital interaction.
`,
  "quantum-computing-business-applications": `
## Quantum Leaps in Business

Quantum computing promises to solve problems currently intractable for classical computers. While still emerging, its potential applications in optimization, materials science, and cryptography are immense.

*   **Optimization:** Solving complex logistics and financial modeling problems.
*   **Materials Science:** Simulating molecules for drug discovery and new materials.
*   **Cryptography:** Breaking current encryption standards and enabling new secure communication methods.

The race for quantum supremacy is on, and businesses need to start exploring its potential impact.
`,
  "cybersecurity-ai-threats-defenses": `
## AI: Cybersecurity's Double-Edged Sword

AI is transforming cybersecurity, introducing sophisticated new threats while also offering powerful defensive capabilities.

### AI-Powered Threats

*   **Adaptive Malware:** Viruses that learn and change to evade detection.
*   **Sophisticated Phishing:** AI-generated emails and messages that are harder to spot.
*   **Automated Attacks:** AI coordinating large-scale network attacks.

### AI-Powered Defenses

*   **Threat Detection:** Identifying anomalies and predicting attacks.
*   **Automated Response:** Quickly neutralizing threats.
*   **Vulnerability Analysis:** Proactively finding weaknesses.

Understanding both sides of the AI coin is crucial for staying secure.
`,
  "nextjs-15-new-features": `
## What's New in Next.js 15?

Next.js continues to push the boundaries of React development. Version 15 introduces several exciting features aimed at improving developer experience and application performance.

*   **Enhanced Server Actions:** More robust and flexible server-side mutations.
*   **Improved Caching:** Finer-grained control over caching strategies.
*   **Partial Prerendering (Experimental):** Combining static generation with dynamic capabilities.

This release solidifies Next.js's position as a leading framework for building modern web applications.
`,
  "css-architecture-large-applications": `
## Taming the CSS Beast

Managing CSS in large projects can be challenging. Adopting a robust architecture is key to maintainability and scalability.

### Popular Approaches

*   **BEM (Block, Element, Modifier):** Naming convention for clarity.
*   **CSS Modules:** Scoped styles to prevent conflicts.
*   **Styled Components/Emotion:** CSS-in-JS for component-level styling.
*   **Tailwind CSS:** Utility-first framework for rapid development.

Choosing the right approach depends on team preference and project needs, but consistency is paramount.
`,
  "building-accessible-web-applications": `
## Web Accessibility: Beyond Compliance

Building accessible websites isn't just about meeting legal requirements; it's about creating inclusive experiences for everyone.

### Key Principles (WCAG)

*   **Perceivable:** Information must be presentable to users in ways they can perceive.
*   **Operable:** User interface components and navigation must be operable.
*   **Understandable:** Information and the operation of the user interface must be understandable.
*   **Robust:** Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

Focus on semantic HTML, ARIA attributes, keyboard navigation, and color contrast.
`,
  "api-design-best-practices": `
## Crafting Effective APIs

Well-designed APIs are crucial for building scalable and maintainable systems. They serve as the contract between different parts of an application or between different services.

### Best Practices

*   **Consistency:** Use consistent naming conventions, data formats, and error handling.
*   **Clear Documentation:** Provide comprehensive and easy-to-understand documentation.
*   **Versioning:** Implement a clear versioning strategy.
*   **Security:** Protect endpoints with proper authentication and authorization.
*   **Performance:** Optimize queries and use caching where appropriate.

Invest time in API design; it pays dividends in the long run.
`,
  "edge-computing-iot-ecosystems": `
## The Edge Advantage in IoT

Edge computing processes data closer to where it's generated, offering significant benefits for IoT systems.

*   **Reduced Latency:** Faster response times for critical applications.
*   **Bandwidth Savings:** Less data needs to be sent to the cloud.
*   **Improved Reliability:** Operations can continue even with intermittent cloud connectivity.
*   **Enhanced Privacy/Security:** Sensitive data can be processed locally.

Edge computing is becoming essential for scaling IoT deployments effectively.
`,
  "machine-learning-predictive-maintenance": `
## Predicting Failures with ML

Predictive maintenance uses machine learning to anticipate equipment failures before they occur, minimizing downtime and costs.

### How it Works

1.  **Data Collection:** Gather sensor data (temperature, vibration, etc.).
2.  **Feature Engineering:** Select relevant data features.
3.  **Model Training:** Train ML models (e.g., regression, classification) on historical data.
4.  **Prediction:** Use the model to predict remaining useful life or failure probability.
5.  **Action:** Schedule maintenance proactively.

It's a powerful application of ML in industrial settings.
`,
  "blockchain-beyond-cryptocurrency": `
## Blockchain's Wider Potential

While known for cryptocurrencies, blockchain technology offers solutions for various industries.

*   **Supply Chain:** Tracking goods transparently and immutably.
*   **Healthcare:** Securely managing patient records.
*   **Voting Systems:** Enhancing election security and transparency.
*   **Intellectual Property:** Protecting ownership rights.

The core principles of decentralization and immutability have far-reaching implications.
`,
  "psychology-of-ux-design": `
## Designing for the Mind

Understanding cognitive psychology principles can significantly improve UX design.

*   **Cognitive Load:** Minimize mental effort required to use an interface.
*   **Hick's Law:** More choices lead to longer decision times.
*   **Gestalt Principles:** How users perceive visual elements as unified wholes.
*   **Color Psychology:** The emotional impact of different colors.

By designing with the user's mind in consideration, we create more intuitive and effective experiences.
`,
  "serverless-architecture-benefits-challenges": `
## The Serverless Revolution

Serverless architecture allows developers to build and run applications without managing servers.

### Benefits

*   **Scalability:** Automatically scales with demand.
*   **Cost-Effectiveness:** Pay only for compute time consumed.
*   **Reduced Operational Overhead:** No server maintenance.

### Challenges

*   **Vendor Lock-in:** Dependence on cloud provider services.
*   **Cold Starts:** Potential latency for infrequently used functions.
*   **Debugging/Monitoring:** Can be more complex.

Serverless offers compelling advantages but requires careful consideration of its trade-offs.
`,
};

// --- Mock Comments --- //
// Use a mutable structure for comments to allow adding new ones
let mockComments: Record<string, Comment[]> = {
  "future-of-ai-2025": [
    { id: "c1", content: "Great overview! The impact on healthcare is particularly fascinating.", createdAt: "2025-05-21T10:00:00Z", author: mockAuthors["michael-chen"] },
    { id: "c2", content: "I'm concerned about the ethical implications. How can we ensure fairness?", createdAt: "2025-05-21T11:30:00Z", author: mockAuthors["priya-sharma"] },
    { id: "c3", content: "Excellent points on the challenges. Regulation needs to catch up quickly.", createdAt: "2025-05-22T09:15:00Z", author: mockAuthors["james-wilson"] },
  ],
  "web3-development-guide": [
    { id: "c4", content: "This is a fantastic starting point for anyone looking to get into Web3 dev.", createdAt: "2025-05-20T14:00:00Z", author: mockAuthors["alex-rodriguez"] },
    { id: "c5", content: "Learning Solidity is key! Also, understanding gas fees is crucial.", createdAt: "2025-05-20T16:25:00Z", author: mockAuthors["emma-thompson"] },
  ],
  "quantum-computing-business-applications": [], // Start with no comments
  "cybersecurity-ai-threats-defenses": [
    { id: "c8", content: "The dual nature of AI in security is well explained.", createdAt: "2025-05-18T10:00:00Z", author: mockAuthors["thomas-anderson"] },
  ],
  "nextjs-15-new-features": [
     { id: "c6", content: "Partial Prerendering sounds very promising!", createdAt: "2025-05-17T08:00:00Z", author: mockAuthors["david-kim"] },
     { id: "c7", content: "Can't wait to try out the improved Server Actions.", createdAt: "2025-05-17T09:30:00Z", author: mockAuthors["sophia-martinez"] },
  ],
  "css-architecture-large-applications": [
    { id: "c9", content: "Tailwind has been a game-changer for our team.", createdAt: "2025-05-16T11:00:00Z", author: mockAuthors["alex-rodriguez"] },
  ],
  "building-accessible-web-applications": [
    { id: "c10", content: "Accessibility should be a priority from the start, not an afterthought.", createdAt: "2025-05-15T13:00:00Z", author: mockAuthors["david-kim"] },
    { id: "c11", content: "Great reminder of the WCAG principles.", createdAt: "2025-05-15T15:45:00Z", author: mockAuthors["natalie-brown"] },
  ],
  "api-design-best-practices": [
    { id: "c12", content: "Consistency is key! Makes consuming the API so much easier.", createdAt: "2025-05-14T10:00:00Z", author: mockAuthors["sophia-martinez"] },
  ],
  "edge-computing-iot-ecosystems": [
    { id: "c13", content: "Reduced latency is critical for our real-time IoT applications.", createdAt: "2025-05-13T14:30:00Z", author: mockAuthors["thomas-anderson"] },
  ],
  "machine-learning-predictive-maintenance": [
    { id: "c14", content: "The cost savings from predictive maintenance can be substantial.", createdAt: "2025-05-12T09:00:00Z", author: mockAuthors["olivia-wang"] },
  ],
  "blockchain-beyond-cryptocurrency": [
    { id: "c15", content: "Supply chain transparency is a huge potential win for blockchain.", createdAt: "2025-05-11T16:00:00Z", author: mockAuthors["robert-johnson"] },
  ],
  "psychology-of-ux-design": [
    { id: "c16", content: "Understanding cognitive load has really improved my designs.", createdAt: "2025-05-10T11:00:00Z", author: mockAuthors["natalie-brown"] },
  ],
  "serverless-architecture-benefits-challenges": [
    { id: "c17", content: "Cold starts can be tricky, but often manageable with optimization.", createdAt: "2025-05-09T15:00:00Z", author: mockAuthors["daniel-lee"] },
  ],
};

// --- Mock Articles Data --- //
const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Future of AI: Predictions for 2025 and Beyond",
    excerpt: "Explore the upcoming trends in artificial intelligence, from advancements in NLP to the rise of ethical AI frameworks.",
    slug: "future-of-ai-2025",
    coverImage: "/images/articles/ai-future.jpg",
    publishedAt: "2025-05-20T09:00:00Z",
    readingTime: 6,
    tags: ["AI", "Machine Learning", "Ethics", "NLP"],
    category: { name: "AI & Machine Learning", slug: "ai-ml" },
    author: { id: "sarah-johnson", name: "Sarah Johnson", avatar: "/images/authors/sarah-johnson.jpg" },
  },
  {
    id: "2",
    title: "Getting Started with Web3 Development: A Beginner's Guide",
    excerpt: "Dive into the world of decentralized applications, smart contracts, and blockchain technology.",
    slug: "web3-development-guide",
    coverImage: "/images/articles/web3-dev.jpg",
    publishedAt: "2025-05-19T11:00:00Z",
    readingTime: 8,
    tags: ["Web3", "Blockchain", "Solidity", "Ethereum", "Tutorial"],
    category: { name: "Web Development", slug: "web-development" },
    author: { id: "michael-chen", name: "Michael Chen", avatar: "/images/authors/michael-chen.jpg" },
  },
  {
    id: "3",
    title: "Quantum Computing: Potential Business Applications",
    excerpt: "How quantum computers could revolutionize industries like finance, medicine, and materials science.",
    slug: "quantum-computing-business-applications",
    coverImage: "/images/articles/quantum-computing.jpg",
    publishedAt: "2025-05-18T14:30:00Z",
    readingTime: 5,
    tags: ["Quantum Computing", "Business", "Innovation"],
    category: { name: "Emerging Tech", slug: "emerging-tech" },
    author: { id: "priya-sharma", name: "Priya Sharma", avatar: "/images/authors/priya-sharma.jpg" },
  },
  {
    id: "4",
    title: "Cybersecurity in the Age of AI: Threats and Defenses",
    excerpt: "Understanding how AI is used by both attackers and defenders in the evolving landscape of cybersecurity.",
    slug: "cybersecurity-ai-threats-defenses",
    coverImage: "/images/articles/cybersecurity-ai.jpg",
    publishedAt: "2025-05-17T10:00:00Z",
    readingTime: 7,
    tags: ["Cybersecurity", "AI", "Threat Intelligence", "Security"],
    category: { name: "Cybersecurity", slug: "cybersecurity" },
    author: { id: "james-wilson", name: "James Wilson", avatar: "/images/authors/james-wilson.jpg" },
  },
  {
    id: "5",
    title: "Exploring the New Features in Next.js 15",
    excerpt: "A deep dive into the latest updates and improvements in the popular React framework.",
    slug: "nextjs-15-new-features",
    coverImage: "/images/articles/nextjs-logo.jpg",
    publishedAt: "2025-05-16T09:00:00Z",
    readingTime: 6,
    tags: ["Next.js", "React", "Web Development", "Frameworks"],
    category: { name: "Web Development", slug: "web-development" },
    author: { id: "alex-rodriguez", name: "Alex Rodriguez", avatar: "/images/authors/alex-rodriguez.jpg" },
  },
  {
    id: "6",
    title: "CSS Architecture for Large-Scale Applications",
    excerpt: "Strategies and methodologies for writing maintainable and scalable CSS in complex projects.",
    slug: "css-architecture-large-applications",
    coverImage: "/images/articles/css-architecture.jpg",
    publishedAt: "2025-05-15T16:00:00Z",
    readingTime: 7,
    tags: ["CSS", "Frontend", "Architecture", "Web Development"],
    category: { name: "Web Development", slug: "web-development" },
    author: { id: "emma-thompson", name: "Emma Thompson", avatar: "/images/authors/emma-thompson.jpg" },
  },
  {
    id: "7",
    title: "Practical Guide to Building Accessible Web Applications",
    excerpt: "Tips and techniques for ensuring your web apps are usable by everyone, including people with disabilities.",
    slug: "building-accessible-web-applications",
    coverImage: "/images/articles/accessibility.jpg",
    publishedAt: "2025-05-14T11:30:00Z",
    readingTime: 8,
    tags: ["Accessibility", "Web Development", "WCAG", "Inclusive Design"],
    category: { name: "Web Development", slug: "web-development" },
    author: { id: "david-kim", name: "David Kim", avatar: "/images/authors/david-kim.jpg" },
  },
  {
    id: "8",
    title: "API Design Best Practices for Modern Applications",
    excerpt: "Learn how to design robust, scalable, and developer-friendly APIs using REST and GraphQL principles.",
    slug: "api-design-best-practices",
    coverImage: "/images/articles/api-design.jpg",
    publishedAt: "2025-05-13T09:00:00Z",
    readingTime: 9,
    tags: ["API", "REST", "GraphQL", "Backend", "Software Design"],
    category: { name: "Software Engineering", slug: "software-engineering" },
    author: { id: "sophia-martinez", name: "Sophia Martinez", avatar: "/images/authors/sophia-martinez.jpg" },
  },
  {
    id: "9",
    title: "The Rise of Edge Computing in IoT Ecosystems",
    excerpt: "How processing data closer to the source is transforming IoT applications and enabling new possibilities.",
    slug: "edge-computing-iot-ecosystems",
    coverImage: "/images/articles/edge-computing.jpg",
    publishedAt: "2025-05-12T14:00:00Z",
    readingTime: 6,
    tags: ["Edge Computing", "IoT", "Cloud Computing", "Networking"],
    category: { name: "Cloud & Infrastructure", slug: "cloud-infrastructure" },
    author: { id: "thomas-anderson", name: "Thomas Anderson", avatar: "/images/authors/thomas-anderson.jpg" },
  },
  {
    id: "10",
    title: "Applying Machine Learning for Predictive Maintenance",
    excerpt: "Using ML algorithms to predict equipment failures and optimize maintenance schedules.",
    slug: "machine-learning-predictive-maintenance",
    coverImage: "/images/articles/predictive-maintenance.jpg",
    publishedAt: "2025-05-11T10:00:00Z",
    readingTime: 7,
    tags: ["Machine Learning", "AI", "Industrial IoT", "Data Science"],
    category: { name: "AI & Machine Learning", slug: "ai-ml" },
    author: { id: "olivia-wang", name: "Olivia Wang", avatar: "/images/authors/olivia-wang.jpg" },
  },
  {
    id: "11",
    title: "Blockchain Technology Beyond Cryptocurrency",
    excerpt: "Exploring the potential of blockchain in supply chain management, healthcare, voting, and more.",
    slug: "blockchain-beyond-cryptocurrency",
    coverImage: "/images/articles/blockchain-apps.jpg",
    publishedAt: "2025-05-10T13:15:00Z",
    readingTime: 8,
    tags: ["Blockchain", "Decentralization", "Technology", "Innovation"],
    category: { name: "Emerging Tech", slug: "emerging-tech" },
    author: { id: "robert-johnson", name: "Robert Johnson", avatar: "/images/authors/robert-johnson.jpg" },
  },
  {
    id: "12",
    title: "The Psychology of User Experience Design",
    excerpt: "How understanding cognitive biases and psychological principles can lead to better UX.",
    slug: "psychology-of-ux-design",
    coverImage: "/images/articles/ux-psychology.jpg",
    publishedAt: "2025-05-09T09:30:00Z",
    readingTime: 7,
    tags: ["UX", "UI", "Design", "Psychology", "Human-Computer Interaction"],
    category: { name: "Design & UX", slug: "design-ux" },
    author: { id: "natalie-brown", name: "Natalie Brown", avatar: "/images/authors/natalie-brown.jpg" },
  },
  {
    id: "13",
    title: "Serverless Architecture: Benefits and Challenges",
    excerpt: "An overview of serverless computing, its advantages, and potential drawbacks to consider.",
    slug: "serverless-architecture-benefits-challenges",
    coverImage: "/images/articles/serverless.jpg",
    publishedAt: "2025-05-08T17:00:00Z",
    readingTime: 6,
    tags: ["Serverless", "Cloud Computing", "AWS Lambda", "Architecture"],
    category: { name: "Cloud & Infrastructure", slug: "cloud-infrastructure" },
    author: { id: "daniel-lee", name: "Daniel Lee", avatar: "/images/authors/daniel-lee.jpg" },
  },
];

// --- Mock Categories Data --- //
const mockCategories: CategoryDetails[] = [
  { id: "cat-1", name: "AI & Machine Learning", slug: "ai-ml", description: "Latest advancements and applications in Artificial Intelligence and Machine Learning.", availableTags: ["AI", "Machine Learning", "Ethics", "NLP", "Data Science", "Industrial IoT"] },
  { id: "cat-2", name: "Web Development", slug: "web-development", description: "Tutorials, frameworks, and best practices for modern web development.", availableTags: ["Web3", "Blockchain", "Solidity", "Ethereum", "Tutorial", "Next.js", "React", "Frameworks", "CSS", "Frontend", "Architecture", "Accessibility", "WCAG", "Inclusive Design"] },
  { id: "cat-3", name: "Emerging Tech", slug: "emerging-tech", description: "Exploring the frontiers of technology, from quantum computing to blockchain.", availableTags: ["Quantum Computing", "Business", "Innovation", "Blockchain", "Decentralization", "Technology"] },
  { id: "cat-4", name: "Cybersecurity", slug: "cybersecurity", description: "Protecting digital assets in an increasingly connected world.", availableTags: ["Cybersecurity", "AI", "Threat Intelligence", "Security"] },
  { id: "cat-5", name: "Software Engineering", slug: "software-engineering", description: "Principles and practices for building robust and scalable software.", availableTags: ["API", "REST", "GraphQL", "Backend", "Software Design"] },
  { id: "cat-6", name: "Cloud & Infrastructure", slug: "cloud-infrastructure", description: "Cloud computing, DevOps, and infrastructure management.", availableTags: ["Edge Computing", "IoT", "Cloud Computing", "Networking", "Serverless", "AWS Lambda", "Architecture"] },
  { id: "cat-7", name: "Design & UX", slug: "design-ux", description: "Creating effective and engaging user experiences.", availableTags: ["UX", "UI", "Design", "Psychology", "Human-Computer Interaction"] },
];

// --- Helper to get Operation Name --- //
const getOperationName = (query: DocumentNode): string | null => {
  const definition = query.definitions.find(
    (def): def is import('graphql').OperationDefinitionNode => def.kind === 'OperationDefinition'
  );
  return definition?.name?.value || null;
};

// --- Mock GraphQL Handler --- //
export const mockGraphQLHandler = async <TData = any>(
  query: DocumentNode,
  variables?: Record<string, any>
): Promise<TData> => {
  const operationName = getOperationName(query);
  console.log(`[Mock API] Handling operation: ${operationName}`, variables);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate potential random errors (e.g., 10% chance)
  // if (Math.random() < 0.1) {
  //   console.error("[Mock API] Simulating random network error");
  //   throw new Error("Simulated network error");
  // }

  switch (operationName) {
    case 'GetHeroArticle':
      return { heroArticle: mockHeroArticle } as TData;
    case 'GetFeaturedArticles':
      return { featuredArticles: mockFeaturedArticles.slice(0, variables?.limit ?? 3) } as TData;
    case 'GetArticlesByCategoryShowcase':
      const showcaseCategorySlug = variables?.slug;
      const showcaseLimit = variables?.limit ?? 4;
      const showcaseArticles = mockArticles
        .filter(a => a.category.slug === showcaseCategorySlug)
        .slice(0, showcaseLimit);
      return { articlesByCategory: showcaseArticles } as TData;
    case 'GetTopPicks':
      return { topPicks: mockTopPicks.slice(0, variables?.limit ?? 5) } as TData;
    case 'GetLatestArticles':
      const latestLimit = variables?.limit ?? 6;
      const latestOffset = variables?.offset ?? 0;
      const latestPaginated = mockArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(latestOffset, latestOffset + latestLimit);
      return {
        latestArticles: {
          articles: latestPaginated,
          totalCount: mockArticles.length,
        }
      } as TData;
    case 'GetCategoryDetails':
      const detailSlug = variables?.slug;
      const categoryDetail = mockCategories.find(c => c.slug === detailSlug);
      if (!categoryDetail) {
        throw new Error(`Category with slug '${detailSlug}' not found.`);
      }
      return { category: categoryDetail } as TData;
    case 'GetCategoryPageArticles':
      const categorySlug = variables?.slug;
      const limit = variables?.limit ?? 9;
      const offset = variables?.offset ?? 0;
      const sortBy = variables?.sortBy ?? 'newest';
      const tags = variables?.tags ?? [];

      let filteredArticles = mockArticles.filter(a => a.category.slug === categorySlug);

      // Apply tag filtering (match all selected tags)
      if (tags.length > 0) {
        filteredArticles = filteredArticles.filter(article => 
          tags.every((tag: string) => article.tags.includes(tag))
        );
      }

      // Apply sorting
      filteredArticles.sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
      });

      const totalCount = filteredArticles.length;
      const paginatedArticles = filteredArticles.slice(offset, offset + limit);

      return {
        categoryArticles: {
          articles: paginatedArticles,
          totalCount: totalCount,
        }
      } as TData;
    case 'SearchArticles':
      const queryText = (variables?.query ?? '').toLowerCase();
      const searchLimit = variables?.limit ?? 10;
      const searchOffset = variables?.offset ?? 0;

      if (!queryText) {
        return { searchArticles: { articles: [], totalCount: 0 } } as TData;
      }

      const searchResults = mockArticles.filter(a => 
        a.title.toLowerCase().includes(queryText) || 
        a.excerpt.toLowerCase().includes(queryText)
      );
      const searchTotalCount = searchResults.length;
      const searchPaginated = searchResults.slice(searchOffset, searchOffset + searchLimit);

      return {
        searchArticles: {
          articles: searchPaginated,
          totalCount: searchTotalCount,
        }
      } as TData;
    case 'GetArticleDetails':
      const articleSlug = variables?.slug;
      const articleDetail = mockArticles.find(a => a.slug === articleSlug);
      if (!articleDetail) {
        // Simulate a 'not found' error
        throw new Error(`Article with slug '${articleSlug}' not found.`);
      }
      // Add full content and detailed author info
      const fullArticleDetail = {
        ...articleDetail,
        content: mockArticleContent[articleSlug] || "Article content not found.",
        author: mockAuthors[articleDetail.author.id] || articleDetail.author, // Use detailed author if available
      };
      return { article: fullArticleDetail } as TData;
    case 'GetRelatedArticles':
      const relatedSlug = variables?.slug;
      const relatedLimit = variables?.limit ?? 3;
      const currentArticle = mockArticles.find(a => a.slug === relatedSlug);
      if (!currentArticle) {
        return { relatedArticles: [] } as TData;
      }
      const related = mockArticles
        .filter(a => a.category.slug === currentArticle.category.slug && a.slug !== relatedSlug)
        .slice(0, relatedLimit);
      return { relatedArticles: related } as TData;
    case 'GetArticleComments':
      const commentSlug = variables?.slug;
      const commentLimit = variables?.limit ?? 10;
      const commentOffset = variables?.offset ?? 0;
      const allComments = mockComments[commentSlug] || [];
      const commentTotalCount = allComments.length;
      const paginatedComments = allComments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort newest first
        .slice(commentOffset, commentOffset + commentLimit);
      return {
        articleComments: {
          comments: paginatedComments,
          totalCount: commentTotalCount,
        }
      } as TData;
    case 'CreateComment':
      const { articleSlug: createCommentSlug, content } = variables || {};
      if (!createCommentSlug || !content) {
        throw new Error("Missing articleSlug or content for creating comment.");
      }
      if (!mockComments[createCommentSlug]) {
        mockComments[createCommentSlug] = [];
      }
      const newComment: Comment = {
        id: `c${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        author: mockAuthors["current-user"], // Use the mock current user
      };
      mockComments[createCommentSlug].push(newComment);
      console.log(`[Mock API] Added comment to ${createCommentSlug}:`, newComment);
      return { createComment: newComment } as TData;
    case 'GetUserProfile':
      // Simulate fetching the current user's profile
      // Ensure the latest verification status is included
      return { userProfile: { ...mockUserProfile } } as TData;
    case 'GetUserPreferences':
      // Simulate fetching the current user's preferences
      return { userPreferences: mockUserPreferences } as TData;
    case 'UpdateUserProfile':
      console.log("[Mock API] Updating user profile with:", variables);
      mockUserProfile = { 
        ...mockUserProfile, 
        ...(variables?.name && { name: variables.name }),
        ...(variables?.bio && { bio: variables.bio }),
        ...(variables?.avatar && { avatar: variables.avatar }), // Assuming avatar is just a URL string for now
      };
      console.log("[Mock API] Updated mockUserProfile:", mockUserProfile);
      return { updateUserProfile: { ...mockUserProfile } } as TData;
    case 'UpdateUserPreferences':
      console.log("[Mock API] Updating user preferences with:", variables);
      mockUserPreferences = { 
        ...mockUserPreferences, 
        ...(variables?.darkMode !== undefined && { darkMode: variables.darkMode }),
        ...(variables?.emailNotificationsEnabled !== undefined && { emailNotificationsEnabled: variables.emailNotificationsEnabled }),
        ...(variables?.favoriteCategories && { favoriteCategories: variables.favoriteCategories }),
        ...(variables?.preferredLevel && { preferredLevel: variables.preferredLevel }),
        ...(variables?.preferredFormats && { preferredFormats: variables.preferredFormats }),
      };
      console.log("[Mock API] Updated mockUserPreferences:", mockUserPreferences);
      return { updateUserPreferences: mockUserPreferences } as TData;
    case 'ChangePassword':
      const { currentPassword, newPassword } = variables || {};
      console.log("[Mock API] Attempting password change...");
      // Simulate password check (always succeeds in mock)
      if (currentPassword === "password123") { // Simulate correct current password
        console.log("[Mock API] Password changed successfully (mock).");
        return { changePassword: { success: true, message: "Password changed successfully." } } as TData;
      } else {
        console.log("[Mock API] Incorrect current password (mock).");
        return { changePassword: { success: false, message: "Incorrect current password." } } as TData;
      }
    case 'SubscribeToNewsletter':
      const { email } = variables || {};
      console.log(`[Mock API] Attempting newsletter subscription for: ${email}`);
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log("[Mock API] Invalid email format.");
        return { subscribeToNewsletter: { success: false, message: "Please enter a valid email address." } } as TData;
      }
      if (mockNewsletterSubscribers.has(email)) {
        console.log(`[Mock API] Email ${email} already subscribed.`);
        return { subscribeToNewsletter: { success: false, message: "This email is already subscribed." } } as TData;
      }
      // Simulate potential server error
      if (email === "error@example.com") {
        console.log("[Mock API] Simulating server error for newsletter subscription.");
        throw new Error("Simulated server error during subscription.");
      }
      
      mockNewsletterSubscribers.add(email);
      console.log(`[Mock API] Added ${email} to subscribers. Total: ${mockNewsletterSubscribers.size}`);
      return { subscribeToNewsletter: { success: true, message: "Successfully subscribed!" } } as TData;
    case 'RequestPasswordReset':
      const { email: resetEmail } = variables || {};
      console.log(`[Mock API] Requesting password reset for: ${resetEmail}`);
      if (!resetEmail || mockUserProfile.email !== resetEmail) { // Simple check against mock user
        console.log("[Mock API] Email not found for password reset (or doesn't match mock user).");
        // Still return success to prevent email enumeration
        return { requestPasswordReset: { success: true, message: "If an account exists for this email, a reset link has been sent." } } as TData;
      }
      // Generate and store mock token
      const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      mockPasswordResetTokens.set(resetEmail, resetToken);
      console.log(`[Mock API] Generated password reset token for ${resetEmail}: ${resetToken} (Simulating email send)`);
      return { requestPasswordReset: { success: true, message: "If an account exists for this email, a reset link has been sent." } } as TData;
    case 'ResetPassword':
      const { token: providedResetToken, newPassword } = variables || {};
      console.log(`[Mock API] Attempting password reset with token: ${providedResetToken}`);
      let foundEmail: string | null = null;
      for (const [email, token] of mockPasswordResetTokens.entries()) {
        if (token === providedResetToken) {
          foundEmail = email;
          break;
        }
      }

      if (foundEmail && mockUserProfile.email === foundEmail) {
        console.log(`[Mock API] Valid reset token found for ${foundEmail}. Updating password.`);
        // Simulate password update (no actual hashing)
        mockPasswordResetTokens.delete(foundEmail); // Remove used token
        console.log(`[Mock API] Password for ${foundEmail} updated to ${newPassword} (mock).`);
        return { resetPassword: { success: true, message: "Password has been successfully reset." } } as TData;
      } else {
        console.log("[Mock API] Invalid or expired password reset token.");
        return { resetPassword: { success: false, message: "Invalid or expired password reset token." } } as TData;
      }

    // --- Add Email Verification Logic --- //
    case 'RequestEmailVerification':
      // Assuming this is requested by the currently logged-in user (mockUserProfile)
      console.log(`[Mock API] Requesting email verification for: ${mockUserProfile.email}`);
      if (mockUserProfile.isEmailVerified) {
        console.log("[Mock API] Email already verified.");
        return { requestEmailVerification: { success: false, message: "Email is already verified." } } as TData;
      }
      // Generate and store verification token
      const verificationToken = `verify-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const expiresAt = Date.now() + 3600 * 1000; // Expires in 1 hour
      mockEmailVerificationTokens.set(verificationToken, { token: verificationToken, userId: mockUserProfile.id, expiresAt });
      console.log(`[Mock API] Generated verification token for ${mockUserProfile.email}: ${verificationToken} (Simulating email send)`);
      return { requestEmailVerification: { success: true, message: "Verification email sent. Please check your inbox." } } as TData;

    case 'VerifyEmail':
      const { token: providedVerifyToken } = variables || {};
      console.log(`[Mock API] Attempting email verification with token: ${providedVerifyToken}`);
      const tokenInfo = mockEmailVerificationTokens.get(providedVerifyToken);

      if (tokenInfo && tokenInfo.userId === mockUserProfile.id && Date.now() < tokenInfo.expiresAt) {
        console.log(`[Mock API] Valid verification token found for user ${tokenInfo.userId}. Verifying email.`);
        mockUserProfile.isEmailVerified = true; // Update user status
        mockEmailVerificationTokens.delete(providedVerifyToken); // Remove used token
        console.log(`[Mock API] Email for user ${tokenInfo.userId} verified.`);
        return {
          verifyEmail: {
            success: true,
            message: "Email verified successfully.",
            user: { ...mockUserProfile } // Return updated user
          }
        } as TData;
      } else {
        let message = "Invalid or expired verification token.";
        if (tokenInfo && Date.now() >= tokenInfo.expiresAt) {
          message = "Verification token has expired.";
          mockEmailVerificationTokens.delete(providedVerifyToken); // Clean up expired token
        }
        console.log(`[Mock API] ${message}`);
        return {
          verifyEmail: {
            success: false,
            message: message,
            user: null
          }
        } as TData;
      }
    // --- End Email Verification Logic --- //

    default:
      console.error(`[Mock API] Unhandled operation: ${operationName}`);
      throw new Error(`Unhandled GraphQL operation: ${operationName}`);
  }
};


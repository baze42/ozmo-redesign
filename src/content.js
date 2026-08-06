const services = [
  {
    title: "Website design and redesign",
    shortTitle: "Website design",
    icon: "layout",
    summary: "A clear, fast, conversion-minded website built around the way your customers actually decide.",
    detail: "We shape the message, structure the pages, and design the experience so your site earns trust before a prospect ever calls.",
    signs: ["Your site feels dated", "Visitors do not know what to do next", "Your best work is hard to understand online"]
  },
  {
    title: "Website care and maintenance",
    shortTitle: "Website care",
    icon: "shield",
    summary: "Updates, backups, security checks, and steady improvements handled before they become distractions.",
    detail: "Your website should not become another system you have to babysit. OZMO keeps it healthy, current, and easy to trust.",
    signs: ["Updates keep getting delayed", "You are worried about security", "Small fixes take too long to get handled"]
  },
  {
    title: "Digital marketing, SEO, and content",
    shortTitle: "Marketing and SEO",
    icon: "chart",
    summary: "Practical campaigns and content that help the right customers find you and understand why you are the right fit.",
    detail: "We focus on the channels and messages that matter for your business instead of chasing every trend.",
    signs: ["You are not sure what is working", "Good customers are not finding you", "Your message changes from channel to channel"]
  },
  {
    title: "Automation, CRM, and email workflows",
    shortTitle: "Automation",
    icon: "workflow",
    summary: "Simple automations that move leads, follow-ups, and customer communication forward in the background.",
    detail: "We connect the pieces so fewer opportunities fall through the cracks and fewer tasks live in your head.",
    signs: ["Follow-up depends on memory", "Leads live in too many places", "Your team repeats the same admin tasks every week"]
  }
];

const quickWins = [
  {
    title: "Save time",
    icon: "clock",
    text: "Spend fewer hours managing websites, content, updates, and follow-up."
  },
  {
    title: "Delight customers",
    icon: "smile",
    text: "Give people a clearer path from first impression to confident next step."
  },
  {
    title: "Grow with confidence",
    icon: "growth",
    text: "Run digital systems that can be measured, maintained, and improved."
  }
];

const painPoints = [
  "Spending too much time on marketing instead of serving your customers.",
  "Feeling overwhelmed by constantly changing digital tools and trends.",
  "Not knowing whether your website and marketing are producing good leads.",
  "Wearing too many hats while the digital side of the business keeps expanding."
];

const planSteps = [
  {
    title: "Schedule a call",
    text: "We listen for what is working, what is stuck, and what would make the biggest difference first."
  },
  {
    title: "Request a site audit",
    text: "You get a plain-spoken view of the gaps, opportunities, and next steps for your website and marketing."
  },
  {
    title: "Let OZMO handle it",
    text: "We build, care for, market, and automate the pieces so your business can keep moving."
  }
];

const articles = [
  {
    title: "Five signs your website is costing you good leads",
    category: "Website strategy",
    date: "August 6, 2026",
    readTime: "6 min read",
    excerpt: "A practical owner-focused checklist for spotting trust, clarity, and conversion gaps before they become expensive.",
    body: [
      "A website does not need to be flashy to work, but it does need to answer the questions your customers are already asking.",
      "If people cannot quickly understand what you do, who you help, and what to do next, the site is quietly adding friction to every referral and search visit.",
      "The strongest small-business websites usually do three things well: they create trust, make the offer plain, and make the next step easy.",
      "A useful audit looks at the whole path: what a visitor sees, how quickly they understand the offer, and whether the next step feels low-risk."
    ],
    takeaway: "Clarity is not a design extra. It is one of the main ways your website earns trust."
  },
  {
    title: "What a healthy website care plan should include",
    category: "Website care",
    date: "July 22, 2026",
    readTime: "5 min read",
    excerpt: "Backups, updates, security, performance, and small improvements should work together as one steady rhythm.",
    body: [
      "Care work is easiest to ignore when everything looks fine from the outside.",
      "The point of a maintenance plan is to prevent small technical issues from becoming customer-facing problems.",
      "A good plan gives you fewer surprises and a clear partner when something needs attention."
    ],
    takeaway: "Maintenance is less about emergencies and more about keeping trust intact."
  },
  {
    title: "Where automation helps without making your business feel cold",
    category: "Automation",
    date: "July 9, 2026",
    readTime: "7 min read",
    excerpt: "The best automations protect follow-up, reduce repetition, and still leave room for real human service.",
    body: [
      "Automation should support hospitality, not replace it.",
      "For many local businesses, the best first automations are simple: inquiry routing, appointment reminders, review requests, and lead follow-up.",
      "The goal is not to make the business feel bigger than it is. The goal is to make the owner and team less dependent on memory."
    ],
    takeaway: "Good automation gives your team more room to be human where it matters."
  },
  {
    title: "How to make your service pages easier to say yes to",
    category: "Conversion",
    date: "June 18, 2026",
    readTime: "4 min read",
    excerpt: "Service pages work better when they explain the problem, the path, and the result in a natural order.",
    body: [
      "Most service pages say what a business offers but skip why it matters.",
      "A stronger page starts with the customer problem, explains the practical path, and gives the reader a clear next step.",
      "That structure helps visitors decide faster and ask better questions when they reach out."
    ],
    takeaway: "A clear service page reduces uncertainty before the first conversation."
  }
];

const concepts = [
  {
    slug: "steady-expert",
    name: "Steady Expert",
    label: "Direction 01",
    tone: "High-trust, editorial, calm, and polished.",
    recommendedFor: "Best for communicating quality, care, strategy, and trust.",
    heroImage: "../../assets/img/be-brilliant-hero.jpg",
    photo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    alt: "A warm meeting table where business owners review a digital plan",
    headline: "Stop juggling your digital marketing. Start growing with confidence.",
    subhead: "OZMO Digital handles the website, marketing, and automation details so you can invest your time in customers and the business you are building.",
    proof: "Sample proof: owners get a clearer website, a steadier marketing rhythm, and fewer digital tasks competing for attention.",
    guideTitle: "A steady guide for the digital work you should not have to carry alone.",
    guideCopy: "We are small business owners too. We know how quickly marketing, website care, tools, and follow-up can pull you away from the work only you can do.",
    successTitle: "A calmer digital presence that works as hard as you do.",
    metric: "1 clear plan",
    stat: "Website, marketing, and follow-up aligned around one practical path."
  },
  {
    slug: "local-growth-studio",
    name: "Local Growth Studio",
    label: "Direction 02",
    tone: "Warm, practical, local, and energetic.",
    recommendedFor: "Best for showing partnership, practical execution, and local-market empathy.",
    heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
    alt: "A small business team collaborating around laptops in natural light",
    headline: "Websites and marketing that help local businesses keep moving.",
    subhead: "We build, care for, and improve the digital side of your business so the right customers can find you, trust you, and take the next step.",
    proof: "Sample proof: clearer service pages, better lead paths, and a plan your team can understand.",
    guideTitle: "Local-business marketing without the agency fog.",
    guideCopy: "OZMO gives you practical help, clear priorities, and careful execution so your business can show up consistently online.",
    successTitle: "More clarity for customers. More breathing room for owners.",
    metric: "3 owner wins",
    stat: "More trust, fewer stalled leads, and a website your team is proud to share."
  },
  {
    slug: "operations-partner",
    name: "Operations Partner",
    label: "Direction 03",
    tone: "Structured, systems-oriented, plain-spoken, and capable.",
    recommendedFor: "Best for emphasizing ongoing support, automation, and measurable digital operations.",
    heroImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
    photo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    alt: "A professional team mapping workflow and digital operations",
    headline: "Let OZMO run the digital systems behind your growth.",
    subhead: "From your website to follow-up workflows, we connect the moving pieces so your digital presence supports the business instead of distracting from it.",
    proof: "Sample proof: fewer missed follow-ups, cleaner systems, and a calmer path from inquiry to customer.",
    guideTitle: "A digital operations partner, not another tool to manage.",
    guideCopy: "We bring the website, marketing, maintenance, and automation pieces into one managed rhythm, then keep improving what matters.",
    successTitle: "A connected digital layer that keeps work moving.",
    metric: "4 connected systems",
    stat: "Website, care, marketing, and automation working from the same plan."
  }
];

const pages = ["index", "services", "contact", "blog", "article"];

module.exports = {
  articles,
  concepts,
  pages,
  painPoints,
  planSteps,
  quickWins,
  services
};

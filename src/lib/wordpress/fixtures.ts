import type {
  PostViewModel,
  ServiceViewModel,
  TransformationViewModel,
} from './mappers';

const updatedAt = '2026-08-08T13:00:00.000Z';

export const fixtureServices: ServiceViewModel[] = [
  {
    id: 1001,
    slug: 'website-design-and-builds',
    title: 'Website design and builds',
    summary:
      'A new website built around a clearer message, stronger structure, and a dependable inquiry path.',
    bodyHtml:
      '<p>OZMO plans, designs, and builds small business websites that explain the offer quickly and make the next step obvious.</p>',
    businessOutcomes: ['Credibility', 'Clarity', 'Lead capture'],
    sections: [
      {
        heading: 'Where it helps',
        body: 'A business needs an owned website that feels credible and directs visitors toward a useful next action.',
      },
      {
        heading: 'How OZMO approaches it',
        body: 'The build starts with positioning and page structure, then moves into fast Astro implementation and practical conversion paths.',
      },
    ],
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    sortOrder: 1,
    seo: {
      title: 'Website Design and Builds',
      description:
        'New small business websites built for clear messaging, credibility, and lead capture.',
    },
    updatedAt,
  },
  {
    id: 1002,
    slug: 'website-redesigns-and-performance-improvements',
    title: 'Website redesigns and performance improvements',
    summary:
      'Focused redesign work for sites that feel dated, load slowly, or make visitors work too hard.',
    bodyHtml:
      '<p>OZMO improves the structure, speed, visual clarity, and calls to action of existing websites without inventing proof the business does not have.</p>',
    businessOutcomes: ['Speed', 'Credibility', 'Ongoing improvement'],
    sections: [
      {
        heading: 'Where it helps',
        body: 'An existing site is still useful, but the experience no longer supports the way customers evaluate the business.',
      },
      {
        heading: 'How OZMO approaches it',
        body: 'The redesign prioritizes load quality, clearer page hierarchy, modern layout, and a better route to inquiry.',
      },
    ],
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    sortOrder: 2,
    seo: {
      title: 'Website Redesigns and Performance Improvements',
      description:
        'Website redesigns that improve speed, polish, clarity, and the path to a lead.',
    },
    updatedAt,
  },
  {
    id: 1003,
    slug: 'messaging-and-conversion-strategy',
    title: 'Messaging and conversion strategy',
    summary:
      'Sharper page messaging and conversion flow for visitors who need to understand the offer quickly.',
    bodyHtml:
      '<p>OZMO turns scattered service copy into a page path that answers common buying questions and supports a confident inquiry.</p>',
    businessOutcomes: ['Clarity', 'Lead capture', 'Easier follow-up'],
    sections: [
      {
        heading: 'Where it helps',
        body: 'The business has a real offer, but the website buries the value, audience, process, or next step.',
      },
      {
        heading: 'How OZMO approaches it',
        body: 'The strategy work clarifies the headline, service story, objection handling, and form context before design decisions harden.',
      },
    ],
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    sortOrder: 3,
    seo: {
      title: 'Messaging and Conversion Strategy',
      description:
        'Website messaging and conversion strategy for clearer offers and easier inquiries.',
    },
    updatedAt,
  },
  {
    id: 1004,
    slug: 'local-seo-and-basic-seo-setup',
    title: 'Local SEO and basic SEO setup',
    summary:
      'Technical and content foundations that help search engines understand the business without false local claims.',
    bodyHtml:
      '<p>OZMO sets up the basics: crawlable pages, clean metadata, readable service structure, and honest location or market signals when they are available.</p>',
    businessOutcomes: ['Credibility', 'Clarity', 'Ongoing improvement'],
    sections: [
      {
        heading: 'Where it helps',
        body: 'The website needs stronger foundations before the business invests in ongoing search or paid traffic work.',
      },
      {
        heading: 'How OZMO approaches it',
        body: 'The setup covers page titles, descriptions, schema where appropriate, internal links, performance hygiene, and a structure that can grow.',
      },
    ],
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    sortOrder: 4,
    seo: {
      title: 'Local SEO and Basic SEO Setup',
      description:
        'Honest local SEO and basic SEO setup for small business websites.',
    },
    updatedAt,
  },
  {
    id: 1005,
    slug: 'lead-capture-forms-and-follow-up-automation',
    title: 'Lead capture forms and follow-up automation',
    summary:
      'Forms and follow-up paths that collect the right context and route inquiries cleanly.',
    bodyHtml:
      '<p>OZMO creates lead capture flows that ask for useful information, respect privacy, and help the business respond with context.</p>',
    businessOutcomes: ['Lead capture', 'Easier follow-up', 'Clarity'],
    sections: [
      {
        heading: 'Where it helps',
        body: 'Visitors are interested, but the form is vague, hard to use, or disconnected from the way the business follows up.',
      },
      {
        heading: 'How OZMO approaches it',
        body: 'The flow balances friction and qualification, stores operational data outside WordPress, and prepares the team for follow-up.',
      },
    ],
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    sortOrder: 5,
    seo: {
      title: 'Lead Capture Forms and Follow-Up Automation',
      description:
        'Lead capture form and follow-up paths for clearer small business inquiries.',
    },
    updatedAt,
  },
  {
    id: 1006,
    slug: 'ongoing-website-care-and-optimization',
    title: 'Ongoing website care and optimization',
    summary:
      'Practical care for keeping the site fast, updated, legally current, and easier to improve over time.',
    bodyHtml:
      '<p>OZMO supports the website after launch with maintenance, content changes, performance attention, and measured improvement work.</p>',
    businessOutcomes: ['Ongoing improvement', 'Speed', 'Credibility'],
    sections: [
      {
        heading: 'Where it helps',
        body: 'The site is live, but someone needs to keep it healthy and aligned with changing business priorities.',
      },
      {
        heading: 'How OZMO approaches it',
        body: 'Care work keeps the site stable while leaving room for better pages, clearer content, and more useful conversion paths.',
      },
    ],
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    sortOrder: 6,
    seo: {
      title: 'Ongoing Website Care and Optimization',
      description:
        'Ongoing website care and optimization for speed, stability, and better lead paths.',
    },
    updatedAt,
  },
];

export const fixtureTransformations: TransformationViewModel[] = [
  {
    id: 2001,
    slug: 'service-business-homepage-with-no-clear-next-step',
    title: 'Service business homepage with no clear next step',
    beforeState:
      'The homepage explains the company history before it explains what the visitor can do next.',
    whatIsNotWorking:
      'The CTA is buried, the offer is unclear, and mobile visitors have to search for the contact path.',
    ozmoImprovementPath:
      'Rework the hero message, move the primary CTA above the fold, simplify service blocks, and add a short quote or contact path.',
    expectedBusinessImpact:
      'Visitors can understand the offer faster and reach the inquiry path with less friction.',
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    mockupVariant: 'cta-path',
    sortOrder: 1,
    seo: {
      title: 'Service Business Homepage Transformation Example',
      description:
        'An honest qualitative transformation example for a service business homepage with an unclear next step.',
    },
    updatedAt,
  },
  {
    id: 2002,
    slug: 'new-business-launch-with-no-website',
    title: 'New business launch with no website',
    beforeState:
      'The business relies on social profiles and word of mouth, with no owned website to explain the offer.',
    whatIsNotWorking:
      'Prospects cannot find a clear service overview, trust markers, or a reliable inquiry path.',
    ozmoImprovementPath:
      'Create a lean launch site with clear positioning, core service copy, local search basics, and a simple lead form.',
    expectedBusinessImpact:
      'The business has a credible owned destination to send referrals, search visitors, and social traffic.',
    cta: { label: 'Start a Website Launch Readiness Review', url: '/free-site-audit' },
    mockupVariant: 'launch-site',
    sortOrder: 2,
    seo: {
      title: 'New Business Launch Transformation Example',
      description:
        'An honest qualitative transformation example for a new business launch with no website.',
    },
    updatedAt,
  },
  {
    id: 2003,
    slug: 'lead-form-path-that-loses-context',
    title: 'Lead form path that loses context',
    beforeState:
      'The site asks visitors to submit a generic contact form after they have already chosen a service path.',
    whatIsNotWorking:
      'The business receives vague inquiries and has to repeat discovery questions before the first useful reply.',
    ozmoImprovementPath:
      'Add service-aware form prompts, a clearer confirmation page, and follow-up details that keep the inquiry context intact.',
    expectedBusinessImpact:
      'Visitors can explain what they need more clearly, and the business can respond with better context.',
    cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
    mockupVariant: 'lead-context',
    sortOrder: 3,
    seo: {
      title: 'Lead Form Path Transformation Example',
      description:
        'An honest qualitative transformation example for improving inquiry context and follow-up.',
    },
    updatedAt,
  },
];

export const fixturePosts: PostViewModel[] = [
  {
    id: 3001,
    slug: 'why-website-speed-affects-leads',
    title: 'Why website speed affects leads',
    excerpt:
      'A slow website does more than annoy visitors. It makes the inquiry path feel harder before the conversation starts.',
    contentHtml:
      '<p>Speed affects trust because visitors read delay as uncertainty. If the first page feels heavy, they may question whether the business will be just as hard to work with.</p><p>For a small business site, performance work should support the path to action. Clear assets, simple page structure, restrained scripts, and readable mobile layouts all help visitors keep moving.</p><p>The goal is not to chase a vanity score. The goal is a site that loads cleanly, explains the offer, and gets out of the way when someone is ready to ask for help.</p>',
    publishedAt: '2026-08-08T12:00:00.000Z',
    updatedAt: '2026-08-08T13:00:00.000Z',
    canonicalPath: '/blog/why-website-speed-affects-leads',
    rss: {
      title: 'Why website speed affects leads',
      description:
        'A slow website makes the inquiry path feel harder before the conversation starts.',
      link: '/blog/why-website-speed-affects-leads',
      pubDate: '2026-08-08T12:00:00.000Z',
    },
    seo: {
      title: 'Why Website Speed Affects Leads',
      description:
        'Why website speed matters for small business lead paths and visitor confidence.',
    },
  },
  {
    id: 3002,
    slug: 'how-to-tell-whether-homepage-messaging-is-unclear',
    title: 'How to tell whether homepage messaging is unclear',
    excerpt:
      'When the first screen does not explain the offer, visitors have to assemble the business story themselves.',
    contentHtml:
      '<p>Unclear homepage messaging usually shows up as friction. Visitors ask basic questions the page should have answered, or they leave before reaching the service detail they needed.</p><p>A practical homepage should make the audience, offer, value, and next step easy to identify. The copy does not need to be loud; it needs to be specific enough to reduce guessing.</p><p>If a visitor can describe what the business does and what to do next after scanning the page, the message is doing its job.</p>',
    publishedAt: '2026-08-09T12:00:00.000Z',
    updatedAt: '2026-08-09T13:00:00.000Z',
    canonicalPath: '/blog/how-to-tell-whether-homepage-messaging-is-unclear',
    rss: {
      title: 'How to tell whether homepage messaging is unclear',
      description:
        'How unclear homepage messaging creates friction in the path to inquiry.',
      link: '/blog/how-to-tell-whether-homepage-messaging-is-unclear',
      pubDate: '2026-08-09T12:00:00.000Z',
    },
    seo: {
      title: 'How to Tell Whether Homepage Messaging Is Unclear',
      description:
        'Signals that homepage messaging is unclear and how to make the next step easier.',
    },
  },
  {
    id: 3003,
    slug: 'what-a-small-business-website-needs-before-running-ads',
    title: 'What a small business website needs before running ads',
    excerpt:
      'Paid traffic needs a page that can explain, reassure, and capture demand before the budget starts working.',
    contentHtml:
      '<p>Ads can bring attention, but the website still has to carry the visitor from curiosity to action. If the page is unclear, traffic can expose the problem faster.</p><p>Before running ads, a small business site should have a clear offer, fast loading pages, a useful mobile path, privacy-aware forms, and enough service context for a visitor to decide whether to reach out.</p><p>A site review before paid traffic helps separate page problems from campaign problems, which makes later decisions cleaner.</p>',
    publishedAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-08-10T13:00:00.000Z',
    canonicalPath: '/blog/what-a-small-business-website-needs-before-running-ads',
    rss: {
      title: 'What a small business website needs before running ads',
      description:
        'What to prepare on a small business website before sending paid traffic to it.',
      link: '/blog/what-a-small-business-website-needs-before-running-ads',
      pubDate: '2026-08-10T12:00:00.000Z',
    },
    seo: {
      title: 'What a Small Business Website Needs Before Running Ads',
      description:
        'What a small business website should have in place before investing in paid traffic.',
    },
  },
];

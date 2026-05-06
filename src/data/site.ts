export const site = {
  title: 'Fun In Space',
  description:
    'Fun In Space — Duane Moore on products, systems, software projects, and contributions to the technium.',
  url: 'https://fun-in-space.com',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/projects/', label: 'Projects' },
    { href: '/writing/', label: 'Writing' },
    { href: '/about/', label: 'About' },
    { href: '/links/', label: 'Links' },
  ],
  social: {
    x: 'https://x.com/Duane1024',
    substack: 'https://duane1024.substack.com',
    linkedin: 'https://www.linkedin.com/in/duane1024/',
    sancho: 'https://asksancho.ai',
    github: 'https://github.com/duane1024',
  },
  hero: {
    eyebrow: 'Engineer / Architect / Founder',
    title: 'Fun In Space',
    blurb:
      'My contributions to the technium: products, platforms, technical organizations, and the systems, tools, and ideas behind them.',
    detail: [
      'I’ve spent my career at the frontier where new technology meets consequential real-world systems: ',
      {
        text: 'early online collaboration',
        href: '/docs/ncsa_access_10_3_opt.pdf',
      },
      ' and ',
      {
        text: 'distance learning',
        href: 'https://en.wikipedia.org/wiki/History_of_virtual_learning_environments_in_the_1990s#:~:text=netLearningPlace',
      },
      ', ',
      {
        text: 'fully immersive virtual reality',
        href: '/docs/Crossing_Streets_a_K-12_virtual_reality_applicatio.pdf'
      },
      ', ',
      {
        text: 'autonomous vehicles',
        href: '/docs/Wireless-Networking-for-Control-and-Automation-of-Off-Road-Equipment-1999.pdf'
      },
      ', ',
      {
        text: 'Air Force command-and-control',
        href: 'https://www.parsons.com/products/c2core/'
      },
      ', large-scale data platforms for space situational awareness, ',
        {
            text: 'secure payments and point-of-sale',
            href: 'https://clover.com/'
        },
        ', mobile computing, automation systems for ',
        {
            text: 'long-haul trucking',
            href: 'https://channel19.io/'
        },
        ' and ',
        {
            text: 'residential real estate',
            href: 'https://atlascdt.com/'
        },
        ', and AI-native products, including a ',
        {
            text: 'modern language learning app',
            href: 'https://cantito.ai/'
        },
        '. I’ve worked across the stack: from embedded systems and distributed infrastructure to developer platforms, desktop/web/mobile apps, and product architecture, and across the org chart, as an engineer, architect, executive, and founder. I go deep into technical challenges and solutions, bring clarity to hard problems, and help build systems, teams, and products that hold up when the stakes are real.',
    ] as Array<string | { text: string; href: string }>,
  },
};

import { ClubStream, QuestionnaireItem, NPC, TrainingModule, ClubProfile } from '../types/game';

export const NPCS: NPC[] = [
  {
    id: 'npc_bar_brodie',
    name: 'Brodie',
    role: 'Bar & Hospitality Manager',
    locationName: 'Clubhouse Bar Counter',
    zone: 'clubhouse',
    x: 9,
    y: 8,
    direction: 'down',
    spriteColor: '#0284c7', // Sky blue
    avatarIcon: 'Beer',
    greeting: "G'day! Welcome behind the club bar. Let's make sure our service is safe, legal, and stocked with great non-alcoholic options!",
    group: 'Alcohol',
    unlockedModuleId: 'module_rsa_rapid_check',
  },
  {
    id: 'npc_alex_rsa',
    name: 'Alex',
    role: 'RSA Staff Coordinator',
    locationName: 'Free Water & Service Station',
    zone: 'clubhouse',
    x: 13,
    y: 8,
    direction: 'down',
    spriteColor: '#0d9488', // Teal
    avatarIcon: 'GlassWater',
    greeting: "Staying hydrated is key to keeping our members safe. I manage our free drinking water, RSA certifications, and zero-shot policies.",
    group: 'Alcohol',
    unlockedModuleId: 'module_rsa_rapid_check',
  },
  {
    id: 'npc_president_pat',
    name: 'President Pat',
    role: 'Club President',
    locationName: 'Committee Boardroom',
    zone: 'boardroom',
    x: 5,
    y: 4,
    direction: 'down',
    spriteColor: '#f59e0b', // Amber gold
    avatarIcon: 'ShieldCheck',
    greeting: "Leadership starts right at the committee table. When we commit to Good Sports, our entire club community thrives.",
    group: 'Community Leadership',
    unlockedModuleId: 'module_governance_code',
  },
  {
    id: 'npc_morgan_sec',
    name: 'Morgan',
    role: 'Club Secretary & Media Officer',
    locationName: 'Operations & Records Desk',
    zone: 'boardroom',
    x: 9,
    y: 4,
    direction: 'down',
    spriteColor: '#6366f1', // Indigo
    avatarIcon: 'FileText',
    greeting: "Hi there! I keep our official policies up to date, manage our member Code of Conduct, and handle media inquiries.",
    group: 'Governance',
    unlockedModuleId: 'module_governance_code',
  },
  {
    id: 'npc_coach_marcus',
    name: 'Coach Marcus',
    role: 'Senior Head Coach',
    locationName: 'Senior Pitch Sidelines',
    zone: 'oval',
    x: 23,
    y: 11,
    direction: 'left',
    spriteColor: '#10b981', // Emerald
    avatarIcon: 'Trophy',
    greeting: "On and off the field, respect and safety come first. That means sober coaching, responsible player trips, and safe rides home.",
    group: 'Community Leadership',
    unlockedModuleId: 'module_safe_transport',
  },
  {
    id: 'npc_taylor_events',
    name: 'Taylor',
    role: 'Social & Events Coordinator',
    locationName: 'Clubhouse Lounge & Terrace',
    zone: 'clubhouse',
    x: 17,
    y: 11,
    direction: 'left',
    spriteColor: '#ec4899', // Pink
    avatarIcon: 'Sparkles',
    greeting: "We can have unforgettable club celebrations without drinking games, open bars, or alcohol-only prizes. Let's build inclusive traditions!",
    group: 'Alcohol',
    unlockedModuleId: 'module_safe_transport',
  },
  {
    id: 'npc_coach_sam',
    name: 'Coach Sam',
    role: 'Junior Development Officer',
    locationName: 'Junior Sports Field',
    zone: 'juniors',
    x: 7,
    y: 19,
    direction: 'right',
    spriteColor: '#8b5cf6', // Violet
    avatarIcon: 'Users',
    greeting: "Our young athletes look up to us! Junior games, training, and presentations should always be 100% alcohol-free and role-modeled right.",
    group: 'Juniors',
    unlockedModuleId: 'module_junior_haven',
  },
  {
    id: 'npc_riley_welfare',
    name: 'Riley',
    role: 'Junior Welfare & Facilities Officer',
    locationName: 'Change Rooms Entry',
    zone: 'juniors',
    x: 13,
    y: 19,
    direction: 'up',
    spriteColor: '#14b8a6', // Teal
    avatarIcon: 'DoorClosed',
    greeting: "Welcome! Ensuring change rooms are strictly alcohol-free when youth are present is vital for child safety and positive club culture.",
    group: 'Juniors',
    unlockedModuleId: 'module_junior_haven',
  },
  {
    id: 'npc_jess_compliance',
    name: 'Jess',
    role: 'Licensing & Compliance Officer',
    locationName: 'Club Main Entrance & Foyer',
    zone: 'clubhouse',
    x: 11,
    y: 14,
    direction: 'down',
    spriteColor: '#ef4444', // Red
    avatarIcon: 'BadgeCheck',
    greeting: "Strict legal compliance protects our licence and our club reputation. Refusing service to intoxicated persons is mandatory law.",
    group: 'Legal Compliance',
    unlockedModuleId: 'module_rsa_rapid_check',
  },
  {
    id: 'npc_dr_jordan',
    name: 'Dr. Jordan',
    role: 'Mental Health Advocate',
    locationName: 'Wellbeing Garden & Recovery Nook',
    zone: 'wellbeing',
    x: 24,
    y: 18,
    direction: 'down',
    spriteColor: '#06b6d4', // Cyan
    avatarIcon: 'HeartPulse',
    greeting: "Physical fitness is only half the battle. We provide mental health education, reputable support pathways, and critical incident support.",
    group: 'Mental Health',
    unlockedModuleId: 'module_mental_health_talk',
  },
  {
    id: 'npc_casey_health',
    name: 'Casey',
    role: 'Health & Illicit Drugs Officer',
    locationName: 'First Aid & Health Kiosk',
    zone: 'wellbeing',
    x: 27,
    y: 18,
    direction: 'left',
    spriteColor: '#a855f7', // Purple
    avatarIcon: 'AlertTriangle',
    greeting: "We have clear expectations around illicit drugs. We educate our coaches and players and keep an incident register ready.",
    group: 'Illicit Drugs',
    unlockedModuleId: 'module_incident_drill',
  },
  {
    id: 'npc_sam_grounds',
    name: 'Sam',
    role: 'Groundskeeper & Smoke-Free Ranger',
    locationName: 'Spectator Pavilion & Boundary',
    zone: 'spectator',
    x: 25,
    y: 6,
    direction: 'down',
    spriteColor: '#22c55e', // Green
    avatarIcon: 'Ban',
    greeting: "Clean air for all! Our spectator areas, sidelines, and playgrounds have prominent smoke-free and vape-free signage.",
    group: 'Smoking and Vaping',
    unlockedModuleId: 'module_smoke_free_perimeter',
  },
];

export const GOOD_SPORTS_QUESTIONS: QuestionnaireItem[] = [
  // --- ALCOHOL GROUP ---
  {
    id: 'alc_bar_no_drink',
    group: 'Alcohol',
    prompt: 'Does your club prohibit bar staff from drinking alcohol while on duty?',
    criteria: 'Club ensures bar staff do not consume alcohol on duty.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_bar_brodie',
    why: 'All states/territories prohibit staff from being intoxicated while serving alcohol. If staff or volunteers drink while on duty, it might breach licensing conditions and result in fines or losing your licence. It also impairs RSA judgement, increases incident risks, and sets a poor example for younger club members.',
    how: 'Ensure that bar staff know drinking alcohol while on duty is not allowed, even during service breaks.',
    actionItems: [
      'Ensure bar staff are trained in Responsible Service of Alcohol (RSA) and supported by committee not to drink when serving.',
      'Ensure bar staff are aware that drinking alcohol on duty is prohibited even during a break.',
      'Monitor alcohol consumption by bar staff and address issues of non-compliance.'
    ],
    policyStatement: 'Our club ensures bar staff do not consume alcohol while on duty to support safe and responsible service.',
    resources: ['Managing alcohol at your club', 'Drinking alcohol while on bar duty']
  },
  {
    id: 'alc_water_free',
    group: 'Alcohol',
    prompt: 'Does your club ensure free drinking water is readily available when alcohol is sold, served or consumed?',
    criteria: 'Water is available free of charge when alcohol is sold, served or consumed.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_alex_rsa',
    why: 'Having water freely available slows down the rate of alcohol absorption, prevents rapid intoxication, and keeps participants hydrated. Many liquor licensing laws strictly mandate free drinking water accessibility.',
    how: 'Ensure water is available free of charge at the bar, in jugs with glasses on the counter, or via a self-serve dispenser/cooler.',
    actionItems: [
      'Provide water free of charge to members and guests when alcohol is sold, served or consumed.',
      'Place fresh water jugs and clean glasses in prominent, easily reachable spots at the bar or social areas.'
    ],
    policyStatement: 'Our club ensures that water is available free of charge when alcohol is sold, served or consumed to encourage hydration and responsible service.',
    resources: ['Free water poster', 'Liquor Licensing Requirements']
  },
  {
    id: 'alc_low_non_options',
    group: 'Alcohol',
    prompt: 'Does your club provide a range of non-alcoholic (e.g. water, soft drink, juice) and low-alcohol drink options?',
    criteria: 'Club has non-alcoholic and low-alcoholic options available for purchase.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_bar_brodie',
    why: 'Providing alcohol-free and low-alcohol (<3.5% ABV) alternatives helps people pace their drinking, reduces the likelihood of accidents and intoxication, and creates an inclusive culture for drivers, youth, and non-drinkers.',
    how: 'Ensure non-alcoholic drinks (water, juice, soft drink, zero-beers) and low-alcohol options (light beer, mid-strength) are prominently displayed and stocked.',
    actionItems: [
      'Stock non-alcoholic drink options such as water, soft drinks, and juices.',
      'Locate a supplier of low-alcohol drinks (mid-strength/light beer, low-alcohol cider).',
      'Display non-alcoholic and low-alcohol drinks in a prominent position in bar fridges and menus.'
    ],
    policyStatement: 'Our club provides a range of non-alcoholic and low-alcohol drinks to provide members and guests with alternative drink options that lower alcohol-related harm.',
    resources: ['Managing alcohol at your club']
  },
  {
    id: 'alc_pricing_cheaper',
    group: 'Alcohol',
    prompt: 'Does your club sell non-alcoholic drinks and low-alcohol options for less than the price of full-strength alcohol drinks?',
    criteria: 'Club prices non-alcoholic and low-alcoholic options cheaper than full strength alcoholic drinks.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_bar_brodie',
    why: 'Pricing non-alcoholic and low-alcohol drinks cheaper makes them more accessible and attractive, encouraging responsible choices that align with RSA principles.',
    how: 'Price all non-alcoholic and low-strength drinks lower than standard full-strength alcoholic drinks.',
    actionItems: [
      'Review all pricing to ensure non-alcoholic and low-alcohol drinks cost less than full-strength beverages.',
      'Ensure non-alcoholic and low-alcohol drinks are placed in prominent positions at the bar.'
    ],
    policyStatement: 'Our club prices non-alcoholic and low-alcohol drinks lower than the price of full-strength alcohol drinks to make them more accessible and affordable.',
    resources: ['Bar pricing guidelines']
  },
  {
    id: 'alc_no_happy_hours',
    group: 'Alcohol',
    prompt: 'Does your club ensure happy hour drink promotions do not occur?',
    criteria: 'Club does not conduct happy hours.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_bar_brodie',
    why: 'Happy hours encourage rapid consumption and binge drinking over short windows, violating RSA principles and increasing injury, legal, and reputational risks.',
    how: 'Eliminate time-limited alcohol discounts and replace them with food specials or inclusive social activities.',
    actionItems: [
      'Eliminate happy hour drink promotions at all club events.',
      'Educate bar staff on why happy hours are prohibited.',
      'Communicate the policy to members and highlight fun, non-alcohol social events.'
    ],
    policyStatement: 'Our club does not conduct happy hour drink promotions, ensuring rapid and excessive alcohol consumption is not encouraged.',
    resources: ['Managing alcohol at your club']
  },
  {
    id: 'alc_no_cheap_promos',
    group: 'Alcohol',
    prompt: 'Does your club ensure cheap or discounted alcoholic drinks are not promoted?',
    criteria: 'Club does not conduct cheap drink promotions.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_bar_brodie',
    why: 'Discounted alcohol promotions (e.g. "$2 drinks" or "drink of the month") drive excessive consumption and undermine family-friendly club values.',
    how: 'Discontinue cheap alcohol marketing and shift promotions to merchandise, club food, or non-alcoholic specials.',
    actionItems: [
      'Eliminate discounted alcoholic drink promotions across all club communication.',
      'Educate bar staff and committee on promoting healthy alternatives.'
    ],
    policyStatement: 'Our club does not conduct promotions on discounted alcoholic drinks, ensuring excessive drinking is not encouraged.',
    resources: ['Managing alcohol at your club']
  },
  {
    id: 'alc_no_shots',
    group: 'Alcohol',
    prompt: 'Does your club ensure that spirits are not sold or supplied as double measures or "shots"?',
    criteria: 'Club does not sell or supply spirits as double measures or \'shots\'.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_alex_rsa',
    why: 'Shots and double measures deliver high concentrations of alcohol rapidly without mixers, making intoxication hard to monitor and dramatically increasing harm risk.',
    how: 'Prohibit selling neat spirit shots or free-poured doubles; always measure standard single serves with mixers.',
    actionItems: [
      'Cease selling or supplying spirits as double measures or shots.',
      'Educate all bar servers to only serve single standard measures with mixers.'
    ],
    policyStatement: 'Our club ensures that spirits are not sold or supplied as double measures or \'shots\' to discourage rapid and excessive alcohol consumption.',
    resources: ['Alcohol standard drinks poster', 'Managing alcohol at your club']
  },
  {
    id: 'alc_no_drinking_games',
    group: 'Alcohol',
    prompt: 'Does your club ensure that drinking competitions or drinking games do not occur, including as part of celebrations?',
    criteria: 'Club does not conduct drinking competitions or games.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_taylor_events',
    why: 'Drinking games (sculling, boat races, beer pong) lead to rapid intoxication and peer pressure, increasing accident risks, fights, and negative influences on youth.',
    how: 'Ban drinking competitions at all club events and end-of-season gatherings (e.g. Mad Monday), replacing them with sports skill games and trivia.',
    actionItems: [
      'Ban drinking competitions and games across all club facilities and trips.',
      'Educate players and bar staff on the policy and enforce zero-tolerance for forced drinking.'
    ],
    policyStatement: 'Our club does not allow drinking competitions or drinking games at any club activity, including club celebrations.',
    resources: ['Event management guidelines']
  },
  {
    id: 'alc_no_open_bar',
    group: 'Alcohol',
    prompt: 'Does your club ensure there are no "open bar" events, or events with unlimited alcohol for a fixed price?',
    criteria: 'Club does not run events that offer an open bar or provide unlimited access to alcohol.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_taylor_events',
    why: 'All-you-can-drink events encourage attendees to get their "money\'s worth" quickly, leading to extreme intoxication and excluding non-drinkers.',
    how: 'Discontinue open-bar ticketing. Package tickets with substantial meals or entertainment, with drinks bought separately.',
    actionItems: [
      'Ensure club events adhere to safe event management guidelines.',
      'Eliminate marketing phrases like "all you can drink" or "open bar" from ticket sales.'
    ],
    policyStatement: 'Our club encourages safer celebrations and events by not offering an open bar or providing unlimited access to alcohol.',
    resources: ['Event management guidelines']
  },
  {
    id: 'alc_no_vouchers',
    group: 'Alcohol',
    prompt: 'Does your club ensure that vouchers or cards for alcoholic drinks are not provided?',
    criteria: 'Club does not provide drink vouchers or cards.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_taylor_events',
    why: 'Drink vouchers create pressure to consume alcohol before cards expire and exclude junior members and non-drinking guests from prize value.',
    how: 'Replace alcoholic drink vouchers with meal vouchers, sports vouchers, or club apparel prizes.',
    actionItems: [
      'Eliminate vouchers or cards for alcoholic drinks as awards or incentives.',
      'Offer food or non-alcohol reward cards instead.'
    ],
    policyStatement: 'Our club ensures vouchers or cards for alcoholic drinks are not provided, including at club celebrations.',
    resources: ['Event management guidelines', 'Prize ideas for your club']
  },
  {
    id: 'alc_substantial_food',
    group: 'Alcohol',
    prompt: 'Does your club ensure substantial food is available when the bar is open?',
    criteria: 'Club has substantial food available when the bar is open.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_bar_brodie',
    why: 'Substantial food slows alcohol absorption and intoxication significantly. Packet snacks (chips/nuts) are not considered substantial meals.',
    how: 'Offer hot food, sandwiches, BBQ, or meal platters whenever the bar operates.',
    actionItems: [
      'Plan simple substantial food options (hot pies, sandwiches, barbecue) rather than relying solely on packet snacks.',
      'Display a clear food menu at the bar.'
    ],
    policyStatement: 'Our club ensures substantial food is available when alcohol is consumed to support responsible service and reduce intoxication risk.',
    resources: ['Substantial food guide']
  },
  {
    id: 'alc_age_18_servers',
    group: 'Alcohol',
    prompt: 'Does your club ensure that only people aged 18 years or older serve alcohol?',
    criteria: 'Only people aged 18 years or older serve alcohol.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_alex_rsa',
    why: 'Liquor licensing laws prohibit minors from serving alcohol. Serving alcohol exposes youth to intoxicated patrons and conflict situations they should not face.',
    how: 'Require all bar volunteers and staff to be at least 18 years old and maintain an active RSA staff register.',
    actionItems: [
      'Ensure only people aged 18 years or older serve alcohol at the club.',
      'Verify age and maintain a register of certified bar servers.'
    ],
    policyStatement: 'Our club ensures that only people aged 18 years or older serve alcohol.',
    resources: ['Liquor Licensing Laws Register']
  },
  {
    id: 'alc_ad_safe_transport',
    group: 'Alcohol',
    prompt: 'Does your club ensure advertising and promotion of events align with responsible service of alcohol and encourage safe transport?',
    criteria: 'Advertising and promotion of events support responsible service of alcohol practices.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_morgan_sec',
    why: 'Promotional posters and social posts heavily influence attendee expectations. Highlighting safe transport and non-alc options prevents drink-driving.',
    how: 'State event start/finish times, promote designated drivers or rideshare, and give equal visibility to alcohol-free features.',
    actionItems: [
      'Do not emphasize unlimited alcohol in promotional materials.',
      'Include safe transport options (taxis, club bus, designated driver) in event communications.'
    ],
    policyStatement: 'Our club is committed to advertising events that support responsible service of alcohol and encourage safe transport planning.',
    resources: ['Safe celebrations guide', 'Good Sports promotional guidelines']
  },
  {
    id: 'alc_player_trips',
    group: 'Alcohol',
    prompt: 'Does your club ensure that all official trips, including end-of-season player trips, follow responsible alcohol practices?',
    criteria: 'Club promotes responsible alcohol practices on club trips, including end-of-season player trips.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_coach_marcus',
    why: 'Official trips reflect the club\'s reputation and involve duty-of-care obligations. Preventing out-of-control binge trips protects players and prevents legal liability.',
    how: 'Set clear behavioural expectations before departure, prohibit drinking on buses, and ensure alcohol-free team activities are central.',
    actionItems: [
      'Set clear expectations around alcohol use prior to trip departures.',
      'Ensure food, water, and non-alcoholic options are always accessible on trips.',
      'Enforce bus rules prohibiting drinking while travelling in transit.'
    ],
    policyStatement: 'Our club ensures that all club outings and trips follow responsible alcohol practices to lower risk and foster positive club culture.',
    resources: ['Managing alcohol at your club', 'Safe celebrations guide']
  },
  {
    id: 'alc_education',
    group: 'Alcohol',
    prompt: 'Does your club provide opportunities for coaches, officials, members and volunteers to learn about alcohol harm prevention?',
    criteria: 'Club provides opportunities for coaches, officials, members and volunteers to learn about alcohol and how to prevent or reduce alcohol-related harm.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_president_pat',
    why: 'Informed coaches and leaders set the standard. When officials understand harm reduction, they can guide young athletes and intervene early.',
    how: 'Share the Good Sports Alcohol Awareness online module, host an awareness round, or run information sessions.',
    actionItems: [
      'Circulate the Good Sports online Alcohol Awareness module among coaches and committee members.',
      'Promote alcohol harm reduction resources on club social media and club website.'
    ],
    policyStatement: 'Our club provides opportunities for coaches, officials, members and volunteers to learn about alcohol and prevent harm.',
    resources: ['Alcohol awareness online module']
  },
  {
    id: 'alc_safe_transport',
    group: 'Alcohol',
    prompt: 'Does your club promote safe transport practices (e.g. club bus, rideshare) to prevent drink driving?',
    criteria: 'Club promotes safe transport practices to prevent drink driving.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_coach_marcus',
    why: 'Clubs have a duty of care to protect members on the road. Safe transport directly prevents road trauma and fatalities.',
    how: 'Implement a designated driver system, provide taxi numbers, give rideshare vouchers as prizes, or organize a club shuttle bus.',
    actionItems: [
      'Implement at least three safe transport practices (e.g. designated driver perks, displayed taxi numbers, club bus).',
      'Remind attendees at all evening functions about safe transport options.'
    ],
    policyStatement: 'Our club encourages members to plan their transport to and from games and events to prevent drink driving and keep the community safe.',
    resources: ['Guide to safe transport']
  },
  {
    id: 'alc_rsa_cert',
    group: 'Alcohol',
    prompt: 'Do all bar staff hold a valid Responsible Service of Alcohol (RSA) certification?',
    criteria: 'Bar staff have a valid RSA certification.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_alex_rsa',
    why: 'RSA training gives staff the legal backing and interpersonal skills to refuse service, spot intoxication early, and prevent violations.',
    how: 'Maintain an up-to-date RSA register and require staff to present certificates before working behind the bar.',
    actionItems: [
      'Check club liquor licence requirements for RSA training.',
      'Ensure all volunteers serving alcohol have completed accredited RSA training.',
      'Audit RSA certificates annually at the start of each playing season.'
    ],
    policyStatement: 'Our club ensures that all bar staff hold a valid Responsible Service of Alcohol (RSA) certification.',
    resources: ['RSA club register', 'Guide to RSA training']
  },
  {
    id: 'alc_zero_alc_under_18',
    group: 'Alcohol',
    prompt: 'Does your club have processes to ensure zero-alcohol drinks are not promoted, sold or supplied to anyone under 18?',
    criteria: 'Club has processes in place to ensure zero-alcohol drinks are not promoted, sold or supplied to anyone under 18 years of age.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_riley_welfare',
    why: 'Zero-alcohol drinks mimic alcohol brands and can normalize drinking culture, increase curiosity, and lower perceived risk among youth.',
    how: 'Treat zero-alcohol beer/wine/cider with the same age restrictions as alcoholic drinks.',
    actionItems: [
      'Ensure zero-alcohol adult beverages are not marketed or supplied to under 18s.',
      'Instruct bar staff to check ID before serving zero-alcohol mock products.'
    ],
    policyStatement: 'Our club ensures zero-alcohol drinks that mimic alcohol are managed responsibly and not supplied to people aged under 18.',
    resources: ['Managing alcohol at your club']
  },
  {
    id: 'alc_alcohol_free_events',
    group: 'Alcohol',
    prompt: 'Does your club ensure alcohol is not consumed at club events, including at licensed venues?',
    criteria: 'Club ensures alcohol is not consumed at club events, including at licensed venues.',
    isMinimumCriteria: false,
    streams: ['NCNSJ', 'NCNSNJ'],
    npcId: 'npc_president_pat',
    why: 'As an alcohol-free club, upholding a consistent smoke-free, alcohol-free atmosphere reinforces health, inclusion, and true family spirit.',
    how: 'Choose alcohol-free venues and communicate the club\'s alcohol-free standard across all team functions.',
    actionItems: [
      'Commit to holding entirely alcohol-free events.',
      'Communicate the policy to all members and visiting teams.'
    ],
    policyStatement: 'Our club ensures alcohol is not consumed at club events, including at licensed venues.',
    resources: ['Alcohol-free club guide']
  },

  // --- COMMUNITY LEADERSHIP ---
  {
    id: 'comm_promote_gs',
    group: 'Community Leadership',
    prompt: 'Does your club commit to promoting your involvement in the Good Sports program?',
    criteria: 'Club commits to promoting involvement in the Good Sports program.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_president_pat',
    why: 'Promoting involvement demonstrates clear community leadership and inspires other clubs to adopt evidence-based harm reduction.',
    how: 'Share Good Sports badges and stories across club social media, newsletters, and ground noticeboards.',
    actionItems: [
      'Display Good Sports promotional posters and social media tiles.',
      'Talk about Good Sports commitments at season launches and annual meetings.'
    ],
    policyStatement: 'Our club is proud to be part of the Good Sports program and promotes our participation across all communications.',
    resources: ['Social Media Tiles', 'Good Sports promotional assets']
  },
  {
    id: 'comm_support_contacts',
    group: 'Community Leadership',
    prompt: 'Does your club display contact details for alcohol and other drug support services?',
    criteria: 'Club displays contact details for alcohol and other drug support services.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_casey_health',
    why: 'Displaying hotline details reduces stigma and makes confidential help readily available when someone in the club community is struggling.',
    how: 'Post the National Alcohol & Other Drug Hotline (1800 250 015) and ADF help cards in change rooms, bathrooms, and on the club website.',
    actionItems: [
      'Display Good Sports support posters on the back of toilet doors and change rooms.',
      'Share ADF support links on the club newsletter or digital channels.'
    ],
    policyStatement: 'Our club displays contact details for alcohol and other drug support services to support the health and wellbeing of members.',
    resources: ['ADF services poster', 'Hi I\'m dib poster']
  },
  {
    id: 'comm_no_alcohol_prizes',
    group: 'Community Leadership',
    prompt: 'Does your club ensure that alcohol-only gifts, awards or raffle prizes are not provided?',
    criteria: 'Club does not provide alcohol-only gifts, awards or raffle prizes.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_taylor_events',
    why: 'Rewarding athletic achievement or volunteers with slabs of beer or bottles of wine reinforces alcohol as the default measure of celebration and excludes junior winners and non-drinkers.',
    how: 'Provide sports gear, dining vouchers, tech accessories, or bespoke trophies instead of alcohol bottles.',
    actionItems: [
      'Adopt a policy prohibiting alcohol-only prizes and raffles.',
      'Curate a list of healthy, inclusive alternative prize ideas.'
    ],
    policyStatement: 'Our club does not endorse alcohol-only gifts, awards, or raffle prizes.',
    resources: ['Prize ideas for your club']
  },
  {
    id: 'comm_sober_officials',
    group: 'Community Leadership',
    prompt: 'Does your club ensure coaches, members, officials and volunteers do not coach, play or officiate while under the influence?',
    criteria: 'Coaches, members, officials, and volunteers do not coach, play or officiate while under the influence of alcohol or illicit drugs.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_coach_marcus',
    why: 'Coaches and officials are key role models. Being under the influence severely impairs reaction times, increases catastrophic injury risks, and destroys club trust.',
    how: 'Explicitly enshrine this standard in the club Code of Conduct and brief all coaches prior to the season.',
    actionItems: [
      'Include a strict zero-tolerance statement in the club Code of Conduct.',
      'Ensure committee members know the Incident Response Procedure if someone appears affected.'
    ],
    policyStatement: 'Our club prohibits coaches, members, officials and volunteers from coaching, playing or officiating if under the influence of alcohol or illicit drugs.',
    resources: ['Managing intoxication at your club', 'Code of Conduct template']
  },
  {
    id: 'comm_committee_commit',
    group: 'Community Leadership',
    prompt: 'Does your club committee formally commit to implementing the Good Sports program?',
    criteria: 'Club committee commits to implementing the Good Sports program.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_president_pat',
    why: 'Sustainable change requires committee leadership and formal endorsement into club governance records.',
    how: 'Pass a formal motion at a committee meeting to adopt the Good Sports policies and assign a volunteer champion.',
    actionItems: [
      'Add Good Sports adoption to the formal committee meeting agenda.',
      'Appoint a dedicated club champion or committee liaison.',
      'Review policy application and consistency annually.'
    ],
    policyStatement: 'Our club committee formally commits to implementing the Good Sports program and reducing alcohol and drug harms.',
    resources: ['Good Sports Committee Overview', 'FAQ Guide']
  },

  // --- GOVERNANCE ---
  {
    id: 'gov_code_conduct',
    group: 'Governance',
    prompt: 'Does your club have a Code of Conduct in place that coaches, officials, members and volunteers abide by?',
    criteria: 'Club abides by a Code of Conduct.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_morgan_sec',
    why: 'A clear Code of Conduct outlines behavioral standards, mutual respect, child safety, and consequences for breaches.',
    how: 'Adopt a sport-specific Code of Conduct and have coaches, captains, and members sign or acknowledge it upon registration.',
    actionItems: [
      'Adopt a recognized Code of Conduct for players, coaches, and parents.',
      'Ensure all new volunteers and members receive and agree to the code.'
    ],
    policyStatement: 'Our club\'s coaches, officials, members and volunteers abide by our Code of Conduct.',
    resources: ['Play by the Rules templates']
  },
  {
    id: 'gov_incident_plan_alc',
    group: 'Governance',
    prompt: 'Does your club have a documented plan for responding to incidents involving alcohol?',
    criteria: 'Club has a plan for responding to incidents involving alcohol.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_morgan_sec',
    why: 'Quick, standardized incident management de-escalates conflicts, ensures medical first aid, and protects club volunteers from legal liability.',
    how: 'Keep the Good Sports Incident Response Procedure and Incident Register accessible in the office and first aid room.',
    actionItems: [
      'Maintain an accessible Incident Response Procedure and Incident Register.',
      'Train volunteers and bar staff on steps to de-escalate and record any occurrences.'
    ],
    policyStatement: 'Our club has a documented plan in place that ensures an appropriate and timely response to incidents involving alcohol.',
    resources: ['Incident response procedure: Alcohol', 'Incident register template']
  },
  {
    id: 'gov_social_media_policy',
    group: 'Governance',
    prompt: 'Does your club have a Social Media Policy prohibiting posting images of members drinking alcohol, smoking or vaping?',
    criteria: 'Club has a Social Media Policy that prohibits coaches, officials, members and volunteers from posting images of members drinking alcohol, smoking and vaping on club social media channels.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_morgan_sec',
    why: 'Public club channels should promote athletic skills and positive culture, not drinking sessions or vape tricks that normalize unhealthy habits to youth.',
    how: 'Implement a social media guideline for club page admins and team group chats.',
    actionItems: [
      'Adopt the Good Sports social media policy template.',
      'Audit existing club photo galleries and remove inappropriate alcohol or vaping imagery.'
    ],
    policyStatement: 'Club coaches, officials, members and volunteers abide by the club\'s Social Media Policy, prohibiting images of drinking, smoking or vaping on official channels.',
    resources: ['Good Sports social media policy template', 'Good Sports promotional guidelines']
  },
  {
    id: 'gov_media_enquiries',
    group: 'Governance',
    prompt: 'Does your club have a plan for handling media enquiries about alcohol or illicit drug-related incidents?',
    criteria: 'Club has a plan for handling media enquiries.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_morgan_sec',
    why: 'Uncoordinated comments to journalists or social commentators during a crisis can severely damage the club and inflame legal matters.',
    how: 'Designate a single official spokesperson (usually Club President) and instruct all members to route queries to them.',
    actionItems: [
      'Identify the designated club spokesperson for all media inquiries.',
      'Circulate clear guidance that members and coaches do not give unauthorized public statements.'
    ],
    policyStatement: 'Our club has a plan for managing media enquiries about alcohol or drug-related incidents, handled exclusively by our designated spokesperson.',
    resources: ['Good Sports media response guidelines']
  },
  {
    id: 'gov_policy_accessible',
    group: 'Governance',
    prompt: 'Does your club commit to having your Good Sports Policy accessible for club members and volunteers?',
    criteria: 'Good Sports Policy will be available for club members to access.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_morgan_sec',
    why: 'A policy document only has impact when the community knows it exists and understands their shared obligations.',
    how: 'Upload the signed policy to the club website, post it on the clubhouse noticeboard, and distribute it in player welcome packs.',
    actionItems: [
      'Upload the signed Good Sports Policy to the club website or member portal.',
      'Display a printed copy in the main clubhouse foyer or noticeboard.'
    ],
    policyStatement: 'Our club ensures the Good Sports Policy is accessible for all coaches, officials, members and volunteers.',
    resources: ['Club noticeboard policy kit']
  },

  // --- ILLICIT DRUGS ---
  {
    id: 'drug_education',
    group: 'Illicit Drugs',
    prompt: 'Does your club provide opportunities for coaches, officials, members and volunteers to learn about illicit drugs and harm reduction?',
    criteria: 'Club provides opportunities for coaches, officials, members and volunteers to learn about illicit drugs and ways to prevent or reduce drug-related harm.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_casey_health',
    why: 'Illicit drug harm affects all communities. Equipping leaders with facts helps identify signs of distress and connect individuals with professional help.',
    how: 'Share the Good Sports "Tackling Illicit Drugs" online module and promote the ADF "Text The Effects" confidential SMS line (0439 835 563).',
    actionItems: [
      'Circulate the Good Sports "Tackling Illicit Drugs" module to coaches and senior captains.',
      'Promote confidential support lines (ADF "Text The Effects" 0439 TELL ME).'
    ],
    policyStatement: 'Our club provides opportunities for coaches, officials, members and volunteers to learn about illicit drugs and harm reduction.',
    resources: ['Tackling illicit drugs online module', 'ADF drug facts guide']
  },
  {
    id: 'drug_expectations',
    group: 'Illicit Drugs',
    prompt: 'Does your club clearly communicate its expectations about illicit drug use and related behaviour to all members?',
    criteria: 'Club communicates its expectations about illicit drug use and related behaviours.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_casey_health',
    why: 'Clear boundaries ensure no ambiguity that illicit drug possession, supply, or use at club grounds or trips is prohibited and dealt with seriously.',
    how: 'Incorporate illicit drug policies into the Code of Conduct and player handbooks.',
    actionItems: [
      'Document expectations regarding illicit drugs in the club Code of Conduct.',
      'Reiterate expectations at team briefings before major trips and celebrations.'
    ],
    policyStatement: 'Our club clearly communicates its expectations regarding illicit drug use and related behaviour at the club, events, and trips.',
    resources: ['Code of Conduct guidelines', 'Incident response procedure: Illicit Drugs']
  },
  {
    id: 'drug_incident_plan',
    group: 'Illicit Drugs',
    prompt: 'Does your club have a plan for responding to illicit drug use, or incidents involving illicit drugs?',
    criteria: 'Club has a plan for responding to illicit drug use or incidents involving illicit drugs.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_casey_health',
    why: 'When an incident occurs, responding with health and safety as the primary priority saves lives and avoids improper handling.',
    how: 'Adopt the Good Sports Incident Response Procedure for illicit drugs, focusing on first aid, duty of care, and medical referral.',
    actionItems: [
      'Keep the Illicit Drugs Incident Response Procedure in the first aid room and committee drive.',
      'Train designated welfare officers in response protocols.'
    ],
    policyStatement: 'Our club has a plan in place that ensures an appropriate and timely response to illicit drug use or incidents.',
    resources: ['Incident response procedure: Illicit Drugs', 'Incident register']
  },

  // --- JUNIORS ---
  {
    id: 'junior_no_alcohol_games',
    group: 'Juniors',
    prompt: 'Does your club ensure that alcohol is not sold, supplied or consumed at junior games, training or competitions?',
    criteria: 'Club does not permit alcohol to be sold, supplied or consumed at junior games, training or competitions.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CNSJ'],
    npcId: 'npc_coach_sam',
    why: 'Sport is where young people develop fitness and friendships. Adult sidelines drinking normalizes alcohol and triggers inappropriate spectator conduct.',
    how: 'Ensure bars and eskies are closed during junior games and training, and put up signs stating the junior sidelines are alcohol-free.',
    actionItems: [
      'Prohibit alcohol sale, supply, and BYO during junior games and training.',
      'Display clear signage along junior field boundaries.'
    ],
    policyStatement: 'Our club does not permit alcohol being sold, supplied or consumed at junior games, training or competitions.',
    resources: ['Managing junior environments', 'Alcohol free junior poster']
  },
  {
    id: 'junior_no_alcohol_events',
    group: 'Juniors',
    prompt: 'Does your club ensure that alcohol is not sold, supplied or consumed at junior events or presentations?',
    criteria: 'Club does not permit alcohol to be sold, supplied or consumed at junior events or presentations.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CNSJ'],
    npcId: 'npc_coach_sam',
    why: 'Junior presentation days should celebrate youth achievement without adult alcohol consumption overshadowing the spotlight.',
    how: 'Keep trophy presentations and junior breakups completely alcohol-free with family-friendly entertainment.',
    actionItems: [
      'Ensure junior trophy presentations and events are completely alcohol-free.',
      'Communicate the policy clearly to parents and supporters in advance.'
    ],
    policyStatement: 'Our club does not permit alcohol being sold, supplied or consumed at junior events or presentations.',
    resources: ['Managing junior environments']
  },
  {
    id: 'junior_no_alcohol_changerooms',
    group: 'Juniors',
    prompt: 'Does your club ensure that alcohol is not consumed in change rooms when someone under 18 is present?',
    criteria: 'Alcohol is not consumed in the change rooms or changing areas when people aged under 18 are present.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_riley_welfare',
    why: 'Change rooms are vulnerable, private spaces. Adults drinking in change rooms where youth shower or dress creates unsafe environments and breaches child safe standards.',
    how: 'Strictly prohibit alcohol inside all locker and change room facilities.',
    actionItems: [
      'Enforce zero alcohol consumption inside change rooms and wet areas.',
      'Post notice signs on change room doors.'
    ],
    policyStatement: 'Our club does not permit alcohol to be consumed in change rooms or changing areas when people under 18 are present.',
    resources: ['Child safety guidelines', 'Managing junior environments']
  },
  {
    id: 'junior_no_alcohol_branding',
    group: 'Juniors',
    prompt: 'Does your club ensure alcohol brands and products are not promoted or advertised on junior team clothing or equipment?',
    criteria: 'Club does not promote alcohol brands and products on junior team clothing or equipment.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CNSJ', 'NCNSJ'],
    npcId: 'npc_coach_sam',
    why: 'Advertising alcohol on junior jerseys links sports identity with alcohol brands from an impressionable young age.',
    how: 'Exclude junior jerseys, training singlets, and balls from alcohol sponsor logos, seeking family-oriented sponsors instead.',
    actionItems: [
      'Audit junior team uniforms and eliminate alcohol logos and brewery sponsors.',
      'Communicate sponsorship rules to suppliers and commercial partners.'
    ],
    policyStatement: 'Our club ensures alcohol brands and products are not promoted or advertised on junior team clothing or equipment.',
    resources: ['Junior sponsorship guidelines']
  },

  // --- LEGAL COMPLIANCE ---
  {
    id: 'legal_licence_aware',
    group: 'Legal Compliance',
    prompt: 'Is your club aware of its liquor licence requirements or exemption requirements?',
    criteria: 'Club is aware of its liquor licence requirements or exemption requirements.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Every club supplying alcohol must comply with state licensing legislation and permit conditions to prevent catastrophic fines or licence cancellation.',
    how: 'Conduct an annual review of licence conditions and check for regulatory amendments.',
    actionItems: [
      'Review your state or territory club liquor licence conditions annually.',
      'Ensure the current licence is framed and visible in the licensed area.'
    ],
    policyStatement: 'Our club is aware of our liquor licence or exemption requirements, and reviews conditions annually.',
    resources: ['Liquor licensing laws guide by state']
  },
  {
    id: 'legal_correct_signage',
    group: 'Legal Compliance',
    prompt: 'Does your club display all alcohol-related signage required by your liquor licence or permit?',
    criteria: 'Club displays correct signage in alignment with state or territory liquor licensing laws.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'State laws require mandatory statutory signage (e.g. Under 18 warning, Intoxication refusal, RSA notices) at point-of-sale and entrances.',
    how: 'Download approved regulatory signs from your state liquor regulator and mount them at all bar entrances and counters.',
    actionItems: [
      'Review required statutory liquor licence signage for your state.',
      'Mount up-to-date notices visibly at every bar point-of-sale.'
    ],
    policyStatement: 'Our club complies with all liquor licence requirements in relation to mandatory signage.',
    resources: ['State liquor regulatory signage downloads']
  },
  {
    id: 'legal_hours_specified',
    group: 'Legal Compliance',
    prompt: 'Does your club only sell, supply or consume alcohol during the times specified on your liquor licence?',
    criteria: 'Alcohol is only served during the times specified in the liquor licence.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Trading outside authorized hours is a severe offence under liquor control acts that carries heavy personal and club penalties.',
    how: 'Post trading hours behind the bar, ring "last drinks" 15 minutes before closing, and shut shutters promptly.',
    actionItems: [
      'Confirm approved trading hours on the club licence.',
      'Instruct bar staff to cease all supply exactly at the specified closing time.'
    ],
    policyStatement: 'Our club ensures alcohol is only sold, supplied or consumed during the times specified on our licence.',
    resources: ['Liquor licensing regulations']
  },
  {
    id: 'legal_no_under_18_supply',
    group: 'Legal Compliance',
    prompt: 'Does your club ensure that alcohol is not sold or supplied to anyone under 18 years of age?',
    criteria: 'Alcohol is not sold or supplied to people under the age of 18 years.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Supplying alcohol to minors is illegal and harmful to youth cognitive and emotional health. Enforcing strict ID checks protects everyone.',
    how: 'Adopt a "Check 25" ID policy: anyone looking under 25 must provide government photo ID (license, passport, proof of age card).',
    actionItems: [
      'Enforce photo ID checks for anyone looking 25 years or younger.',
      'Display official "Proof of Age Required" signage at all points of service.'
    ],
    policyStatement: 'Our club ensures that alcohol is not sold or supplied to members or guests who are aged under 18 years.',
    resources: ['Proof of age guidance', 'Liquor control laws']
  },
  {
    id: 'legal_prevent_intox_entry',
    group: 'Legal Compliance',
    prompt: 'Does your club prevent intoxicated people from entering the premises?',
    criteria: 'Intoxicated people are not permitted to enter the premises.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Allowing intoxicated persons on the premises increases violence, injuries, and breaches liquor laws across Australia.',
    how: 'Station responsible greeters at club entrance during major games and events to politely turn away intoxicated individuals.',
    actionItems: [
      'Train volunteers and security to observe entry points for intoxication indicators.',
      'Display entrance signs stating intoxicated persons will be refused entry.'
    ],
    policyStatement: 'Our club prevents intoxicated people from entering the premises.',
    resources: ['Managing intoxication at your club']
  },
  {
    id: 'legal_refuse_intox_service',
    group: 'Legal Compliance',
    prompt: 'Does your club refuse service of alcohol when there are reasonable grounds to believe a person is intoxicated?',
    criteria: 'Intoxicated people are not served alcohol.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Serving an intoxicated person is illegal in every Australian jurisdiction and leads to severe accidents and licence suspension.',
    how: 'Empower bar staff to refuse service firmly and politely, offer water, and back up staff decisions 100% from the committee.',
    actionItems: [
      'Train all staff to detect speech, balance, and coordination indicators of intoxication.',
      'Ensure committee members immediately support bar staff during refusal of service.'
    ],
    policyStatement: 'Our club ensures all bar staff follow Responsible Service of Alcohol practices when refusing service to intoxicated patrons.',
    resources: ['Refusal of service guide', 'Preventing poor spectator behaviour']
  },
  {
    id: 'legal_process_managing_intox',
    group: 'Legal Compliance',
    prompt: 'Does your club have a process for managing people who are intoxicated on your premises?',
    criteria: 'Club has a process for managing people who are intoxicated on the premises.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Duty of care requires ensuring an intoxicated person leaves safely without driving or endangering themselves.',
    how: 'Provide water, help contact a family member or taxi, and record the event in the club Incident Register.',
    actionItems: [
      'Establish a clear protocol for assisting intoxicated individuals to depart safely via rideshare or family pickup.',
      'Log details in the Good Sports Incident Register.'
    ],
    policyStatement: 'Our club has a process for safely managing people who are intoxicated on the premises.',
    resources: ['Managing intoxication at your club', 'Incident register template']
  },
  {
    id: 'legal_observe_local_laws',
    group: 'Legal Compliance',
    prompt: 'Does your club follow local council laws in relation to alcohol consumption?',
    criteria: 'Club observes local laws in relation to alcohol consumption.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ'],
    npcId: 'npc_jess_compliance',
    why: 'Local councils enforce specific municipal by-laws on sports pavilions, public parks, glass restrictions, and consumption zones.',
    how: 'Review your municipal facility lease agreement and council alcohol consumption permits annually.',
    actionItems: [
      'Check local council by-laws regarding drinking in public reserves and council-owned clubrooms.',
      'Ensure all club practices and event permits comply with council regulations.'
    ],
    policyStatement: 'Our club complies with all requirements of local council alcohol laws and park regulations.',
    resources: ['Local council permits guide']
  },

  // --- MENTAL HEALTH ---
  {
    id: 'mental_education',
    group: 'Mental Health',
    prompt: 'Does your club provide opportunities for coaches, officials, members and volunteers to build mental health awareness?',
    criteria: 'Club provides an opportunity for coaches, officials, members and volunteers to be educated about mental health.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_dr_jordan',
    why: 'Sports clubs are trusted community hubs. Training coaches to notice withdrawal, changes in mood, and how to start a conversation saves lives.',
    how: 'Share the Good Sports Mental Health online module or host an "R U OK?" club session.',
    actionItems: [
      'Circulate the Good Sports Mental Health online module among coaching staff.',
      'Host an annual Mental Health Round or R U OK? Day club barbecue.'
    ],
    policyStatement: 'Our club provides opportunities for members, coaches and officials to build mental health awareness and learn about support services.',
    resources: ['Mental health awareness online module', 'R U OK? in sport kit']
  },
  {
    id: 'mental_materials_promoted',
    group: 'Mental Health',
    prompt: 'Does your club promote information about reputable mental health support services?',
    criteria: 'Mental health materials from reputable mental health organisations are promoted within the club.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_dr_jordan',
    why: 'Visible posters for Beyond Blue (1300 22 4636), Lifeline (13 11 14), and headspace normalize help-seeking in sporting environments.',
    how: 'Put up posters in changerooms and clubhouse bathrooms, and feature helplines on the club website.',
    actionItems: [
      'Display Good Sports mental health posters in change rooms and common areas.',
      'Regularly post helpline numbers in club emails and member newsletters.'
    ],
    policyStatement: 'Our club promotes information and contact pathways for reputable mental health support services.',
    resources: ['Lost your bounce poster', 'Mental health services directory']
  },
  {
    id: 'mental_critical_incident_plan',
    group: 'Mental Health',
    prompt: 'Does your club have a plan for responding to critical incidents that impact mental health?',
    criteria: 'Club has a plan for responding to critical incidents that have an impact on mental health.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_dr_jordan',
    why: 'Traumatic events (such as serious road crashes, loss of a member, or sudden emergencies) deeply shake a club. Having a support plan brings calm and care.',
    how: 'Appoint a volunteer wellbeing officer and adopt the Good Sports critical incident response procedure.',
    actionItems: [
      'Ensure the Good Sports mental health management plan is accessible.',
      'Appoint and support a volunteer Wellbeing Officer to oversee incident follow-up.'
    ],
    policyStatement: 'Our club has a plan in place to respond appropriately to critical incidents that impact member mental health.',
    resources: ['Mental health management plan template']
  },

  // --- SMOKING AND VAPING ---
  {
    id: 'smoke_comply_laws',
    group: 'Smoking and Vaping',
    prompt: 'Does your club comply with smoking and vaping laws and regulations in your state or territory?',
    criteria: 'Club complies with the smoking and vaping laws and regulations in your state or territory, as well as any local laws that may apply.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_sam_grounds',
    why: 'All Australian jurisdictions prohibit smoking and vaping in enclosed public spaces and within designated buffers (typically 10m) of outdoor sporting grounds.',
    how: 'Check state legislation and ensure the entire spectator boundary, clubrooms, and dugouts are smoke and vape-free.',
    actionItems: [
      'Audit the sporting facility to ensure compliance with outdoor smoking buffer laws.',
      'Ensure members and visiting teams are aware of designated smoke-free zones.'
    ],
    policyStatement: 'Our club complies with all state, territory, and local smoking and vaping laws and regulations.',
    resources: ['Guide to smoking and vaping laws by state']
  },
  {
    id: 'smoke_display_signage',
    group: 'Smoking and Vaping',
    prompt: 'Does your club display signage identifying smoke-free and vape-free areas?',
    criteria: 'Signage identifying smoke-free and vape-free areas is displayed at your club.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_sam_grounds',
    why: 'Clear visual signage eliminates second-hand smoke exposure, informs visiting spectators, and sets a firm health standard.',
    how: 'Mount official "No Smoking / No Vaping" signs at entry gates, grandstands, playgrounds, and canteen areas.',
    actionItems: [
      'Place smoke-free and vape-free signage at club entrances, sidelines, and food service counters.',
      'Designate any permitted smoking areas well away from spectators and junior fields.'
    ],
    policyStatement: 'Our club displays smoke-free and vape-free signage and clearly communicates designated areas.',
    resources: ['Smoke and Vape-free posters']
  },
  {
    id: 'smoke_officials_no_smoke',
    group: 'Smoking and Vaping',
    prompt: 'Does your club ensure coaches, members, officials and volunteers do not smoke or vape while involved in official club activities?',
    criteria: 'Coaches, members, officials and volunteers do not smoke or vape while involved in official club activities.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_sam_grounds',
    why: 'When coaches or officials vape or smoke in club uniform or on sidelines, it directly models dangerous habits to young athletes.',
    how: 'Prohibit smoking or vaping while wearing club polo/uniform or during training, coaching, and officiating duties.',
    actionItems: [
      'Enshrine smoke and vape-free requirements for all team officials in the Code of Conduct.',
      'Ensure committee members intervene if an official smokes in club uniform.'
    ],
    policyStatement: 'Our club ensures that coaches, members, officials and volunteers do not smoke or vape while involved in official club activities.',
    resources: ['Smoking and vaping management guide']
  },
  {
    id: 'smoke_promote_support',
    group: 'Smoking and Vaping',
    prompt: 'Does your club promote support services and resources that help people quit smoking or vaping?',
    criteria: 'Club promotes support services and resources that help people to quit smoking or vaping.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_sam_grounds',
    why: 'Providing Quitline links and resources demonstrates authentic community care and supports members seeking to improve their respiratory health.',
    how: 'Display Quitline posters (13 7848) and links to quit.org.au on club media.',
    actionItems: [
      'Display Quit support resources on club noticeboards and bathroom doors.',
      'Share quit.org.au resources in club newsletters.'
    ],
    policyStatement: 'Our club promotes information and support services that help members and volunteers quit smoking or vaping.',
    resources: ['Quit webpage', 'Do you need help to quit vaping poster']
  },
  {
    id: 'smoke_no_sell_tobacco',
    group: 'Smoking and Vaping',
    prompt: 'Does your club refrain from selling cigarettes or tobacco products?',
    criteria: 'Club does not sell cigarettes or tobacco products.',
    isMinimumCriteria: true,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_sam_grounds',
    why: 'Sport and tobacco are contradictory. Community sports clubs should never profit from or distribute addictive, cancer-causing tobacco products.',
    how: 'Maintain a 100% tobacco-free canteen and bar.',
    actionItems: [
      'Ensure cigarettes and vaping products are strictly excluded from club retail sales.'
    ],
    policyStatement: 'Our club does not sell cigarettes or tobacco products.',
    resources: ['Smoke-free club policy template']
  },
  {
    id: 'smoke_education',
    group: 'Smoking and Vaping',
    prompt: 'Does your club provide opportunities for coaches, officials, members and volunteers to learn about smoking and vaping harms?',
    criteria: 'Club provides an opportunity for coaches, officials, members and volunteers to be educated about smoking and vaping.',
    isMinimumCriteria: false,
    streams: ['CSJ', 'CSNJ', 'CNSJ', 'CNSNJ', 'NCNSJ', 'NCNSNJ'],
    npcId: 'npc_sam_grounds',
    why: 'Vaping has surged among teenagers. Coaches and parents need up-to-date facts to talk constructively with youth about vaping risks.',
    how: 'Circulate the Good Sports "Know the Score on Vaping" video series or organize an education session.',
    actionItems: [
      'Circulate Good Sports smoking and vaping education guides.',
      'Share "Know the Score on Vaping" training videos with coaches working with juniors.'
    ],
    policyStatement: 'Our club provides opportunities for coaches, officials, members and volunteers to learn about the risks of smoking and vaping.',
    resources: ['Coaches and club leader training', 'Talking about vaping with young people']
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'module_rsa_rapid_check',
    title: 'RSA Bar Safety & ID Challenge',
    group: 'Alcohol',
    description: 'Step behind the club bar! Test your reflexes and RSA rules: check IDs under 25, spot intoxication, serve free water, and refuse illegal shot promotions.',
    badgeName: 'RSA Bar Shield',
    badgeIcon: 'Wine',
    badgeColor: '#0284c7',
    badgeEarned: false,
    requiredQuestionIds: ['alc_water_free', 'alc_no_shots', 'alc_age_18_servers']
  },
  {
    id: 'module_junior_haven',
    title: 'Junior Safe Zone Inspection Drill',
    group: 'Juniors',
    description: 'Inspect the youth tournament perimeter! Locate and resolve sideline violations: junior changeroom alcohol breaches, alcohol sponsor logos on jerseys, and spectator drink zones.',
    badgeName: 'Junior Champion Crest',
    badgeIcon: 'Award',
    badgeColor: '#8b5cf6',
    badgeEarned: false,
    requiredQuestionIds: ['junior_no_alcohol_games', 'junior_no_alcohol_changerooms']
  },
  {
    id: 'module_mental_health_talk',
    title: '\'R U OK?\' Teammate Conversation Simulator',
    group: 'Mental Health',
    description: 'Engage in an empathetic dialogue with your teammate Dave, who has been unusually quiet and stressed after matches. Choose supportive listening steps and connect him with ADF & Beyond Blue support.',
    badgeName: 'Wellbeing Heart Star',
    badgeIcon: 'HeartPulse',
    badgeColor: '#06b6d4',
    badgeEarned: false,
    requiredQuestionIds: ['mental_education', 'mental_materials_promoted']
  },
  {
    id: 'module_incident_drill',
    title: 'Crisis & Incident Protocol Master',
    group: 'Illicit Drugs',
    description: 'A critical event occurs on presentation night. Sequence the official Good Sports Incident Response steps in rapid succession: assess safety, provide water/medical help, record in register, and coordinate with the wellbeing officer.',
    badgeName: 'Safety Guardian Ribbon',
    badgeIcon: 'ShieldAlert',
    badgeColor: '#a855f7',
    badgeEarned: false,
    requiredQuestionIds: ['gov_incident_plan_alc', 'drug_incident_plan']
  },
  {
    id: 'module_smoke_free_perimeter',
    title: 'Smoke & Vape-Free Perimeter Ranger',
    group: 'Smoking and Vaping',
    description: 'Setup compliance signage across grandstands, boundary lines, and playground zones. Enforce smoke-free buffers and support members with Quitline resources.',
    badgeName: 'Clean Air Crest',
    badgeIcon: 'Wind',
    badgeColor: '#22c55e',
    badgeEarned: false,
    requiredQuestionIds: ['smoke_comply_laws', 'smoke_display_signage', 'smoke_officials_no_smoke']
  },
  {
    id: 'module_safe_transport',
    title: 'Safe Celebrations & Shuttle Route Planner',
    group: 'Community Leadership',
    description: 'Plan the club\'s annual awards night! Select substantial hot food catering, zero-alcohol drink packages, designate driver rewards, and plot the club bus route home safely.',
    badgeName: 'Leadership Compass',
    badgeIcon: 'Bus',
    badgeColor: '#f59e0b',
    badgeEarned: false,
    requiredQuestionIds: ['alc_safe_transport', 'comm_sober_officials', 'comm_committee_commit']
  }
];

export const INITIAL_CLUB_PROFILE: ClubProfile = {
  name: 'Wattle Valley Rovers Sports Club',
  sport: 'Australian Rules Football & Netball',
  state: 'Victoria',
  stream: 'CSJ', // Consume + Sell + Juniors
  sellsAlcohol: true,
  consumesAlcohol: true,
  hasJuniors: true,
};

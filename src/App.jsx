import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Database, Shield, Cloud, Server, ArrowRight, CheckCircle,
  Zap, DollarSign, Layers, Info, AlertTriangle,
  Activity, Users, Code, Lock, CreditCard, Star, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Design tokens (inline) ─────────────────────────── */
const C = {
  bg:          '#0b1120',
  surface:     'rgba(22, 33, 55, 0.85)',
  surfaceDark: 'rgba(10, 16, 30, 0.7)',
  border:      'rgba(148, 163, 184, 0.12)',
  borderGlow:  'rgba(99, 179, 237, 0.25)',
  textPrimary: '#e2e8f0',
  textSub:     '#94a3b8',
  textMuted:   '#64748b',
  green:       '#3ecf8e',
  red:         '#f02d65',
  blue:        '#60a5fa',
  purple:      '#a78bfa',
  yellow:      '#fbbf24',
  success:     '#10b981',
  warning:     '#f59e0b',
  error:       '#ef4444',
};

const card = {
  background: C.surface,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: `1px solid ${C.border}`,
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};

const badgePill = (color) => ({
  display: 'inline-block',
  padding: '0.3rem 0.9rem',
  borderRadius: '999px',
  background: `${color}22`,
  border: `1px solid ${color}55`,
  color: color,
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
});

const effortBadge = (effort) => {
  const map = { High: C.error, Medium: C.warning, Low: C.success };
  const c = map[effort] || C.blue;
  return { ...badgePill(c) };
};

/* ─── Reusable Sub-components ────────────────────────── */
const StackRow = ({ label, detail, accentColor }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: '0.3rem',
    padding: '0.9rem 1.1rem',
    background: C.surfaceDark,
    borderRadius: '12px',
    borderLeft: `3px solid ${accentColor}`,
  }}>
    <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: accentColor }}>{label}</span>
    <span style={{ color: C.textSub, fontSize: '0.9rem', lineHeight: 1.6 }}>{detail}</span>
  </div>
);

const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    <ArrowRight size={16} style={{ color: C.textMuted, opacity: 0.4 }} />
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em',
    color: C.textPrimary, marginBottom: '1.5rem',
    borderBottom: `1px solid ${C.border}`, paddingBottom: '0.75rem',
  }}>
    {children}
  </h2>
);

/* ─── Main App ───────────────────────────────────────── */
const App = () => {
  const [userScale, setUserScale] = useState(10000);
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture',   label: 'Architecture',    icon: <Layers size={16} /> },
    { id: 'classification', label: 'Classification',  icon: <Info size={16} /> },
    { id: 'costs',          label: 'Scaling Costs',   icon: <DollarSign size={16} /> },
    { id: 'tiers',          label: 'Free vs. Paid',   icon: <CreditCard size={16} /> },
    { id: 'migration',      label: 'Migration Path',  icon: <Activity size={16} /> },
    { id: 'lockin',         label: 'Lock-in & Risk',  icon: <Lock size={16} /> },
  ];

  /* ── Tier data for all stack services ── */
  const tierData = [
    {
      service: 'Supabase',
      role: 'Database · Auth · Edge Functions · Storage',
      logo: '🟩',
      color: C.green,
      stack: 'supabase',
      freeName: 'Free',
      paidName: 'Pro — $25/mo/project',
      freeItems: [
        { label: 'Monthly Active Users',   value: '50,000 MAU',         risk: 'low' },
        { label: 'Database Storage',       value: '500 MB',             risk: 'medium' },
        { label: 'File Storage',           value: '1 GB',               risk: 'low' },
        { label: 'Egress (Bandwidth)',     value: '5 GB / month',       risk: 'medium' },
        { label: 'Edge Functions',         value: 'Included (limited)', risk: 'low' },
        { label: 'Auth Providers',         value: 'All (email, OAuth)', risk: 'low' },
        { label: 'Realtime',               value: 'Included',           risk: 'low' },
        { label: 'Backups',                value: 'None',               risk: 'high' },
        { label: 'Project Pausing',        value: 'After 7 days idle',  risk: 'high' },
        { label: 'Support',                value: 'Community only',     risk: 'medium' },
      ],
      paidItems: [
        { label: 'Monthly Active Users',   value: '100,000 MAU included' },
        { label: 'Database Storage',       value: '8 GB (+$0.125/GB)' },
        { label: 'File Storage',           value: '100 GB' },
        { label: 'Egress (Bandwidth)',     value: '250 GB / month' },
        { label: 'Edge Functions',         value: 'Higher compute limits' },
        { label: 'Compute Credits',        value: '$10/mo credit included' },
        { label: 'Backups',                value: 'Daily, 7-day retention' },
        { label: 'Project Pausing',        value: 'Never paused' },
        { label: 'Spend Caps',             value: 'Enabled by default' },
        { label: 'Support',                value: 'Email support' },
      ],
      runway: 'MedInsight is nowhere near the 50k MAU or 500MB limits today. Primary free-tier risk is the 7-day project pause — keep GitHub Actions or a cron job pinging the project weekly to prevent it.',
      upgradeWhen: 'When conversations + messages rows exceed ~200k records (~400MB), or when you need daily backups before a patient-facing launch.',
    },
    {
      service: 'Appwrite Cloud',
      role: 'Database · Auth · Functions · Storage',
      logo: '🟥',
      color: C.red,
      stack: 'appwrite',
      freeName: 'Starter (Free)',
      paidName: 'Pro — $25/mo/org',
      freeItems: [
        { label: 'Monthly Active Users',   value: '75,000 MAU',          risk: 'low' },
        { label: 'Projects',               value: '2 per org',           risk: 'low' },
        { label: 'Functions',              value: '2 per project',       risk: 'high' },
        { label: 'Function Executions',    value: '750,000 / month',     risk: 'low' },
        { label: 'Storage',                value: '2 GB',                risk: 'low' },
        { label: 'Bandwidth',              value: '5 GB / month',        risk: 'medium' },
        { label: 'Realtime Messages',      value: '2M / month',          risk: 'low' },
        { label: 'Realtime Connections',   value: '250 concurrent',      risk: 'low' },
        { label: 'Compute (GB-Hours)',     value: '100 GB-hrs / month',  risk: 'low' },
        { label: 'Resource Sharing',       value: 'Shared (not dedicated)', risk: 'medium' },
      ],
      paidItems: [
        { label: 'Monthly Active Users',   value: '200,000 MAU' },
        { label: 'Projects',               value: 'Unlimited' },
        { label: 'Functions',              value: 'Unlimited' },
        { label: 'Function Executions',    value: '3.5M / month' },
        { label: 'Storage',                value: '150 GB (+$2.80/100GB)' },
        { label: 'Bandwidth',              value: '2 TB / month' },
        { label: 'Realtime Messages',      value: '6M / month' },
        { label: 'Realtime Connections',   value: '500 concurrent' },
        { label: 'Compute (GB-Hours)',     value: '1,000 GB-hrs / month' },
        { label: 'Resources',              value: 'Dedicated per project' },
      ],
      runway: 'The 2-function limit per project is the critical constraint for MedInsight. You currently only need the health-chat function — but Clinical Summaries and Proactive Notifications (future features) each need their own function. You\'d hit the wall at feature 3.',
      upgradeWhen: 'When you build the Clinical Summary generator OR the notification service — whichever comes first. Both require a second dedicated Function.',
    },
    {
      service: 'Vercel',
      role: 'Frontend Hosting · Deployment Pipeline',
      logo: '▲',
      color: C.textPrimary,
      stack: 'both',
      freeName: 'Hobby (Free)',
      paidName: 'Pro — $20/mo/seat',
      freeItems: [
        { label: 'Commercial Use',         value: 'NOT allowed',         risk: 'high' },
        { label: 'Fast Data Transfer',     value: '100 GB / month',      risk: 'medium' },
        { label: 'Edge Requests',          value: '1M / month',          risk: 'low' },
        { label: 'Deployments / Day',      value: '100',                 risk: 'low' },
        { label: 'Concurrent Builds',      value: '1',                   risk: 'low' },
        { label: 'Build Minutes / Month',  value: '6,000',               risk: 'low' },
        { label: 'Function Memory',        value: '2 GB',                risk: 'low' },
        { label: 'Function Max Duration',  value: '300 seconds',         risk: 'low' },
        { label: 'Analytics',             value: 'Limited',              risk: 'medium' },
        { label: 'Overage Handling',       value: 'Services pause',      risk: 'high' },
      ],
      paidItems: [
        { label: 'Commercial Use',         value: 'Fully allowed' },
        { label: 'Fast Data Transfer',     value: '1 TB / month' },
        { label: 'Edge Requests',          value: '10M / month' },
        { label: 'Deployments / Day',      value: '6,000' },
        { label: 'Concurrent Builds',      value: 'Up to 12' },
        { label: 'Build Minutes / Month',  value: '24,000' },
        { label: 'Function Memory',        value: '4 GB' },
        { label: 'Function Max Duration',  value: 'Up to 800 seconds' },
        { label: 'Analytics',             value: 'Web Analytics included' },
        { label: 'Spend Management',       value: 'Configurable caps' },
      ],
      runway: '⚠️ IMPORTANT: Vercel Hobby is strictly personal/non-commercial. If MedInsight ever earns revenue, accepts grants, is used in a clinical setting, or is associated with an organization, Vercel\'s ToS requires the Pro plan. This is the most urgent billing risk in the stack.',
      upgradeWhen: 'The moment MedInsight AI moves from a personal prototype to any form of institutional, commercial, or grant-funded project. This should be budgeted from day one of any pilot launch.',
    },
    {
      service: 'Google Gemini API',
      role: 'AI Intelligence · health-chat Function',
      logo: '✦',
      color: C.blue,
      stack: 'both',
      freeName: 'Free Tier (AI Studio)',
      paidName: 'Paid / Billing Enabled (Tier 1+)',
      freeItems: [
        { label: 'API Key Required',       value: 'Yes (AI Studio)',     risk: 'low' },
        { label: 'Rate Limit (RPM)',        value: '10–15 req/min',       risk: 'high' },
        { label: 'Data Privacy',           value: 'Prompts may train Google models', risk: 'high' },
        { label: 'Cost',                   value: '$0',                  risk: 'low' },
        { label: 'Context Window',         value: '1M tokens',           risk: 'low' },
        { label: 'Billing Account',        value: 'Not required',        risk: 'low' },
        { label: 'Daily Requests',         value: '~200–500 RPD (est.)', risk: 'medium' },
        { label: 'Usage Tier',             value: 'Free (no billing)',   risk: 'high' },
      ],
      paidItems: [
        { label: 'Rate Limit (Tier 1)',    value: '150–300 req/min' },
        { label: 'Data Privacy',           value: 'Excluded from training' },
        { label: 'Cost (2.5 Flash)',       value: '~$0.075 / 1M tokens input' },
        { label: 'Billing Account',        value: 'Required (GCP)' },
        { label: 'Spend Caps',             value: 'Mandatory since Apr 2026' },
        { label: 'Tier Upgrades',          value: 'Automatic at $100 / $1k spend' },
        { label: 'SLA',                    value: 'Google Cloud SLA' },
        { label: 'Support',                value: 'GCP support tiers' },
      ],
      runway: 'You already have billing enabled (needed for the 1,500 free daily messages figure). At 10–15 RPM free, a classroom of 30 students chatting simultaneously would hit the cap instantly. Billing-enabled Tier 1 unlocks 150–300 RPM and removes the training data concern — critical for health data.',
      upgradeWhen: 'Already partially done (billing account linked). Ensure spend caps are enabled in GCP. The privacy concern (prompts used for training on free tier) means billing should stay enabled for any real user.',
    },
    {
      service: 'GitHub',
      role: 'Version Control · CI/CD · Code Storage',
      logo: '🐙',
      color: C.purple,
      stack: 'both',
      freeName: 'Free',
      paidName: 'Pro — $4/mo/user',
      freeItems: [
        { label: 'Public Repos',           value: 'Unlimited',           risk: 'low' },
        { label: 'Private Repos',          value: 'Unlimited',           risk: 'low' },
        { label: 'Actions Minutes',        value: '2,000 / month',       risk: 'low' },
        { label: 'Packages Storage',       value: '500 MB',              risk: 'low' },
        { label: 'Codespaces',             value: '120 hrs / month',     risk: 'low' },
        { label: 'Branch Protection',      value: 'Basic only',          risk: 'medium' },
        { label: 'PR Reviewers Required',  value: 'Not available',       risk: 'medium' },
        { label: 'Wikis (private repos)',  value: 'Not available',       risk: 'low' },
        { label: 'Insights & Graphs',      value: 'Limited',             risk: 'low' },
        { label: 'Support',                value: 'Community',           risk: 'low' },
      ],
      paidItems: [
        { label: 'Actions Minutes',        value: '3,000 / month' },
        { label: 'Packages Storage',       value: '2 GB' },
        { label: 'Codespaces',             value: '180 hrs / month' },
        { label: 'Branch Protection',      value: 'Advanced (code owners)' },
        { label: 'PR Reviewers Required',  value: 'Configurable' },
        { label: 'Wikis (private repos)',  value: 'Full wiki support' },
        { label: 'Insights & Graphs',      value: 'Full (traffic, contributors)' },
        { label: 'Auto-linked References', value: 'Supported' },
        { label: 'Support',                value: 'Email support' },
        { label: 'Price',                  value: '$4 / user / month' },
      ],
      runway: 'GitHub Free is genuinely generous and presents zero imminent limits for MedInsight. The 2,000 Actions minutes are free for private repos — sufficient for your current CI/CD cadence. No upgrade required until you need required PR reviewers for a team.',
      upgradeWhen: 'When MedInsight expands to a multi-person team that needs code review policies and protected branches for a production deployment.',
    },
  ];

  const riskColor = { low: C.success, medium: C.warning, high: C.error };

  const costData = useMemo(() => {
    const points = [];
    for (let s = 0; s <= 100000; s += 10000) {
      points.push({
        users: s === 0 ? '0' : `${s / 1000}k`,
        Supabase: s <= 50000 ? 25 : Math.round(25 + (s - 50000) * 0.0003),
        Appwrite: s <= 75000 ? 15 : Math.round(15 + (s - 75000) * 0.0002),
      });
    }
    return points;
  }, []);

  const sbCost = userScale <= 50000 ? 25 : Math.round(25 + (userScale - 50000) * 0.0003);
  const awCost = userScale <= 75000 ? 15 : Math.round(15 + (userScale - 75000) * 0.0002);

  const migrationSteps = [
    { task: 'Database Schema',  effort: 'Medium', detail: 'Convert Postgres relational tables (conversations, messages) to Appwrite Collections/Documents. The FK relationship between the two tables must become a $id reference field.', time: '3–5 days' },
    { task: 'Authentication',   effort: 'Low',    detail: 'Swap Supabase Auth SDK for Appwrite Account API. Session management and JWT handling is similar; OAuth providers (Google, GitHub) need reconfiguration in the Appwrite Console.', time: '1–2 days' },
    { task: '"health-chat" Function', effort: 'High', detail: 'Rewrite the Deno Edge Function to an Appwrite Function (Node.js 18+ or Deno). The Gemini 2.5 Flash API call logic stays the same; only the runtime wrapper and secrets management differ.', time: '1–2 weeks' },
    { task: 'Data Migration',   effort: 'Medium', detail: 'Export Postgres data via pg_dump, transform rows to JSON documents, then seed via Appwrite Server SDK. Historical chat history must be preserved with matching session_id references.', time: '3–7 days' },
    { task: 'Row Level Security → Permissions', effort: 'Medium', detail: 'Map Postgres RLS policies to Appwrite Document-level Permissions (user:{id}, any). The current "users own their conversations" rule maps cleanly.', time: '2–3 days' },
    { task: 'Frontend SDK Swap', effort: 'Low',   detail: 'Replace supabase.from("messages").select() calls with appwrite.databases.listDocuments(). The React component tree stays intact; only the data-fetching hooks change.', time: '2–4 days' },
  ];

  const classificationData = [
    {
      tool: 'Supabase',
      badge: 'BaaS — Backend as a Service',
      color: C.green,
      body: 'Supabase operates as a fully-managed Backend as a Service. It takes an open-source Postgres database and wraps it in a hosted API layer (PostgREST), an Auth service, Edge Functions (Deno runtime), and Realtime subscriptions — all provisioned on AWS via their control plane. You write no infrastructure code; you consume APIs.',
      nuance: 'Because the database is real Postgres, data portability is high. But the orchestration layer (Auth schema in auth.*, Edge Functions, RLS policies) is tightly coupled to Supabase\'s cloud — making it closer to a "managed PaaS" for those specific features.',
      traits: ['Fully hosted on AWS', 'Real Postgres (portable data)', 'Proprietary Auth schema', 'Deno-only Edge Function runtime'],
      responsibility: {
        providerHandles: [
          { category: 'Physical Infrastructure',  detail: 'AWS servers, data centers, networking, power, and cooling. You never touch a rack.' },
          { category: 'Database Engine',          detail: 'Postgres installation, patching, minor/major version upgrades, and WAL management.' },
          { category: 'High Availability',        detail: 'Automated failover and read replicas (on paid tiers). Zero config from your side.' },
          { category: 'Platform Security',        detail: 'TLS in transit, encryption at rest, Supabase control-plane authentication, and SOC 2 compliance.' },
          { category: 'Auth Service',             detail: 'GoTrue auth engine is hosted and maintained. JWT signing keys rotate automatically.' },
          { category: 'Edge Function Runtime',    detail: 'Deno sandboxing, cold-start management, and global distribution of the health-chat function.' },
          { category: 'Realtime Engine',          detail: 'WebSocket infrastructure behind supabase.channel() — scaling and connection management.' },
          { category: 'Backups (Pro only)',        detail: 'Daily automated Postgres backups with 7-day retention. Free tier has no backups.' },
          { category: 'Platform Uptime SLA',      detail: '99.9% uptime guarantee on Pro. Supabase monitors and pages on incidents.' },
        ],
        youHandle: [
          { category: 'Schema Design',            detail: 'You define and migrate the conversations and messages tables. No guardrails — a bad migration can break production.', risk: 'medium' },
          { category: 'Row Level Security (RLS)', detail: 'You write and maintain every Postgres policy. A misconfigured policy can expose all user medical chat data.', risk: 'high' },
          { category: 'Edge Function Logic',      detail: 'The health-chat function code, prompt engineering, Gemini API key rotation, and error handling are entirely yours.', risk: 'high' },
          { category: 'API Key Security',         detail: 'Supabase anon/service keys must be kept out of the React bundle. Currently handled via env vars — must stay that way.', risk: 'high' },
          { category: 'Data Compliance',          detail: 'HIPAA, FERPA, or state health privacy laws are YOUR responsibility. Supabase is not a HIPAA BAA partner on free tier.', risk: 'high' },
          { category: 'Frontend Application',     detail: 'All React UI code, component logic, Vercel deployment config, and client-side error handling.', risk: 'medium' },
          { category: 'Third-Party Integrations', detail: 'Gemini API version pinning, Google Cloud billing alerts, and SDK updates when breaking changes ship.', risk: 'medium' },
          { category: 'Project Active State',     detail: 'On the free tier, you must ping the project weekly to prevent the 7-day idle pause. Supabase will not warn you.', risk: 'medium' },
          { category: 'Cost Monitoring',          detail: 'No auto-alerts on free tier. You must proactively watch usage in the Supabase dashboard to avoid surprise overages.', risk: 'low' },
        ],
      },
    },
    {
      tool: 'Appwrite',
      badge: 'BaaS + Self-Host Option (IaaS-adjacent)',
      color: C.red,
      body: 'Appwrite is also Backend as a Service, but with a critical structural difference: the entire platform ships as a Docker Compose stack. This means it can run identically on Appwrite Cloud (fully managed SaaS), on a VPS you control (self-hosted), or in a private data center. The API surface is identical in all three models.',
      nuance: 'This dual-mode nature pushes Appwrite toward the IaaS boundary when self-hosted — you own the infrastructure. On Appwrite Cloud, it is pure BaaS/SaaS. For MedInsight\'s current stage, Cloud mode is the relevant comparison.',
      traits: ['Cloud OR self-hosted Docker', 'MariaDB under a JSON abstraction layer', 'Multi-runtime Functions (Node, Deno, Python, PHP, Go)', 'Open-source MIT core'],
      responsibility: {
        providerHandles: [
          { category: 'Physical Infrastructure',  detail: 'On Appwrite Cloud, servers, networking, and data center operations are fully managed. Self-hosted shifts this to you.' },
          { category: 'Database Engine',          detail: 'MariaDB provisioning, patching, and backups are managed by Appwrite Cloud (abstracted under the Collection API).' },
          { category: 'Platform Security',        detail: 'TLS, encryption at rest, and the security of the Appwrite control plane and console authentication.' },
          { category: 'Auth Service',             detail: 'The Account API, session store, and JWT issuing are fully managed. OAuth flows work out of the box.' },
          { category: 'Function Runtime',         detail: 'Container sandboxing for Node.js/Deno/Python runtimes, cold-start management, and scaling of the health-chat function.' },
          { category: 'Storage Service',          detail: 'File bucket hosting, CDN distribution, and image transformation pipeline are managed.' },
          { category: 'Platform Uptime',          detail: 'Appwrite Cloud commits to an uptime SLA; they monitor infrastructure and handle incident response.' },
          { category: 'SDK Maintenance',          detail: 'Appwrite maintains the official Web SDK — API compatibility and security patches are their responsibility.' },
        ],
        youHandle: [
          { category: 'Collection Schema Design', detail: 'You define attribute types, required fields, and indexes. No foreign keys — referential integrity is your app logic.', risk: 'medium' },
          { category: 'Document Permissions',     detail: 'You set read/write rules on every document. Appwrite has no equivalent to row-level SQL policies — logic lives in your app code.', risk: 'high' },
          { category: 'Function Logic',           detail: 'All Node.js health-chat code, Gemini API integration, prompt construction, and retry logic is yours to build and maintain.', risk: 'high' },
          { category: 'Relational Logic',         detail: 'There are no JOINs. Fetching a conversation and all its messages requires two API calls — you must handle ordering and pagination manually.', risk: 'medium' },
          { category: 'API Key Security',         detail: 'Appwrite API keys must be stored as Function environment variables, never in the React bundle. Same risk as Supabase, same solution.', risk: 'high' },
          { category: 'Data Compliance',          detail: 'HIPAA/health data compliance remains entirely your responsibility. Appwrite Cloud is not a HIPAA BAA provider.', risk: 'high' },
          { category: 'Frontend Application',     detail: 'All React UI, Vercel deployment, and client-side error handling. The SDK swap is yours to execute and test.', risk: 'medium' },
          { category: 'Self-Host Operations',     detail: 'If you ever move to self-hosted, Docker, server patching, SSL certs, and disk management become entirely yours.', risk: 'low' },
          { category: 'Ecosystem Research',       detail: 'Appwrite has a smaller plugin ecosystem. Evaluating third-party compatibility (e.g., HL7 for the Physician Bridge) is your work.', risk: 'low' },
        ],
      },
    },
  ];

  const lockInItems = [
    { category: 'Data Portability', supabase: { rating: 'Excellent', note: 'Plain Postgres — pg_dump works anywhere.', color: C.success },     appwrite: { rating: 'Good', note: 'JSON export available; MariaDB under the hood.', color: C.success } },
    { category: 'Auth Portability', supabase: { rating: 'Moderate', note: 'auth.* schema is Supabase-proprietary.', color: C.warning },         appwrite: { rating: 'Good', note: 'Standard JWT; sessions via open spec.', color: C.success } },
    { category: 'Function Runtime', supabase: { rating: 'Low', note: 'Deno only — no Python or Go support.', color: C.error },                  appwrite: { rating: 'Excellent', note: '6 runtimes including Python, Go, PHP.', color: C.success } },
    { category: 'Self-Hosting',     supabase: { rating: 'Partial', note: 'Docker available but poorly documented.', color: C.warning },          appwrite: { rating: 'First-Class', note: 'docker compose up — official path.', color: C.success } },
    { category: 'Pricing Model',    supabase: { rating: 'Usage-based', note: 'Spikes on egress & large storage.', color: C.warning },            appwrite: { rating: 'Seat-based', note: 'Predictable; larger free MAU tier.', color: C.success } },
  ];

  const risks = [
    { severity: 'high',   platform: 'Supabase', title: 'Pricing Tail Risk', desc: 'As MedInsight scales to 500k+ message rows and high egress (clinical summaries, PDFs), costs in Supabase\'s proprietary cloud can spike unpredictably without a hard cap.' },
    { severity: 'high',   platform: 'Appwrite', title: 'Schema Flexibility Tradeoff', desc: 'Appwrite\'s Collection API adds constraints on data types and JSON depth. Complex relational queries (e.g., "all messages in conversations older than 30 days") require either multiple round-trips or Functions.' },
    { severity: 'medium', platform: 'Supabase', title: 'Edge Function Runtime Lock-in', desc: 'The health-chat function is Deno-based. If Gemini\'s SDK drops Deno support or you need a Python ML library, migration becomes unavoidable.' },
    { severity: 'medium', platform: 'Appwrite', title: 'Ecosystem Maturity', desc: 'Appwrite\'s community and third-party integration library is significantly smaller than Postgres\'. Some future "Physician Bridge" integrations (e.g., HL7/FHIR libraries) may not exist as Appwrite plugins.' },
    { severity: 'low',    platform: 'Supabase', title: 'Lovable Dependency Risk', desc: 'Lovable\'s tight Supabase coupling means any AI-generated code assumes Supabase tables. Paid plan required for full code control — already a pain point you\'ve encountered.' },
    { severity: 'low',    platform: 'Appwrite', title: 'Migration Data Fidelity', desc: 'Converting from relational to document model risks subtle data integrity issues (e.g., orphaned message documents if conversation migration fails mid-batch).' },
  ];

  const sevColor = { high: C.error, medium: C.warning, low: C.success };

  /* ── Render ── */
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.textPrimary, fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.65 }}>

      {/* ── Header ── */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '3.5rem 2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ ...badgePill(C.blue), marginBottom: '1.2rem', display: 'inline-block' }}>
            MedInsight AI · Migration Strategy
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Evolution of the Health Stack
          </h1>
          <p style={{ fontSize: '1.05rem', color: C.textSub, maxWidth: 640, margin: '0 auto', lineHeight: 1.75 }}>
            A detailed, project-specific comparison of our current <strong style={{ color: C.textPrimary }}>Supabase</strong> infrastructure against a potential transition to <strong style={{ color: C.textPrimary }}>Appwrite</strong> — covering architecture, costs, migration effort, and lock-in risk.
          </p>
        </div>

        {/* ── Nav ── */}
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1.2rem', borderRadius: '10px',
                  border: active ? `1px solid ${C.borderGlow}` : `1px solid ${C.border}`,
                  background: active ? 'rgba(99,179,237,0.12)' : 'rgba(22,33,55,0.7)',
                  color: active ? C.blue : C.textSub,
                  fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                  boxShadow: active ? '0 0 18px rgba(99,179,237,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ paddingBottom: '5rem' }}
          >

            {/* ══ ARCHITECTURE ══ */}
            {activeTab === 'architecture' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Unified aligned diagram — single card, shared row grid */}
                <div style={{ ...card, padding: '2rem' }}>

                  {/* Platform headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: `2px solid ${C.green}` }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.green}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Database size={18} style={{ color: C.green }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.green }}>Current Stack</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Supabase</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1.25rem', borderBottom: `2px solid ${C.red}` }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.red}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Cloud size={18} style={{ color: C.red }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.red }}>Potential Stack</div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Appwrite</div>
                      </div>
                    </div>
                  </div>

                  {/* Layer rows — each pair of StackRows is in the SAME grid row so heights always match */}
                  {[
                    {
                      sb: { label: 'Client Layer',               detail: 'React (Vercel) · Supabase Client SDK · GitHub Versioning',                                                                                 color: C.blue   },
                      aw: { label: 'Client Layer',               detail: 'React (Vercel) · Appwrite Web SDK · Same GitHub integration — minimal frontend changes',                                                   color: C.blue   },
                    },
                    {
                      sb: { label: 'Auth & RLS',                 detail: 'Supabase Auth → unique user_id → links profiles to chat history via Postgres Row-Level Security Policies',                                 color: C.green  },
                      aw: { label: 'Account Service',            detail: 'Appwrite Account API → session-based auth → same user-owns-data model enforced via Document Permissions',                                  color: C.red    },
                    },
                    {
                      sb: { label: 'Edge Function: health-chat', detail: 'Deno runtime intercepts /send → bundles user profile + message → calls Google Gemini 2.5 Flash API (key hidden server-side)',              color: C.purple },
                      aw: { label: 'Function: health-chat',      detail: 'Node.js 18 runtime replaces Deno. Gemini API call logic is identical; secrets managed via Appwrite Console env vars',                     color: C.purple },
                    },
                    {
                      sb: { label: 'PostgREST API',              detail: "supabase.from('messages').insert() auto-writes via REST layer atop Postgres — no custom API code needed",                                  color: C.green  },
                      aw: { label: 'Databases API',              detail: 'appwrite.databases.listDocuments() replaces PostgREST. Queries are attribute-filtered JSON — no JOIN support at SDK level',               color: C.red    },
                    },
                  ].map((layer, i) => (
                    <div key={i}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                        <StackRow label={layer.sb.label} detail={layer.sb.detail} accentColor={layer.sb.color} />
                        <StackRow label={layer.aw.label} detail={layer.aw.detail} accentColor={layer.aw.color} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Divider />
                        <Divider />
                      </div>
                    </div>
                  ))}

                  {/* Database row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem 1.1rem', background: `${C.green}18`, borderRadius: 12, border: `1px solid ${C.green}44`, textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: C.green }}>PostgreSQL</div>
                      <div style={{ fontSize: '0.82rem', color: C.textMuted, marginTop: '0.2rem' }}>conversations · messages · profiles</div>
                    </div>
                    <div style={{ padding: '1rem 1.1rem', background: `${C.red}18`, borderRadius: 12, border: `1px solid ${C.red}44`, textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: C.red }}>Collections API (MariaDB)</div>
                      <div style={{ fontSize: '0.82rem', color: C.textMuted, marginTop: '0.2rem' }}>conversations · messages · profiles (as Documents)</div>
                    </div>
                  </div>
                </div>

                {/* Key Differences Banner */}
                <div style={{ ...card, background: 'rgba(99,179,237,0.06)', borderColor: C.borderGlow }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                    {[
                      { icon: <Database size={20} />, color: C.green,  title: 'SQL vs. Document',    body: 'Supabase gives full relational power (JOINs, triggers). Appwrite abstracts to JSON Documents — simpler to start, limiting at scale.' },
                      { icon: <Code size={20} />,     color: C.purple, title: 'Deno vs. Node.js',    body: 'health-chat must be rewritten for Node.js 18. Logic stays the same; Gemini SDK works in both. Effort: ~1 sprint.' },
                      { icon: <Shield size={20} />,   color: C.red,    title: 'RLS vs. Permissions', body: 'Postgres Row-Level Security → Appwrite Document Permissions. The "user owns their data" rule maps cleanly.' },
                    ].map(item => (
                      <div key={item.title} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ color: item.color, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.88rem', color: C.textSub, lineHeight: 1.65 }}>{item.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ CLASSIFICATION ══ */}
            {activeTab === 'classification' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Intro explainer */}
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(99,179,237,0.07)', borderRadius: 14, border: `1px solid ${C.borderGlow}`, fontSize: '0.9rem', color: C.textSub, lineHeight: 1.75 }}>
                  <strong style={{ color: C.blue }}>Shared Responsibility Model:</strong> In cloud computing, responsibility for security, reliability, and compliance is divided between the provider and the customer. Understanding this split tells you exactly where your risk exposure begins — and what you can't outsource.
                </div>

                {classificationData.map(item => (
                  <div key={item.tool} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Platform identity card */}
                    <div style={{ ...card, borderLeft: `4px solid ${item.color}` }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: item.color, marginBottom: '0.4rem' }}>Platform</div>
                          <div style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '0.75rem' }}>{item.tool}</div>
                          <span style={{ ...badgePill(item.color), display: 'inline-block', marginBottom: '1.5rem' }}>{item.badge}</span>
                          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {item.traits.map(t => (
                              <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: C.textSub }}>
                                <CheckCircle size={14} style={{ color: item.color, flexShrink: 0, marginTop: 2 }} />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.97rem', color: C.textPrimary, lineHeight: 1.8, marginBottom: '1.2rem' }}>{item.body}</p>
                          <div style={{ padding: '1rem 1.25rem', background: C.surfaceDark, borderRadius: 12, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Nuance</div>
                            <p style={{ fontSize: '0.9rem', color: C.textSub, lineHeight: 1.75 }}>{item.nuance}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shared Responsibility Matrix */}
                    <div style={{ ...card, padding: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <Shield size={18} style={{ color: item.color }} />
                        <h3 style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                          Shared Responsibility — {item.tool} (Cloud Mode)
                        </h3>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                        {/* Provider column */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.6rem 0.9rem', background: `${C.success}12`, borderRadius: 8, border: `1px solid ${C.success}30` }}>
                            <CheckCircle size={14} style={{ color: C.success }} />
                            <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: C.success }}>Provider Handles (You don't touch this)</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {item.responsibility.providerHandles.map(r => (
                              <div key={r.category} style={{ padding: '0.75rem 0.9rem', background: C.surfaceDark, borderRadius: 10, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.success}` }}>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: C.textPrimary, marginBottom: '0.25rem' }}>{r.category}</div>
                                <div style={{ fontSize: '0.82rem', color: C.textSub, lineHeight: 1.6 }}>{r.detail}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Developer column */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.6rem 0.9rem', background: `${C.warning}12`, borderRadius: 8, border: `1px solid ${C.warning}30` }}>
                            <Users size={14} style={{ color: C.warning }} />
                            <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: C.warning }}>You Handle (Your responsibility)</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {item.responsibility.youHandle.map(r => (
                              <div key={r.category} style={{ padding: '0.75rem 0.9rem', background: C.surfaceDark, borderRadius: 10, border: `1px solid ${C.border}`, borderLeft: `3px solid ${riskColor[r.risk]}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '0.5rem' }}>
                                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: C.textPrimary }}>{r.category}</div>
                                  <span style={{ ...badgePill(riskColor[r.risk]), fontSize: '0.6rem', padding: '0.15rem 0.55rem', flexShrink: 0 }}>{r.risk} risk</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: C.textSub, lineHeight: 1.6 }}>{r.detail}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Summary callout */}
                      <div style={{ marginTop: '1.25rem', padding: '0.9rem 1.1rem', background: `${item.color}0d`, borderRadius: 10, border: `1px solid ${item.color}30`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ fontSize: '0.83rem', color: C.textSub }}>
                          <span style={{ fontWeight: 700, color: C.success }}>✓ Provider owns:</span> Infrastructure, runtime security, platform uptime, database engine, and auth plumbing.
                        </div>
                        <div style={{ fontSize: '0.83rem', color: C.textSub }}>
                          <span style={{ fontWeight: 700, color: C.warning }}>⚠ You own:</span> All business logic, data schema, security policies, compliance, API key hygiene, and the AI integration (Gemini).
                        </div>
                      </div>
                    </div>

                  </div>
                ))}

                {/* Side-by-side comparison callout */}
                <div style={{ ...card, background: 'rgba(99,179,237,0.05)', borderColor: C.borderGlow }}>
                  <SectionTitle>Key Differences in What You Own</SectionTitle>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'left', color: C.textMuted, fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Responsibility Area</th>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'center', color: C.green, fontWeight: 700, fontSize: '0.8rem' }}>Supabase</th>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'center', color: C.red, fontWeight: 700, fontSize: '0.8rem' }}>Appwrite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { area: 'Database schema & migrations',   sb: 'SQL + migrations (you run them)',              aw: 'Collection attributes (no SQL, point-and-click or API)' },
                          { area: 'Data security policies',         sb: 'SQL Row-Level Security — you write every policy', aw: 'Document Permissions — set per-document in code' },
                          { area: 'AI function (health-chat)',       sb: 'Deno function — you own all logic + key mgmt',  aw: 'Node.js function — same logic, different runtime wrapper' },
                          { area: 'Relational data integrity',      sb: 'FK constraints enforced by Postgres',           aw: 'No FK support — your app code must validate references' },
                          { area: 'Health data compliance (HIPAA)', sb: 'Your responsibility — Supabase is not a HIPAA BAA', aw: 'Your responsibility — Appwrite is not a HIPAA BAA' },
                          { area: 'Project availability (free)',    sb: '⚠️ You must keep project active (7-day idle pause)', aw: 'No idle pause on free tier' },
                          { area: 'Backup & recovery (free)',       sb: '⚠️ No backups — you must export manually',       aw: 'Limited backups on free — verify with console' },
                          { area: 'SDK maintenance',                sb: 'Supabase ships SDK updates; you pin versions',   aw: 'Appwrite ships SDK updates; you pin versions' },
                        ].map((row, i) => (
                          <tr key={row.area} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : C.surfaceDark }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: C.textPrimary }}>{row.area}</td>
                            <td style={{ padding: '0.85rem 1rem', color: C.textSub, textAlign: 'center', fontSize: '0.84rem' }}>{row.sb}</td>
                            <td style={{ padding: '0.85rem 1rem', color: C.textSub, textAlign: 'center', fontSize: '0.84rem' }}>{row.aw}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ══ COSTS ══ */}
            {activeTab === 'costs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ ...card }}>
                  <SectionTitle>Scale-up Cost Projection (Est. Monthly)</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'start' }}>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                          <label style={{ fontWeight: 600, fontSize: '0.9rem', color: C.textSub }}>Monthly Active Users</label>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: C.blue, fontFamily: 'monospace' }}>{userScale.toLocaleString()}</span>
                        </div>
                        <input
                          id="user-scale-slider"
                          type="range" min="0" max="100000" step="500"
                          value={userScale}
                          onChange={e => setUserScale(Number(e.target.value))}
                          style={{ width: '100%', accentColor: C.blue, height: '6px', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', color: C.textMuted, fontFamily: 'monospace' }}>
                          <span>0</span><span>50k</span><span>75k</span><span>100k</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ padding: '1.2rem', background: `${C.green}10`, borderRadius: 14, border: `1px solid ${C.green}33` }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.green, marginBottom: '0.3rem' }}>Supabase Pro</div>
                          <div style={{ fontWeight: 900, fontSize: '2rem', fontFamily: 'monospace' }}>${sbCost}<span style={{ fontSize: '0.85rem', color: C.textMuted, fontFamily: 'sans-serif', fontWeight: 400 }}>/mo</span></div>
                          <div style={{ fontSize: '0.78rem', color: C.textMuted, marginTop: '0.3rem' }}>{userScale <= 50000 ? 'Within 50k MAU free tier' : `+${(userScale - 50000).toLocaleString()} MAU over limit`}</div>
                        </div>
                        <div style={{ padding: '1.2rem', background: `${C.red}10`, borderRadius: 14, border: `1px solid ${C.red}33` }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.red, marginBottom: '0.3rem' }}>Appwrite Cloud</div>
                          <div style={{ fontWeight: 900, fontSize: '2rem', fontFamily: 'monospace' }}>${awCost}<span style={{ fontSize: '0.85rem', color: C.textMuted, fontFamily: 'sans-serif', fontWeight: 400 }}>/mo</span></div>
                          <div style={{ fontSize: '0.78rem', color: C.textMuted, marginTop: '0.3rem' }}>{userScale <= 75000 ? 'Within 75k MAU free tier' : `+${(userScale - 75000).toLocaleString()} MAU over limit`}</div>
                        </div>
                        <div style={{ padding: '0.9rem 1rem', background: C.surfaceDark, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: '0.82rem', color: C.textSub, lineHeight: 1.65 }}>
                          💡 At current usage (early stage), Appwrite saves ~${sbCost - awCost}/mo. The gap narrows above 75k MAU.
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div style={{ height: 380 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={costData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                          <defs>
                            <linearGradient id="gSB" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={C.green} stopOpacity={0.25} />
                              <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gAW" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={C.red} stopOpacity={0.25} />
                              <stop offset="95%" stopColor={C.red} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.08)" vertical={false} />
                          <XAxis dataKey="users" stroke={C.textMuted} fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Monthly Active Users', position: 'insideBottom', offset: -5, fill: C.textMuted, fontSize: 11 }} />
                          <YAxis stroke={C.textMuted} fontSize={12} tickLine={false} axisLine={false} unit="$" width={45} />
                          <Tooltip contentStyle={{ background: '#0b1120', border: `1px solid ${C.border}`, borderRadius: 10, color: C.textPrimary }} />
                          <Legend verticalAlign="top" height={32} />
                          <Area type="monotone" dataKey="Supabase" stroke={C.green} strokeWidth={2.5} fill="url(#gSB)" />
                          <Area type="monotone" dataKey="Appwrite" stroke={C.red} strokeWidth={2.5} fill="url(#gAW)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem 1.25rem', background: 'rgba(99,179,237,0.07)', borderRadius: 14, border: `1px solid ${C.borderGlow}`, fontSize: '0.9rem', color: C.textSub, lineHeight: 1.75 }}>
                  <strong style={{ color: C.blue }}>Pricing Note:</strong> Estimates use simplified MAU-based scaling for illustration. Real costs include egress, storage, and function invocations. Supabase charges ~$0.00325/additional MAU; Appwrite Cloud charges per resource bucket. Both have generous free tiers well above MedInsight's current scale.
                </div>
              </div>
            )}

            {/* ══ FREE VS. PAID TIERS ══ */}
            {activeTab === 'tiers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Summary banner */}
                <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(99,179,237,0.07)', borderRadius: 16, border: `1px solid ${C.borderGlow}`, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  {[
                    { label: 'Supabase', cost: '$0 → $25/mo', urgency: 'low' },
                    { label: 'Appwrite', cost: '$0 → $25/mo', urgency: 'medium' },
                    { label: 'Vercel',   cost: '$0 → $20/mo', urgency: 'high' },
                    { label: 'Gemini',   cost: '$0 → pay-as-go', urgency: 'medium' },
                    { label: 'GitHub',   cost: '$0 → $4/mo', urgency: 'low' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '0.75rem', background: C.surfaceDark, borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{s.label}</div>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: C.textSub }}>{s.cost}</div>
                      <div style={{ marginTop: '0.4rem', ...badgePill(riskColor[s.urgency]), fontSize: '0.6rem' }}>
                        {s.urgency === 'high' ? 'Upgrade soon' : s.urgency === 'medium' ? 'Watch closely' : 'Comfortable'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Per-service expanded cards */}
                {tierData.map(svc => (
                  <div key={svc.service} style={{ ...card, borderTop: `3px solid ${svc.color}` }}>

                    {/* Service header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{svc.logo}</span>
                          <span style={{ fontWeight: 900, fontSize: '1.2rem' }}>{svc.service}</span>
                          {svc.stack !== 'both' && (
                            <span style={{ ...badgePill(svc.color), fontSize: '0.65rem' }}>
                              {svc.stack === 'supabase' ? 'Current Stack' : 'Migration Target'}
                            </span>
                          )}
                          {svc.stack === 'both' && (
                            <span style={{ ...badgePill(C.textMuted), fontSize: '0.65rem' }}>Both Stacks</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.83rem', color: C.textMuted }}>{svc.role}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ ...badgePill(C.success), fontSize: '0.65rem' }}>{svc.freeName}</span>
                        <span style={{ ...badgePill(C.blue), fontSize: '0.65rem' }}>{svc.paidName}</span>
                      </div>
                    </div>

                    {/* Two-column comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

                      {/* Free column */}
                      <div style={{ background: C.surfaceDark, borderRadius: 14, padding: '1.1rem', border: `1px solid ${C.success}33` }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: C.success, marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={14} /> {svc.freeName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {svc.freeItems.map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', padding: '0.45rem 0', borderBottom: `1px solid ${C.border}` }}>
                              <span style={{ fontSize: '0.83rem', color: C.textSub, flexShrink: 0 }}>{item.label}</span>
                              <span style={{ fontSize: '0.83rem', fontWeight: 600, color: riskColor[item.risk], textAlign: 'right' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Paid column */}
                      <div style={{ background: C.surfaceDark, borderRadius: 14, padding: '1.1rem', border: `1px solid ${C.blue}33` }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: C.blue, marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Star size={14} /> {svc.paidName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {svc.paidItems.map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', padding: '0.45rem 0', borderBottom: `1px solid ${C.border}` }}>
                              <span style={{ fontSize: '0.83rem', color: C.textSub, flexShrink: 0 }}>{item.label}</span>
                              <span style={{ fontSize: '0.83rem', fontWeight: 600, color: C.textPrimary, textAlign: 'right' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Runway + upgrade trigger */}
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1rem' }}>
                      <div style={{ padding: '0.9rem 1rem', background: 'rgba(99,179,237,0.06)', borderRadius: 12, border: `1px solid ${C.borderGlow}` }}>
                        <div style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: C.blue, marginBottom: '0.4rem' }}>
                          MedInsight Freemium Runway
                        </div>
                        <p style={{ fontSize: '0.86rem', color: C.textSub, lineHeight: 1.7 }}>{svc.runway}</p>
                      </div>
                      <div style={{ padding: '0.9rem 1rem', background: `${C.warning}0d`, borderRadius: 12, border: `1px solid ${C.warning}33` }}>
                        <div style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: C.warning, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <TrendingUp size={13} /> Upgrade When
                        </div>
                        <p style={{ fontSize: '0.86rem', color: C.textSub, lineHeight: 1.7 }}>{svc.upgradeWhen}</p>
                      </div>
                    </div>

                  </div>
                ))}

                {/* Total monthly cost summary */}
                <div style={{ ...card, background: 'rgba(99,179,237,0.06)', borderColor: C.borderGlow }}>
                  <SectionTitle>Total Stack — Monthly Cost Today (Freemium)</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                    {[
                      { name: 'Supabase', cost: '$0', note: 'Free tier' },
                      { name: 'Appwrite', cost: 'N/A', note: 'Not yet used' },
                      { name: 'Vercel',   cost: '$0', note: 'Hobby plan (⚠️ commercial risk)' },
                      { name: 'Gemini',   cost: '~$0', note: 'Billing enabled, minimal usage' },
                      { name: 'GitHub',   cost: '$0', note: 'Free tier' },
                    ].map(item => (
                      <div key={item.name} style={{ textAlign: 'center', padding: '1rem', background: C.surfaceDark, borderRadius: 12, border: `1px solid ${C.border}` }}>
                        <div style={{ fontWeight: 800, fontSize: '1.4rem', fontFamily: 'monospace' }}>{item.cost}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: C.textMuted, marginTop: '0.15rem' }}>{item.note}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: C.surfaceDark, borderRadius: 12, border: `1px solid ${C.border}` }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: C.textSub }}>Estimated minimum paid stack (when needed):</span>
                      <span style={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: 'monospace', color: C.blue, marginLeft: '0.75rem' }}>$45–$69/mo</span>
                      <span style={{ fontSize: '0.78rem', color: C.textMuted, marginLeft: '0.4rem' }}>(Vercel Pro + Supabase Pro + GitHub Free)</span>
                    </div>
                    <span style={{ ...badgePill(C.warning) }}>Future State</span>
                  </div>
                </div>
              </div>
            )}

            {/* ══ MIGRATION PATH ══ */}
            {activeTab === 'migration' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ ...card }}>
                  <SectionTitle>Migration Assessment — MedInsight AI</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                    {migrationSteps.map((step, i) => (
                      <div key={step.task} style={{ display: 'grid', gridTemplateColumns: '2fr 120px 3fr auto', gap: '1.25rem', alignItems: 'center', padding: '1.1rem 1.25rem', background: C.surfaceDark, borderRadius: 12, border: `1px solid ${C.border}` }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, fontFamily: 'monospace' }}>Step {i + 1}</span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.97rem', color: C.textPrimary }}>{step.task}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={effortBadge(step.effort)}>{step.effort}</span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: C.textSub, lineHeight: 1.65 }}>{step.detail}</div>
                        <div style={{ textAlign: 'right', whiteSpace: 'nowrap', fontSize: '0.82rem', color: C.textMuted, fontFamily: 'monospace' }}>{step.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  {[
                    { icon: <Zap size={18} style={{ color: C.yellow }} />, title: 'Key Opportunity', body: 'Appwrite Functions support Python & Go — enabling future ML-based triage logic (e.g., symptom severity scoring) that Deno can\'t easily support.' },
                    { icon: <AlertTriangle size={18} style={{ color: C.error }} />, title: 'Primary Risk', body: 'Loss of SQL JOINs. The conversations↔messages relationship currently works with FK constraints. In Appwrite, this requires two sequential reads or denormalized data.' },
                    { icon: <CheckCircle size={18} style={{ color: C.success }} />, title: 'Recommended Approach', body: 'Run parallel stacks for 2–4 weeks. Keep Supabase live, bring up Appwrite in shadow mode, validate data parity, then cut DNS.' },
                  ].map(card2 => (
                    <div key={card2.title} style={{ ...card, padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                        {card2.icon} {card2.title}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: C.textSub, lineHeight: 1.7 }}>{card2.body}</p>
                    </div>
                  ))}
                </div>

                <div style={{ ...card, background: 'rgba(99,179,237,0.06)', borderColor: C.borderGlow }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: C.blue }}>Total Estimated Migration Effort</div>
                  <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Minimum (solo dev)', val: '4–5 weeks' },
                      { label: 'Recommended (with testing)', val: '8–10 weeks' },
                      { label: 'Risk Level', val: 'Medium-High' },
                      { label: 'Reversibility', val: 'High (parallel run)' },
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: '0.2rem' }}>{item.label}</div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ LOCK-IN & RISK ══ */}
            {activeTab === 'lockin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Comparison Table */}
                <div style={{ ...card }}>
                  <SectionTitle>Switching Cost Framework</SectionTitle>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: C.textMuted, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dimension</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: C.green, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Supabase</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: C.red, fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Appwrite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lockInItems.map((row, i) => (
                          <tr key={row.category} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : C.surfaceDark }}>
                            <td style={{ padding: '1rem', fontWeight: 600, color: C.textPrimary }}>{row.category}</td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ ...badgePill(row.supabase.color), marginBottom: '0.35rem' }}>{row.supabase.rating}</div>
                              <div style={{ fontSize: '0.83rem', color: C.textSub, marginTop: '0.3rem' }}>{row.supabase.note}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ ...badgePill(row.appwrite.color), marginBottom: '0.35rem' }}>{row.appwrite.rating}</div>
                              <div style={{ fontSize: '0.83rem', color: C.textSub, marginTop: '0.3rem' }}>{row.appwrite.note}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lock-in bars */}
                <div style={{ ...card }}>
                  <SectionTitle>Platform Lock-in Score</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                      { label: 'Supabase — Overall Lock-in', score: 62, color: C.green, note: 'Data is portable (Postgres), but Edge Functions and Auth schema are proprietary.' },
                      { label: 'Appwrite Cloud — Overall Lock-in', score: 28, color: C.red, note: 'Open-source Docker core means you can self-host with zero API changes.' },
                    ].map(bar => (
                      <div key={bar.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{bar.label}</span>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: bar.color, fontFamily: 'monospace' }}>{bar.score}%</span>
                        </div>
                        <div style={{ height: 10, background: 'rgba(148,163,184,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.score}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ height: '100%', background: bar.color, borderRadius: 999 }}
                          />
                        </div>
                        <div style={{ fontSize: '0.83rem', color: C.textMuted, marginTop: '0.4rem' }}>{bar.note}</div>
                      </div>
                    ))}
                    <p style={{ fontSize: '0.8rem', color: C.textMuted, fontStyle: 'italic' }}>*Score = difficulty of moving core business logic + data to a new provider (0 = zero lock-in, 100 = total lock-in)</p>
                  </div>
                </div>

                {/* Risk Matrix */}
                <div style={{ ...card }}>
                  <SectionTitle>Risk Summary — Both Platforms</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {risks.map(r => (
                      <div key={r.title} style={{ display: 'flex', gap: '0.9rem', padding: '1rem 1.1rem', background: C.surfaceDark, borderRadius: 12, border: `1px solid ${C.border}`, borderLeft: `3px solid ${sevColor[r.severity]}` }}>
                        <div style={{ flexShrink: 0 }}>
                          <AlertTriangle size={16} style={{ color: sevColor[r.severity], marginTop: 2 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{r.title}</span>
                            <span style={{ ...badgePill(r.platform === 'Supabase' ? C.green : C.red), fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{r.platform}</span>
                          </div>
                          <p style={{ fontSize: '0.86rem', color: C.textSub, lineHeight: 1.65 }}>{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1rem 1.25rem', background: 'rgba(99,179,237,0.07)', borderRadius: 14, border: `1px solid ${C.borderGlow}`, fontSize: '0.88rem', color: C.textSub, lineHeight: 1.75 }}>
                  <strong style={{ color: C.blue }}>Recommendation:</strong> For MedInsight AI's current stage, <strong style={{ color: C.textPrimary }}>stay on Supabase</strong>. The relational model (conversations ↔ messages) maps naturally to Postgres, and you're well within free tiers. Revisit Appwrite when (a) the "Physician Bridge" feature requires multi-region self-hosting for HIPAA compliance, or (b) you hit cost pressure above 50k MAU.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem', paddingBottom: '2rem', textAlign: 'center', color: C.textMuted, fontSize: '0.83rem' }}>
          © 2026 MedInsight AI Architectural Lab &nbsp;·&nbsp; Powered by Antigravity
        </div>
      </div>
    </div>
  );
};

export default App;

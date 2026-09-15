export const Brand = {
  name: 'IntefAI Security',
  shortName: 'IntefAI',
  tagline: 'Smart visitor management',
  passLabel: 'IntefAI Community Pass',
  communityName: 'IntefAI Community',
} as const;

export const Colors = {
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  primaryMuted: '#93C5FD',
  primaryDark: '#1D4ED8',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#F1F5F9',
  borderStrong: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLabel: '#475569',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#F59E0B',
  warningSoft: '#FFEDD5',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  white: '#FFFFFF',
} as const;

export const DemoAuth = {
  resident: { username: '9876543210', password: '1234', otp: '123456' },
  guard: { username: 'EMP2481', password: '1234', otp: '123456' },
} as const;

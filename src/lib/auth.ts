export type AuthProvider = 'google' | 'apple' | 'kakao'

export interface AuthUser {
  id: string
  name: string
  email: string
  provider: AuthProvider
}

const STORAGE_KEY = 'k-vibe-mock-session'

// Fixture per provider — stands in for what each real OAuth provider would
// actually return, so swapping in real auth later doesn't change what the UI
// expects to receive (still "an AuthUser shaped by which provider was used").
const MOCK_USERS: Record<AuthProvider, AuthUser> = {
  google: { id: 'mock-google-1', name: 'Google User', email: 'guest@gmail.com', provider: 'google' },
  apple: { id: 'mock-apple-1', name: 'Apple User', email: 'guest@icloud.com', provider: 'apple' },
  kakao: { id: 'mock-kakao-1', name: '카카오 사용자', email: 'guest@kakao.com', provider: 'kakao' },
}

// All three functions below are mocked against localStorage for now. Step15
// (backend integration) replaces only these bodies — e.g. with
// supabase.auth.getUser()/signInWithOAuth()/signOut(), or calls to our own
// backend — without touching any caller (LoginModal/ProfilePage/TopBar only
// ever go through useAuth(), never these functions directly).
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export async function loginWithProvider(provider: AuthProvider): Promise<AuthUser> {
  const user = MOCK_USERS[provider]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export async function logout(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY)
}

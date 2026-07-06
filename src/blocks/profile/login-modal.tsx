import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Apple, CheckCircle2, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useAuth } from '@/lib/use-auth'
import type { AuthProvider } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { GoogleIcon } from '@/assets/google-icon'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PROVIDER_BUTTONS: {
  id: AuthProvider
  labelKey: string
  className: string
  icon: ComponentType<{ className?: string }>
}[] = [
  { id: 'google', labelKey: 'login.continue_google', className: 'border border-border bg-background text-foreground hover:bg-accent', icon: GoogleIcon },
  { id: 'apple', labelKey: 'login.continue_apple', className: 'bg-foreground text-background hover:bg-foreground/90', icon: Apple },
  { id: 'kakao', labelKey: 'login.continue_kakao', className: 'bg-[#FEE500] text-black hover:bg-[#FEE500]/90', icon: MessageCircle },
]

// Same UI on mobile and desktop — three provider buttons + a guest CTA don't
// need a layout split the way RoutePage/ProfilePage do.
export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation()
  const { login, isLoggingIn } = useAuth()
  const guestFeatures = t('login.guest_features', { returnObjects: true }) as string[]

  function handleLogin(provider: AuthProvider) {
    login(provider, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('login.title')}</DialogTitle>
          <DialogDescription>{t('login.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {PROVIDER_BUTTONS.map(({ id, labelKey, className, icon: Icon }) => (
            <button
              key={id}
              type="button"
              disabled={isLoggingIn}
              onClick={() => handleLogin(id)}
              className={cn(
                'flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-60',
                className,
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {t(labelKey)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full py-2 text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('login.continue_guest')}
        </button>

        <div className="space-y-1.5 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{t('login.available_without_login')}</p>
          {guestFeatures.map((feature) => (
            <p key={feature} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-crowd-low" />
              {feature}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

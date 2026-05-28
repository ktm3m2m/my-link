import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "firebase/auth"
import { toast } from "sonner"

interface HeaderProps {
  user: User | null;
  profile: { username: string; photoURL: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, profile, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-primary w-8 h-8 text-primary-foreground font-bold">
            M
          </div>
          <span className="text-xl font-bold tracking-tight">MyLink</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarImage src={profile?.photoURL ?? user.photoURL ?? ''} />
                  <AvatarFallback>{profile?.username?.[0] ?? (user.email ? user.email[0].toUpperCase() : 'U')}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{profile?.username ?? (user.email ? user.email.split('@')[0] : '사용자')}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("모든 변경 사항이 저장되었습니다.")}>
                저장
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={onLogin}>
              Google 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

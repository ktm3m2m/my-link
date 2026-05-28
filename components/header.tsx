"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "firebase/auth"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, SignOut, CheckCircle } from "@phosphor-icons/react"

interface HeaderProps {
  user: User | null;
  profile: { username: string; photoURL: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, profile, onLogin, onLogout }: HeaderProps) {
  const handleCopyLink = () => {
    if (!profile?.username && !user?.uid) return;
    const url = `${window.location.origin}/@${profile?.username || user?.uid}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.custom((t) => (
          <div className="flex w-[340px] sm:w-[400px] items-center gap-4 rounded-[1.25rem] border border-foreground/10 bg-background/60 p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl ring-1 ring-white/10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <CheckCircle size={24} weight="fill" className="text-primary animate-in zoom-in duration-500" />
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-[15px] font-extrabold tracking-tight text-foreground">링크 복사 완료 ✨</span>
              <span className="text-xs font-semibold text-muted-foreground truncate">{url}</span>
            </div>
          </div>
        ), { position: "top-center", duration: 3500 });
      })
      .catch(() => toast.error("링크 복사에 실패했습니다.", { position: "top-center" }));
  };

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
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => toast.success("모든 변경 사항이 저장되었습니다.")}>
                저장
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-transparent ring-0 outline-none">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-all hover:ring-primary/30 cursor-pointer">
                    <AvatarImage src={profile?.photoURL ?? user.photoURL ?? ''} />
                    <AvatarFallback>{profile?.username?.[0] ?? (user.email ? user.email[0].toUpperCase() : 'U')}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.username ?? (user.email ? user.email.split('@')[0] : '사용자')}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer py-2">
                    <Copy className="mr-2 h-4 w-4" weight="bold" />
                    <span>내 페이지 링크 복사</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 py-2">
                    <SignOut className="mr-2 h-4 w-4" weight="bold" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

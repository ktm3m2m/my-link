"use client"

import { useState } from "react"
import { dummyLinks, Link } from "@/data/links"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { ShareNetwork, ArrowUpRight } from "@phosphor-icons/react"

export default function Page() {
  const [links, setLinks] = useState<Link[]>(dummyLinks)

  // PRD의 User 모델 예시 데이터
  const user = {
    username: "Caesium Y",
    displayName: "caesiumy",
    bio: "Frontend Developer & UI Explorer. Building minimal things for the web.",
    photoURL: "https://github.com/shadcn.png", // 실제로는 구글 프로필 URL이 들어옵니다.
  }

  const handleAddLink = (newLink: Link) => {
    setLinks([newLink, ...links])
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-20 bg-background/50 backdrop-blur-[2px]">
      {/* 상단 공유 버튼 */}
      <div className="absolute top-6 right-6">
        <Button variant="outline" size="icon" className="rounded-none h-10 w-10 ring-1 ring-foreground/10 bg-background/80 backdrop-blur-md transition-all hover:bg-accent">
          <ShareNetwork size={18} weight="bold" />
        </Button>
      </div>

      {/* 프로필 섹션 */}
      <section className="mb-14 flex flex-col items-center gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Avatar className="h-24 w-24 ring-2 ring-foreground/10 ring-offset-4 ring-offset-background">
          <AvatarImage src={user.photoURL} alt={user.username} />
          <AvatarFallback className="text-xl font-bold">{user.username[0]}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-3 max-w-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tighter">{user.username}</h1>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">@{user.displayName}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground/80 italic font-medium px-4">
            "{user.bio}"
          </p>
        </div>
      </section>

      {/* 링크 관리 및 목록 섹션 */}
      <section className="flex w-full max-w-md flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {/* 링크 추가 버튼 (다이얼로그) */}
        <div className="mb-4">
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block transition-all duration-300 hover:-translate-y-1 hover:translate-x-0.5"
          >
            <Card className="relative overflow-hidden cursor-pointer border-none transition-all duration-300 group-hover:bg-accent group-hover:ring-foreground/20 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] dark:group-hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)]">
              <CardContent className="flex items-center gap-4 py-4 pr-12">
                {/* 파비콘 자동 로드 영역 */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted/50 ring-1 ring-foreground/5 overflow-hidden">
                  <img 
                    src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                    alt={link.title}
                    className="h-6 w-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold tracking-tight truncate">{link.title}</span>
                  <span className="text-[10px] text-muted-foreground/60 truncate font-medium">
                    {new URL(link.url).hostname}
                  </span>
                </div>

                {/* 우측 상단 화살표 아이콘 (호버 시 표시) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-primary">
                  <ArrowUpRight size={16} weight="bold" />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </section>

      {/* 푸터 */}
      <footer className="mt-auto pt-20 flex flex-col items-center gap-4 opacity-40">
        <div className="h-[1px] w-8 bg-foreground/20" />
        <p className="text-[9px] uppercase tracking-[0.2em] font-black">
          Powered by MyLink
        </p>
      </footer>
    </main>
  )
}


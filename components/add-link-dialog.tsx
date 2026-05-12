"use client"

import { useState } from "react"
import { Plus, Link as LinkIcon, PaperPlaneTilt, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/data/links"
import { cn } from "@/lib/utils"

interface AddLinkDialogProps {
  onAdd: (link: Link) => void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return

    setIsSubmitting(true)
    
    // 시뮬레이션: 약간의 딜레이를 주어 실제 서버와 통신하는 느낌을 줌
    await new Promise((resolve) => setTimeout(resolve, 600))

    const newLink: Link = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      url: url.startsWith("http") ? url : `https://${url}`,
    }

    onAdd(newLink)
    setTitle("")
    setUrl("")
    setIsSubmitting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="default"
            className="w-full h-16 rounded-[1.25rem] font-bold gap-3 shadow-2xl shadow-primary/20 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground group relative overflow-hidden p-0"
          >
            {/* 버튼 내부 레이아웃 */}
            <div className="flex items-center justify-center w-full h-full gap-3 px-6 z-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner transition-all duration-500 group-hover:rotate-90 group-hover:bg-white/30 group-hover:scale-110">
                <Plus size={18} weight="bold" />
              </div>
              <span className="text-lg tracking-tight">새로운 링크 추가하기</span>
            </div>

            {/* 프리미엄 효과: 광택 애니메이션 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer transition-transform" />
            
            {/* 하단 글로우 효과 */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[420px] rounded-[2rem] border-none shadow-2xl bg-background/95 backdrop-blur-xl p-8">
        <DialogHeader className="gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <LinkIcon size={24} weight="duotone" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">새 링크 추가</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
            나의 새로운 링크를 세상에 공유해보세요.<br />제목과 URL만 있으면 충분합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid gap-2.5">
            <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 pl-1">
              링크 제목
            </Label>
            <div className="relative group">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 나의 블로그, 포트폴리오"
                className="h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus-visible:border-primary/20 focus-visible:bg-background transition-all pl-4 text-sm font-semibold"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid gap-2.5">
            <Label htmlFor="url" className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 pl-1">
              URL 주소
            </Label>
            <div className="relative">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-14 rounded-2xl bg-muted/30 border-2 border-transparent focus-visible:border-primary/20 focus-visible:bg-background transition-all pl-4 text-sm font-semibold pr-10"
                required
                disabled={isSubmitting}
                type="url"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                <PaperPlaneTilt size={18} weight="bold" />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3 pt-2">
            <Button 
              type="submit" 
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-base transition-all duration-300",
                isSubmitting ? "opacity-80 scale-[0.98]" : "hover:scale-[1.02]"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "추가 중..." : "링크 생성 완료"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-medium"
              disabled={isSubmitting}
            >
              취소
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

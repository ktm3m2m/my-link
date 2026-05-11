"use client"

import { useState } from "react"
import { Plus } from "@phosphor-icons/react"
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

interface AddLinkDialogProps {
  onAdd: (link: Link) => void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return

    const newLink: Link = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      url: url.startsWith("http") ? url : `https://${url}`,
    }

    onAdd(newLink)
    setTitle("")
    setUrl("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="default"
            className="w-full h-14 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} weight="bold" />
            새 링크 추가하기
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">새 링크 추가</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground/80 font-medium">
            공유하고 싶은 링크의 제목과 URL을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 내 인스타그램, 포트폴리오 등"
              className="h-12 rounded-xl bg-muted/50 border-none ring-1 ring-foreground/5 focus-visible:ring-primary/20 focus-visible:bg-background transition-all"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-12 rounded-xl bg-muted/50 border-none ring-1 ring-foreground/5 focus-visible:ring-primary/20 focus-visible:bg-background transition-all"
              required
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base">
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

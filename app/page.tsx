"use client"

import { useState } from "react"
import { doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Link } from "@/data/links"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { ShareNetwork, ArrowUpRight, Trash, CircleNotch, PencilSimple, CheckCircle } from "@phosphor-icons/react"
import { useAuth } from "@/hooks/useAuth"
import { Header } from "@/components/header"
import { toast } from "sonner"
import { useProfile } from "@/hooks/useProfile"
import { useLinks, ExtendedLink } from "@/hooks/useLinks"

export default function Page() {
  const { user, isLoading: isAuthLoading, login, logout } = useAuth();
  const { profile, isLoading: isProfileLoading, updateProfile } = useProfile(user);
  const { links, isLoading: isLinksLoading, addLink, updateLink, deleteLink } = useLinks(user);

  // 인라인 편집 및 삭제 모달 상태
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);
  const [deleteLinkTitle, setDeleteLinkTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 인라인 편집 관련 상태
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempBio, setTempBio] = useState("")

  const handleAddLink = async (newLink: Omit<Link, "id">) => {
    setIsSubmitting(true);
    try {
      await addLink(newLink);
      toast.success("새로운 링크가 추가되었습니다.");
    } catch (error: any) {
      toast.error(error.message || "링크 추가에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!profile?.username && !user?.uid) return;
    const url = `${window.location.origin}/${profile?.displayName || profile?.username || user?.uid}`;
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

  const handleConfirmDelete = async () => {
    if (!deleteLinkId) return;
    setIsDeleting(true);
    try {
      await deleteLink(deleteLinkId);
      toast.success("링크가 삭제되었습니다.");
    } catch (error: any) {
      toast.error(error.message || "링크 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setDeleteLinkId(null);
      setDeleteLinkTitle('');
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLinkId) return;
    if (!editTitle.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    try {
      new URL(editUrl);
    } catch {
      toast.error("올바른 URL을 입력해주세요.");
      return;
    }
    setIsUpdatingLink(true);
    try {
      await updateLink({ id: editingLinkId, title: editTitle.trim(), url: editUrl.trim() });
      toast.success("링크가 수정되었습니다.");
    } catch (error: any) {
      toast.error(error.message || "링크 수정에 실패했습니다.");
    } finally {
      setIsUpdatingLink(false);
      setEditingLinkId(null);
    }
  };

  const startEditing = (link: ExtendedLink) => {
    setEditingLinkId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const cancelEditing = () => {
    setEditingLinkId(null);
    setEditTitle('');
    setEditUrl('');
  };

  const openDeleteModal = (link: ExtendedLink) => {
    setDeleteLinkId(link.id);
    setDeleteLinkTitle(link.title);
  };

  const closeDeleteModal = () => {
    setDeleteLinkId(null);
    setDeleteLinkTitle('');
  };

  const handleUpdateName = async () => {
    setIsEditingName(false);
    const trimmed = tempName.trim();
    if (!trimmed) {
      toast.error("이름은 빈 칸으로 둘 수 없습니다.");
      return;
    }
    if (trimmed === profile?.username) return;
    try {
      await updateProfile({ username: trimmed });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleUpdateBio = async () => {
    setIsEditingBio(false)
    const trimmed = tempBio.trim()
    if (trimmed === profile?.bio) return
    try {
      await updateProfile({ bio: trimmed });
    } catch (error) {}
  }

  const handleLinkClick = async (linkId: string) => {
    if (!db || !user?.uid) return;
    try {
      const linkRef = doc(db, "users", user.uid, "links", linkId);
      await updateDoc(linkRef, {
        clicks: increment(1)
      });
    } catch (error) {
      console.error("Error updating click count:", error);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Header user={user} profile={profile ?? null} onLogin={login} onLogout={logout} isAuthLoading={isAuthLoading} />

      <main className="flex-1 flex flex-col items-center px-6 py-12">
        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-3 animate-in fade-in duration-500">
            <CircleNotch size={32} className="animate-spin text-primary opacity-60" />
            <p className="text-sm text-muted-foreground/60 font-semibold">로그인 상태를 확인하는 중...</p>
          </div>
        ) : !user ? (
          <section className="flex flex-col items-center text-center mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              나만의 모든 링크를 <br className="hidden sm:block"/>
              <span className="text-primary">하나의 페이지로.</span>
            </h1>
            <p className="text-muted-foreground/80 mb-10 max-w-md text-lg">
              로그인 이후에 링크를 관리하고 프로필을 설정할 수 있습니다.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all" onClick={login}>
              구글로 시작하기
            </Button>
          </section>
        ) : (
          <>
            <div className="absolute top-24 right-8 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-2xl h-12 w-12 ring-1 ring-foreground/5 bg-background/50 backdrop-blur-xl transition-all hover:bg-accent hover:scale-110 active:scale-95 shadow-sm"
                onClick={handleCopyLink}
              >
                <ShareNetwork size={20} weight="bold" />
              </Button>
            </div>

            <section className="flex flex-col items-center mb-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10">
                <AvatarImage src={profile?.photoURL ?? user.photoURL ?? ''} />
                <AvatarFallback>{profile?.username?.[0] ?? (user.email ? user.email[0].toUpperCase() : 'U')}</AvatarFallback>
              </Avatar>

              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleUpdateName}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                  className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none text-center w-full max-w-xs mb-1"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-2xl font-bold mb-1 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => {
                    setTempName(profile?.username || "");
                    setIsEditingName(true);
                  }}
                  title="클릭하여 이름 수정"
                >
                  {profile?.username}
                </h2>
              )}

              <p className="text-sm font-medium text-muted-foreground mb-4 select-none">
                @{profile?.displayName}
              </p>

              {isEditingBio ? (
                <input
                  type="text"
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  onBlur={handleUpdateBio}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateBio()}
                  className="text-base text-muted-foreground/80 bg-transparent border-b-2 border-primary focus:outline-none text-center w-full"
                  autoFocus
                />
              ) : (
                <p
                  className="text-base leading-relaxed text-muted-foreground/80 font-medium cursor-pointer hover:text-foreground transition-all select-none border border-transparent hover:border-foreground/5 hover:bg-foreground/5 rounded-2xl px-4 py-2 text-center w-full"
                  onClick={() => {
                    setTempBio(profile?.bio || "");
                    setIsEditingBio(true);
                  }}
                  title="클릭하여 소개글 수정"
                >
                  {profile?.bio}
                </p>
              )}
            </section>

            <section className="flex w-full max-w-md flex-col gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out">
              <div className="mb-2">
                <AddLinkDialog onAdd={handleAddLink} />
              </div>

              <div className="flex flex-col gap-4">
                {isLinksLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <CircleNotch size={32} className="animate-spin text-primary opacity-60" />
                    <p className="text-xs text-muted-foreground/60 font-semibold">링크 목록을 불러오는 중...</p>
                  </div>
                ) : links.length > 0 ? (
                  links.map((link, index) => {
                    let hostname = ""
                    try {
                      hostname = new URL(link.url).hostname
                    } catch (e) {
                      hostname = link.url
                    }

                    return (
                      <div
                        key={link.id}
                        className="group relative"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {editingLinkId === link.id ? (
                          <Card className="relative overflow-hidden bg-background/50 backdrop-blur-md ring-1 ring-foreground/5 transition-all duration-500 hover:ring-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                            <CardContent className="flex flex-col gap-2 p-4 bg-background/80 rounded-lg shadow-lg">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="제목"
                                className="border border-primary rounded px-2 py-1 bg-background"
                                disabled={isUpdatingLink}
                              />
                              <input
                                type="url"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                                placeholder="URL"
                                className="border border-primary rounded px-2 py-1 bg-background"
                                disabled={isUpdatingLink}
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <Button variant="secondary" size="sm" onClick={cancelEditing} disabled={isUpdatingLink}>
                                  취소
                                </Button>
                                <Button size="sm" onClick={handleUpdateLink} disabled={isUpdatingLink}>
                                  {isUpdatingLink ? <CircleNotch size={14} className="animate-spin" /> : "저장"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                              onClick={() => handleLinkClick(link.id)}
                            >
                              <Card className="relative overflow-hidden cursor-pointer border-none bg-background/50 backdrop-blur-md ring-1 ring-foreground/5 transition-all duration-500 hover:ring-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                                <CardContent className="flex items-center gap-5 py-5 pr-14 pl-5">
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-foreground/5 overflow-hidden group-hover:ring-primary/20 transition-all duration-500">
                                    {hostname && (
                                      <img
                                        src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.url}&size=128`}
                                        alt={link.title}
                                        className="h-7 w-7 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 rounded-md"
                                        onError={(e) => {
                                          e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
                                        }}
                                      />
                                    )}
                                  </div>

                                  <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-base font-bold tracking-tight truncate group-hover:text-primary transition-colors">
                                      {link.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground/60 truncate font-medium mt-0.5">
                                      {hostname}
                                    </span>
                                  </div>

                                  <div className="flex flex-col items-end gap-1 mr-8">
                                    <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                      {link.clicks || 0} clicks
                                    </span>
                                  </div>

                                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-primary">
                                    <ArrowUpRight size={20} weight="bold" />
                                  </div>
                                </CardContent>
                              </Card>
                            </a>

                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute -left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl transition-all duration-300 shadow-lg z-10"
                              onClick={(e) => {
                                e.preventDefault();
                                startEditing(link);
                              }}
                            >
                              <PencilSimple size={18} weight="bold" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl transition-all duration-300 shadow-lg shadow-destructive/20 z-10"
                              onClick={(e) => {
                                e.preventDefault();
                                openDeleteModal(link);
                              }}
                            >
                              <Trash size={18} weight="bold" />
                            </Button>
                          </>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="py-20 text-center space-y-4 opacity-50">
                    <div className="text-4xl">🌵</div>
                    <p className="text-sm font-medium">아직 등록된 링크가 없습니다.<br />새로운 링크를 추가해보세요!</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {!user && (
        <footer className="w-full text-center py-6 text-sm text-muted-foreground/60 border-t border-foreground/5 mt-auto">
          &copy; 2026 MyLink. All rights reserved.
        </footer>
      )}

      <Dialog open={!!deleteLinkId} onOpenChange={(open) => { if (!open) closeDeleteModal(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>{deleteLinkTitle}</DialogDescription>
                <p className="text-red-600 mt-2">이 작업은 되돌릴 수 없습니다.</p>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={closeDeleteModal} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <CircleNotch size={14} className="animate-spin" /> : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

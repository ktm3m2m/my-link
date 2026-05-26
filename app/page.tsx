"use client"

import { useState, useEffect } from "react"
import { Link } from "@/data/links"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { ShareNetwork, ArrowUpRight, Trash, CircleNotch } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface ExtendedLink extends Link {
  createdAt: Date
}

interface UserProfile {
  username: string
  displayName: string
  bio: string
  photoURL: string
}

export default function Page() {
  const [links, setLinks] = useState<ExtendedLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  // 인라인 편집 관련 상태
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempBio, setTempBio] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // 프로필 데이터 실시간 구독
  useEffect(() => {
    const docRef = doc(db, "users", "anonymous")
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile({
            username: docSnap.data().username || "이름 없음",
            displayName: docSnap.data().displayName || "anonymous",
            bio: docSnap.data().bio || "소개글이 없습니다.",
            photoURL: docSnap.data().photoURL || "https://github.com/shadcn.png"
          })
        } else {
          // 최초 문서가 없을 때 기본값 제공
          const defaultProfile = {
            username: "Caesium Y",
            displayName: "caesiumy",
            bio: "Frontend Developer & UI Explorer. Building minimal things for the web.",
            photoURL: "https://github.com/shadcn.png",
          }
          setProfile(defaultProfile)
          // DB에 기본 문서 생성
          setDoc(docRef, defaultProfile, { merge: true }).catch(console.error)
        }
        setIsProfileLoading(false)
      },
      (error) => {
        console.error("Firestore에서 프로필을 가져오는 중 오류 발생:", error)
        toast.error("프로필 데이터를 불러오지 못했습니다.")
        setIsProfileLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // 링크 목록 실시간 구독
  useEffect(() => {
    const q = query(
      collection(db, "users", "anonymous", "links"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedLinks = snapshot.docs.map((doc) => {
          const data = doc.data()
          // serverTimestamp() 계산 대기 중에 로컬 캐시로 null이 반환되면 현재 시간으로 대체하여 깜빡임과 뒤틀림 방지
          const createdAtDate = data.createdAt ? data.createdAt.toDate() : new Date()
          return {
            id: doc.id,
            title: data.title || "",
            url: data.url || "",
            icon: data.icon || "",
            createdAt: createdAtDate,
          }
        })
        
        // 클라이언트 단에서 확실히 정렬 순서 고정
        fetchedLinks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        
        setLinks(fetchedLinks)
        setIsLoading(false)
      },
      (error) => {
        console.error("Firestore에서 링크를 가져오는 중 오류 발생:", error)
        toast.error("링크 목록을 불러오지 못했습니다.")
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleAddLink = async (newLink: Omit<Link, "id">) => {
    try {
      await addDoc(collection(db, "users", "anonymous", "links"), {
        title: newLink.title,
        url: newLink.url,
        createdAt: serverTimestamp(),
      })
      toast.success("새로운 링크가 추가되었습니다.")
    } catch (error) {
      console.error("Firestore에 링크 추가 중 오류 발생:", error)
      toast.error("링크 추가에 실패했습니다.")
      throw error
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", "anonymous", "links", id))
      toast.success("링크가 삭제되었습니다.")
    } catch (error) {
      console.error("Firestore에서 링크 삭제 중 오류 발생:", error)
      toast.error("링크 삭제에 실패했습니다.")
    }
  }

  // 프로필 업데이트 처리
  const handleUpdateName = async () => {
    setIsEditingName(false)
    const trimmed = tempName.trim()
    if (!trimmed) {
      toast.error("이름은 빈 칸으로 둘 수 없습니다.")
      return
    }
    if (trimmed === profile?.username) return

    try {
      setIsUpdatingProfile(true)
      await setDoc(
        doc(db, "users", "anonymous"),
        { username: trimmed },
        { merge: true }
      )
      toast.success("표시 이름이 수정되었습니다.")
    } catch (error) {
      console.error("이름 업데이트 중 오류 발생:", error)
      toast.error("이름을 저장하지 못했습니다.")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdateBio = async () => {
    setIsEditingBio(false)
    const trimmed = tempBio.trim()
    if (trimmed === profile?.bio) return

    try {
      setIsUpdatingProfile(true)
      await setDoc(
        doc(db, "users", "anonymous"),
        { bio: trimmed },
        { merge: true }
      )
      toast.success("한 줄 소개가 수정되었습니다.")
    } catch (error) {
      console.error("한 줄 소개 업데이트 중 오류 발생:", error)
      toast.error("한 줄 소개를 저장하지 못했습니다.")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center px-6 py-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* 상단 공유 버튼 */}
      <div className="absolute top-8 right-8">
        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 ring-1 ring-foreground/5 bg-background/50 backdrop-blur-xl transition-all hover:bg-accent hover:scale-110 active:scale-95 shadow-sm">
          <ShareNetwork size={20} weight="bold" />
        </Button>
      </div>

      {/* 프로필 섹션 */}
      <section className="mb-16 flex flex-col items-center gap-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out w-full max-w-sm">
        {isProfileLoading ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-3 w-full flex flex-col items-center">
              <Skeleton className="h-8 w-48 rounded-xl" />
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Avatar className="h-32 w-32 ring-4 ring-background relative">
                <AvatarImage src={profile?.photoURL} alt={profile?.username} className="object-cover" />
                <AvatarFallback className="text-3xl font-black bg-muted">{profile?.username?.[0]}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-4 w-full">
              <div className="space-y-2 flex flex-col items-center justify-center">
                {isEditingName ? (
                  <div className="relative w-full max-w-xs flex items-center justify-center">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={handleUpdateName}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateName()
                      }}
                      autoFocus
                      className="text-3xl font-black tracking-tight text-center bg-background border-b-2 border-primary focus:outline-none w-full px-2 py-1 rounded-md"
                      disabled={isUpdatingProfile}
                    />
                  </div>
                ) : (
                  <h1 
                    className="text-4xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-all select-none border-b-2 border-transparent hover:border-foreground/20"
                    onClick={() => {
                      setTempName(profile?.username || "")
                      setIsEditingName(true)
                    }}
                    title="클릭하여 이름 수정"
                  >
                    {profile?.username}
                  </h1>
                )}
                <p className="text-sm font-black text-primary uppercase tracking-[0.3em] inline-block px-3 py-1 bg-primary/5 rounded-full select-none mt-2">
                  @{profile?.displayName}
                </p>
              </div>
              
              <div className="px-6 flex justify-center w-full">
                {isEditingBio ? (
                  <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    onBlur={handleUpdateBio}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleUpdateBio()
                      }
                    }}
                    autoFocus
                    rows={3}
                    maxLength={150}
                    className="text-sm text-center bg-background border-2 border-primary/20 rounded-2xl focus:border-primary focus:outline-none p-3 w-full resize-none font-medium leading-relaxed"
                    placeholder="소개글을 입력하고 바깥을 클릭해 저장하세요 (최대 150자)"
                    disabled={isUpdatingProfile}
                  />
                ) : (
                  <p 
                    className="text-base leading-relaxed text-muted-foreground/80 font-medium cursor-pointer hover:text-foreground transition-all select-none border border-transparent hover:border-foreground/5 hover:bg-foreground/5 rounded-2xl px-4 py-2 text-center w-full"
                    onClick={() => {
                      setTempBio(profile?.bio || "")
                      setIsEditingBio(true)
                    }}
                    title="클릭하여 소개글 수정"
                  >
                    {profile?.bio}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* 링크 관리 및 목록 섹션 */}
      <section className="flex w-full max-w-md flex-col gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out">
        {/* 링크 추가 버튼 (다이얼로그) */}
        <div className="mb-2">
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
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
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="relative overflow-hidden cursor-pointer border-none bg-background/50 backdrop-blur-md ring-1 ring-foreground/5 transition-all duration-500 hover:ring-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                      <CardContent className="flex items-center gap-5 py-5 pr-14 pl-5">
                        {/* 파비콘 자동 로드 영역 */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-foreground/5 overflow-hidden group-hover:ring-primary/20 transition-all duration-500">
                          {hostname && (
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
                              alt={link.title}
                              className="h-7 w-7 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
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

                        {/* 우측 상단 화살표 아이콘 */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-primary">
                          <ArrowUpRight size={20} weight="bold" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>

                  {/* 삭제 버튼 (호버 시 표시) */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 group-hover:-right-3 transition-all duration-300 shadow-lg shadow-destructive/20 z-10"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteLink(link.id)
                    }}
                  >
                    <Trash size={18} weight="bold" />
                  </Button>
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

      {/* 푸터 */}
      <footer className="mt-auto pt-32 pb-12 flex flex-col items-center gap-6 opacity-30">
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-foreground to-transparent" />
        <p className="text-[10px] uppercase tracking-[0.4em] font-black">
          Powered by MyLink
        </p>
      </footer>
    </main>
  )
}



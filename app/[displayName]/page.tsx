"use client"

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { ExtendedLink } from "@/hooks/useLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, CircleNotch } from "@phosphor-icons/react";

export default function UserPage() {
  const params = useParams();
  const displayName = params.displayName as string;
  
  const { user, isLoading: isAuthLoading, login, logout } = useAuth();
  const { profile: loggedInProfile } = useProfile(user);

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<ExtendedLink[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchUserAndLinks = async () => {
      if (!db || !displayName) return;
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", displayName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setIsNotFound(true);
          setIsLoading(false);
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserProfile;
        setProfile(userData);

        const linksRef = collection(db, "users", userDoc.id, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);

        const fetchedLinks = linksSnapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || "",
            url: data.url || "",
            icon: data.icon || "",
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
          } as ExtendedLink;
        });

        setLinks(fetchedLinks);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndLinks();
  }, [displayName]);

  if (isNotFound) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Header user={user} profile={loggedInProfile ?? null} onLogin={login} onLogout={logout} isAuthLoading={isAuthLoading} />

      <main className="flex-1 flex flex-col items-center px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <CircleNotch size={32} className="animate-spin text-primary opacity-60" />
            <p className="text-xs text-muted-foreground/60 font-semibold">프로필을 불러오는 중...</p>
          </div>
        ) : profile && (
          <>
            <section className="flex flex-col items-center mb-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10">
                <AvatarImage src={profile.photoURL} />
                <AvatarFallback>{profile.username?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-bold mb-1">
                {profile.username}
              </h2>
              
              <p className="text-sm font-medium text-muted-foreground mb-4">
                @{profile.displayName}
              </p>

              <p className="text-base leading-relaxed text-muted-foreground/80 font-medium text-center w-full px-4 py-2">
                {profile.bio}
              </p>
            </section>

            <section className="flex w-full max-w-md flex-col gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 ease-out">
              {links.length > 0 ? (
                links.map((link, index) => {
                  let hostname = "";
                  try {
                    hostname = new URL(link.url).hostname;
                  } catch (e) {
                    hostname = link.url;
                  }

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                      style={{ animationDelay: `${index * 100}ms` }}
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

                          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-primary">
                            <ArrowUpRight size={20} weight="bold" />
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )
                })
              ) : (
                <div className="py-20 text-center space-y-4 opacity-50">
                  <div className="text-4xl">🌵</div>
                  <p className="text-sm font-medium">아직 등록된 링크가 없습니다.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="w-full text-center py-6 text-sm text-muted-foreground/60 border-t border-foreground/5 mt-auto">
        &copy; 2026 MyLink. All rights reserved.
      </footer>
    </div>
  );
}

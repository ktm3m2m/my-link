"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { useLinks } from "@/hooks/useLinks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleNotch, ChartBar, CursorClick } from "@phosphor-icons/react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Rectangle } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export default function StatsPage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading, login, logout } = useAuth()
  const { profile } = useProfile(user)
  const { links, isLoading: isLinksLoading } = useLinks(user)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/")
    }
  }, [user, isAuthLoading, router])

  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.clicks || 0), 0)
  }, [links])

  const chartData = useMemo(() => {
    return links
      .map((link) => ({
        title: link.title || "제목 없음",
        clicks: link.clicks || 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10) // 상위 10개만 표시
  }, [links])

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  const mostPopularLink = chartData.length > 0 ? chartData[0] : null;

  if (isAuthLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="flex flex-col items-center justify-center mt-32 gap-3 animate-in fade-in duration-500">
          <CircleNotch size={32} className="animate-spin text-primary opacity-60" />
          <p className="text-sm text-muted-foreground/60 font-semibold">인증 상태 확인 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <Header user={user} profile={profile ?? null} onLogin={login} onLogout={logout} isAuthLoading={isAuthLoading} />

      <main className="flex-1 flex flex-col items-center px-6 py-12 w-full max-w-4xl mx-auto space-y-8">
        <section className="w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">클릭 통계</h1>
          <p className="text-muted-foreground">내 링크들이 얼마나 클릭되었는지 확인해보세요.</p>
        </section>

        {isLinksLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CircleNotch size={32} className="animate-spin text-primary opacity-60" />
            <p className="text-sm text-muted-foreground/60 font-semibold">통계 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="w-full grid gap-6 md:grid-cols-[1fr_2fr] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 ease-out">
            {/* 요약 카드 */}
            <Card className="bg-background/50 backdrop-blur-xl border-foreground/5 shadow-xl shadow-primary/5 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CursorClick size={20} className="text-primary" weight="duotone" />
                  클릭 요약
                </CardTitle>
                <CardDescription>전체 링크의 누적 통계입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">총 클릭 수</p>
                  <div className="text-5xl font-black tracking-tighter text-primary">
                    {totalClicks.toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">활성 링크 수</p>
                    <div className="text-xl font-bold">{links.length}개</div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">최다 클릭 링크</p>
                    <div className="text-lg font-bold truncate" title={mostPopularLink?.title || "없음"}>
                      {mostPopularLink && mostPopularLink.clicks > 0 ? mostPopularLink.title : "없음"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 차트 카드 */}
            <Card className="bg-background/50 backdrop-blur-xl border-foreground/5 shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ChartBar size={20} className="text-primary" weight="duotone" />
                  가장 인기 있는 링크
                </CardTitle>
                <CardDescription>클릭 수가 많은 상위 10개의 링크입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 && chartData.some(d => d.clicks > 0) ? (
                  <ChartContainer config={chartConfig} className="min-h-[300px] w-full mt-4">
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="title" 
                        tickLine={false} 
                        tickMargin={10} 
                        axisLine={false}
                        tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                        fontSize={12}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={10}
                        allowDecimals={false}
                        fontSize={12}
                      />
                      <Bar 
                        dataKey="clicks" 
                        fill="var(--color-clicks)" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={50}
                        animationDuration={1500}
                        activeBar={(props: any) => {
                          const { x, y, width, height, value } = props;
                          return (
                            <g>
                              <Rectangle x={x} y={y} width={width} height={height} fill="var(--color-clicks)" opacity={0.8} radius={[4, 4, 0, 0]} />
                              <text x={x + width / 2} y={y - 8} fill="currentColor" textAnchor="middle" className="text-sm font-bold">
                                {value}
                              </text>
                            </g>
                          );
                        }}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground/50">
                    <ChartBar size={48} weight="thin" className="mb-4 opacity-50" />
                    <p className="text-sm font-medium">아직 클릭된 링크가 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <footer className="w-full text-center py-6 text-sm text-muted-foreground/60 border-t border-foreground/5 mt-auto">
        &copy; 2026 MyLink. All rights reserved.
      </footer>
    </div>
  )
}

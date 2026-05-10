export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export const dummyLinks: Link[] = [
  {
    id: "1",
    title: "Instagram",
    url: "https://instagram.com",
    icon: "instagram",
  },
  {
    id: "2",
    title: "YouTube",
    url: "https://youtube.com",
    icon: "youtube",
  },
  {
    id: "3",
    title: "Blog",
    url: "https://blog.naver.com",
    icon: "blog",
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com",
    icon: "github",
  },
  {
    id: "5",
    title: "Portfolio",
    url: "https://my-portfolio.com",
    icon: "globe",
  },
];

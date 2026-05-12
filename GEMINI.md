# MyLink 프로젝트 가이드

이 파일은 **MyLink** 프로젝트의 구조, 기술 스택, 개발 컨벤션 및 주요 기능을 설명하는 가이드입니다.

## 1. 프로젝트 개요
MyLink는 사용자가 자신의 소셜 링크와 웹사이트 주소를 한 페이지에 모으고 관리하며 공유할 수 있는 **간편한 링크 통합 서비스**입니다.

### 핵심 기술 스택
- **프레임워크**: Next.js 16 (App Router)
- **라이브러리**: React 19
- **스타일링**: Tailwind CSS 4, Lucide React (Icons)
- **UI 컴포넌트**: shadcn/ui
- **백엔드/인증**: Firebase (Authentication, Firestore)
- **언어**: TypeScript

## 2. 프로젝트 구조
```text
C:\Users\ktm3m\OneDrive\Desktop\nyt\my_link\
├── app/                # Next.js App Router (페이지 및 레이아웃)
├── components/         # 재사용 가능한 UI 컴포넌트 (shadcn/ui 포함)
├── docs/               # 설계 문서: PRD, 시나리오, 와이어프레임
├── hooks/              # 커스텀 React 훅
├── lib/                # 유틸리티 함수 및 라이브러리 설정
├── public/             # 정적 자산 (이미지, 파비콘 등)
└── types/              # TypeScript 타입 정의
```

## 3. 주요 기능 (PRD 기준)
- **Firebase 인증**: 구글 소셜 로그인 지원.
- **프로필 관리**: 구글 프로필 연동 (사진, 이름), 소개글(Bio) 편집.
- **인라인 편집**: 클릭 시 즉시 텍스트를 편집할 수 있는 대시보드 UI.
- **링크 관리**: 제목 및 URL 추가/삭제, 구글 파비콘 API를 통한 아이콘 자동 로딩.
- **반응형 디자인**: 모바일 최적화 레이아웃.

## 4. 스크립트 및 명령어
| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev` | 개발 서버 시작 (`--turbopack` 사용) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 프로덕션 서버 시작 |
| `npm run lint` | ESLint 분석 실행 |
| `npm run format` | Prettier를 통한 코드 포맷팅 (`ts`, `tsx`) |
| `npm run typecheck` | TypeScript 타입 체크 실행 |

## 5. 개발 컨벤션
- **언어 규칙**: **모든 대화, 문서 작성, 계획, 태스크, Walkthrough 및 커밋 메시지는 반드시 한국어를 사용합니다.**
- **UI 컴포넌트**: `npx shadcn@latest add [component]`를 통해 `@components/ui`에 새로운 UI 컴포넌트를 추가합니다.
- **스타일링**: Tailwind CSS 4를 기본으로 사용하며, CSS 변수(`--font-sans`, `--font-mono`)를 활용합니다.
- **다크 모드**: `next-themes`를 통해 설정하며, 단축키 `d`로 전환 가능합니다.
- **파일 참조**: 프로젝트 내 파일을 참조할 때는 `@` 접두사를 사용합니다 (예: `@app/page.tsx`).
- **편집 UI**: 별도의 저장 버튼 없이 포커스를 잃을 때(blur) 변경 사항이 저장되는 인라인 편집 방식을 선호합니다.
- **데이터 구조**: 데이터 관리를 위해 Firestore의 `users` 컬렉션과 `links` 하위 컬렉션을 사용합니다.

## 6. 관련 문서
- [PRD (제품 요구사항 정의서)](@docs/prd.md)
- [시나리오](@docs/scenario.md)
- [와이어프레임](@docs/Wireframe.md)

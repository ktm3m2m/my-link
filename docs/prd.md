# [PRD] 마이링크 (MyLink) - 심플 링크 통합 서비스

**Version: v1.3**  
**Last Updated: 2026-05-10**

## 1. 프로젝트 개요
- **프로젝트명**: 마이링크 (MyLink)
- **목적**: 사용자가 자신의 여러 소셜 링크와 웹사이트 주소를 하나의 간결한 페이지로 모아 관리하고 공유할 수 있는 서비스.
- **대상 사용자**: 개인 SNS 계정 운영자 및 자신의 링크를 정리하고 싶은 일반 사용자.

## 2. 핵심 기능 목록

### 2.1 필수 기능
- **인증 (Firebase Auth)**: 구글 소셜 로그인 단일 인증 방식.
- **프로필 관리 및 초기화**: 
    - **프로필 이미지 (photoURL)**: 구글 프로필 이미지를 사용하며 수정 기능 없음.
    - **URL 식별자 (displayName)**: 본인 페이지의 고유 URL 경로 (`mylink.com/{displayName}`). 구글 이메일의 ID 부분으로 자동 초기화됨.
    - **표시 이름 (username)**: 프로필 상단에 노출되는 이름. 구글 프로필 이름으로 자동 초기화됨.
    - **한 줄 소개 (bio)**: 본인을 표현하는 짧은 문구.
- **인라인 편집 (Inline Editing)**: 
    - 별도의 폼이나 모달 없이 대시보드 내 `username`, `bio` 텍스트를 클릭하여 즉시 수정.
- **링크 관리**: 
    - 제목 및 URL 입력 기능을 통한 링크 추가 및 삭제.
    - **Google Favicon API 활용**: 링크 파비콘 자동 표시.
- **디자인 시스템**: **shadcn/ui** 기반의 깔끔한 모바일 최적화 반응형 디자인.

### 2.2 향후 추가 기능
- **방문자 통계 및 분석 대시보드**: 페이지 방문자 수 및 링크 클릭수 트래킹.

## 3. 데이터베이스 모델링 (NoSQL - Firestore)

### 3.1 Users Collection
```json
{
  "uid": "google_uid_123",
  "email": "user@example.com",
  "displayName": "caesiumy", // URL Slug (Unique). Init from email prefix.
  "username": "Caesium Y",   // 프로필 표시 이름 (Real Name). Init from Google Name.
  "photoURL": "https://lh3.googleusercontent.com/...", // Google 프로필 이미지
  "bio": "Frontend Developer",
  "createdAt": "timestamp"
}
```
*Note: `displayName`의 유일성을 보장하기 위해 별도 인덱스나 로직이 필요함.*

### 3.2 Links Sub-collection (users/{uid}/links)
```json
{
  "id": "link_uuid",
  "title": "My Blog",
  "url": "https://blog.example.com",
  "createdAt": "timestamp"
}
```

## 4. 제약 사항 및 제외 범위
- **이미지 업로드 없음**: 구글 프로필 이미지만 사용.
- **편집 UI**: 별도의 저장 버튼 없이 포커스 아웃 시 자동 저장 지향.
- **정적 목록**: 순서 변경 및 활성화 토글 기능 제외.
- **핸들(@) 미사용**: URL 경로에 `@` 기호를 사용하지 않음.

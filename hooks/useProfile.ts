import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { toast } from "sonner";

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
}

export function useProfile(user: User | null) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user || !db) return null;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const googleName = user.displayName || "이름 없음";
        const emailPrefix = user.email ? user.email.split('@')[0] : "이름 없음";
        
        let currentUsername = data.username;
        let currentSlug = data.displayName;

        let needsUpdate = false;
        if (!currentUsername || currentUsername === "anonymous" || currentUsername === emailPrefix) {
          currentUsername = googleName;
          needsUpdate = true;
        }

        if (!currentSlug || currentSlug === "anonymous") {
          currentSlug = emailPrefix;
          needsUpdate = true;
        }

        if (needsUpdate) {
          setDoc(docRef, { username: currentUsername, displayName: currentSlug }, { merge: true }).catch(console.error);
        }

        return {
          username: currentUsername,
          displayName: currentSlug,
          bio: data.bio || "소개글이 없습니다.",
          photoURL: data.photoURL || "https://github.com/shadcn.png",
        };
      } else {
        const googleName = user.displayName || "이름 없음";
        const emailPrefix = user.email ? user.email.split('@')[0] : "이름 없음";
        const defaultProfile = {
          username: googleName,
          displayName: emailPrefix,
          bio: "반갑습니다! 새로운 링크를 추가해보세요.",
          photoURL: user.photoURL || "https://github.com/shadcn.png",
        };
        
        setDoc(docRef, defaultProfile, { merge: true }).catch(console.error);
        return defaultProfile;
      }
    },
    enabled: !!user && !!db,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user || !db) throw new Error("로그인이 필요합니다.");
      

      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.uid] });
      
      if (variables.username) toast.success("표시 이름이 수정되었습니다.");
      if (variables.bio) toast.success("한 줄 소개가 수정되었습니다.");
      if (variables.displayName) toast.success("디스플레이 이름이 수정되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "프로필 저장 중 오류가 발생했습니다.");
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}

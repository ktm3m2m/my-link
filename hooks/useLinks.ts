import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { Link } from "@/data/links";

export interface ExtendedLink extends Link {
  createdAt: Date;
  updatedAt?: Date;
  clicks: number;
}

export function useLinks(user: User | null) {
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["links", user?.uid],
    queryFn: async (): Promise<ExtendedLink[]> => {
      if (!user || !db) return [];
      
      const colRef = collection(db, "users", user.uid, "links");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate?.() ?? new Date();
        return {
          id: d.id,
          title: data.title || "",
          url: data.url || "",
          icon: data.icon || "",
          createdAt,
          clicks: data.clicks || 0,
        } as ExtendedLink;
      });
    },
    enabled: !!user && !!db,
  });

  const addLinkMutation = useMutation({
    mutationFn: async (newLink: Omit<Link, "id">) => {
      if (!user || !db) throw new Error("로그인이 필요합니다.");
      await addDoc(collection(db, "users", user.uid, "links"), {
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        clicks: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
    },
  });

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, title, url }: { id: string, title: string, url: string }) => {
      if (!user || !db) throw new Error("로그인이 필요합니다.");
      await setDoc(doc(db, "users", user.uid, "links", id), {
        title,
        url,
        updatedAt: serverTimestamp()
      }, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user || !db) throw new Error("로그인이 필요합니다.");
      await deleteDoc(doc(db, "users", user.uid, "links", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
    },
  });

  return {
    links,
    isLoading,
    addLink: addLinkMutation.mutateAsync,
    isAdding: addLinkMutation.isPending,
    updateLink: updateLinkMutation.mutateAsync,
    isUpdating: updateLinkMutation.isPending,
    deleteLink: deleteLinkMutation.mutateAsync,
    isDeleting: deleteLinkMutation.isPending,
  };
}

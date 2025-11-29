import { trpc } from "@/lib/trpc";

export function useUser() {
    const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
        retry: false,
    });

    return {
        user,
        isLoading,
        error,
    };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, loginWithProvider, logout, type AuthProvider } from '@/lib/auth'
import { mergeGuestSavedPlacesIntoUser } from '@/lib/saved-places'

const AUTH_QUERY_KEY = ['auth-user']
const SAVED_PLACES_QUERY_KEY = ['saved-places']

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: user = null, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentUser,
  })

  const loginMutation = useMutation({
    mutationFn: (provider: AuthProvider) => loginWithProvider(provider),
    onSuccess: async (loggedInUser) => {
      // Claim whatever was saved as a guest into this account before
      // anything re-reads the saved-places list.
      await mergeGuestSavedPlacesIntoUser(loggedInUser.id)
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SAVED_PLACES_QUERY_KEY })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SAVED_PLACES_QUERY_KEY })
    },
  })

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
  }
}

import React from 'react'
import { auth, firebase } from '../services/firebase'

type User = {
  id: string,
  name: string,
  avatar: string,
}

type AuthContextType = {
  user: User | undefined,
  signInWitthGoogle: () => Promise<void>,
}

type AuthContextProviderProps = {
  children: React.ReactNode,
}

export const AuthContext = React.createContext({} as AuthContextType)

export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = React.useState<User>()

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWitthGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWitthGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}

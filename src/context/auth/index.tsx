import { TypedDocumentNode, gql, useMutation } from '@apollo/client'
import {
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import {
  Auth,
  UserRole as GQLUserRole,
  Maybe,
  MutationSignUpArgs,
} from '../../__generated__/graphql'
import { AuthState, SignUpFormValue, UserRole } from '../../types'
import { FBaseContext } from '../FBase'
export interface IAuthContext {
  isAuthenticated: boolean
  authState?: AuthState
  user?: User | null
  logout?: () => Promise<void>
  signIn?: (email: string, password: string) => Promise<void>
  signInWithGoogle?: () => Promise<void>
  signUp?: (value: SignUpFormValue) => Promise<void>
  signUpWithGoogle?: () => Promise<void>
}

const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
})

const { Consumer, Provider } = AuthContext

interface IAuthProvider {
  children: React.ReactNode
}

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  display: 'popup',
})

const SIGN_UP_MUTATION: TypedDocumentNode<
  { signUp: Maybe<Auth> },
  MutationSignUpArgs
> = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      name
      email
      emailVerified
      verifiedByAdmin
      authStep {
        next
        previous
      }
      profileUrl
      userRole
      token
      refreshToken
    }
  }
`

const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const { firebaseApp } = useContext(FBaseContext)
  const [user, setUser] = useState<User | null>(null)
  const [signUpMutation /*, { signUpData, signUpLoading, signUpError } */] =
    useMutation(SIGN_UP_MUTATION)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authState, _setAuthState] = useState<AuthState>()

  const handleAuthChange = (user: User | null) => {
    if (user) {
      setUser(user)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    if (!firebaseApp) return
    const auth = getAuth(firebaseApp)
    onAuthStateChanged(auth, handleAuthChange)
  }, [firebaseApp])

  const logout = async () => {
    setIsAuthenticated(false)
  }

  const signInWithGoogle = async () => {
    try {
      if (!firebaseApp) return
      const auth = getAuth(firebaseApp)
      const userCredential = await signInWithPopup(auth, googleProvider)
      const authCredential =
        GoogleAuthProvider.credentialFromResult(userCredential)
      console.log('authCredential => ', authCredential)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('error => ', {
        error,
        errorCode,
        email,
        errorMessage,
        credential,
      })
    }
  }

  const signUpWithGoogle = async () => {
    try {
      if (!firebaseApp) return
      const auth = getAuth(firebaseApp)
      const userCredential = await signInWithPopup(auth, googleProvider)
      console.log('userCredential => ', userCredential)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('error => ', {
        error,
        errorCode,
        email,
        errorMessage,
        credential,
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!firebaseApp) return
      const auth = getAuth(firebaseApp)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('authCredential => ', userCredential)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('error => ', {
        error,
        errorCode,
        email,
        errorMessage,
        credential,
      })
    }
  }
  const signUp = async (signUpFormValue: SignUpFormValue): Promise<void> => {
    const { name, email, password, userRole, phoneNumber } = signUpFormValue
    const signUpUserRole: GQLUserRole =
      userRole!.data! === UserRole.OWNER
        ? GQLUserRole.Owner
        : GQLUserRole.Tenant
    signUpMutation({
      variables: {
        input: {
          email: email.data,
          name: name.data,
          password: password.data,
          phoneNumber: phoneNumber.data.replace(/[()-\s]/g, ''),
          userRole: signUpUserRole,
        },
      },
    })
  }

  return (
    <Provider
      value={{
        isAuthenticated,
        logout,
        authState,
        signInWithGoogle,
        signUpWithGoogle,
        signUp,
        signIn,
        user,
      }}
    >
      {children}
    </Provider>
  )
}

export { Consumer as AuthConsumer, AuthContext, AuthProvider }

import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthForm from '../../components/forms/auth'
import { AuthContext } from '../../context/auth'
import { AuthFormType, SignInFormValue, SignUpFormValue } from '../../types'

// const GET_OWNERS = gql`
//   query GetOwners {
//     getOwners {
//       id
//       name
//     }
//   }
// `

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const formTypeParam = searchParams.get('form')
  const [formType, setFormType] = useState<AuthFormType>('signIn')

  useEffect(() => {
    if (formTypeParam && ['signIn', 'signUp'].includes(formTypeParam)) {
      setFormType(formTypeParam as AuthFormType)
    } else {
      setFormType('signIn')
    }
  }, [formTypeParam])

  const handleOnSignIn = async (value: SignInFormValue) => {
    await authContext?.signIn?.(value)
  }

  const handleOnSignInWithGoogle = async () => {
    await authContext?.signInWithGoogle?.()
  }

  const handleOnSignUpWithGoogle = async () => {
    await authContext?.signUpWithGoogle?.()
  }

  const handleOnSignUp = async (value: SignUpFormValue) => {
    await authContext?.signIn?.(value)
  }

  const navigateToSignInOrSignUpForm = (form: AuthFormType) => {
    navigate(`/auth?form=${form}`)
  }

  const navigateToForgotPassword = () => {
    navigate('/forgotPassword')
  }

  return (
    <section className="xs:mx-auto container flex h-screen flex-col justify-center px-4 sm:mx-auto md:w-4/12">
      <AuthForm
        formType={formType}
        navigateToSignInOrSignUpForm={navigateToSignInOrSignUpForm}
        navigateToForgotPassword={navigateToForgotPassword}
        handleOnSignIn={handleOnSignIn}
        handleOnSignInWithGoogle={handleOnSignInWithGoogle}
        handleOnSignUpWithGoogle={handleOnSignUpWithGoogle}
        handleOnSignUp={handleOnSignUp}
      />
    </section>
  )
}
export default AuthPage

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { GoogleAuthProvider } from 'firebase/auth'
import { useState } from 'react'
import { GoogleLoginButton } from 'react-social-login-buttons'
import {
  AuthFormType,
  SignInFormValue,
  SignUpFormValue,
  UserRole,
} from '../../types'

interface IAuthForm {
  formType: AuthFormType
  handleOnSignIn: (value: SignInFormValue) => Promise<void>
  handleOnSignUp: (value: SignUpFormValue) => Promise<void>
  handleOnSignInWithGoogle: () => Promise<void>
  handleOnSignUpWithGoogle: () => Promise<void>
  navigateToSignInOrSignUpForm: (form: AuthFormType) => void
  navigateToForgotPassword: () => void
}

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  display: 'popup',
})

const AuthForm: React.FC<IAuthForm> = ({
  formType,
  handleOnSignIn,
  handleOnSignUp,
  navigateToSignInOrSignUpForm,
  navigateToForgotPassword,
  handleOnSignInWithGoogle,
  handleOnSignUpWithGoogle,
}) => {
  const [signInValues, setSignInValues] = useState<Partial<SignInFormValue>>({})
  const [signUpValues, setSignUpValues] = useState<Partial<SignUpFormValue>>({})

  const handleOnChange =
    (
      key: `${keyof SignInFormValue}` | `${keyof SignUpFormValue}`,
      formType: AuthFormType
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (formType === 'signIn') {
        setSignInValues({
          ...signInValues,
          [key]: {
            data: event.target.value,
            error: false,
            message: '',
          },
        })
      } else {
        setSignUpValues({
          ...signUpValues,
          [key]: {
            data:
              key === 'userRole'
                ? ((event.target as HTMLInputElement).value as UserRole)
                : event.target.value,
            error: false,
            message: '',
          },
        })
      }
    }

  const isSignUpFormValid = (): boolean => {
    let isValid = true
    const updatedSignUpValue: Partial<SignUpFormValue> = {}
    if (
      signUpValues['userName'] == null ||
      signUpValues?.['userName']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignUpValue['userName'] = {
        data: '',
        ...(signUpValues?.['userName'] ?? {}),
        error: true,
        message: 'Please enter email address.',
      }
    }
    if (
      signUpValues['email'] == null ||
      signUpValues?.['email']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignUpValue['email'] = {
        data: '',
        ...signUpValues['email'],
        error: true,
        message: 'Please enter email address.',
      }
    }
    if (
      signUpValues['email'] != null &&
      signUpValues?.['email']?.data?.trim()?.length > 0 &&
      !signUpValues['email'].data.match(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      )
    ) {
      isValid = false
      updatedSignUpValue['email'] = {
        ...signUpValues['email'],
        error: true,
        message: 'Please enter valid email address.',
      }
    }
    if (
      signUpValues['password'] == null ||
      signUpValues?.['password']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignUpValue['password'] = {
        data: '',
        ...signUpValues['password'],
        error: true,
        message: 'Please enter password.',
      }
    }
    if (
      signUpValues['password'] != null &&
      signUpValues['password']?.data?.trim()?.length > 0 &&
      !signUpValues['password'].data.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    ) {
      isValid = false
      updatedSignUpValue['password'] = {
        ...signUpValues['password'],
        error: true,
        message:
          '1. Password should have minimum 8 characters.\n2. Password should have at least 1 upper case english letter.\n3. Password should have at least 1 lower case english letter.\n4. Password should have at least 1 digit.\n5. Password should have one special character. i.e #?!@$%^&*-',
      }
    }
    if (
      signUpValues['phoneNumber'] == null ||
      signUpValues?.['phoneNumber']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignUpValue['phoneNumber'] = {
        data: '',
        ...signUpValues['phoneNumber'],
        error: true,
        message: 'Please enter phone number.',
      }
    }
    if (
      signUpValues['userRole'] == null ||
      signUpValues?.['userRole']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignUpValue['userRole'] = {
        data: undefined,
        ...signUpValues['userRole'],
        error: true,
        message: 'Please select user role.',
      }
    }
    setSignUpValues(updatedSignUpValue)
    return isValid
  }

  const handleSignUp = () => {
    if (!isSignUpFormValid()) return
    handleOnSignUp(signUpValues as SignUpFormValue)
  }
  const isSignInFormValid = (): boolean => {
    let isValid = true
    const updatedSignInValue: Partial<SignInFormValue> = {}
    if (
      signUpValues['email'] == null ||
      signUpValues['email']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignInValue['email'] = {
        data: '',
        ...signUpValues['email'],
        error: true,
        message: 'Please enter email address.',
      }
    }
    if (
      signUpValues['password'] == null ||
      signUpValues['password']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignInValue['password'] = {
        data: '',
        ...signUpValues['password'],
        error: true,
        message: 'Please enter password.',
      }
    }
    setSignInValues(updatedSignInValue)
    return isValid
  }
  const handleSignIn = () => {
    if (!isSignInFormValid()) {
      return
    }
    handleOnSignIn(signUpValues as SignInFormValue)
  }

  const signInContent = (
    <Box
      className=" flex flex-col items-center gap-4 align-middle"
      component="form"
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        label="Email"
        type="email"
        className="flex w-full"
        placeholder="Enter your email address."
        value={signUpValues?.email?.data ?? ''}
        onChange={handleOnChange('email', 'signIn')}
        error={signUpValues?.email?.error ?? false}
        helperText={signUpValues?.email?.message ?? ''}
      />
      <TextField
        required
        label="Password"
        type="password"
        className="flex w-full"
        placeholder="Enter your password."
        onChange={handleOnChange('password', 'signIn')}
        value={signUpValues?.password?.data ?? ''}
        error={signUpValues?.password?.error ?? false}
        helperText={signUpValues?.password?.message ?? ''}
      />
      <Link
        component="button"
        variant="body2"
        className="self-start"
        onClick={navigateToForgotPassword}
      >
        {'Forgot Password?'}
      </Link>
      <Button
        variant="contained"
        className="flex w-full"
        onClick={handleSignIn}
      >
        {'Sign In'}
      </Button>
      <Divider orientation="horizontal" variant="middle" flexItem>
        <Typography variant="subtitle1">OR</Typography>
      </Divider>
      <GoogleLoginButton
        onClick={handleOnSignInWithGoogle}
        text={'Sign in with Google'}
        align="center"
        className=" !w-fit"
      />
    </Box>
  )

  const signUpContent = (
    <Box
      className=" flex flex-col items-center gap-4 align-middle"
      component="form"
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        label="Username"
        type="text"
        className="flex w-full"
        placeholder="Enter your user name."
        value={signUpValues?.userName?.data ?? ''}
        onChange={handleOnChange('userName', 'signUp')}
        error={signUpValues?.userName?.error ?? false}
        helperText={signUpValues?.userName?.message ?? ''}
      />
      <TextField
        required
        label="Email"
        type="email"
        className="flex w-full"
        placeholder="Enter your email address."
        value={signUpValues?.email?.data ?? ''}
        onChange={handleOnChange('email', 'signUp')}
        error={signUpValues?.email?.error ?? false}
        helperText={signUpValues?.email?.message ?? ''}
      />
      <FormControl className=" w-full" error={signUpValues?.userRole?.error}>
        <FormLabel id="user-role-radio-group">
          {'Are you home owner or tenant?'}
        </FormLabel>
        <RadioGroup
          row
          color="red"
          aria-labelledby="row-role-radio-buttons-group-label"
          name="row-role-radio-buttons-group"
          value={signUpValues?.userRole?.data ?? ''}
          onChange={handleOnChange('userRole', 'signUp')}
        >
          <FormControlLabel
            value={UserRole.OWNER}
            control={<Radio />}
            label={<Typography variant={'subtitle1'}>{'Owner'}</Typography>}
          />
          <FormControlLabel
            value={UserRole.TENANT}
            control={<Radio />}
            label={<Typography variant={'subtitle1'}>{'Tenant'}</Typography>}
          />
        </RadioGroup>
        <FormHelperText error={signUpValues?.userRole?.error}>
          {signUpValues?.userRole?.message ?? ''}
        </FormHelperText>
      </FormControl>
      <TextField
        required
        label="Mobile Number"
        type="tel"
        className="flex w-full"
        placeholder="Enter your mobile number."
        value={signUpValues?.phoneNumber?.data ?? ''}
        onChange={handleOnChange('phoneNumber', 'signUp')}
        error={signUpValues?.phoneNumber?.error ?? false}
        helperText={signUpValues?.phoneNumber?.message ?? ''}
      />
      <TextField
        required
        label="Password"
        type="password"
        className="flex w-full"
        placeholder="Enter your password."
        onChange={handleOnChange('password', 'signUp')}
        value={signUpValues?.password?.data ?? ''}
        error={signUpValues?.password?.error ?? false}
        helperText={signUpValues?.password?.message ?? ''}
      />
      <Button
        variant="contained"
        className="flex w-full"
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
      <Divider orientation="horizontal" variant="middle" flexItem>
        <Typography variant="subtitle1">OR</Typography>
      </Divider>
      <GoogleLoginButton
        onClick={handleOnSignUpWithGoogle}
        text={'Sign up with Google'}
        align="center"
        className=" !w-fit"
      />
    </Box>
  )

  return (
    <Box className="flex flex-col gap-2">
      <ToggleButtonGroup
        color="primary"
        value={formType}
        className=" max-h-10 self-end rounded-3xl border"
        exclusive
        aria-label="sign-in-or-sign-up-form-navigation-button-group"
      >
        <ToggleButton
          value="signIn"
          onClick={() => navigateToSignInOrSignUpForm('signIn')}
          className="rounded-bl-3xl rounded-tl-3xl border"
        >
          Sign In
        </ToggleButton>
        <ToggleButton
          value="signUp"
          onClick={() => navigateToSignInOrSignUpForm('signUp')}
          className="rounded-br-3xl rounded-tr-3xl border"
        >
          Sign Up
        </ToggleButton>
      </ToggleButtonGroup>
      {formType === 'signIn' ? signInContent : signUpContent}
    </Box>
  )
}

export default AuthForm

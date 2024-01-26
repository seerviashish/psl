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
import { useContext, useEffect, useState } from 'react'
import { GoogleLoginButton } from 'react-social-login-buttons'
import { FBaseContext } from '../../context/FBase'
import {
  AuthFormType,
  FBaseConfigKey,
  FBaseCountriesKeyValue,
  FBaseCountryKeyValue,
  SignInFormValue,
  SignUpFormValue,
  UserRole,
} from '../../types'
import { CountryField, TextMaskField } from './customFields'

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
  const [signUpValues, setSignUpValues] = useState<Partial<SignUpFormValue>>({
    country: {
      data: {
        code: 'IN',
        label: 'India',
        phone: '91',
        phoneNoMask: '+91 (####) ###-###',
      },
      error: false,
      message: '',
    },
  })

  const { remoteConfig, getConfigValue } = useContext(FBaseContext)

  const [countries, setCountries] = useState<FBaseCountriesKeyValue>([])

  useEffect(() => {
    if (!getConfigValue || !remoteConfig) return
    const countries = getConfigValue<FBaseConfigKey.COUNTRIES>(
      FBaseConfigKey.COUNTRIES
    )
    setCountries(countries)
  }, [remoteConfig, getConfigValue])

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
      }
      if (formType === 'signUp') {
        if (key === 'phoneNumber' && signUpValues?.['country']?.data == null) {
          setSignUpValues({
            ...signUpValues,
            country: {
              data: null,
              error: true,
              message: 'Please select your country',
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
    }

  const handleOnChangeCountry = (
    _event: React.SyntheticEvent,
    value: FBaseCountryKeyValue | null
  ) => {
    setSignUpValues({
      ...signUpValues,
      country: {
        data: value,
        error: false,
        message: '',
      },
    })
  }

  const isSignUpFormValid = (): boolean => {
    let isValid = true
    const updatedSignUpValue: Partial<SignUpFormValue> = { ...signUpValues }
    if (
      signUpValues['name'] == null ||
      signUpValues?.['name']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignUpValue['name'] = {
        data: '',
        ...(signUpValues?.['name'] ?? {}),
        error: true,
        message: 'Please enter name.',
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
      signUpValues['country'] == null ||
      signUpValues['country']?.data == null
    ) {
      isValid = false
      updatedSignUpValue['country'] = {
        data: null,
        error: true,
        message: 'Please select your country',
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
    const updatedSignInValue: Partial<SignInFormValue> = { ...signInValues }
    if (
      signInValues['email'] == null ||
      signInValues['email']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignInValue['email'] = {
        data: '',
        ...signInValues['email'],
        error: true,
        message: 'Please enter email address.',
      }
    }
    if (
      signInValues['password'] == null ||
      signInValues['password']?.data?.trim()?.length === 0
    ) {
      isValid = false
      updatedSignInValue['password'] = {
        data: '',
        ...signInValues['password'],
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
    handleOnSignIn(signInValues as SignInFormValue)
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
        value={signInValues?.email?.data ?? ''}
        onChange={handleOnChange('email', 'signIn')}
        error={signInValues?.email?.error ?? false}
        helperText={signInValues?.email?.message ?? ''}
      />
      <TextField
        required
        label="Password"
        type="password"
        className="flex w-full"
        placeholder="Enter your password."
        onChange={handleOnChange('password', 'signIn')}
        value={signInValues?.password?.data ?? ''}
        error={signInValues?.password?.error ?? false}
        helperText={signInValues?.password?.message ?? ''}
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
        label="Name"
        type="text"
        className="flex w-full"
        placeholder="Enter your name."
        value={signUpValues?.name?.data ?? ''}
        onChange={handleOnChange('name', 'signUp')}
        error={signUpValues?.name?.error ?? false}
        helperText={signUpValues?.name?.message ?? ''}
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
      <CountryField
        countryOptions={
          countries ?? [
            {
              data: {
                code: 'IN',
                label: 'India',
                phone: '91',
                phoneNoMask: '+91 (####) ###-###',
              },
              error: false,
              message: '',
            },
          ]
        }
        error={signUpValues?.country?.error ?? false}
        helperText={signUpValues?.country?.message}
        value={signUpValues?.country?.data ?? null}
        onChange={handleOnChangeCountry}
        required={true}
        label="Country"
      />
      <TextField
        required
        label="Mobile Number"
        className="flex w-full"
        placeholder="Enter your mobile number."
        value={signUpValues?.phoneNumber?.data ?? ''}
        onChange={handleOnChange('phoneNumber', 'signUp')}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: TextMaskField as any,
        }}
        inputProps={{
          mask:
            signUpValues?.country?.data?.phoneNoMask ?? '+(###) ###-########',
        }}
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

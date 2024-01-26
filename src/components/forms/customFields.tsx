import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  Box,
  TextField,
} from '@mui/material'
import React from 'react'
import { IMaskInput } from 'react-imask'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

interface ITextMaskFieldProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  mask: string
}

export const TextMaskField = React.forwardRef<
  HTMLInputElement,
  ITextMaskFieldProps
>(function TextMaskCustom(props, ref) {
  const { onChange, mask, name, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask={mask}
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value: unknown) =>
        onChange({
          target: { name, value: typeof value === 'string' ? value : '' },
        })
      }
      overwrite
    />
  )
})

interface ITextNumericFormatField {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  prefix: string
}

export const TextNumericFormatField = React.forwardRef<
  NumericFormatProps,
  ITextNumericFormatField
>(function NumericFormatCustom(props, ref) {
  const { onChange, prefix, name, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        })
      }}
      thousandSeparator
      valueIsNumericString
      prefix={prefix}
    />
  )
})

interface CountryOption {
  code: string
  label: string
  phone: string
  phoneNoMask: string
}

interface ICountryField {
  countryOptions: CountryOption[]
  label: string
  onChange: (
    event: React.SyntheticEvent,
    value: CountryOption | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<CountryOption>
  ) => void
  value?: CountryOption | null
  error: boolean
  helperText?: React.ReactNode
  required?: boolean
}

export const CountryField: React.FC<ICountryField> = ({
  countryOptions,
  value,
  onChange,
  label,
  error,
  helperText,
  required,
}) => {
  return (
    <Autocomplete
      sx={{ width: '100%' }}
      options={countryOptions}
      autoHighlight
      onChange={onChange}
      value={value}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      getOptionLabel={(option) =>
        `${option.code} (+${option.phone}) ${option.label}`
      }
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          label={label}
          required={required}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}

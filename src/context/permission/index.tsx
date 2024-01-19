import React, { useCallback, useEffect, useState } from 'react'
import {
  ExtraPermission,
  ExtraPermissionName,
  Optional,
  Permission,
  PermissionCheckType,
} from '../../types'

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material'
const theme = createTheme({
  palette: {
    mode: 'light',
  },
})
export interface IPermissionContext {}

const PermissionContext = React.createContext<IPermissionContext>({})

const { Consumer, Provider } = PermissionContext

interface IPermissionProvider {
  children: React.ReactNode
}

const permissions: Optional<Permission, 'status' | 'state'>[] = [
  {
    id: 1,
    name: 'notifications',
    required: false,
    check: PermissionCheckType.RUNTIME,
  },
  {
    id: 2,
    name: 'push',
    required: false,
    check: PermissionCheckType.RUNTIME,
  },
  {
    id: 3,
    name: ExtraPermission.STORAGE,
    required: true,
    check: PermissionCheckType.ONLOAD,
  },
  {
    id: 4,
    name: ExtraPermission.COOKIE,
    required: true,
    check: PermissionCheckType.ONLOAD,
  },
  {
    id: 5,
    name: 'persistent-storage',
    required: false,
    check: PermissionCheckType.RUNTIME,
  },
]

type ExtendedPermissionStatus = {
  type: 'system' | 'extended' | 'error'
  name: PermissionName | ExtraPermissionName
  state?: PermissionState
  error?: unknown
  id: number
  required: boolean
  check: `${PermissionCheckType}`
}

const PermissionProvider: React.FC<IPermissionProvider> = ({ children }) => {
  const [permissionsStatus, setPermissionsStatus] = useState<
    ExtendedPermissionStatus[]
  >([])
  const [isLoaded, setLoaded] = useState<boolean>(false)
  const isLocalStorageEnabled = () => {
    try {
      if (window?.localStorage == null) return false
      const key = `__storage__test`
      window.localStorage.setItem(key, '__storage_test')
      window.localStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  }

  const isSessionStorageEnabled = () => {
    try {
      if (window?.sessionStorage == null) return false
      const key = `__storage__test`
      window.sessionStorage.setItem(key, '__storage_test')
      window.sessionStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  }
  const checkPermissions = useCallback(async () => {
    const permissionStatusAsync: Promise<ExtendedPermissionStatus>[] =
      permissions.map(async (permission): Promise<ExtendedPermissionStatus> => {
        try {
          if (permission.name === ExtraPermission.STORAGE) {
            const isStorageEnabled =
              isLocalStorageEnabled() && isSessionStorageEnabled()
            return {
              id: permission.id,
              type: 'extended',
              name: permission.name,
              state: isStorageEnabled ? 'granted' : 'denied',
              check: permission.check,
              required: permission.required,
            }
          } else if (permission.name === ExtraPermission.COOKIE) {
            return {
              id: permission.id,
              type: 'extended',
              name: permission.name,
              state: navigator.cookieEnabled ? 'granted' : 'denied',
              check: permission.check,
              required: permission.required,
            }
          } else {
            const permissionQueryResult = await navigator.permissions.query({
              name: permission.name,
            })
            return {
              id: permission.id,
              name: permissionQueryResult.name as PermissionName,
              state: permissionQueryResult.state,
              type: 'system',
              check: permission.check,
              required: permission.required,
            }
          }
        } catch (error) {
          return {
            id: permission.id,
            type: 'error',
            name: permission.name,
            error,
            check: permission.check,
            required: permission.required,
          }
        }
      })

    return await Promise.all(permissionStatusAsync)
  }, [])

  useEffect(() => {
    const asyncFn = async () => {
      setPermissionsStatus(await checkPermissions())
    }
    asyncFn().finally(() => {
      setLoaded(true)
    })
  }, [checkPermissions])

  const isAnyRequiredOnloadPermissionNotEnabled =
    permissionsStatus?.length == 0 ||
    permissionsStatus?.filter(
      (permission) =>
        permission.required &&
        permission.check === PermissionCheckType.ONLOAD &&
        permission.state !== 'granted'
    )?.length > 0

  const content = isAnyRequiredOnloadPermissionNotEnabled ? (
    <MUIThemeProvider theme={theme}>
      {'Required permissions are not enabled. i.e localStorage'}
    </MUIThemeProvider>
  ) : (
    children
  )

  return <Provider value={{}}>{isLoaded ? content : 'Loading...'}</Provider>
}

export { Consumer as PermissionConsumer, PermissionContext, PermissionProvider }

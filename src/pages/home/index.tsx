import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionResponse, ActionStatus, PersonalIdentity } from '../../types'

const TENANT_ROW = [
  'Room Number',
  'Name',
  'Phone Number',
  'Personal ID',
  'Personal ID Number',
  'Actions',
]

type Tenant = {
  id: string
  name: string
  phoneNumber: string
  personalId: PersonalIdentity
  personalIdNumber: string
  roomNumber: number
}

const GET_TENANTS = gql`
  query GetTenants {
    getTenants {
      id
      name
      phoneNumber
      roomNumber
      personalId
      personalIdNumber
    }
  }
`

const REMOVE_TENANT = gql`
  mutation DeleteTenant($deleteTenantId: ID!) {
    deleteTenant(id: $deleteTenantId) {
      message
      status
    }
  }
`
interface IDeleteButton {
  tenantId: string
  removeTenantItem: (id: string) => void
}

const DeleteButton: React.FC<IDeleteButton> = ({
  tenantId,
  removeTenantItem,
}) => {
  const [
    removeTenant,
    { loading: removeTenantLoading, error: removeTenantError },
  ] = useMutation<{
    deleteTenant: ActionResponse
  }>(REMOVE_TENANT)

  const handleRemoveTenant = (deleteTenantId: string) => () => {
    removeTenant({
      variables: {
        deleteTenantId,
      },
    }).then((response) => {
      if (response.data?.deleteTenant?.status === ActionStatus.SUCCESS) {
        removeTenantItem(tenantId)
      }
    })
  }
  return (
    <div className="flex flex-col">
      <button
        key={'remove'}
        className={`radius-sm rounded-md border ${
          removeTenantLoading ? 'bg-blue-300' : 'bg-red-400'
        } px-2`}
        onClick={handleRemoveTenant(tenantId)}
        disabled={removeTenantLoading}
      >
        {removeTenantLoading ? 'Loading...' : 'Remove'}
      </button>
      {removeTenantError && (
        <p className=" text-red-500">{`Failed! Retry ${
          removeTenantError?.message ?? ''
        }`}</p>
      )}
    </div>
  )
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const {
    loading: loadingTenant,
    data: tenantData,
    error: tenantError,
  } = useQuery<{ getTenants: Tenant[] }>(GET_TENANTS)

  useEffect(() => {
    setTenants(tenantData?.getTenants ?? [])
  }, [tenantData])

  if (loadingTenant) {
    return <p>Loading...</p>
  }
  if (tenantError) {
    return <p>{tenantError.message}</p>
  }

  const handleRemoveItem = (tenantId: string): void => {
    const updatedTenants = tenants.filter((tenant) => tenant.id !== tenantId)
    setTenants(updatedTenants)
  }

  // const handleAddNew = () => {
  //   navigate('/tenant/new')
  // }

  const handleEdit = (tenantId: string) => () => {
    navigate(`/tenant/${tenantId}`)
  }

  return (
    <div className="flex flex-col">
      <h5 className="text-center text-2xl">Tenants</h5>
      <div className=" flex justify-start p-4">
        {/* <button
          className=" radius-sm rounded-md border bg-blue-300 px-2"
          onClick={handleAddNew}
          disabled
        >
          Add New [TODO]
        </button> */}
      </div>
      <div className="flex h-96 flex-col overflow-y-auto">
        <table className=" border-collapse">
          <thead>
            <tr className="bg-white even:bg-gray-100">
              {TENANT_ROW.map((rowLabel) => {
                return (
                  <th key={rowLabel} className=" text-center">
                    {rowLabel}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => {
              return (
                <tr key={tenant.id}>
                  {[
                    'roomNumber',
                    'name',
                    'phoneNumber',
                    'personalId',
                    'personalIdNumber',
                  ].map((keyName, index) => {
                    return (
                      <td key={`${tenant.id}-${index}`} className="text-center">
                        {tenant[keyName as keyof Tenant]}
                      </td>
                    )
                  })}
                  <td
                    key={`${tenant.id}-action`}
                    className="flex justify-center gap-2"
                  >
                    <DeleteButton
                      key={'remove'}
                      tenantId={tenant.id}
                      removeTenantItem={handleRemoveItem}
                    />
                    <button
                      key={'edit'}
                      className="radius-sm rounded-md border px-2"
                      onClick={handleEdit(tenant.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex justify-center p-2">
          <button className=" radius-sm rounded-md border bg-blue-300 px-2">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
}
export default HomePage

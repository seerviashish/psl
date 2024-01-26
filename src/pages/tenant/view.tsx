import moment from 'moment'
import { useState } from 'react'
import { PersonalIdentity, Tenant } from '../../types'

const TenantView: React.FC = () => {
  const [tenantValue, setTenantValue] = useState<Partial<Tenant>>()
  const [editable, setEditable] = useState<boolean>(false)

  const handleInputChange =
    (keyName: keyof Omit<Tenant, 'permanentAddress'>) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setTenantValue({ ...tenantValue, [keyName]: e.target.value })
    }

  return (
    <div className="flex flex-col items-center justify-center">
      <h5 className="text-2xl">View/Edit Tenant Details</h5>
      <form className=" flex w-2/4 flex-col items-center justify-center gap-2 p-4">
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={tenantValue?.name ?? ''}
            onChange={handleInputChange('name')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="roomNumber">Room Number</label>
          <input
            id="roomNumber"
            value={tenantValue?.roomNumber ?? ''}
            placeholder="Enter room number"
            type="number"
            onChange={handleInputChange('roomNumber')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            value={tenantValue?.phoneNumber ?? ''}
            placeholder="Enter phone number"
            type="tel"
            onChange={handleInputChange('phoneNumber')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="fatherName">Father's Name</label>
          <input
            id="fatherName"
            type="text"
            placeholder="Enter your father's name"
            value={tenantValue?.fatherName ?? ''}
            onChange={handleInputChange('fatherName')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="fatherPhoneNumber">Father's Phone Number</label>
          <input
            id="fatherPhoneNumber"
            value={tenantValue?.fatherPhoneNumber ?? ''}
            placeholder="Enter father's phone number"
            type="tel"
            onChange={handleInputChange('fatherPhoneNumber')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="college">College</label>
          <input
            id="college"
            value={tenantValue?.college ?? ''}
            placeholder="Enter college name"
            type="text"
            onChange={handleInputChange('college')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="course">Course</label>
          <input
            id="course"
            value={tenantValue?.course ?? ''}
            placeholder="Enter course name"
            type="text"
            onChange={handleInputChange('course')}
            readOnly={!editable}
          />
        </div>
        <fieldset className="flex w-2/4 flex-col gap-1">
          <legend>Select personal identity type</legend>
          <div className="flex gap-2">
            <input
              type="radio"
              id="pancard"
              name="pancard"
              value={PersonalIdentity.PANCARD}
              checked={
                (tenantValue?.personalId ?? PersonalIdentity.PANCARD) ===
                PersonalIdentity.PANCARD
              }
              onChange={handleInputChange('personalId')}
              readOnly={!editable}
            />
            <label htmlFor="pancard">Pancard</label>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              id="adharcard"
              name="adharcard"
              value={PersonalIdentity.ADHARCARD}
              checked={tenantValue?.personalId === PersonalIdentity.ADHARCARD}
              onChange={handleInputChange('personalId')}
              readOnly={!editable}
            />
            <label htmlFor="adharcard">Adharcard</label>
          </div>
        </fieldset>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="personalIdNumber">Personal ID Number</label>
          <input
            id="personalIdNumber"
            value={tenantValue?.personalIdNumber ?? ''}
            placeholder="Enter personal identity number"
            type="text"
            onChange={handleInputChange('personalIdNumber')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="stayFrom">Stay From</label>
          <input
            id="stayFrom"
            value={
              tenantValue?.stayFrom
                ? moment(tenantValue.stayFrom).format('YYYY-MM-DD')
                : ''
            }
            placeholder="Select date from which you are staying"
            type="date"
            onChange={handleInputChange('stayFrom')}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="rentPaidTill">Rent Paid Till</label>
          <input
            id="rentPaidTill"
            // value={new Date().getTime() ?? ''}
            placeholder="Select date till the rent paid"
            type="date"
            value={
              tenantValue?.rentPaidTill
                ? moment(tenantValue.rentPaidTill).format('YYYY-MM-DD')
                : ''
            }
            onChange={(e) => {
              console.log(e.target.value)
              handleInputChange('rentPaidTill')(e)
            }}
            readOnly={!editable}
          />
        </div>
        <div className="flex w-2/4 flex-col gap-1">
          <label htmlFor="permanentAddress">Permanent Address</label>
          <textarea
            id="permanentAddress"
            name="permanentAddress"
            onInput={(e) => {
              setTenantValue({
                ...tenantValue,
                permanentAddress: (e?.target as { value?: string })?.value,
              })
            }}
            value={tenantValue?.permanentAddress}
            readOnly={!editable}
          />
        </div>
        <button
          onClick={
            !editable
              ? (e) => {
                  e.preventDefault()
                  setEditable(true)
                }
              : () => 0
          }
          type="submit"
          className="m-4 w-2/4 self-center rounded-md border-2 p-2 text-xl"
        >
          {!editable ? 'Edit' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export default TenantView

import Common from '../global/common'
import ClientModel from '../schema/client'

class ClientService extends Common {
  private static instance: ClientService
  private constructor() {
    super()
  }
  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService()
    }
    return ClientService.instance
  }

  public async validateClient(clientKey?: string): Promise<boolean> {
    try {
      if (!clientKey) {
        throw new Error('clientKey is undefined, null or empty string')
      }
      const clientDocument = await ClientModel.findOne({ key: clientKey })
      this.logFunctionDebug(
        __filename,
        this.validateClient.name,
        'client document result: ',
        { clientDocument }
      )
      if (!clientDocument || !clientDocument?.enabled) {
        return false
      }
      return true
    } catch (error) {
      this.logFunctionError(__filename, this.validateClient.name, error, {
        clientKey,
      })
      return false
    }
  }
}

export default ClientService

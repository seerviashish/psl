import Common from '../global/common'

class AuthService extends Common {
  private static instance: AuthService
  private constructor() {
    super()
  }
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  public async generateTokens(): Promise<boolean> {
    try {
      return true
    } catch (error) {
      this.logFunctionError(__filename, this.generateTokens.name, error, {})
      return false
    }
  }
}

export default AuthService

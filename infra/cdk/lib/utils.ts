export const PROJECT_NAME = 'google-login-example';

export function makeResourceName(key: string): string {
  return `${PROJECT_NAME}-${key}`
}

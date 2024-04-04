import { validateRequest } from './deps.ts'

export const handleNotFound = () => {
  return new Response('not found', { status: 404 })
}

export const handleHealthCheck = async (request: Request) => {
  const { error } = await validateRequest(request, { GET: {} })
  if (error) {
    return new Response(error.message, { status: error.status })
  }

  return new Response('ok', { status: 200 })
}

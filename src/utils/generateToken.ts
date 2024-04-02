import { randomBytes } from 'crypto'

export function generateVerificationToken(){ //userId: number
    return randomBytes(32).toString('hex')
}
import Token from '../db/model/token';

export async function saveToken(userId: number, token: string ,jwt: string){
    await Token.create({userId, token ,jwt});
}
// require ("dotenv").config();
import { sender } from "./sender";

export async function sendVerification(email: string , token: string){

    ``
    const mailOptions = {
        from: "khievnavin@gmail.com",
        to : email,
        subject: "Verify your Email account",
        text: `Click here to verify your account: http://localhost:8080/users/verify?token=${token}`,

    };
    await sender.sendMail(mailOptions)
}

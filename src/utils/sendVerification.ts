// require ("dotenv").config();
import { sender } from "./sender";

export async function sendVerification(email: string , token: string){

    const link = `https://youtu.be/9FB_pfRoMVQ?si=XHtW0PeNS86YRH6W`
    const mailOptions = {
        from: "khievnavin@gmail.com",
        to : email,
        subject: "Verify your Email account",
        text: `Click here to verify your account:  ${link}    /   ${token}`,

    };
    await sender.sendMail(mailOptions)
}

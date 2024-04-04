import nodemailer from "nodemailer";


export const sender = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "khievnavin@gmail.com",
        pass: "wiswnprjsxrqyiwx"   //account gmail => app password => name => password generated
    }
})
// const verifymail = async (email: string, link: string, res: Response)=>{
    
//     try{
//         let transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: "khievnavin@gmail.com",
//                 pass: "wiswnprjsxrqyiwx"
//             }
//         })

//         let info = await transporter.sendMail({
//             from: "khievnavin@gmail.com",
//             to: email,
//             subject: "Verify your account",
//             html: `<h1>Hello ${email}</h1><p>Please click on the link below to verify your account</p><a href="${link}">Verify</a>`
//         })



//     }catch(error) {
//         console.log(error, "Email failed to be verified")
//         return res.status(404).json()
//     }
// };

// export default verifymail;
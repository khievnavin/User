import z from 'zod'

const UserSchema = z.object({
    email : z.string().min(10),
    password :z.string().min(8, "password must be at least 8 characters"),
    username : z.string().min(5,"Full name is required")
})

export default UserSchema;
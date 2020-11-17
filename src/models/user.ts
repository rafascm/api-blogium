import joi from 'joi'

const userSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  username: joi
    .string()
    .pattern(/^([a-z0-9.]){4,10}$/)
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%&+]).{6,10}$/)
    .required(),
  passwordConfirmation: joi.ref('password'),
  avatarUrl: joi.string().uri(),
  biography: joi.string().min(50).max(2048)
})

export { userSchema }

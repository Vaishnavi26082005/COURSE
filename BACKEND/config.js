import dotenv from "dotenv"
dotenv.config();
const JWT_USER_PASSWORD=process.env.JWT_USER_PASSWORD
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD
const STRIPE_SECRET_KEY="sk_test_51RUG9fIjnqkP0Bf3XedPWMlnTCZeL6P2r8HaYn0ybR2FZjU8tiDuKfx8RnrWV6kpMYeioQqDUxLq7VYbj6mqhlsz00EjD0LtO0"

export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY
}
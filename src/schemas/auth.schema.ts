import { number, object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  first_name: string({ required_error: "First name is required" }).min(
    2,
    "Frist name is required"
  ),
  last_name: string({ required_error: "Last name is required" }).min(
    2,
    "Last name is required"
  ),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirm_password: string({
    required_error: "Confirm password is required",
  }).min(1, "Confirm password is required"),
  roleId: number({ required_error: "Role is required" }).min(
    1,
    "Role is required"
  ),
});

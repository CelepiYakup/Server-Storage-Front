import { z } from "zod";

const allowedDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "yandex.com",
];

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) => {
        const domain = email.split("@")[1].toLocaleLowerCase();
        return allowedDomains.includes(domain);
      },
      { message: "Email domain is not allowed" }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
export type RegisterInput = z.infer<typeof registerSchema>;

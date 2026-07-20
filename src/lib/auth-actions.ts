"use server";

import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSession,
  getSession,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

// ── Register ──

type RegisterResult = {
  success: boolean;
  error?: string;
};

export async function registerAction(
  prev: RegisterResult,
  formData: FormData
): Promise<RegisterResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();

  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { success: false, error: "An account with this email already exists." };
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashPassword(password),
      firstName,
      lastName,
    },
  });

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return { success: true };
}

// ── Login ──

type LoginResult = {
  success: boolean;
  error?: string;
};

export async function loginAction(
  prev: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Invalid email or password." };
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return { success: true };
}

// ── Logout ──

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

// ── Change Password ──

type ChangePasswordResult = {
  success: boolean;
  error?: string;
};

export async function changePasswordAction(
  prev: ChangePasswordResult,
  formData: FormData
): Promise<ChangePasswordResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "All fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
    return { success: false, error: "Current password is incorrect." };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash: hashPassword(newPassword) },
  });

  return { success: true };
}

// ── Update Profile ──

type UpdateProfileResult = {
  success: boolean;
  error?: string;
};

export async function updateProfileAction(
  prev: UpdateProfileResult,
  formData: FormData
): Promise<UpdateProfileResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!firstName || !lastName || !email) {
    return { success: false, error: "All fields are required." };
  }

  // Check email uniqueness (if changed)
  if (email !== session.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists && exists.id !== session.userId) {
      return { success: false, error: "This email is already in use." };
    }
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { firstName, lastName, email },
  });

  revalidatePath("/account/settings");
  return { success: true };
}

// ── Delete Account ──

type DeleteAccountResult = {
  success: boolean;
  error?: string;
};

export async function deleteAccountAction(
  prev: DeleteAccountResult,
  formData: FormData
): Promise<DeleteAccountResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated." };
  }

  const password = formData.get("password") as string;
  if (!password) {
    return { success: false, error: "Password is required to delete your account." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Password is incorrect." };
  }

  await prisma.user.delete({ where: { id: session.userId } });
  await clearSession();
  redirect("/");
}

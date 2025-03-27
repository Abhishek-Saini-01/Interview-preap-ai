"use server"

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            message: 'Account created successfully.Please sign in now.'
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Error creating a user', error);
        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Please sign up instead.'
            }
        }

        await setSessionCookie(idToken);
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: 'Failed to log into an account'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStone = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })

    cookieStone.set('session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ONE_WEEK,
        path: '/',

    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStone = await cookies();
    const sessionCookie = cookieStone.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}
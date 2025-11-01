import { App as FirebaseApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { User } from '../../types/User'

const USER_COLLECTION = 'users'

export class UserDao {
    public static async getUsersByIds(
        firebaseApp: FirebaseApp,
        userIds: string[]
    ): Promise<Map<string, User>> {
        if (userIds.length === 0) {
            return new Map()
        }

        const db = getFirestore(firebaseApp)
        const uniqueUserIds = [...new Set(userIds)]

        const userPromises = uniqueUserIds.map(async (userId) => {
            try {
                const userDoc = await db
                    .collection(USER_COLLECTION)
                    .doc(userId)
                    .get()

                if (!userDoc.exists) {
                    return null
                }

                const data = userDoc.data()
                return {
                    id: userDoc.id,
                    displayName: data?.displayName,
                    email: data?.email,
                    photoUrl: data?.photoURL || data?.photoUrl,
                    createdAt:
                        data?.createdAt?.toDate?.()?.toISOString() ||
                        data?.createdAt,
                    updatedAt:
                        data?.updatedAt?.toDate?.()?.toISOString() ||
                        data?.updatedAt,
                } as User
            } catch (error) {
                return null
            }
        })

        const users = await Promise.all(userPromises)
        const userMap = new Map<string, User>()

        users.forEach((user) => {
            if (user) {
                userMap.set(user.id, user)
            }
        })

        return userMap
    }
}

import { doc, getDoc } from 'firebase/firestore'
import { fireStoreMainInstance } from '../../firebase.ts'
import { useEffect, useState } from 'react'

export const useIsSuperAdmin = (user: { uid: string } | null) => {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    useEffect(() => {
        if (!user?.uid) {
            setIsSuperAdmin(false)
            return
        }
        getDoc(doc(fireStoreMainInstance, 'admins/users/admins', user.uid))
            .then((docSnapshot) => {
                setIsSuperAdmin(docSnapshot.exists())
            })
            .catch((error) => {
                console.error(error)
                setIsSuperAdmin(false)
            })
    }, [user])

    return isSuperAdmin
}

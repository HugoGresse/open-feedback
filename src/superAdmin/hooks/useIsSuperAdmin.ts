import { fireStoreMainInstance } from '../../firebase.ts'
import { useEffect, useState } from 'react'

export const useIsSuperAdmin = (user: { uid: string } | null) => {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    useEffect(() => {
        fireStoreMainInstance
            .collection('admins/users/admins')
            .doc(user?.uid)
            .get()
            .then((doc) => {
                setIsSuperAdmin(doc.exists)
            })
            .catch((error) => {
                console.error(error)
                setIsSuperAdmin(false)
            })
    }, [user])

    return isSuperAdmin
}

import type firebase from 'firebase/compat/app'

// From a snapshot of collection (when you use .collection(..).get()), convert it into a map of:
// {
//    id1: {...dataOfId1},
//    id2: {...dataOfId2}
// }
// The documents are cast to T: callers state the shape of the collection.
export const convertSnapshotToMap = <T extends { id: string }>(
    snapshot: firebase.firestore.QuerySnapshot
): Record<string, T> => {
    const map: Record<string, T> = {}
    snapshot.forEach((doc) => {
        map[doc.id] = {
            ...doc.data(),
            id: doc.id,
        } as T
    })
    return map
}

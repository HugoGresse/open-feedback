// From a snapshot of collection (when you use .collection(..).get()), convert it into a map of:
// {
//    id1: {...dataOfId1},
//    id2: {...dataOfId2}
// }
export const convertSnapshotToMap = snapshot => {
    const map = {}
    snapshot.forEach(doc => {
        map[doc.id] = {
            ...doc.data(),
            id: doc.id,
        }
    })
    return map
}

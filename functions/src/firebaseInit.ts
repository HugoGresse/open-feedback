import * as admin from "firebase-admin"
import serviceAccount from "../serviceAccountKey.json";
import {ServiceAccount} from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})


export const firestore = admin.firestore()

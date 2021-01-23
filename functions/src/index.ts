import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

"use strict"
admin.initializeApp();

export const verifyTheOrder = functions.https.onCall(async (data, context) => {
    let result: boolean = false;
    const orderID: string = data.orderID;
    const riderUID: string = data.riderUID;
    const customerUID: string = data.customerUID;
    await admin.firestore().collection('order').doc(orderID).get().then(async res => {
        if(res.exists) {
            const resRiderUID = res?.data()?.riderUID;
            const resCustomerUID = res?.data()?.customerUID;
            console.log(riderUID, resRiderUID, customerUID, resCustomerUID);
            if(riderUID === resRiderUID && customerUID === resCustomerUID) {
                //means correct people and can proceed to close the order
                await admin.firestore().collection('order').doc(orderID).update({
                    status: 'delivered',
                    updated: admin.firestore.Timestamp.now(),
                    updatedBy: 'system',
                }).catch(err => console.log(err));
                result = true ;
            } else {
                //wrong people
                result = false;
            }
        } else {
            //record dont even exist, should not even reach this point tho.
            result = false;
        }
    }).catch(err => console.log(err));
    console.log("reach 47: ", result);
    return { result: result }
});
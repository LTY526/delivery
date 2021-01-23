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
    console.log("reach 19");
    await admin.firestore().collection('order').doc(orderID).get().then(async res => {
        if(res.exists) {
            console.log("reach 22");
            const resRiderUID = res?.data()?.riderUID;
            const resCustomerUID = res?.data()?.customerUID;
            console.log(riderUID, resRiderUID, customerUID, resCustomerUID);
            if(riderUID === resRiderUID && customerUID === resCustomerUID) {
                console.log("reach 28");
                //means correct people and can proceed to close the order
                await admin.firestore().collection('order').doc(orderID).update({
                    status: 'delivered',
                    updated: admin.database.ServerValue.TIMESTAMP,
                    updatedBy: 'system',
                }).catch(err => console.log(err));
                result = true ;
            } else {
                //wrong people
                console.log("reach 38");
                result = false;
            }
        } else {
            //record dont even exist, should not even reach this point tho.
            console.log("reach 43");
            result = false;
        }
    }).catch(err => console.log(err));
    console.log("reach 47");
    return { result: result }
});
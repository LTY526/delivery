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

export const notifyTheRiders = functions.firestore
    .document('order/{orderID}')
    .onCreate(async (snapshot, context) => {
        const peopleArray: string[] = [];   //riders list
        const tokenArray: string | any[] = []; //riders notification token

        await admin.firestore().collection('roleList').where('rider', '==', true).where('customer', '==', false).get().then(res => {
            if(res.size > 0) {
                res.forEach(ress => {
                    peopleArray.push(ress.id)
                });
                console.log(peopleArray);
            }
        }).then(async action => {
            for(let i=0; i<peopleArray.length; i++) {
                if(peopleArray[i].match(snapshot.data().customerUID)) return;
                await admin.firestore().collection('token').doc(peopleArray[i]).get().then(res => {
                    if(res.exists) {
                        tokenArray.push(res?.data()?.value);
                    }
                }).catch(err => console.log(err));
            }
            console.log(tokenArray);
        }).catch(err => console.log(err));

        const payload = 
        {
            notification: {
                title: 'New order',
                body: 'There is new job order!',
            },
        };
        admin.messaging().sendToDevice(tokenArray, payload).then(response => {
            console.log("Successful:", response);
        }).catch(err => console.log(err));
    });

export const notifyTheCustomer = functions.https.onCall(async (data, context) => {
    const orderID: string = data.orderID;
    const status: string = data.status;
    const riderUID: string = data.riderUID;
    let riderName: string;
    let customerUID: string;
    let customerToken: string;
    //get customer notificaiton token
    await admin.firestore().collection('order').doc(orderID).get().then(async res => {
        if(res.exists) {
            customerUID = res?.data()?.customerUID;
            await admin.firestore().collection('token').doc(customerUID).get().then(ress => {
                if(!res?.data()?.value) return;
                else customerToken = res?.data()?.value;
            }).catch(err => console.log(err));
        }
    }).then(async _ => {
        //get rider's name
        console.log("notifyTheCustomer: reached");
        await admin.firestore().collection('userInformation').doc(riderUID).get().then(res => {
            if(res.exists) {
                riderName = res?.data()?.realName;
            }
        }).catch(err => console.log(err));
    }).then(_ => {
        if(status == 'pickup') {
            const payload = {
                notification: {
                    title: 'Your order has been picked up!',
                    body: `${riderName} has picked up your order.`,
                },
            };
            admin.messaging().sendToDevice(customerToken, payload).then(response => {
                console.log("Successful:", response);
            }).catch(err => console.log(err));
        
        } else if(status == 'indelivery') {
            const payload = {
                notification: {
                    title: 'Your order is being delivered!',
                    body: `${riderName} is now delivering your order.`,
                },
            };
            admin.messaging().sendToDevice(customerToken, payload).then(response => {
                console.log("Successful:", response);
            }).catch(err => console.log(err));
        } else {
            console.log("notifyTheCustomer: Incorrect status.");
            return;
        }
    }).catch(err => console.log(err));
});

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
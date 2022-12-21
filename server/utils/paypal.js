const paypal = require("@paypal/checkout-server-sdk");
const payout = require("@paypal/payouts-sdk");
// const schedule = require('node-schedule');
// const Payout = require('../models/payout');
const User = require("../models/user");
const { default: axios } = require("axios");
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

exports.createOrder = async (cost, name) => {
  console.log("i am here ", cost, name);
  const request = new paypal.orders.OrdersCreateRequest();
  console.log("i am here 3", request);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: cost == 0 ? 1 : cost,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: cost == 0 ? 1 : cost,
            },
          },
        },
        items: [
          {
            name: name,
            unit_amount: {
              currency_code: "USD",
              value: cost == 0 ? 1 : cost,
            },
            quantity: 1,
          },
        ],
      },
    ],
    application_context: {
      return_url: "http://return.example.com",
      cancel_url: "http://cancel.example.com",
    },
  });
  try {
    // console.log("i am here 3", request);
    const order = await paypalClient.execute(request);
    // console.log("my order", order);
    return order;
  } catch (e) {
    console.log("my error", e);
    return e.message;
  }
};

exports.captureOrder = async function (orderId) {
  let request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  // Call API with your client and get a response for your call
  let response = await paypalClient.execute(request);
  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  return response;
};

// exports.pay=async (topay,user,email)=>{
//   const rand = (Math.random()*Math.pow(10,10)).toString().substr(0, 10).replace('.','');
//   let requestBody = {
//     sender_batch_header: {
//       recipient_type: 'EMAIL',
//       email_message: 'SDK payouts test txn',
//       note: 'Enjoy your Payout!!',
//       sender_batch_id: user._id + rand,
//       email_subject: 'This is a test transaction from SDK',
//     },
//     items: [
//       {
//         note: 'Your ' + topay + '$ Payout!',
//         amount: {
//           currency: 'USD',
//           value: topay,
//         },

//         receiver: email,
//         sender_item_id: user._id + rand,
//       },
//     ],
//   };
//   let request = new payout.payouts.PayoutsPostRequest();
//   request.requestBody(requestBody);
//   let response = await paypalClient.execute(request);
//   if (response && response.statusCode && response.statusCode == 201) {
//     await Payout.create({
//       batchId: response.result.batch_header.payout_batch_id,
//       pay: topay,
//       status: response.result.batch_header.batch_status,
//       user: user._id,
//     });
//     paypment_tracking(response.result.batch_header.payout_batch_id);
//   } else {
//     const nuser = await User.findById(user._id).exec();
//     nuser.balance += topay;
//     await nuser.save();
//   }
// };
// const payoutClient = () => {
//   return new payout.core.PayPalHttpClient(
//     new Environment(
//       process.env.PAYPAL_CLIENT_ID,
//       process.env.PAYPAL_CLIENT_SECRET
//     )
//   );
// };
// const paypment_tracking = async (id) => {
//   let date = new Date();
//   date = new Date(date.getTime() + 60 * 1000);
//   const job = schedule.scheduleJob(id, date, async () => {
//     const request = new payout.payouts.PayoutsGetRequest(id);
//     const response = await payoutClient().execute(request);
//     if (
//       response.result.batch_header.batch_status == 'DENIED' ||
//       response.result.batch_header.batch_status == 'PENDING' ||
//       response.result.batch_header.batch_status == 'UNCLAIMED' ||
//       response.result.batch_header.batch_status == 'RETURNED' ||
//       response.result.batch_header.batch_status == 'ONHOLD' ||
//       response.result.batch_header.batch_status == 'BLOCKED' ||
//       response.result.batch_header.batch_status == 'REFUNDED' ||
//       response.result.batch_header.batch_status == 'FAILED' ||
//       response.result.batch_header.batch_status == 'CANCELED'
//     ) {
//       if (response.result.batch_header.batch_status == 'PENDING'||
//         response.result.batch_header.batch_status == 'UNCLAIMED'||
//         response.result.batch_header.batch_status == 'ONHOLD') {
//         const request = new payout.payouts.PayoutsItemCancelRequest(id);

//         const response = await payoutClient().execute(request);
//         await Payout.updateOne({ batchId: id }, { status: 'CANCELED' });
//       } else {
//         await Payout.updateOne(
//           { batchId: id },
//           { status: response.result.batch_header.batch_status }
//         );
//       }
//       const cpayout = await Payout.findOne({ batchId: id }).exec();
//       const user = await User.findById(cpayout.user).select('+balance').exec();
//       user.balance += cpayout.pay*100;
//       await user.save();
//     } else if (response.result.batch_header.batch_status == 'PROCESSING') {
//       paypment_tracking(id);
//     } else if (response.result.batch_header.batch_status == 'SUCCESS') {
//       await Payout.updateOne({ batchId: id }, { status: 'SUCCESS' });
//     }
//   });
// };

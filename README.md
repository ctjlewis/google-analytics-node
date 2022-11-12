# Google Analytics for Node

Report Google Analytics 4 events from a Node server.

### Prerequisites

This library reads a `_ga` cookie from a `{ cookes }` object, and relies on this
being available.  This will typically involve adding Google Analytics to your
client-side, extracting the cookies from the request in your endpoint, and
passing them to the `await ga({ cookies, ... })` function (see **Usage** below).

If you're using Next,
[`nextjs-google-analytics`](https://www.npmjs.com/package/nextjs-google-analytics)
is recommended for the client-side. User requests to your API routes will then
contain the necessary `_ga` cookie, and you can send server-side GA4 events.

### Usage

```ts
await googleAnalytics(
  { 
    cookies: {},
    measurementId = process.env.GA_MEASUREMENT_ID,
    apiSecret = process.env.GA_API_SECRET
  }, 
  ...events,
);
```

Whenever you send an event, the following will be needed:

  1. an API secret, provided via `ga({ apiSecret }, ...events)` or
    `process.env.GA_API_SECRET`.

      > To create a new secret, navigate to: **Admin > Data Streams > choose
      your stream > Measurement Protocol > Create**.

  2. a measurement ID associated with a data stream, provided via `ga({
    measurementId }, ...events)` or `process.env.GA_MEASUREMENT_ID` env var.

      > Found in the Google Analytics UI under: **Admin > Data Streams > choose
      your stream > Measurement ID**.

  3. a `cookies` object of form `{ [key: string]: string | undefined }`, from
     which the Google Analytics ID will be extracted.

  4. an `events` array, of form `{ name: ..., params: { ... } }[]`.

E.g., the following Next API route handler:

```ts
import { googleAnalytics } from "ga4-node"

/**
 * GA_API_SECRET and GA_MEASUREMENT_ID provided via process.env.
 */
export default async function handler(req, res) {
  /**
   * Do something.
   */
  await makeOfflinePurchase(/* ... */);
  /**
   * Send GA events.
   */
  const { cookies } = req;
  await googleAnalytics(
    { cookies },
    {
      name: "offline_purchase",
      params: {
        engagement_time_msec: "100",
        session_id: "123",
      },
    },
    // ...,
  );
}
```

#### Resources 

- [**Google Analytics: Sending events**](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag)
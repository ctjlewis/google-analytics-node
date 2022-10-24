# GA-4 for Node

Report Google Analytics 4 events from a Node server.

### Prerequisites

This library reads a `_ga` cookie from a network request, and relies on this
being available.  This will typically involve adding Google Analytics to your
client-side, receiving network requests to endpoints from users with the cookie
embedded in them, and forwarding it to the `await ga({ req, ... })` function.

If you're using Next,
[`nextjs-google-analytics`](https://www.npmjs.com/package/nextjs-google-analytics)
is recommended. User requests to your API routes will then contain the necessary
`_ga` cookie, and you can send server-side GA4 events.

### Usage

Whenever you send an event, the following will be needed:

  1. an API secret, provided via `ga({ apiSecret })` arg or
    `process.env.GA_API_SECRET`.

  2. a measurement ID associated with a data stream, provided via `ga({
    measurementId })` or `process.env.GA_MEASUREMENT_ID` env var.

  3. a `req` object containing a `{ cookies: { ... } }` property, from which the
    client ID will be extracted.

  4. an `events` array, of form `{ name: ..., params: { ... } }`.

E.g., the following Next API route handler:

```ts
import { ga } from "ga4-node"

/**
 * GA_API_SECRET and GA_MEASUREMENT_ID provided via process.env.
 */
export default async function handler(req, res) {
  /**
   * Do something.
   */
  await makeOfflinePurchase(/* ... */);
  /**
   * Send GA event.
   */
  await ga({
    req,
    events: [
      {
        name: "offline_purchase",
        params: {
          engagement_time_msec: "100",
          session_id: "123",
          // ...
        },
      },
      // ...,
    ]
  });
}
```

#### Resources 

- [**Google Analytics: Sending events**](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag)
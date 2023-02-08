export interface GoogleAnalyticsEvent {
  name: string;
  params: {
    [key: string]: string;
  };
}

export interface GoogleAnalyticsOptions {
  /**
   * The cookies associated with the request.
   */
  cookies: Partial<{
    [key: string]: string;
  }>;

  apiSecret?: string;
  measurementId?: string;
  /**
   * If enabled, will set `debug_mode: true`. See **Admin > DebugView**.
   *
   * @see https://support.google.com/analytics/answer/7201382#zippy=%2Cgoogle-tag-websites
   *
   */
  debug?: boolean;
}

/**
 * Send the given event items to the Google Analytics 4 data stream associated
 * with the given `GA_MEASUREMENT_ID`.
 *
 * @see https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events
 *
 * @returns The status code of the request.
 */
export const googleAnalytics = async (
  {
    cookies,
    debug = false,
    apiSecret: api_secret = process.env.GA_API_SECRET,
    measurementId: measurement_id = (
      process.env.GA_MEASUREMENT_ID ||
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ),
  }: GoogleAnalyticsOptions,
  ...events: GoogleAnalyticsEvent[]
) => {
  if (!api_secret) {
    throw new Error("Missing GA_API_SECRET. Supply `apiSecret` arg or set `GA_API_SECRET` env var.");
  }

  if (!measurement_id) {
    throw new Error("Missing GA_MEASUREMENT_ID. Supply `measurementId` arg or set `GA_MEASUREMENT_ID` env var.");
  }

  if (!events.length) {
    throw new Error("Missing events. Supply at least one event.");
  }

  /**
   * Extract the client_id from the request cookies.
   */
  const { _ga: client_id } = cookies;

  if (!client_id) {
    // eslint-disable-next-line no-console
    console.error("Missing _ga cookie. Ensure the _ga cookie is set on the request.");
    return;
  }

  const { status } = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
    {
      method: "POST",
      body: JSON.stringify({
        client_id,
        events:
          debug
            ? events.map(
              (event) => ({
                ...event,
                params: {
                  ...event.params,
                  debug_mode: true,
                },
              })
            )
            : events,
      })
    }
  );

  return status;
};
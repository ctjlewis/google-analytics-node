export const getGAVariables = () => {
  const GA_API_SECRET = process.env.GA_API_SECRET;
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
  return { GA_API_SECRET, GA_MEASUREMENT_ID };
};

export const hasGAVariables = () => {
  const { GA_API_SECRET, GA_MEASUREMENT_ID } = getGAVariables();
  return Boolean(GA_API_SECRET && GA_MEASUREMENT_ID);
};

export const assertHasGAVariables = () => {
  const { GA_API_SECRET, GA_MEASUREMENT_ID } = getGAVariables();

  if (!GA_API_SECRET) {
    throw new Error("Missing GA_API_SECRET. Supply `apiSecret` arg or set `GA_API_SECRET` env var.");
  }

  if (!GA_MEASUREMENT_ID) {
    throw new Error("Missing GA_MEASUREMENT_ID. Supply `measurementId` arg or set `GA_MEASUREMENT_ID` env var.");
  }

  return true;
};
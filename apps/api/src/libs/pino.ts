import pino from 'pino';

export const logger = pino({
  name: process.env.BASELIME_DATASET,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
      },
      {
        target: '@baselime/pino-transport',
        options: {
          dataset: process.env.BASELIME_DATASET,
          baselimeApiKey: process.env.BASELIME_API_KEY,
        },
      },
    ],
  },
  redact: {
    paths: [
      'attributes.http.body.email',
      'attributes.http.body.password',
      'payload.email',
      'payload.password',
    ],
  },
});

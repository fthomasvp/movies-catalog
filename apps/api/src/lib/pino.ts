import pino from 'pino';

export const logger = pino({
  name: 'movies-catalog/api',
  transport: {
    targets: [
      // {
      //   target: '@axiomhq/pino',
      //   options: {
      //     dataset: process.env.AXIOM_DATASET,
      //     token: process.env.AXIOM_TOKEN,
      //   },
      // },
      {
        target: 'pino-pretty',
      },
    ],
  },
  redact: {
    paths: ['request.body.password', 'payload.password'],
    remove: true,
  },
});

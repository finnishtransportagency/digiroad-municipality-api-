export default {
  type: "object",
  properties: {
    message: { type: 'string' || Error },
  },
  required: ['name']
} as const;

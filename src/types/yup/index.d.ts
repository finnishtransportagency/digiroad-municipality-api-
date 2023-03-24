declare module 'yup' {
  // tslint:disable-next-line: interface-name
  interface ArraySchema<T, C, TIn, TOut> {
    oneOfSchemasArray<U>(schemas: Array<U>): this;
  }

  interface ObjectSchema<TShape, TContext, TIn, TOut> {
    oneOfSchemas<U>(schemas: U): this;
  }
}

export * from 'yup';

import { Client } from 'pg';

type QueryFunction = (client: Client) => Promise<void>;

interface PostgresQuery {
  text: string;
  values: Array<string | Array<string | null> | null>;
}

export { QueryFunction, PostgresQuery };

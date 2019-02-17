declare module '@frontier-token-research/frontier-js/dist/frontier.node.js'

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}

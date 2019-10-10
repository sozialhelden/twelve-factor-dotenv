export type FilterFunction = (name: string, value: string | undefined) => boolean;

export const defaultFilterFunction: FilterFunction = (k: string) =>
  !!k.match(/^REACT_APP_/) || k === 'npm_package_version';

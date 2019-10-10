export type FilterFunction = (name: string, value: string | undefined) => boolean;

const defaultFilterFunction: FilterFunction = (k: string) =>
  !!k.match(/^REACT_APP_/) || k === 'npm_package_version';

export default defaultFilterFunction;

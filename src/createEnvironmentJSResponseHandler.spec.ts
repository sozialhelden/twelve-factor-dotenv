import { defaultFilterFunction } from '.';
import createEnvironmentJSResponseHandler, {
  IResponse,
} from './createEnvironmentJSResponseHandler';

describe('createEnvironmentJSResponseHandler', () => {
  it('allows npm_package_version', () => {
    const handler = createEnvironmentJSResponseHandler(
      { foo: 'bar', REACT_APP_FOO: 'qux' },
      defaultFilterFunction,
    );

    const setHeader = jest.fn();
    const send = jest.fn();

    const response: IResponse = {
      setHeader,
      send,
    };

    handler(test, response);

    expect(setHeader).toBeCalledWith('Cache-Control', 'max-age=300');
    expect(setHeader).toBeCalledTimes(1);

    expect(send).toBeCalledWith('window.env = {"REACT_APP_FOO":"qux"};');
    expect(send).toBeCalledTimes(1);
  });
});

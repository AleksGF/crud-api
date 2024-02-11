import { startApp } from '../index';
import { appSingleMode, appMultiMode } from '../app';

jest.mock('../app', () => ({
  appSingleMode: jest.fn(),
  appMultiMode: jest.fn(),
}));

const originalArgv = process.argv;

describe('App', () => {
  afterEach(() => {
    process.argv = originalArgv;
  });

  afterAll(() => {
    jest.unmock('../app');
  });

  it('should start in single mode when has no arguments', () => {
    expect(appSingleMode).not.toHaveBeenCalled();
    expect(appMultiMode).not.toHaveBeenCalled();

    startApp();

    expect(appSingleMode).toHaveBeenCalledTimes(1);
    expect(appMultiMode).not.toHaveBeenCalled();
  });

  it('should start in multi mode when has --multi argument', () => {
    process.argv.push('--multi');

    expect(appSingleMode).not.toHaveBeenCalled();
    expect(appMultiMode).not.toHaveBeenCalled();

    startApp();

    expect(appSingleMode).not.toHaveBeenCalled();
    expect(appMultiMode).toHaveBeenCalledTimes(1);
  });
});

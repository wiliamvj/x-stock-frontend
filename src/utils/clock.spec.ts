import { Clock } from './clock';

describe('Clock', () => {
  describe('now', () => {
    it('should return the Date object', () => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date('2021-10-20T10:00:00.000Z'));
      expect(Clock.now()).toEqual(new Date('2021-10-20T10:00:00.000Z'));
    });
  });
});

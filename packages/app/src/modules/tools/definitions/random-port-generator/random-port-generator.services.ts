import { random } from 'lodash-es';

export function generateRandomPort() {
  return random(1024, 65535);
}

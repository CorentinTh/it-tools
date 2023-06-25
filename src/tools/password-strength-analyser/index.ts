import { defineTool } from '../tool';
import PasswordIcon from '~icons/mdi/form-textbox-password';

export const tool = defineTool({
  name: 'Password strength analyser',
  path: '/password-strength-analyser',
  description: 'Discover the strength of your password with this client side only password strength analyser and crack time estimation tool.',
  keywords: ['password', 'strength', 'analyser', 'and', 'crack', 'time', 'estimation', 'brute', 'force', 'attack', 'entropy', 'cracking', 'hash', 'hashing', 'algorithm', 'algorithms', 'md5', 'sha1', 'sha256', 'sha512', 'bcrypt', 'scrypt', 'argon2', 'argon2id', 'argon2i', 'argon2d'],
  component: () => import('./password-strength-analyser.vue'),
  icon: PasswordIcon,
  createdAt: new Date('2023-06-24'),
});

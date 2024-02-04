import { randIntFromInterval } from '@/utils/random';

export const generatePort = () => randIntFromInterval(1024, 65535);

import { Noto_Sans, Merriweather } from 'next/font/google';
 
export const notoSans = Noto_Sans({
    subsets: ['latin'],
});
 
export const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900']
});
import type { Theme } from '@react-navigation/native';

export const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      primary: 'hsl(240 5.9% 10%)',
      background: 'hsl(0 0% 100%)',
      card: 'hsl(0 0% 100%)',
      text: 'hsl(240 10% 3.9%)',
      border: 'hsl(240 5.9% 90%)',
      notification: 'hsl(0 84.2% 60.2%)',
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: 'hsl(0 0% 98%)',
      background: 'hsl(240 10% 3.9%)',
      card: 'hsl(240 10% 3.9%)',
      text: 'hsl(0 0% 98%)',
      border: 'hsl(240 3.7% 15.9%)',
      notification: 'hsl(0 62.8% 30.6%)',
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  },
};

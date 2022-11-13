// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      primary60: string;
      primary40: string;
      primary20: string;
      secondary: string;
      secondaryDark: string;
      secondary60: string;
      secondary40: string;
      secondary20: string;
    };
  }
}
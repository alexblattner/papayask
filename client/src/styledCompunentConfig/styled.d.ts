// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary_D2: string;
      primary_D1: string;
      primary: string;
      primary_L1: string;
      primary_L2: string;
      secondary_D2: string;
      secondary_D1: string;
      secondary: string;
      secondary_L1: string;
      secondary_L2: string;
    };
  }
}
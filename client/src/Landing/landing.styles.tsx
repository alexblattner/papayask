import styled from 'styled-components';

export const LandingPage = styled('div')`
  font-family: 'GreycliffCF';
  max-width: 100vw;
  overflow-x: hidden;
  margin-top: -20px;
  box-sizing: border-box;
  scroll-behavior: smooth;

  h1 {
    &:nth-of-type(1) {
      margin-bottom: 10vw;
    }

    &:nth-of-type(2) {
      text-align: center;
    }
  }
`;

export const FirstSection = styled.section`
  width: 100vw;
  position: relative;
`;

export const BackgroundImage = styled('img')`
  object-fit: contain;
  width: 100%;
`;

export const FirstSectionContent = styled('div')`
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 9vw;
  width: 66%;
  font-weight: bold;
  line-height: 10vw;

  @media (min-width: 600px) {
    top: 25%;
    left: 5%;
    font-size: 3.8vw;
    width: 42%;
    -webkit-transform: translateX(0);
    -ms-transform: translateX(0);
    transform: translateX(0);
    line-height: 4vw;
  }
`;

export const Arrow = styled('img')`
  width: 15vw;
  cursor: pointer;
  margin-top: 5vw;
  margin-left: 50%;
  transform: translateX(-50%);

  @media (min-width: 600px) {
    width: 5vw;
    margin-top: 6vw;
  }
`;

export const InfoSection = styled('div')`
  background: #fbeeea;
  padding: 4.5vw;
  display: flex;
  gap: 1em;
  align-items: center;
  font-size: 6vw;
  flex-direction: column;

  span {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }

  img {
    width: 20vw;
  }

  @media (min-width: 600px) {
    padding: 4vw;
    gap: 2vw;
    font-size: 3vw;
    flex-direction: row;

    img {
      width: 8vw;
    }
  }
`;
export const SignUpButton=styled('button')`
  background-color: var(--primary-d1);
  color: white;
  border: none;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 16px;
  width: auto;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
	left: 50%;
	position: relative;
	transform: translateX(-50%);
	padding: ;
	padding: 20px 70px;
	border-radius: 90px;
	box-shadow: 0px 8px 12px rgba(var(--primary-numbers-d1),.3);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    &:not(:disabled) {
      opacity: 0.8;
    }
  }
  img {
    width: 24px;
    margin-left: 8px;
    margin-top: -4px;
  }
`
export const LearnMore=styled('button')`
  background-color: var(--primary-d1);
  color: white;
  border: none;margin-top:30px;
  font-size: 30px;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 16px;
  width: auto;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
	left: 50%;
	position: relative;
	transform: translateX(-50%);
	padding: ;
	padding: 20px 70px;
	border-radius: 90px;
	box-shadow: 0px 8px 12px rgba(var(--primary-numbers-d1),.3);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    &:not(:disabled) {
      opacity: 0.8;
    }
  }
  img {
    width: 24px;
    margin-left: 8px;
    margin-top: -4px;
  }
`
export const FlexItem = styled('div')<{ reverse?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 3vw;
  margin-bottom: 5vw;
  font-weight: bold;
  text-align: justify;

  h2 {
    font-size: 6vw;
    color: #0074eb;
    font-weight: bold;
  }

  p {
    color: #004d9d;
    font-size: 4vw;
  }

  img {
    width: 30vw;
  }

  @media (min-width: 600px) {
    flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};

    img {
      width: 12vw;
    }

    h2 {
      font-size: 3vw;
    }

    p {
      color: #004d9d;
      font-size: 1.5vw;
    }
  }
`;

export const FlexItemImage = styled('div')`
  h3 {
    font-weight: bold;
    font-size: 5vw;
    text-align: center;
    margin-top: 1em;
  }

  img {
    width: 90vw;
  }

  @media (min-width: 600px) {
    img {
      width: 50vw;
    }

    h3 {
      font-size: 2vw;
      margin-top: 0;
    }
  }
`;

export const MainPage = styled('section')`
  width: 100vw;
  position: relative;
`;

export const FlexContainer = styled('div')`
  padding: 4vw 16vw;
`;
export const Strip = styled('section')`
  background-color: #fbeeea;
  padding: 4vw 8vw;
`;

export const BottomSection = styled('section')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vw;
  padding: 8vw 0;

  h4 {
    font-size: 8vw;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }

  h2 {
    font-size: 6vw;
    text-align: center;
    color: #004d9d;
    font-weight: bold;
  }

  img {
    width: 95vw;
  }

  @media (min-width: 600px) {
    padding: 5vw 0;
    h4 {
      font-size: 4vw;
    }

    h2 {
      font-size: 2vw;
    }

    img {
      width: 35vw;
    }
  }
`;

export const Footer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3vw;
  padding: 6vw 0;
  flex-direction: column;

  div {
    display: flex;
    align-items: center;
    gap: 1vw;
  }

  p {
    font-size: 4vw;
    font-weight: bold;
    margin: 0;
  }

  img {
    width: 4vw;
  }

  @media (min-width: 600px) {
    flex-direction: row;
    padding: 1.5vw 0;

    p {
      font-size: 1.5vw;
      font-weight: bold;
      margin: 0;
    }

    img {
      width: 1.5vw;
    }
  }
`;

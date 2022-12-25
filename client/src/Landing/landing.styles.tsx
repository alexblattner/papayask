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
  font-size: 10vw;
  width: 66%;
  font-weight: bold;
  line-height: 8vw;

  @media (min-width: 600px) {
    top: 25%;
    left: 8%;
    font-size: 2.3vw;
    width: 40%;
    transform: translateX(0);
    line-height: 3vw;
  }
`;

export const Arrow = styled('img')`
  width: 10vw;
  cursor: pointer;
  margin-top: 5vw;
  margin-left: 50%;
  transform: translateX(-50%);

  @media (min-width: 600px) {
    width: 5vw;
    margin-top: 3vw;
  }
`;

export const FlexItem = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 3vw;
  margin-bottom: 5vm;

  &:nth-of-type(odd) {
    margin-bottom: 2vw;
  }
  &:nth-of-type(even) {
    margin-bottom: 6vw;
  }

  img {
    width: 30vw;
  }

  @media (min-width: 600px) {
    flex-direction: row;

    &:nth-of-type(2) {
      flex-direction: row-reverse;
    }

    img {
      width: 13vw;
    }
  }
`;

export const Title = styled('h2')`
  font-size: 8vw;
  font-weight: bold;
  margin-bottom: 2vw;
  line-height: 10vw;
  color: ${({ theme }) => theme.colors.primary};

  @media (min-width: 600px) {
    font-size: 3vw;
    line-height: 1;
  }
`;

export const Subtitle = styled('h3')`
  font-size: 6vw;
  font-weight: bold;

  @media (min-width: 600px) {
    font-size: 2vw;
  }
`;
export const Text = styled('p')`
  font-size: 5vw;
  line-height: 6vw;

  @media (min-width: 600px) {
    font-size: 2vw;
    line-height: normal;
  }
`;

export const MainPage = styled('section')`
  width: 100vw;
  position: relative;
  padding: 8vw;
`;

export const FlexContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 5%;
  flex-direction: column;

  p {
    font-size: 4vw;
  }

  @media (min-width: 600px) {
    flex-direction: row;

    p {
      font-size: 1.5vw;
    }
  }
`;
export const Strip = styled('section')`
  background-color: rgba(205, 240, 243, 1);
  padding: 4vw;
  border-radius: 24px;
  position: relative;
  margin-bottom: 10vw;

  h2 {
    font-family: 'Greycliff CF DemiBold';
    width: 100%;
    text-align: center;
    font-size: 10vw;
  }
  @media (min-width: 600px) {
    h2 {
      font-size: 4vw;
    }
  }
`;
export const Grid = styled('div')`
  background-color: rgba(205, 240, 243, 1);

  div {
    width: 100%;
    text-align: center;
    margin-bottom: 0px;

    h2 {
      text-align: center;
      font-size: 8vw;
    }
  }

  p {
    font-size: 5vw;
  }

  img {
    width: 80%;
  }

  @media (min-width: 600px) {
    display: grid;
    grid-column-gap: 80px;
    grid-row-gap: 0px;
    grid-template-columns: auto auto;
    div {
      width: 100%;
      text-align: start;
      h2 {
        text-align: start;
        font-size: 3vw;
      }
    }

    p {
      font-size: 2vw;
    }

    img {
      width: 60%;
    }
  }
`;

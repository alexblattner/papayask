import styled from "styled-components";

export const LandingPage = styled('div')`
  font-family: 'GreycliffCF';
  max-width: 100vw;
  overflow-x: hidden;
  margin-top: -80px;
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

export const Title = styled('h1')`
  font-size: 10vw;
  font-weight: bold;
  margin-bottom: 2vw;
  text-align: left;
  padding-inline-start: 8vw;
  padding-inline-end: 12vw;
  color: ${({ theme }) => theme.colors.primary_D2};
  line-height: 10vw;

  

  @media (min-width: 600px) {
    font-size: 4vw;
    text-align: center;
    line-height: normal;
  }

  span {
    &:nth-child(2) {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const FlexItem = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 3vw;
  padding: 0 8vw;
  margin-bottom: 5vm;

  &:nth-of-type(2n) {
    flex-direction: column-reverse;
  }
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

    &:nth-of-type(2n) {
      flex-direction: row;
    }

    img {
      width: 13vw;
    }
  }
`;

export const SubTitle = styled('h2')`
  font-size: 8vw;
  font-weight: bold;
  margin-bottom: 2vw;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 10vw;

  @media (min-width: 600px) {
    font-size: 3vw;
    line-height: normal;
  }
`;

export const Text = styled('p')`
  font-size: 5vw;
  color: ${({ theme }) => theme.colors.primary_D2};
  line-height: 6vw;

  @media (min-width: 600px) {
    font-size: 2vw;
    line-height: normal;
  }
`;

export const MainPage = styled('section')`
  width: 100vw;
  position: relative;
  padding-top: 10vw;
  padding-bottom: 10vw;
`;

export const Strip = styled('section')`
  background-color: ${({ theme }) => theme.colors.primary_L2};
  padding: 8vw 0 1vw 0;
  position: relative;
  margin-bottom: 10vw;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-bottom: 4vw solid ${({ theme }) => theme.colors.primary_L2};
    border-left: 100vw solid transparent;
    position: absolute;
    bottom: 100%;
    right: 0;
    z-index: -1;
  }

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-top: 4vw solid ${({ theme }) => theme.colors.primary_L2};
    border-right: 100vw solid transparent;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: -1;
  }
`;
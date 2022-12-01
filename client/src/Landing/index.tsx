import useWidth from '../Hooks/useWidth';
import './landing.css';
import {
  Arrow,
  BackgroundImage,
  FirstSection,
  FirstSectionContent,
  FlexItem,
  LandingPage,
  MainPage,
  Strip,
  SubTitle,
  Text,
  Title,
} from './landing.styles';

const Landing = () => {
  const { width } = useWidth();
  return (
    <LandingPage>
      <FirstSection>
        <BackgroundImage
          src={`assets/landing-page-assets/section_1_bg${
            width < 600 ? '_mobile' : ''
          }.jpg`}
        />
        <FirstSectionContent>
          <p>
            Access knowledge
            {width > 600 && <br />} and wisdom of top professionals
          </p>
          <a href="#main">
            {' '}
            <Arrow src="assets/landing-page-assets/arrow_down.svg" />
          </a>
        </FirstSectionContent>
      </FirstSection>
      <MainPage id="main">
        <Title>
          <span>What is </span> <span>Papayask?</span>
        </Title>
        <FlexItem>
          <img src="assets/landing-page-assets/Puzzle.svg" alt="Puzzle" />
          <div>
            <SubTitle>Find the best professional for you</SubTitle>
            <Text>
              Papayask gives you the ability to search the skill you’re looking
              for in a person including a variety of other options. This gives
              you the ability to search for the right professional for you.
            </Text>
          </div>
        </FlexItem>
        <FlexItem>
          <div>
            <SubTitle>Pay and ask professionals</SubTitle>
            <Text>
              After finding the best professional for your needs, you can pay to
              ask them a question privately. Just write down your question, pay
              and wait for an answer
            </Text>
          </div>
          <img src="assets/landing-page-assets/Question.svg" alt="Question" />
        </FlexItem>
        <Strip>
          <Title>Why you can trust us?</Title>
          <FlexItem>
            <img src="assets/landing-page-assets/Pro.svg" alt="Pro" />
            <div>
              <SubTitle>Detailed and verified profiles</SubTitle>
              <Text>
                Papayask gives the professionals the ability to specify relevant
                details to prove their competences. To ensure authenticity, we
                verify all profiles before they can offer to answer questions.
              </Text>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <SubTitle>Secured payments, and pay back policy</SubTitle>
              <Text>
                The payment process is done through Paypal to ensure the
                security of the payment. Shoult there happen to be a legitimate
                issue, we will refund you in full.
              </Text>
            </div>
            <img src="assets/landing-page-assets/Lock.svg" alt="Lock" />
          </FlexItem>
        </Strip>
        <Title>Get your pro knowledge, easy and fast</Title>
      </MainPage>
    </LandingPage>
  );
};

export default Landing;

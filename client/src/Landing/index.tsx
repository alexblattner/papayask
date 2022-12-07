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
import arrow from './assets/arrow_down.svg';
import logo from './assets/full_logo.svg';
import lock from './assets/Lock.svg';
import pro from './assets/Pro.svg';
import search from './assets/Search.svg';
import question from './assets/Question.svg';
import first from './assets/section_1_bg.jpg';
import firstMobile from './assets/section_1_bg_mobile.jpg';
const Landing = () => {
  const { width } = useWidth();
  return (
    <LandingPage>
      <FirstSection>
        <BackgroundImage
          src={width < 600 ? firstMobile : first}
        />
        <FirstSectionContent>
          <p>
            Access knowledge
            {width > 600 && <br />} and wisdom of top professionals
          </p>
          <a href="#main">
            {' '}
            <Arrow src={arrow} />
          </a>
        </FirstSectionContent>
      </FirstSection>
      <MainPage id="main">
        <Title>
          <span>What we offer</span>
        </Title>
        <FlexItem>
          <img src={search} alt="Search" />
          <div>
            <SubTitle>Find the right advisor for you</SubTitle>
            <Text>
              Papayask gives you the ability to search the skill you’re looking
              for in a person including a variety of other options. This gives
              you the ability to search for the right advisor for you.
            </Text>
          </div>
        </FlexItem>
        <FlexItem>
          <div>
            <SubTitle>Pay and ask leading experts</SubTitle>
            <Text>
              After finding the best professional for your needs, you can pay to
              ask them a question privately. Just write down your question, pay
              and wait for an answer
            </Text>
          </div>
          <img src={question} alt="Question" />
        </FlexItem>
        <Strip>
          <Title>Why trust us</Title>
          <FlexItem>
            <img src={pro} alt="Pro" />
            <div>
              <SubTitle>Detailed and verified profiles</SubTitle>
              <Text>
                Papayask gives its advisors the ability to specify relevant
                details to prove their competences. To ensure authenticity, we
                verify all profiles before they can offer their services.
              </Text>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <SubTitle>Secured payments and pay back policy</SubTitle>
              <Text>
                The payment process is done through Paypal to ensure the
                security of the payment. Should there happen to be a legitimate
                issue, we will refund you in full.
              </Text>
            </div>
            <img src={lock} alt="Lock" />
          </FlexItem>
        </Strip>
        <Title>Get your pro knowledge, easy and fast</Title>
      </MainPage>
    </LandingPage>
  );
};

export default Landing;

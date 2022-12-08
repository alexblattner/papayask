import React from 'react';
import { UserProps } from '../models/User';
import Badge from '../shared/Badge';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import LanguagesSelect from '../shared/LanguagesSelect';
import Modal from '../shared/Modal';
import { Text } from '../shared/Text';
import { AuthContext } from '../Auth/ContextProvider';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

const LanguagesModal = (props: Props) => {
  const [languages, setLanguages] = React.useState<string[]>(
    props.user.languages
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  const addLanguage = (language: string) => {
    setLanguages([...languages, language]);
  };

  const { updateUser } = React.useContext(AuthContext);

  const updateLanguages = async () => {
    setLoading(true);
    try {
      await updateUser({
        languages,
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    props.setShowModal(false);
  };

  const removeLanguage = (language: string) => {
    const newLanguages = [...languages];
    const index = newLanguages.indexOf(language);
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);
  };

  return (
    <Modal setShowModal={props.setShowModal}>
      <Text fontSize={32} fontWeight="bold">
        Languages
      </Text>
      <Container height="32px" />
      <Container flex dir="column" width="100%">
        <Container flex flexWrap gap={12} mb={32}>
          {languages.map((language, index) => (
            <Badge
              key={index}
              text={language}
              isRemovable={true}
              onRemove={removeLanguage}
            ></Badge>
          ))}
        </Container>
        <LanguagesSelect addLanguage={addLanguage} />
        <Container flex justify="flex-end" gap={12} mt={16}>
          <Button variant="outline" onClick={() => props.setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={updateLanguages}
            disabled={loading}
          >
            {loading ? 'Please Wait...' : 'Save'}
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};

export default LanguagesModal;

import React, { useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import api from '../utils/api';
import compressImage from '../utils/compressImage';
import { Button } from './components/Button';
import { Container } from './components/Container';
import { Input } from './components/Input';
import { Text } from './components/Text';
import { TextArea } from './components/TextArea';

const HiddenInput = styled.input`
  display: none;
`;

const ImageContainer = styled('div')<{ image: string; progress: number }>`
  width: 300px;
  height: 300px;
  background-color: ${(props) =>
    props.image ? `` : props.theme.colors.secondary};
  border-radius: 30px;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: ${(props) => (props.progress >= 100 ? 1 : 0.5)};
  }
`;

const Uploader = styled('div')<{ progress: number }>`
  display: ${(props) => (props.progress >= 100 ? 'none' : 'block')};
  width: 90%;
  height: 10px;
`;

interface Props {
  title: string;
  bio: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setBio: React.Dispatch<React.SetStateAction<string>>;
}

const StepOne = (props: Props) => {
  const [image, setImage] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number>(0);
  const [imageObg, setImageObg] = React.useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });
  const { title, bio, setTitle, setBio } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const getCloudinarySignature = async () => {
    const res = await api.post('cloudinary-signature');
    const { signature, timestamp } = res.data;
    return { signature, timestamp };
  };

  const readFile = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const image = reader.result as string;
      setImage(image);
    };
  };

  const onFileChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files?.[0];

    if (!file) {
      return;
    }
    const sizeCheck = file.size < 17825792;

    if (sizeCheck && imageRef) {
      file = await compressImage(file, 17, imageRef);

      if (!file) {
        return;
      }
      readFile(file);
    }

    const { signature, timestamp } = await getCloudinarySignature();

    const config = {
      onUploadProgress: (progressEvent: any) => {
        let presentComleted = sizeCheck
          ? Math.round((progressEvent.loaded * 50) / progressEvent.total) + 50
          : Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(presentComleted);
      },
    };
    const preset =
      process.env.REACT_APP_ENV === 'production' ? 'production' : 'development';

    const formData = new FormData();
    formData.append('file', file!);
    formData.append('upload_preset', preset);

    axios
      .post(
        `https://api.cloudinary.com/v1_1/snipcritics/image/upload?api_key=${process.env.REACT_APP_CLOUDINARY_KEY}&timestamp=${timestamp}&signature=${signature}`,
        formData,
        config
      )
      .then((res) => {
        const imgId = res.data.public_id.replace(`${preset}/`, '');
        setImageObg({ id: imgId, name: res.data.original_filename });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Text fontSize={32} fontWeight={600} mb={16}>
        Headline
      </Text>
      <Input
        type="text"
        value={title}
        placeholder="Enter a link and press enter"
        onChange={(e) => setTitle(e.target.value)}
        name="headline"
      />
      <Text fontSize={32} fontWeight={600} mb={16}>
        Tell your clients about yourself
      </Text>
      <TextArea value={bio} onChange={(e) => setBio(e.target.value)} />
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileChosen(e)}
      />
      <Container flex align="flex-start" gap={48}>
        <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
          Upload profile picture
        </Button>
        <ImageContainer ref={imageRef} image={image} progress={progress}>
          {image && <img src={image} alt="profile" />}
          <Uploader ref={uploadRef} progress={progress}>
            {progress > 0 && progress < 100 && (
              <Text>{progress}% completed</Text>
            )}
          </Uploader>
        </ImageContainer>
      </Container>
    </>
  );
};

export default StepOne;

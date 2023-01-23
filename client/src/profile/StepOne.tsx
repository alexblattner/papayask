import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios, { AxiosProgressEvent } from 'axios';

import api from '../utils/api';
import useWidth from '../Hooks/useWidth';
import compressImage from '../utils/compressImage';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { TextArea } from '../shared/TextArea';
import { useEditProfile } from './profileService';
import SvgIcon from '../shared/SvgIcon';
import ProfilePicture from '../shared/ProfilePicture';

const HiddenInput = styled.input`
  display: none;
`;

const ImageContainer = styled('div')<{ image: string; progress: number }>`
  position: relative;
  width: 250px;
  height: 250px;
  background-color: ${(props) =>
    props.image ? `` : props.theme.colors.secondary};
  border-radius: 30px;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: ${(props) =>
      props.progress >= 100 || props.progress === 0 ? 1 : 0.5};
  }
`;

const Uploader = styled('div')<{ progress: number }>`
  display: ${(props) => (props.progress >= 100 ? 'none' : 'block')};
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  border-radius: 20px;
  transform: translateY(-50%);
  text-align: center;
  background-color: green;
  color: white;
  font-weight: bold;
  z-index: 99;
`;

const DeletePictureButton = styled('div')`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StepOne = () => {
  const [progress, setProgress] = React.useState<number>(0);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const { width } = useWidth();
  const {
    name,
    title,
    bio,
    image,
    setName,
    setTitle,
    setBio,
    setImage,
    setCloudinaryImageId,
  } = useEditProfile();

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

    setProgress(0);

    const { signature, timestamp } = await getCloudinarySignature();

    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        let percentCompleted = sizeCheck
          ? Math.round((progressEvent.loaded * 50) / progressEvent.total!) + 50
          : Math.round((progressEvent.loaded * 100) / progressEvent.total!);

        if (uploadRef.current) {
          uploadRef.current.textContent = `${percentCompleted}% completed`;
          uploadRef.current.style.background = `linear-gradient(to right, var(--primary) ${percentCompleted}% , #aaa ${percentCompleted}%)`;
        }
        setProgress(percentCompleted);
      },
    };
    const preset =
      process.env.REACT_APP_ENV === 'production' ? 'production' : 'development';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    axios
      .post(
        `https://api.cloudinary.com/v1_1/snipcritics/image/upload?api_key=${process.env.REACT_APP_CLOUDINARY_KEY}&signature=${signature}&timestamp=${timestamp}`,
        formData,
        config
      )
      .then((res) => {
        const imgId = res.data.public_id.replace(`${preset}/`, '');

        setCloudinaryImageId(imgId);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  const deleteImage = () => {
    setImage('');
    setCloudinaryImageId('');
  };

  useEffect(() => {
    if (image) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
  }, [image]);

  return (
    <Container flex gap={32} dir={width > 800 ? 'row' : 'column'}>
      <Container flex dir="column" gap={12}>
        <HiddenInput
          type="file"
          ref={fileInputRef}
          onChange={(e) => onFileChosen(e)}
        />
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          width="250px"
        >
          Upload profile picture
        </Button>
        <ImageContainer ref={imageRef} image={image} progress={progress}>
          {showDelete && (
            <DeletePictureButton onClick={deleteImage}>
              <SvgIcon src="delete" color="white" />
            </DeletePictureButton>
          )}
          {image && image.includes('cloudinary') ? (
            <ProfilePicture size={250} src={image.split('-')[1]} />
          ) : image && !image.includes('cloudinary') ? (
            <img src={image} alt="profile" />
          ) : (
            <img src={`assets/default.png`} alt="default" />
          )}
          <Uploader ref={uploadRef} progress={progress}></Uploader>
        </ImageContainer>
      </Container>
      <Container width="100%">
      <Text fontSize={32} fontWeight={600} mb={16} color="primary">
          First Name and Last Name
        </Text>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          width='300px'
        />
        <Text fontSize={32} fontWeight={600} mb={16} color="primary">
          Headline
        </Text>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="headline"
          width="300px"
        />
        <Text fontSize={32} fontWeight={600} mb={16} color="primary">
          Tell us about yourself
        </Text>
        <TextArea value={bio} onChange={(e) => setBio(e.target.value)} />
      </Container>
    </Container>
  );
};

export default StepOne;

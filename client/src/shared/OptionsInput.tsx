import {useEffect, useState} from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { Container } from './Container';
import { Text } from './Text';
import { Input } from './Input';
const Suggestions = styled('div')<{ show: boolean }>`
  position: absolute;
  top: 35px;
  left: 0;
  max-height: 240px;
  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
  background-color: #fff;
  width: 300px;
  z-index: 999;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: scroll;
`;

const Suggestion = styled('div')`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary20};
  }
`;
interface Props{
    options: string[] | Promise<string[]> | any[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    name?: string;
    width?: number;
    disabled?: boolean;
    config?: {
        main: string;
        sub: string;
    };
}
export const OptionsInput = (props: Props) => {
    const [options, setOptions] = useState<string[]>([]);
    const [focused, setFocused] = useState<boolean>(false);
    useEffect(() => {
      if(props.value === ''){
        setOptions([]);
      }else{
        if(props.options instanceof Promise){
          props.options.then((returnedoptions: string[]) => {
            let temp= returnedoptions.filter((option: string) => option.toLowerCase().includes(props.value.toLowerCase()));
            setOptions(temp);
          });
        }else{
          let temp= props.options.filter((option: string) => option.toLowerCase().includes(props.value.toLowerCase())&&option.toLowerCase()!==props.value.toLowerCase());
          setOptions(props.options);
        }
      }
    }, [props.value]);
    return <Container position="relative">
    <Input
      type="text"
      value={props.value}
      placeholder={props.placeholder? props.placeholder: ''}
      name={props.name? props.name: ''}
      onChange={(e) => props.onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />

    <Suggestions show={options.length > 0}>
      {focused&&options.map((option, index) => (
        <Suggestion
          key={index}
          onClick={() => {
            props.onChange(option);
            setOptions([]);
          }}
        >
          <Text fontSize={14} fontWeight={'bold'}>
            {/*props.config?option[props.config.main]:option*/}
            {option}
          </Text>
          <Text fontSize={13}>
            {/*props.config?option[props.config.sub]:option*/}
            {option}
          </Text>
        </Suggestion>
      ))}
    </Suggestions>
  </Container>
}
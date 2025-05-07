import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GreyBox from '../screens/Account/components/GreyBox';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('GreyBox login', () => {
  it('chama o Firebase com email e senha corretos', async () => {
    const { getByPlaceholderText, getByText } = render(<GreyBox />);

    fireEvent.changeText(getByPlaceholderText('example@example.com'), 'email@teste.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'senha123');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // auth
        'email@teste.com',
        'senha123'
      );
    });
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GreyBox from '../screens/Account/components/GreyBox';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('GreyBox login', () => {
  it('deve chamar signInWithEmailAndPassword com email e senha', async () => {
    const { getByPlaceholderText, getByText } = render(<GreyBox />);

    fireEvent.changeText(getByPlaceholderText('example@example.com'), 'user@email.com');
    fireEvent.changeText(getByPlaceholderText('********'), '123456');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'user@email.com',
        '123456'
      );
    });
  });
});

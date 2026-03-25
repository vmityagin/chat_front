import '../index.css';
import ToastProvider from '../components/ToastProvider';

export const metadata = {
  title: 'Анонимный чат',
  description: 'Анонимный чат',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

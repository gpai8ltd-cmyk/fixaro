import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Общи условия',
  description: 'Общи условия за ползване на онлайн магазин Fixaro. Информация за поръчки, плащания, гаранции и права на потребителите.',
  keywords: ['общи условия', 'условия за ползване', 'гаранция', 'права на потребителя', 'онлайн магазин'],
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Общи условия | Fixaro',
    description: 'Общи условия за ползване на онлайн магазин Fixaro.',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}

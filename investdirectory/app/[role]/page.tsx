import { notFound } from 'next/navigation';
import MainContent from '../components/MainContent';
import '../styles.css';

const validRoles = ['legal', 'wealth', 'ops'];

interface RolePageProps {
  params: Promise<{ role: string }>;
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;
  
  if (!validRoles.includes(role)) {
    notFound();
  }

  return <MainContent role={role} />;
}

// Generate static params for the three role pages
export function generateStaticParams() {
  return validRoles.map((role) => ({ role }));
}

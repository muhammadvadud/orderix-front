import { redirect } from 'next/navigation';

// Hozircha "/" managerga yo'naltiradi. Keyinchalik bu yerda boshqa sahifa bo'ladi.
export default function Home() {
  redirect('/manager');
}

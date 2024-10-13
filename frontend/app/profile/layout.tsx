import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile page',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

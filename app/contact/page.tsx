// app/contact/page.tsx
import type { Metadata, Viewport } from 'next'
import ContactForm from '@/components/ContactForm'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'Contact | ひろしまいける Portfolio',
  description: 'お問い合わせフォーム',
  openGraph: {
    title: 'Contact | ひろしまいける Portfolio',
    description: 'お問い合わせ',
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
          Contact
        </h1>
        <ContactForm />
      </div>
    </main>
  )
}

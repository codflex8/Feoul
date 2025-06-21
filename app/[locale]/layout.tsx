import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@radix-ui/react-toast";
// import { Cairo } from "next/font/google";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SidebarProvider } from "@/components/ui/sidebar"

// const fontFamily = Cairo({
//   variable: "--font-cairo",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "سراة من فيول",
  description: "مدن عقارية متطورة في مدينة جدة",
  icons: ['/assets/icons/sarah-logo.png']
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // const messages = getMessages()
  const locale = (await params).locale

  // Load messages dynamically
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading translations for locale "${locale}"`, error);
    messages = {};
  }
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  // const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        // className={`${fontFamily.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <SidebarProvider>
            <ToastProvider>
              <SidebarProvider>
                <main>{children}</main>
                <Toaster />
              </SidebarProvider>
            </ToastProvider>
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

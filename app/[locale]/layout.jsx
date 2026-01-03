import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import PageLayout from "@/components/PageLayout";

export default async function Layout({ children }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <PageLayout>{children}</PageLayout>
    </NextIntlClientProvider>
  );
}

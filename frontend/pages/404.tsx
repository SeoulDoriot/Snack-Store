// Not-found page.
import Head from "next/head";
import { useRouter } from "next/router";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { SearchIcon } from "@/components/common/Icons";
import styles from "@/styles/Checkout.module.css";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page not found · Hak Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageLayout>
        <PageHeader title="Page not found" subtitle="That link led nowhere" />

        <div className={`appWidth ${styles.page}`}>
          <EmptyState
            icon={<SearchIcon size={24} />}
            title="We couldn't find that page"
            description="The link may be out of date, or the page may have moved."
            action={<Button onClick={() => router.push("/")}>Back to the shop</Button>}
          />
        </div>
      </PageLayout>
    </>
  );
}

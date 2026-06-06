import { DesignWizard } from "@/components/design-step/DesignWizard";

export default async function GeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url = "" } = await searchParams;
  return <DesignWizard initialUrl={url} />;
}

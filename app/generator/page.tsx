import { Generator } from "@/components/Generator";

export default async function GeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url = "" } = await searchParams;
  return <Generator initialUrl={url} />;
}

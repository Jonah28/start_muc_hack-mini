import { createFileRoute } from "@tanstack/react-router";
import { DesignStep } from "@/components/design-step/DesignStep";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Design your website — Step 3 of 4" },
      {
        name: "description",
        content:
          "Pick a color palette, typography, and the sections you want. We'll build a website your customers will love.",
      },
      { property: "og:title", content: "Design your website — Step 3 of 4" },
      {
        property: "og:description",
        content: "Three quick choices and your trades website is ready.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <DesignStep />;
}

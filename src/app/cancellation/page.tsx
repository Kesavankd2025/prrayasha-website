import PolicyPage from "@/components/PolicyPage";
import { policies } from "@/lib/storefront-data";

export default function CancellationPage() {
  return <PolicyPage policy={policies.cancellation} />;
}

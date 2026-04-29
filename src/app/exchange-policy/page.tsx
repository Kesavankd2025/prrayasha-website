import PolicyPage from "@/components/PolicyPage";
import { policies } from "@/lib/storefront-data";

export default function ExchangePolicyPage() {
  return <PolicyPage policy={policies["exchange-policy"]} />;
}

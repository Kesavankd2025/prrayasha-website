import PolicyPage from "@/components/PolicyPage";
import { policies } from "@/lib/storefront-data";

export default function ShippingPolicyPage() {
  return <PolicyPage policy={policies["shipping-policy"]} />;
}

import PolicyPage from "@/components/PolicyPage";
import { policies } from "@/lib/storefront-data";

export default function FabricCarePage() {
  return <PolicyPage policy={policies["fabric-care"]} />;
}

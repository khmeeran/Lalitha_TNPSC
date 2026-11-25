import { redirect } from "next/navigation";

export default function LessonDefaultPage() {
  // Redirect to active lesson node
  redirect("/lesson/node_hist_3");
}

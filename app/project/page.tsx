import { permanentRedirect } from "next/navigation";

export default function ProjectIndexRedirect() {
  permanentRedirect("/projects");
}

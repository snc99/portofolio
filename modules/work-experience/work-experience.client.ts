// // work-experience.client.ts

// export async function fetchWorkExperiences() {
//   const res = await fetch("/api/work-experience");
//   if (!res.ok) throw new Error("Failed to fetch work experiences");
//   return res.json();
// }

// export async function deleteWorkExperience(id: string) {
//   const res = await fetch(`/api/work-experience/${id}`, {
//     method: "DELETE",
//   });

//   if (!res.ok) {
//     const error = await res.json().catch(() => null);
//     throw new Error(error?.error ?? "Failed to delete work experience");
//   }

//   return res.status === 204 ? null : res.json();
// }

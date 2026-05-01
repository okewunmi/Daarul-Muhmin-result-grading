// // Configuration
// const config = {
//   endpoint: "https://nyc.cloud.appwrite.io/v1",
//   platform: "Daarul-Muhmin",
//   projectId: "694ec3480029a8f2b0c0",
//   DATABASE_ID: "694ee58c0003eac348b9",
//   USERS_COLLECTION_ID: "userauth",
//   ACADEMIC_SESSIONS_COLLECTION_ID: "academicSessions",
//   CLASSES_COLLECTION_ID: "classes",
//   STUDENTS_COLLECTION_ID: "students",
//   SUBJECTS_COLLECTION_ID: "subjects",
//   RESULTS_COLLECTION_ID: "results",
// };

// export async function GET() {
//   try {
//     const response = await fetch(`${config.endpoint}/health`, {
//       method: "GET",
//       headers: {
//         "X-Appwrite-Project": config.projectId,
//       },
//     });

//     if (!response.ok) throw new Error(`Health check failed: ${response.status}`);

//     return Response.json({ status: "ok", service: "appwrite" });
//   } catch (err) {
//     return Response.json({ status: "error", message: err.message }, { status: 500 });
//   }
// }
// standard_47ad55a574190be17f42e0d672f1f1ab070f52b6ce9e94ecdc02e974e88c9e38769b8cc74a7dc12f70e4df6154c64de119726dbcc381ac7eb4e2baf923c6506b7be505bea6285aecbe14e2f89ae264536a44c2197c1fb49eb650d1e86ddc09d09aef0fb9d1120f82a0a17c0edf01f7f979a6e7b3591e42548fac6bd01a7d358c

import { Client, Databases } from "node-appwrite";

const config = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  projectId: "694ec3480029a8f2b0c0",
  DATABASE_ID: "694ee58c0003eac348b9",
  USERS_COLLECTION_ID: "userauth",
APPWRITE: "standard_47ad55a574190be17f42e0d672f1f1ab070f52b6ce9e94ecdc02e974e88c9e38769b8cc74a7dc12f70e4df6154c64de119726dbcc381ac7eb4e2baf923c6506b7be505bea6285aecbe14e2f89ae264536a44c2197c1fb49eb650d1e86ddc09d09aef0fb9d1120f82a0a17c0edf01f7f979a6e7b3591e42548fac6bd01a7d358c",
};

export async function GET() {
  try {
    const client = new Client()
      .setEndpoint(config.endpoint)
      .setProject(config.projectId)
      .setKey(config.APPWRITE);

    const databases = new Databases(client);

    await databases.listDocuments(config.DATABASE_ID, config.USERS_COLLECTION_ID);

    return Response.json({ status: "ok", service: "appwrite" });
  } catch (err) {
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}
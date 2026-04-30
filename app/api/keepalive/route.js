// Configuration
const config = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  platform: "Daarul-Muhmin",
  projectId: "694ec3480029a8f2b0c0",
  DATABASE_ID: "694ee58c0003eac348b9",
  USERS_COLLECTION_ID: "userauth",
  ACADEMIC_SESSIONS_COLLECTION_ID: "academicSessions",
  CLASSES_COLLECTION_ID: "classes",
  STUDENTS_COLLECTION_ID: "students",
  SUBJECTS_COLLECTION_ID: "subjects",
  RESULTS_COLLECTION_ID: "results",
};

export async function GET() {
  try {
    const response = await fetch(`${config.endpoint}/health`, {
      method: "GET",
      headers: {
        "X-Appwrite-Project": config.projectId,
      },
    });

    if (!response.ok) throw new Error(`Health check failed: ${response.status}`);

    return Response.json({ status: "ok", service: "appwrite" });
  } catch (err) {
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}